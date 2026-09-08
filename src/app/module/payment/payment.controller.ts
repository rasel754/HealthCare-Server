import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import httpStatus from "http-status";
import { envVars } from "../../../config/env";
import { stripe } from "../../../config/stripe.config";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../shared/sendResponse";

export const handleStripeWebhookEvent = catchAsync(async (req:Request, res:Response) => {
    const signature = req.headers[`stripe-signature`] as string ;
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET 

    if(!signature || !webhookSecret){
       return res.status(httpStatus.BAD_REQUEST).json({message:"missing webhook signature or secret"});
    }

    let event ;

    try{
        event = stripe.webhooks.constructEvent(req.body,signature,webhookSecret)
    }catch(error){
        console.error(`Error processing stripe webhook signature:`, error);
        return res.status(httpStatus.BAD_REQUEST).json({message:"error processing stripe webhook"})
    }
    
    try{
        const result = await PaymentService.handleStripeWebhookEvent(event);
       sendResponse(res,
        {
            httpStatusCode:httpStatus.OK,
            success:true,
            message:"stripe webhook event processed successfully",
            data:result
        });
    }catch(error){
        console.error(`Error processing stripe webhook event:`, error);
        sendResponse(res,{
            httpStatusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:"error processing stripe webhook event"
        })
    }
})


export const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getAllPayments();
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Payments retrieved successfully",
        data: result
    });
});

export const confirmPayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.confirmPayment(req.body);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: "Payment confirmed successfully",
        data: result
    });
});

export const PaymentControler = {
    handleStripeWebhookEvent,
    getAllPayments,
    confirmPayment
}