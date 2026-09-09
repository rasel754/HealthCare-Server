import { Server } from "http";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seed";
import { envVars } from "./config/env";
import { redisService } from "./app/lib/redis";

import { AppointmentService } from "./app/module/appointment/appointment.service";
import cron from "node-cron";

let server : Server;
const bootstrap = async() => {
    try {
        await seedSuperAdmin();
        await redisService.connect().catch(console.error);
        cron.schedule("*/25 * * * *", async () => {
            try {
                await AppointmentService.cancelUnpaidAppointments();
            } catch (error: any) {
                console.error("Error occurred while canceling unpaid appointments:", error.message);
            }
        });
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }   
}

process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down server...");

    if (server) {
        server.close(() => {
            console.log("Server closed gracefully.");
            process.exit(1);
        });
    } 
    
    process.exit(1);
});

process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down server...");

    if (server) {
        server.close(() => {
            console.log("Server closed gracefully.");
            process.exit(1);
        });
    }

    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error("Uncaught Exception Detected... Shutting down server", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection Detected... Shutting down server", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    process.exit(1);
});

bootstrap();