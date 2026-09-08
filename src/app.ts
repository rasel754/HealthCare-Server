import express, { Application } from 'express';
import cookieParser from "cookie-parser";
import { indexRouter } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import path from 'path';
import cors from "cors";
import { envVars } from './config/env';
import qs from "qs";
import { PaymentControler } from './app/module/payment/payment.controller';
import { AppointmentService } from './app/module/appointment/appointment.service';
import cron from "node-cron";


const app: Application = express();
app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`))


app.post("/webhook", express.raw({ type: "application/json" }), PaymentControler.handleStripeWebhookEvent)


app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))


app.use("/api/auth", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", indexRouter);

cron.schedule("*/25 * * * *", async () => {
    try {
        await AppointmentService.cancelUnpaidAppointments();
    } catch (error: any) {
        console.error("Error occurred while canceling unpaid appointments:", error.message);
    }
});

app.use(globalErrorHandler);

app.use(notFound)

export default app;