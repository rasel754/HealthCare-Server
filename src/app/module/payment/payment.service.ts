/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { stripe } from "../../../config/stripe.config";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/email";
import { generateInvoicePdf } from "./payment.utils";
import { uploadFileToCloudinary } from "../../../config/cloudinary.config";



const handleStripeWebhookEvent = async (event : Stripe.Event) =>{

    const existingPayment = await prisma.payment.findFirst({
        where:{
            stripeEventId : event.id
        }
    })

    if(existingPayment){
        return {message : `Event ${event.id} already processed. Skipping`}
    }

    switch(event.type){
        case "checkout.session.completed": {
            const session = event.data.object as any;

            const appointmentId = session.metadata?.appointmentId;
            const paymentId = session.metadata?.paymentId;

            if (!appointmentId || !paymentId) {
                console.error("⚠️ Missing metadata in webhook event");
                return { message: "Missing metadata" };
            }

            // Verify appointment exists with related data
            const appointment = await prisma.appointment.findUnique({
                where: { id: appointmentId },
                include: {
                    patient: true,
                    doctor: true,
                    schedule: true,
                    payment: true
                }
            });

            if (!appointment) {
                console.error(`⚠️ Appointment ${appointmentId} not found. Payment may be for expired appointment.`);
                return { message: "Appointment not found" };
            }
            let pdfBuffer: Buffer | null = null;

            // Update both appointment and payment in a transaction
            const result = await prisma.$transaction(async (tx) => {
                const updatedAppointment = await tx.appointment.update({
                    where: {
                        id: appointmentId
                    },
                    data: {
                        paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
                    }
                });

                let invoiceUrl = null;
                

                // If payment is successful, generate and upload invoice
                if (session.payment_status === "paid") {
                    try {
                        // Generate invoice PDF
                        pdfBuffer = await generateInvoicePdf({
                            invoiceId: appointment.payment?.id || paymentId,
                            patientName: appointment.patient.name,
                            patientEmail: appointment.patient.email,
                            doctorName: appointment.doctor.name,
                            appointmentDate: appointment.schedule.startDateTime.toString(),
                            amount: appointment.payment?.amount || 0,
                            transactionId: appointment.payment?.transactionId || "",
                            paymentDate: new Date().toISOString()
                        });

                        // Upload PDF to Cloudinary
                        const cloudinaryResponse = await uploadFileToCloudinary(
                            pdfBuffer,
                            `ph-healthcare/invoices/invoice-${paymentId}-${Date.now()}.pdf`
                        );

                        invoiceUrl = cloudinaryResponse?.secure_url;
                    } catch (pdfError) {
                        console.error("❌ Error generating/uploading invoice PDF:", pdfError);
                        // Continue with payment update even if PDF generation fails
                    }
                }

                const updatedPayment = await tx.payment.update({
                    where: {
                        id: paymentId
                    },
                    data: {
                        status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                        paymentGatewayData: session,
                        invoiceUrl: invoiceUrl, // Store invoice URL
                        stripeEventId: event.id // Store event ID for idempotency
                    }
                });

                return { updatedAppointment, updatedPayment, invoiceUrl };
            });

            // Send invoice email to patient (outside transaction to avoid blocking payment update)
            if (session.payment_status === "paid" && result.invoiceUrl) {
                try {
                    await sendEmail({
                        to: appointment.patient.email,
                        subject: `Payment Confirmation & Invoice - Appointment with ${appointment.doctor.name}`,
                        templateName: "invoice",
                        templateData: {
                            patientName: appointment.patient.name,
                            invoiceId: appointment.payment?.id || paymentId,
                            transactionId: appointment.payment?.transactionId || "",
                            paymentDate: new Date().toLocaleDateString(),
                            doctorName: appointment.doctor.name,
                            appointmentDate: new Date(appointment.schedule.startDateTime).toLocaleDateString(),
                            amount: appointment.payment?.amount || 0,
                            invoiceUrl: result.invoiceUrl
                        },
                        attachments: [
                            {
                                filename: `Invoice-${paymentId}.pdf`,
                                content: pdfBuffer || Buffer.from(""), // Attach PDF if generated, else empty buffer
                                contentType: 'application/pdf'
                            }
                        ]
                    });
                } catch (emailError) {
                    console.error("❌ Error sending invoice email:", emailError);
                    // Log but don't fail the payment if email fails
                }
            }

            break;
        }

        case "checkout.session.expired" : {
            break;
        }
        case "payment_intent.payment_failed" : {
            break;
        }
        default :
            break;
    }

    return {message : `Webhook Event ${event.id} processed successfully`}
}

const getAllPayments = async () => {
    const payments = await prisma.payment.findMany({
        include: {
            appointment: {
                include: {
                    patient: true,
                    doctor: true,
                    schedule: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return payments;
}

const confirmPayment = async (payload: { appointmentId?: string; paymentId?: string; transactionId?: string; sessionId?: string; paymentGatewayData?: any }) => {
    let { appointmentId, paymentId, transactionId, sessionId, paymentGatewayData } = payload;

    if (sessionId && (!appointmentId || !paymentId)) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (session.metadata?.appointmentId) appointmentId = session.metadata.appointmentId;
            if (session.metadata?.paymentId) paymentId = session.metadata.paymentId;
            if (!paymentGatewayData) paymentGatewayData = session;
        } catch (err) {
            console.error("Error retrieving stripe session in confirmPayment:", err);
        }
    }

    const payment = await prisma.payment.findFirst({
        where: {
            OR: [
                ...(paymentId ? [{ id: paymentId }] : []),
                ...(appointmentId ? [{ appointmentId }] : []),
                ...(transactionId ? [{ transactionId }] : []),
            ]
        },
        include: {
            appointment: true
        }
    });

    if (!payment) {
        throw new Error("Payment record not found");
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
            where: { id: payment.id },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: paymentGatewayData || { paymentMethod: "STRIPE", settledAt: new Date().toISOString() },
            }
        });

        const updatedAppointment = await tx.appointment.update({
            where: { id: payment.appointmentId },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        });

        return { updatedPayment, updatedAppointment };
    });

    return result;
}


export const PaymentService = {
    handleStripeWebhookEvent,
    getAllPayments,
    confirmPayment
}