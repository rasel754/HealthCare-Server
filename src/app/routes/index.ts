import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";
import { authRouters } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { SuperAdminRoutes } from "../module/superAdmin/superAdmin.route";
import { scheduleRoutes } from "../module/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../module/appointment/appointment.route";
import { PatientRoutes } from "../module/patient/patient.route";
import { PrescriptionRoutes } from "../module/prescription/prescription.route";
import { ReviewRoutes } from "../module/review/review.route";
import { paymentRoutes } from "../module/payment/payment.route";
import { StatsRoutes } from "../module/stats/stats.route";
import { RagRoutes } from "../module/rag/rag.route";

const router = Router();

router.use('/auth', authRouters);
router.use('/specialty', SpecialtyRouter); 
router.use('/users', UserRoutes);
router.use('/doctors', DoctorRoutes);
router.use('/admins', AdminRoutes);
router.use('/super-admins', SuperAdminRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/doctor-schedules', DoctorScheduleRoutes)
router.use('/appointments', AppointmentRoutes)
router.use('/patient', PatientRoutes);
router.use('/patients', PatientRoutes);
router.use('/prescription', PrescriptionRoutes)
router.use('/review', ReviewRoutes)
router.use('/payment', paymentRoutes)
router.use('/stats', StatsRoutes)
router.use('rag',RagRoutes)
export const indexRouter = router;

