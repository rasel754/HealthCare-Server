var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express4 from "express";
import cookieParser from "cookie-parser";

// src/app/routes/index.ts
import { Router as Router13 } from "express";

// src/app/module/specialty/specialty.route.ts
import { Router } from "express";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [
    "postgresqlExtensions"
  ],
  "clientVersion": "7.9.1",
  "engineVersion": "e922089b7d7502aff4249d5da3420f6fa55fc6ad",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Specialty {\n  id String @id @default(uuid(7))\n\n  title       String  @unique @db.VarChar(100)\n  description String? @db.Text\n  icon        String? @db.VarChar(255)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  doctorSpecialties DoctorSpecialty[]\n\n  @@index([isDeleted], name: "idx_specialty_isDeleted")\n  @@index([title], name: "idx_specialty_title")\n  @@map("specialties")\n}\n\nmodel DoctorSpecialty {\n  id          String @id @default(uuid(7))\n  doctorId    String\n  specialtyId String\n\n  doctor    Doctor    @relation(fields: [doctorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  specialty Specialty @relation(fields: [specialtyId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@unique([doctorId, specialtyId])\n  @@index([doctorId], name: "idx_doctor_specialty_doctorId")\n  @@index([specialtyId], name: "idx_doctor_specialty_specialtyId")\n  @@map("doctor_specialties")\n}\n\nmodel Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email], name: "idx_admin_email")\n  @@index([isDeleted], name: "idx_admin_isDeleted")\n  @@map("admin")\n}\n\nmodel Appointment {\n  id             String            @id @default(uuid(7))\n  patientId      String\n  doctorId       String\n  videoCallingId String            @unique @db.Uuid()\n  status         AppointmentStatus @default(SCHEDULED)\n  paymentStatus  PaymentStatus     @default(UNPAID)\n  createdAt      DateTime          @default(now())\n  updatedAt      DateTime          @updatedAt\n\n  // Relations\n  patient    Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  doctor     Doctor   @relation(fields: [doctorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade)\n\n  // One appointment can have one review, and medical report\n  review          Review?\n  payment         Payment?\n  // medicalReport   MedicalReport?\n  prescription    Prescription?\n  doctorSchedules DoctorSchedules[]\n\n  @@map("appointments")\n}\n\nmodel User {\n  id                 String      @id\n  name               String\n  email              String\n  emailVerified      Boolean     @default(false)\n  role               Role        @default(PATIENT)\n  status             UserStatus  @default(ACTIVE)\n  needPasswordChange Boolean     @default(false)\n  isDeleted          Boolean     @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime    @default(now())\n  updatedAt          DateTime    @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  patient            Patient?\n  doctor             Doctor?\n  admin              Admin?\n  superAdmin         SuperAdmin?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  issuer                String?\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Doctor {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n\n  registrationNumber  String @unique\n  experience          Int    @default(0)\n  gender              Gender\n  appointmentFee      Float\n  qualification       String\n  currentWorkingPlace String\n  designation         String\n  averageRating       Float  @default(0.0)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  specialties     DoctorSpecialty[]\n  doctorSchedules DoctorSchedules[]\n  appointments    Appointment[]\n  reviews         Review[]\n  prescriptions   Prescription[]\n\n  @@index([email], name: "idx_doctor_email")\n  @@index([isDeleted], name: "idx_doctor_isDeleted")\n  @@map("doctor")\n}\n\nmodel DoctorSchedules {\n  id         String   @id @default(uuid(7))\n  doctorId   String\n  scheduleId String\n  isBooked   Boolean  @default(false)\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  // Relations\n  doctor   Doctor   @relation(fields: [doctorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  schedule Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  // An appointment is associated with this specific doctor\'s schedule slot\n  appointment Appointment[]\n\n  @@unique([doctorId, scheduleId])\n  @@index([doctorId])\n  @@index([scheduleId])\n  @@map("doctor_schedules")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  DOCTOR\n  PATIENT\n}\n\nenum UserStatus {\n  BLOCKED\n  DELETED\n  ACTIVE\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum AppointmentStatus {\n  SCHEDULED\n  INPROGRESS\n  COMPLETED\n  CANCELED\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum MaritalStatus {\n  MARRIED\n  UNMARRIED\n  DIVORCED\n  WIDOWED\n}\n\nmodel MedicalReport {\n  id         String   @id @default(uuid(7))\n  reportName String\n  reportLink String\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  patientId String\n  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)\n\n  @@index([patientId])\n  @@map("medical_reports")\n}\n\nmodel Patient {\n  id            String    @id @default(uuid())\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  // relation\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  patientHealthData PatientHealthData?\n  appointments      Appointment[]\n  prescriptions     Prescription[]\n  reviews           Review[]\n  medicalReports    MedicalReport[]\n\n  //indexing \n\n  @@index([email], name: "idx-patient_email")\n  @@index([isDeleted], name: "idx-patient-deleted")\n  @@map("patients")\n}\n\nmodel PatientHealthData {\n  id                  String      @id @default(uuid(7))\n  patientId           String      @unique\n  gender              Gender?\n  dateOfBirth         DateTime?\n  bloodGroup          BloodGroup?\n  hasAllergies        Boolean?    @default(false)\n  hasDiabetes         Boolean?    @default(false)\n  height              String?\n  weight              String?\n  smokingStatus       Boolean?    @default(false)\n  dietaryPreferences  String?\n  pregnancyStatus     Boolean?    @default(false)\n  mentalHealthHistory String?\n  immunizationStatus  String?\n  hasPastSurgeries    Boolean?    @default(false)\n  recentAnxiety       Boolean?    @default(false)\n  recentDepression    Boolean?    @default(false)\n  maritalStatus       String?\n  createdAt           DateTime    @default(now())\n  updatedAt           DateTime    @updatedAt\n\n  // Relations\n  patient Patient @relation(fields: [patientId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@map("patient_health_data")\n}\n\nmodel Payment {\n  id                 String        @id @default(uuid(7))\n  amount             Float\n  transactionId      String        @unique @db.Uuid()\n  stripeEventId      String?       @unique\n  status             PaymentStatus @default(UNPAID)\n  invoiceUrl         String?\n  paymentGatewayData Json?\n  createdAt          DateTime      @default(now())\n  updatedAt          DateTime      @updatedAt\n\n  appointmentId String      @unique\n  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)\n\n  @@index([appointmentId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Prescription {\n  id           String   @id @default(uuid(7))\n  followUpDate DateTime\n  instructions String   @db.Text\n  pdfUrl       String?\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  appointmentId String      @unique\n  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  patientId String\n  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  doctorId String\n  doctor   Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([appointmentId])\n  @@index([patientId])\n  @@index([doctorId])\n  @@map("prescriptions")\n}\n\nmodel DocumentEmbedding {\n  id          String  @id @default(uuid(7))\n  chunkKey    String  @unique\n  sourceType  String\n  sourceId    String\n  sourceLevel String?\n  content     String\n  metadata    Json?\n\n  embedding Unsupported("vector(2048)")\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([sourceType], name: "idx_document_embedding_sourceType")\n  @@index([sourceId], name: "idx_document_embedding_sourceId")\n  @@map("document_embedding")\n}\n\nmodel Review {\n  id            String   @id @default(uuid(7))\n  patientId     String\n  doctorId      String\n  appointmentId String   @unique\n  rating        Float\n  comment       String?\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  // Relations\n  patient     Patient     @relation(fields: [patientId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  doctor      Doctor      @relation(fields: [doctorId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  appointment Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@map("reviews")\n}\n\nmodel Schedule {\n  id            String   @id @default(uuid(7))\n  startDateTime DateTime\n  endDateTime   DateTime\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  // Relations\n  doctorSchedules DoctorSchedules[]\n  appointments    Appointment[]\n\n  @@map("schedules")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider        = "prisma-client"\n  output          = "../../src/generated/prisma"\n  previewFeatures = ["postgresqlExtensions"]\n}\n\ndatasource db {\n  provider   = "postgresql"\n  extensions = [vector]\n}\n\nmodel SuperAdmin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email], name: "idx_super_admin_email")\n  @@index([isDeleted], name: "idx_super_admin_isDeleted")\n  @@map("super_admin")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Specialty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"doctorSpecialties","kind":"object","type":"DoctorSpecialty","relationName":"DoctorSpecialtyToSpecialty"}],"dbName":"specialties"},"DoctorSpecialty":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"specialtyId","kind":"scalar","type":"String"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToDoctorSpecialty"},{"name":"specialty","kind":"object","type":"Specialty","relationName":"DoctorSpecialtyToSpecialty"}],"dbName":"doctor_specialties"},"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admin"},"Appointment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"videoCallingId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AppointmentStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"patient","kind":"object","type":"Patient","relationName":"AppointmentToPatient"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"AppointmentToDoctor"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"AppointmentToSchedule"},{"name":"review","kind":"object","type":"Review","relationName":"AppointmentToReview"},{"name":"payment","kind":"object","type":"Payment","relationName":"AppointmentToPayment"},{"name":"prescription","kind":"object","type":"Prescription","relationName":"AppointmentToPrescription"},{"name":"doctorSchedules","kind":"object","type":"DoctorSchedules","relationName":"AppointmentToDoctorSchedules"}],"dbName":"appointments"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"patient","kind":"object","type":"Patient","relationName":"PatientToUser"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"superAdmin","kind":"object","type":"SuperAdmin","relationName":"SuperAdminToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"issuer","kind":"scalar","type":"String"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Doctor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"registrationNumber","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"appointmentFee","kind":"scalar","type":"Float"},{"name":"qualification","kind":"scalar","type":"String"},{"name":"currentWorkingPlace","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"DoctorToUser"},{"name":"specialties","kind":"object","type":"DoctorSpecialty","relationName":"DoctorToDoctorSpecialty"},{"name":"doctorSchedules","kind":"object","type":"DoctorSchedules","relationName":"DoctorToDoctorSchedules"},{"name":"appointments","kind":"object","type":"Appointment","relationName":"AppointmentToDoctor"},{"name":"reviews","kind":"object","type":"Review","relationName":"DoctorToReview"},{"name":"prescriptions","kind":"object","type":"Prescription","relationName":"DoctorToPrescription"}],"dbName":"doctor"},"DoctorSchedules":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToDoctorSchedules"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"DoctorSchedulesToSchedule"},{"name":"appointment","kind":"object","type":"Appointment","relationName":"AppointmentToDoctorSchedules"}],"dbName":"doctor_schedules"},"MedicalReport":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"reportName","kind":"scalar","type":"String"},{"name":"reportLink","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"patient","kind":"object","type":"Patient","relationName":"MedicalReportToPatient"}],"dbName":"medical_reports"},"Patient":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PatientToUser"},{"name":"patientHealthData","kind":"object","type":"PatientHealthData","relationName":"PatientToPatientHealthData"},{"name":"appointments","kind":"object","type":"Appointment","relationName":"AppointmentToPatient"},{"name":"prescriptions","kind":"object","type":"Prescription","relationName":"PatientToPrescription"},{"name":"reviews","kind":"object","type":"Review","relationName":"PatientToReview"},{"name":"medicalReports","kind":"object","type":"MedicalReport","relationName":"MedicalReportToPatient"}],"dbName":"patients"},"PatientHealthData":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"bloodGroup","kind":"enum","type":"BloodGroup"},{"name":"hasAllergies","kind":"scalar","type":"Boolean"},{"name":"hasDiabetes","kind":"scalar","type":"Boolean"},{"name":"height","kind":"scalar","type":"String"},{"name":"weight","kind":"scalar","type":"String"},{"name":"smokingStatus","kind":"scalar","type":"Boolean"},{"name":"dietaryPreferences","kind":"scalar","type":"String"},{"name":"pregnancyStatus","kind":"scalar","type":"Boolean"},{"name":"mentalHealthHistory","kind":"scalar","type":"String"},{"name":"immunizationStatus","kind":"scalar","type":"String"},{"name":"hasPastSurgeries","kind":"scalar","type":"Boolean"},{"name":"recentAnxiety","kind":"scalar","type":"Boolean"},{"name":"recentDepression","kind":"scalar","type":"Boolean"},{"name":"maritalStatus","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"patient","kind":"object","type":"Patient","relationName":"PatientToPatientHealthData"}],"dbName":"patient_health_data"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"invoiceUrl","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"appointmentId","kind":"scalar","type":"String"},{"name":"appointment","kind":"object","type":"Appointment","relationName":"AppointmentToPayment"}],"dbName":"payments"},"Prescription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"followUpDate","kind":"scalar","type":"DateTime"},{"name":"instructions","kind":"scalar","type":"String"},{"name":"pdfUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"appointmentId","kind":"scalar","type":"String"},{"name":"appointment","kind":"object","type":"Appointment","relationName":"AppointmentToPrescription"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"patient","kind":"object","type":"Patient","relationName":"PatientToPrescription"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToPrescription"}],"dbName":"prescriptions"},"DocumentEmbedding":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"chunkKey","kind":"scalar","type":"String"},{"name":"sourceType","kind":"scalar","type":"String"},{"name":"sourceId","kind":"scalar","type":"String"},{"name":"sourceLevel","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"document_embedding"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"patientId","kind":"scalar","type":"String"},{"name":"doctorId","kind":"scalar","type":"String"},{"name":"appointmentId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"patient","kind":"object","type":"Patient","relationName":"PatientToReview"},{"name":"doctor","kind":"object","type":"Doctor","relationName":"DoctorToReview"},{"name":"appointment","kind":"object","type":"Appointment","relationName":"AppointmentToReview"}],"dbName":"reviews"},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startDateTime","kind":"scalar","type":"DateTime"},{"name":"endDateTime","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"doctorSchedules","kind":"object","type":"DoctorSchedules","relationName":"DoctorSchedulesToSchedule"},{"name":"appointments","kind":"object","type":"Appointment","relationName":"AppointmentToSchedule"}],"dbName":"schedules"},"SuperAdmin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SuperAdminToUser"}],"dbName":"super_admin"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","patient","patientHealthData","doctor","schedule","appointment","_count","doctorSchedules","appointments","review","payment","prescription","prescriptions","reviews","medicalReports","admin","superAdmin","specialties","specialty","doctorSpecialties","Specialty.findUnique","Specialty.findUniqueOrThrow","Specialty.findFirst","Specialty.findFirstOrThrow","Specialty.findMany","data","Specialty.createOne","Specialty.createMany","Specialty.createManyAndReturn","Specialty.updateOne","Specialty.updateMany","Specialty.updateManyAndReturn","create","update","Specialty.upsertOne","Specialty.deleteOne","Specialty.deleteMany","having","_min","_max","Specialty.groupBy","Specialty.aggregate","DoctorSpecialty.findUnique","DoctorSpecialty.findUniqueOrThrow","DoctorSpecialty.findFirst","DoctorSpecialty.findFirstOrThrow","DoctorSpecialty.findMany","DoctorSpecialty.createOne","DoctorSpecialty.createMany","DoctorSpecialty.createManyAndReturn","DoctorSpecialty.updateOne","DoctorSpecialty.updateMany","DoctorSpecialty.updateManyAndReturn","DoctorSpecialty.upsertOne","DoctorSpecialty.deleteOne","DoctorSpecialty.deleteMany","DoctorSpecialty.groupBy","DoctorSpecialty.aggregate","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","Admin.groupBy","Admin.aggregate","Appointment.findUnique","Appointment.findUniqueOrThrow","Appointment.findFirst","Appointment.findFirstOrThrow","Appointment.findMany","Appointment.createOne","Appointment.createMany","Appointment.createManyAndReturn","Appointment.updateOne","Appointment.updateMany","Appointment.updateManyAndReturn","Appointment.upsertOne","Appointment.deleteOne","Appointment.deleteMany","Appointment.groupBy","Appointment.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Doctor.findUnique","Doctor.findUniqueOrThrow","Doctor.findFirst","Doctor.findFirstOrThrow","Doctor.findMany","Doctor.createOne","Doctor.createMany","Doctor.createManyAndReturn","Doctor.updateOne","Doctor.updateMany","Doctor.updateManyAndReturn","Doctor.upsertOne","Doctor.deleteOne","Doctor.deleteMany","_avg","_sum","Doctor.groupBy","Doctor.aggregate","DoctorSchedules.findUnique","DoctorSchedules.findUniqueOrThrow","DoctorSchedules.findFirst","DoctorSchedules.findFirstOrThrow","DoctorSchedules.findMany","DoctorSchedules.createOne","DoctorSchedules.createMany","DoctorSchedules.createManyAndReturn","DoctorSchedules.updateOne","DoctorSchedules.updateMany","DoctorSchedules.updateManyAndReturn","DoctorSchedules.upsertOne","DoctorSchedules.deleteOne","DoctorSchedules.deleteMany","DoctorSchedules.groupBy","DoctorSchedules.aggregate","MedicalReport.findUnique","MedicalReport.findUniqueOrThrow","MedicalReport.findFirst","MedicalReport.findFirstOrThrow","MedicalReport.findMany","MedicalReport.createOne","MedicalReport.createMany","MedicalReport.createManyAndReturn","MedicalReport.updateOne","MedicalReport.updateMany","MedicalReport.updateManyAndReturn","MedicalReport.upsertOne","MedicalReport.deleteOne","MedicalReport.deleteMany","MedicalReport.groupBy","MedicalReport.aggregate","Patient.findUnique","Patient.findUniqueOrThrow","Patient.findFirst","Patient.findFirstOrThrow","Patient.findMany","Patient.createOne","Patient.createMany","Patient.createManyAndReturn","Patient.updateOne","Patient.updateMany","Patient.updateManyAndReturn","Patient.upsertOne","Patient.deleteOne","Patient.deleteMany","Patient.groupBy","Patient.aggregate","PatientHealthData.findUnique","PatientHealthData.findUniqueOrThrow","PatientHealthData.findFirst","PatientHealthData.findFirstOrThrow","PatientHealthData.findMany","PatientHealthData.createOne","PatientHealthData.createMany","PatientHealthData.createManyAndReturn","PatientHealthData.updateOne","PatientHealthData.updateMany","PatientHealthData.updateManyAndReturn","PatientHealthData.upsertOne","PatientHealthData.deleteOne","PatientHealthData.deleteMany","PatientHealthData.groupBy","PatientHealthData.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Prescription.findUnique","Prescription.findUniqueOrThrow","Prescription.findFirst","Prescription.findFirstOrThrow","Prescription.findMany","Prescription.createOne","Prescription.createMany","Prescription.createManyAndReturn","Prescription.updateOne","Prescription.updateMany","Prescription.updateManyAndReturn","Prescription.upsertOne","Prescription.deleteOne","Prescription.deleteMany","Prescription.groupBy","Prescription.aggregate","DocumentEmbedding.findUnique","DocumentEmbedding.findUniqueOrThrow","DocumentEmbedding.findFirst","DocumentEmbedding.findFirstOrThrow","DocumentEmbedding.findMany","DocumentEmbedding.updateOne","DocumentEmbedding.updateMany","DocumentEmbedding.updateManyAndReturn","DocumentEmbedding.deleteOne","DocumentEmbedding.deleteMany","DocumentEmbedding.groupBy","DocumentEmbedding.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","SuperAdmin.findUnique","SuperAdmin.findUniqueOrThrow","SuperAdmin.findFirst","SuperAdmin.findFirstOrThrow","SuperAdmin.findMany","SuperAdmin.createOne","SuperAdmin.createMany","SuperAdmin.createManyAndReturn","SuperAdmin.updateOne","SuperAdmin.updateMany","SuperAdmin.updateManyAndReturn","SuperAdmin.upsertOne","SuperAdmin.deleteOne","SuperAdmin.deleteMany","SuperAdmin.groupBy","SuperAdmin.aggregate","AND","OR","NOT","id","name","email","profilePhoto","contactNumber","isDeleted","deletedAt","createdAt","updatedAt","userId","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","startDateTime","endDateTime","every","some","none","patientId","doctorId","appointmentId","rating","comment","chunkKey","sourceType","sourceId","sourceLevel","content","metadata","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","followUpDate","instructions","pdfUrl","amount","transactionId","stripeEventId","PaymentStatus","status","invoiceUrl","paymentGatewayData","Gender","gender","dateOfBirth","BloodGroup","bloodGroup","hasAllergies","hasDiabetes","height","weight","smokingStatus","dietaryPreferences","pregnancyStatus","mentalHealthHistory","immunizationStatus","hasPastSurgeries","recentAnxiety","recentDepression","maritalStatus","address","reportName","reportLink","scheduleId","isBooked","registrationNumber","experience","appointmentFee","qualification","currentWorkingPlace","designation","averageRating","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","issuer","token","ipAddress","userAgent","emailVerified","Role","role","UserStatus","needPasswordChange","image","videoCallingId","AppointmentStatus","paymentStatus","specialtyId","title","description","icon","doctorId_scheduleId","doctorId_specialtyId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "iAmlAawCDBgAAM8EACDNAgAA7AQAMM4CAABKABDPAgAA7AQAMNACAQAAAAHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIb0DAQAAAAG-AwEAkgQAIb8DAQCSBAAhAQAAAAEAIAgIAADvBAAgFwAA_wQAIM0CAAD-BAAwzgIAAAMAEM8CAAD-BAAw0AIBAJEEACHrAgEAkQQAIbwDAQCRBAAhAggAAOoHACAXAACMCAAgCQgAAO8EACAXAAD_BAAgzQIAAP4EADDOAgAAAwAQzwIAAP4EADDQAgEAAAAB6wIBAJEEACG8AwEAkQQAIcEDAAD9BAAgAwAAAAMAIAEAAAQAMAIAAAUAIAwDAACWBAAgzQIAAPwEADDOAgAABwAQzwIAAPwEADDQAgEAkQQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIaUDQACVBAAhsAMBAJEEACGxAwEAkgQAIbIDAQCSBAAhAwMAAIsFACCxAwAAgAUAILIDAACABQAgDAMAAJYEACDNAgAA_AQAMM4CAAAHABDPAgAA_AQAMNACAQAAAAHXAkAAlQQAIdgCQACVBAAh2QIBAJEEACGlA0AAlQQAIbADAQAAAAGxAwEAkgQAIbIDAQCSBAAhAwAAAAcAIAEAAAgAMAIAAAkAIBIDAACWBAAgzQIAAPsEADDOAgAACwAQzwIAAPsEADDQAgEAkQQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIaYDAQCRBAAhpwMBAJEEACGoAwEAkgQAIakDAQCSBAAhqgMBAJIEACGrA0AAlAQAIawDQACUBAAhrQMBAJIEACGuAwEAkgQAIa8DAQCSBAAhCQMAAIsFACCoAwAAgAUAIKkDAACABQAgqgMAAIAFACCrAwAAgAUAIKwDAACABQAgrQMAAIAFACCuAwAAgAUAIK8DAACABQAgEgMAAJYEACDNAgAA-wQAMM4CAAALABDPAgAA-wQAMNACAQAAAAHXAkAAlQQAIdgCQACVBAAh2QIBAJEEACGmAwEAkQQAIacDAQCRBAAhqAMBAJIEACGpAwEAkgQAIaoDAQCSBAAhqwNAAJQEACGsA0AAlAQAIa0DAQCSBAAhrgMBAJIEACGvAwEAkgQAIQMAAAALACABAAAMADACAAANACAUAwAAlgQAIAcAAMAEACANAACaBAAgEQAAwQQAIBIAAMIEACATAADDBAAgzQIAAL8EADDOAgAADwAQzwIAAL8EADDQAgEAkQQAIdECAQCRBAAh0gIBAJEEACHTAgEAkgQAIdQCAQCSBAAh1QIgAJMEACHWAkAAlAQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIZcDAQCSBAAhAQAAAA8AIBgGAAC9BAAgzQIAALkEADDOAgAAEQAQzwIAALkEADDQAgEAkQQAIdcCQACVBAAh2AJAAJUEACHqAgEAkQQAIYYDAAC6BIYDI4cDQACUBAAhiQMAALsEiQMjigMgALwEACGLAyAAvAQAIYwDAQCSBAAhjQMBAJIEACGOAyAAvAQAIY8DAQCSBAAhkAMgALwEACGRAwEAkgQAIZIDAQCSBAAhkwMgALwEACGUAyAAvAQAIZUDIAC8BAAhlgMBAJIEACEBAAAAEQAgEwYAAL0EACAIAADvBAAgCQAA9QQAIAwAAJkEACAOAAD4BAAgDwAA-QQAIBAAAPoEACDNAgAA9gQAMM4CAAATABDPAgAA9gQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAh6wIBAJEEACGCAwAA9wS7AyKaAwEAkQQAIbkDAQDxBAAhuwMAAK0EggMiBwYAAIoGACAIAADqBwAgCQAAiAgAIAwAAOkFACAOAACJCAAgDwAAiggAIBAAAIsIACATBgAAvQQAIAgAAO8EACAJAAD1BAAgDAAAmQQAIA4AAPgEACAPAAD5BAAgEAAA-gQAIM0CAAD2BAAwzgIAABMAEM8CAAD2BAAw0AIBAAAAAdcCQACVBAAh2AJAAJUEACHqAgEAkQQAIesCAQCRBAAhggMAAPcEuwMimgMBAJEEACG5AwEAAAABuwMAAK0EggMiAwAAABMAIAEAABQAMAIAABUAIAwIAADvBAAgCQAA9QQAIAoAAJoEACDNAgAA9AQAMM4CAAAXABDPAgAA9AQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIesCAQCRBAAhmgMBAJEEACGbAyAAkwQAIQMIAADqBwAgCQAAiAgAIAoAAOoFACANCAAA7wQAIAkAAPUEACAKAACaBAAgzQIAAPQEADDOAgAAFwAQzwIAAPQEADDQAgEAAAAB1wJAAJUEACHYAkAAlQQAIesCAQCRBAAhmgMBAJEEACGbAyAAkwQAIcADAADzBAAgAwAAABcAIAEAABgAMAIAABkAIAMAAAATACABAAAUADACAAAVACABAAAAEwAgAwAAABMAIAEAABQAMAIAABUAIAEAAAAXACABAAAAEwAgDgYAAL0EACAIAADvBAAgCgAArgQAIM0CAADuBAAwzgIAACAAEM8CAADuBAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh6gIBAJEEACHrAgEAkQQAIewCAQCRBAAh7QIIAKwEACHuAgEAkgQAIQEAAAAgACAOCgAArgQAIM0CAACrBAAwzgIAACIAEM8CAACrBAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh7AIBAJEEACH-AggArAQAIf8CAQDxBAAhgAMBAJIEACGCAwAArQSCAyKDAwEAkgQAIYQDAACjBAAgAQAAACIAIA8GAAC9BAAgCAAA7wQAIAoAAK4EACDNAgAA8AQAMM4CAAAkABDPAgAA8AQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAh6wIBAJEEACHsAgEAkQQAIfsCQACVBAAh_AIBAJEEACH9AgEAkgQAIQEAAAAkACADAAAAFwAgAQAAGAAwAgAAGQAgAQAAABcAIAQGAACKBgAgCAAA6gcAIAoAAIEGACD9AgAAgAUAIA8GAAC9BAAgCAAA7wQAIAoAAK4EACDNAgAA8AQAMM4CAAAkABDPAgAA8AQAMNACAQAAAAHXAkAAlQQAIdgCQACVBAAh6gIBAJEEACHrAgEAkQQAIewCAQAAAAH7AkAAlQQAIfwCAQCRBAAh_QIBAJIEACEDAAAAJAAgAQAAKAAwAgAAKQAgBAYAAIoGACAIAADqBwAgCgAAgQYAIO4CAACABQAgDgYAAL0EACAIAADvBAAgCgAArgQAIM0CAADuBAAwzgIAACAAEM8CAADuBAAw0AIBAAAAAdcCQACVBAAh2AJAAJUEACHqAgEAkQQAIesCAQCRBAAh7AIBAAAAAe0CCACsBAAh7gIBAJIEACEDAAAAIAAgAQAAKwAwAgAALAAgCgYAAL0EACDNAgAA7QQAMM4CAAAuABDPAgAA7QQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAhmAMBAJEEACGZAwEAkQQAIQEGAACKBgAgCgYAAL0EACDNAgAA7QQAMM4CAAAuABDPAgAA7QQAMNACAQAAAAHXAkAAlQQAIdgCQACVBAAh6gIBAJEEACGYAwEAkQQAIZkDAQCRBAAhAwAAAC4AIAEAAC8AMAIAADAAIAEAAAATACABAAAAJAAgAQAAACAAIAEAAAAuACAcAwAAlgQAIAwAAJkEACANAACaBAAgEQAAwQQAIBIAAMIEACAWAADPBAAgzQIAAMwEADDOAgAANgAQzwIAAMwEADDQAgEAkQQAIdECAQCRBAAh0gIBAJEEACHTAgEAkgQAIdQCAQCSBAAh1QIgAJMEACHWAkAAlAQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIYYDAADOBIYDIpcDAQCSBAAhnAMBAJEEACGdAwIAzQQAIZ4DCACsBAAhnwMBAJEEACGgAwEAkQQAIaEDAQCRBAAhogMIAKwEACEBAAAANgAgDgMAAJYEACDNAgAA6QQAMM4CAAA4ABDPAgAA6QQAMNACAQCRBAAh0QIBAJEEACHSAgEAkQQAIdMCAQCSBAAh1AIBAJIEACHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIdkCAQCRBAAhAQAAADgAIA4DAACWBAAgzQIAAJAEADDOAgAAOgAQzwIAAJAEADDQAgEAkQQAIdECAQCRBAAh0gIBAJEEACHTAgEAkgQAIdQCAQCSBAAh1QIgAJMEACHWAkAAlAQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIQEAAAA6ACABAAAABwAgAQAAAAsAIAMAAAADACABAAAEADACAAAFACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAAgACABAAArADACAAAsACADAAAAJAAgAQAAKAAwAgAAKQAgAQAAAAMAIAEAAAAXACABAAAAEwAgAQAAACAAIAEAAAAkACABAAAAAwAgAQAAAAEAIAwYAADPBAAgzQIAAOwEADDOAgAASgAQzwIAAOwEADDQAgEAkQQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAhvQMBAJEEACG-AwEAkgQAIb8DAQCSBAAhBBgAAJ0HACDWAgAAgAUAIL4DAACABQAgvwMAAIAFACADAAAASgAgAQAASwAwAgAAAQAgAwAAAEoAIAEAAEsAMAIAAAEAIAMAAABKACABAABLADACAAABACAJGAAAhwgAINACAQAAAAHVAiAAAAAB1gJAAAAAAdcCQAAAAAHYAkAAAAABvQMBAAAAAb4DAQAAAAG_AwEAAAABAR4AAE8AIAjQAgEAAAAB1QIgAAAAAdYCQAAAAAHXAkAAAAAB2AJAAAAAAb0DAQAAAAG-AwEAAAABvwMBAAAAAQEeAABRADABHgAAUQAwCRgAAP0HACDQAgEAhAUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAhvQMBAIQFACG-AwEAhQUAIb8DAQCFBQAhAgAAAAEAIB4AAFQAIAjQAgEAhAUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAhvQMBAIQFACG-AwEAhQUAIb8DAQCFBQAhAgAAAEoAIB4AAFYAIAIAAABKACAeAABWACADAAAAAQAgJQAATwAgJgAAVAAgAQAAAAEAIAEAAABKACAGCwAA-gcAICsAAPwHACAsAAD7BwAg1gIAAIAFACC-AwAAgAUAIL8DAACABQAgC80CAADrBAAwzgIAAF0AEM8CAADrBAAw0AIBAP8DACHVAiAAgQQAIdYCQACCBAAh1wJAAIMEACHYAkAAgwQAIb0DAQD_AwAhvgMBAIAEACG_AwEAgAQAIQMAAABKACABAABcADAqAABdACADAAAASgAgAQAASwAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAFCAAA-QcAIBcAAJYHACDQAgEAAAAB6wIBAAAAAbwDAQAAAAEBHgAAZQAgA9ACAQAAAAHrAgEAAAABvAMBAAAAAQEeAABnADABHgAAZwAwBQgAAPgHACAXAACUBwAg0AIBAIQFACHrAgEAhAUAIbwDAQCEBQAhAgAAAAUAIB4AAGoAIAPQAgEAhAUAIesCAQCEBQAhvAMBAIQFACECAAAAAwAgHgAAbAAgAgAAAAMAIB4AAGwAIAMAAAAFACAlAABlACAmAABqACABAAAABQAgAQAAAAMAIAMLAAD1BwAgKwAA9wcAICwAAPYHACAGzQIAAOoEADDOAgAAcwAQzwIAAOoEADDQAgEA_wMAIesCAQD_AwAhvAMBAP8DACEDAAAAAwAgAQAAcgAwKgAAcwAgAwAAAAMAIAEAAAQAMAIAAAUAIA4DAACWBAAgzQIAAOkEADDOAgAAOAAQzwIAAOkEADDQAgEAAAAB0QIBAJEEACHSAgEAAAAB0wIBAJIEACHUAgEAkgQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAh2QIBAAAAAQEAAAB2ACABAAAAdgAgBAMAAIsFACDTAgAAgAUAINQCAACABQAg1gIAAIAFACADAAAAOAAgAQAAeQAwAgAAdgAgAwAAADgAIAEAAHkAMAIAAHYAIAMAAAA4ACABAAB5ADACAAB2ACALAwAA9AcAINACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEAAAAB1QIgAAAAAdYCQAAAAAHXAkAAAAAB2AJAAAAAAdkCAQAAAAEBHgAAfQAgCtACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEAAAAB1QIgAAAAAdYCQAAAAAHXAkAAAAAB2AJAAAAAAdkCAQAAAAEBHgAAfwAwAR4AAH8AMAsDAADzBwAg0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh0wIBAIUFACHUAgEAhQUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAh2QIBAIQFACECAAAAdgAgHgAAggEAIArQAgEAhAUAIdECAQCEBQAh0gIBAIQFACHTAgEAhQUAIdQCAQCFBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACHZAgEAhAUAIQIAAAA4ACAeAACEAQAgAgAAADgAIB4AAIQBACADAAAAdgAgJQAAfQAgJgAAggEAIAEAAAB2ACABAAAAOAAgBgsAAPAHACArAADyBwAgLAAA8QcAINMCAACABQAg1AIAAIAFACDWAgAAgAUAIA3NAgAA6AQAMM4CAACLAQAQzwIAAOgEADDQAgEA_wMAIdECAQD_AwAh0gIBAP8DACHTAgEAgAQAIdQCAQCABAAh1QIgAIEEACHWAkAAggQAIdcCQACDBAAh2AJAAIMEACHZAgEA_wMAIQMAAAA4ACABAACKAQAwKgAAiwEAIAMAAAA4ACABAAB5ADACAAB2ACABAAAAFQAgAQAAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIBAGAADMBQAgCAAAzQUAIAkAAOQFACAMAADRBQAgDgAAzgUAIA8AAM8FACAQAADQBQAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB6gIBAAAAAesCAQAAAAGCAwAAALsDApoDAQAAAAG5AwEAAAABuwMAAACCAwIBHgAAkwEAIAnQAgEAAAAB1wJAAAAAAdgCQAAAAAHqAgEAAAAB6wIBAAAAAYIDAAAAuwMCmgMBAAAAAbkDAQAAAAG7AwAAAIIDAgEeAACVAQAwAR4AAJUBADAQBgAAngUAIAgAAJ8FACAJAADiBQAgDAAAowUAIA4AAKAFACAPAAChBQAgEAAAogUAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeoCAQCEBQAh6wIBAIQFACGCAwAAmwW7AyKaAwEAhAUAIbkDAQCEBQAhuwMAAJwFggMiAgAAABUAIB4AAJgBACAJ0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6gIBAIQFACHrAgEAhAUAIYIDAACbBbsDIpoDAQCEBQAhuQMBAIQFACG7AwAAnAWCAyICAAAAEwAgHgAAmgEAIAIAAAATACAeAACaAQAgAwAAABUAICUAAJMBACAmAACYAQAgAQAAABUAIAEAAAATACADCwAA7QcAICsAAO8HACAsAADuBwAgDM0CAADkBAAwzgIAAKEBABDPAgAA5AQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIeoCAQD_AwAh6wIBAP8DACGCAwAA5QS7AyKaAwEA_wMAIbkDAQCmBAAhuwMAAKcEggMiAwAAABMAIAEAAKABADAqAAChAQAgAwAAABMAIAEAABQAMAIAABUAIBUEAADeBAAgBQAA3wQAIAYAAOAEACAIAADhBAAgFAAA4gQAIBUAAOMEACDNAgAA2wQAMM4CAACnAQAQzwIAANsEADDQAgEAAAAB0QIBAJEEACHSAgEAAAAB1QIgAJMEACHWAkAAlAQAIdcCQACVBAAh2AJAAJUEACGCAwAA3QS3AyKzAyAAkwQAIbUDAADcBLUDIrcDIACTBAAhuAMBAJIEACEBAAAApAEAIAEAAACkAQAgFQQAAN4EACAFAADfBAAgBgAA4AQAIAgAAOEEACAUAADiBAAgFQAA4wQAIM0CAADbBAAwzgIAAKcBABDPAgAA2wQAMNACAQCRBAAh0QIBAJEEACHSAgEAkQQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAhggMAAN0EtwMiswMgAJMEACG1AwAA3AS1AyK3AyAAkwQAIbgDAQCSBAAhCAQAAOgHACAFAADpBwAgBgAAigYAIAgAAOoHACAUAADrBwAgFQAA7AcAINYCAACABQAguAMAAIAFACADAAAApwEAIAEAAKgBADACAACkAQAgAwAAAKcBACABAACoAQAwAgAApAEAIAMAAACnAQAgAQAAqAEAMAIAAKQBACASBAAA4gcAIAUAAOMHACAGAADkBwAgCAAA5QcAIBQAAOYHACAVAADnBwAg0AIBAAAAAdECAQAAAAHSAgEAAAAB1QIgAAAAAdYCQAAAAAHXAkAAAAAB2AJAAAAAAYIDAAAAtwMCswMgAAAAAbUDAAAAtQMCtwMgAAAAAbgDAQAAAAEBHgAArAEAIAzQAgEAAAAB0QIBAAAAAdICAQAAAAHVAiAAAAAB1gJAAAAAAdcCQAAAAAHYAkAAAAABggMAAAC3AwKzAyAAAAABtQMAAAC1AwK3AyAAAAABuAMBAAAAAQEeAACuAQAwAR4AAK4BADASBAAAsAcAIAUAALEHACAGAACyBwAgCAAAswcAIBQAALQHACAVAAC1BwAg0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACGCAwAArwe3AyKzAyAAhgUAIbUDAACuB7UDIrcDIACGBQAhuAMBAIUFACECAAAApAEAIB4AALEBACAM0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACGCAwAArwe3AyKzAyAAhgUAIbUDAACuB7UDIrcDIACGBQAhuAMBAIUFACECAAAApwEAIB4AALMBACACAAAApwEAIB4AALMBACADAAAApAEAICUAAKwBACAmAACxAQAgAQAAAKQBACABAAAApwEAIAULAACrBwAgKwAArQcAICwAAKwHACDWAgAAgAUAILgDAACABQAgD80CAADUBAAwzgIAALoBABDPAgAA1AQAMNACAQD_AwAh0QIBAP8DACHSAgEA_wMAIdUCIACBBAAh1gJAAIIEACHXAkAAgwQAIdgCQACDBAAhggMAANYEtwMiswMgAIEEACG1AwAA1QS1AyK3AyAAgQQAIbgDAQCABAAhAwAAAKcBACABAAC5AQAwKgAAugEAIAMAAACnAQAgAQAAqAEAMAIAAKQBACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAkDAACqBwAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB2QIBAAAAAaUDQAAAAAGwAwEAAAABsQMBAAAAAbIDAQAAAAEBHgAAwgEAIAjQAgEAAAAB1wJAAAAAAdgCQAAAAAHZAgEAAAABpQNAAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAQEeAADEAQAwAR4AAMQBADAJAwAAqQcAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIdkCAQCEBQAhpQNAAIgFACGwAwEAhAUAIbEDAQCFBQAhsgMBAIUFACECAAAACQAgHgAAxwEAIAjQAgEAhAUAIdcCQACIBQAh2AJAAIgFACHZAgEAhAUAIaUDQACIBQAhsAMBAIQFACGxAwEAhQUAIbIDAQCFBQAhAgAAAAcAIB4AAMkBACACAAAABwAgHgAAyQEAIAMAAAAJACAlAADCAQAgJgAAxwEAIAEAAAAJACABAAAABwAgBQsAAKYHACArAACoBwAgLAAApwcAILEDAACABQAgsgMAAIAFACALzQIAANMEADDOAgAA0AEAEM8CAADTBAAw0AIBAP8DACHXAkAAgwQAIdgCQACDBAAh2QIBAP8DACGlA0AAgwQAIbADAQD_AwAhsQMBAIAEACGyAwEAgAQAIQMAAAAHACABAADPAQAwKgAA0AEAIAMAAAAHACABAAAIADACAAAJACABAAAADQAgAQAAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIA8DAAClBwAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB2QIBAAAAAaYDAQAAAAGnAwEAAAABqAMBAAAAAakDAQAAAAGqAwEAAAABqwNAAAAAAawDQAAAAAGtAwEAAAABrgMBAAAAAa8DAQAAAAEBHgAA2AEAIA7QAgEAAAAB1wJAAAAAAdgCQAAAAAHZAgEAAAABpgMBAAAAAacDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrA0AAAAABrANAAAAAAa0DAQAAAAGuAwEAAAABrwMBAAAAAQEeAADaAQAwAR4AANoBADAPAwAApAcAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIdkCAQCEBQAhpgMBAIQFACGnAwEAhAUAIagDAQCFBQAhqQMBAIUFACGqAwEAhQUAIasDQACHBQAhrANAAIcFACGtAwEAhQUAIa4DAQCFBQAhrwMBAIUFACECAAAADQAgHgAA3QEAIA7QAgEAhAUAIdcCQACIBQAh2AJAAIgFACHZAgEAhAUAIaYDAQCEBQAhpwMBAIQFACGoAwEAhQUAIakDAQCFBQAhqgMBAIUFACGrA0AAhwUAIawDQACHBQAhrQMBAIUFACGuAwEAhQUAIa8DAQCFBQAhAgAAAAsAIB4AAN8BACACAAAACwAgHgAA3wEAIAMAAAANACAlAADYAQAgJgAA3QEAIAEAAAANACABAAAACwAgCwsAAKEHACArAACjBwAgLAAAogcAIKgDAACABQAgqQMAAIAFACCqAwAAgAUAIKsDAACABQAgrAMAAIAFACCtAwAAgAUAIK4DAACABQAgrwMAAIAFACARzQIAANIEADDOAgAA5gEAEM8CAADSBAAw0AIBAP8DACHXAkAAgwQAIdgCQACDBAAh2QIBAP8DACGmAwEA_wMAIacDAQD_AwAhqAMBAIAEACGpAwEAgAQAIaoDAQCABAAhqwNAAIIEACGsA0AAggQAIa0DAQCABAAhrgMBAIAEACGvAwEAgAQAIQMAAAALACABAADlAQAwKgAA5gEAIAMAAAALACABAAAMADACAAANACAJzQIAANEEADDOAgAA7AEAEM8CAADRBAAw0AIBAAAAAdcCQACVBAAh2AJAAJUEACGjAwEAkQQAIaQDAQCRBAAhpQNAAJUEACEBAAAA6QEAIAEAAADpAQAgCc0CAADRBAAwzgIAAOwBABDPAgAA0QQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIaMDAQCRBAAhpAMBAJEEACGlA0AAlQQAIQADAAAA7AEAIAEAAO0BADACAADpAQAgAwAAAOwBACABAADtAQAwAgAA6QEAIAMAAADsAQAgAQAA7QEAMAIAAOkBACAG0AIBAAAAAdcCQAAAAAHYAkAAAAABowMBAAAAAaQDAQAAAAGlA0AAAAABAR4AAPEBACAG0AIBAAAAAdcCQAAAAAHYAkAAAAABowMBAAAAAaQDAQAAAAGlA0AAAAABAR4AAPMBADABHgAA8wEAMAbQAgEAhAUAIdcCQACIBQAh2AJAAIgFACGjAwEAhAUAIaQDAQCEBQAhpQNAAIgFACECAAAA6QEAIB4AAPYBACAG0AIBAIQFACHXAkAAiAUAIdgCQACIBQAhowMBAIQFACGkAwEAhAUAIaUDQACIBQAhAgAAAOwBACAeAAD4AQAgAgAAAOwBACAeAAD4AQAgAwAAAOkBACAlAADxAQAgJgAA9gEAIAEAAADpAQAgAQAAAOwBACADCwAAngcAICsAAKAHACAsAACfBwAgCc0CAADQBAAwzgIAAP8BABDPAgAA0AQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIaMDAQD_AwAhpAMBAP8DACGlA0AAgwQAIQMAAADsAQAgAQAA_gEAMCoAAP8BACADAAAA7AEAIAEAAO0BADACAADpAQAgHAMAAJYEACAMAACZBAAgDQAAmgQAIBEAAMEEACASAADCBAAgFgAAzwQAIM0CAADMBAAwzgIAADYAEM8CAADMBAAw0AIBAAAAAdECAQCRBAAh0gIBAAAAAdMCAQCSBAAh1AIBAJIEACHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIdkCAQAAAAGGAwAAzgSGAyKXAwEAkgQAIZwDAQAAAAGdAwIAzQQAIZ4DCACsBAAhnwMBAJEEACGgAwEAkQQAIaEDAQCRBAAhogMIAKwEACEBAAAAggIAIAEAAACCAgAgCgMAAIsFACAMAADpBQAgDQAA6gUAIBEAAM0GACASAADOBgAgFgAAnQcAINMCAACABQAg1AIAAIAFACDWAgAAgAUAIJcDAACABQAgAwAAADYAIAEAAIUCADACAACCAgAgAwAAADYAIAEAAIUCADACAACCAgAgAwAAADYAIAEAAIUCADACAACCAgAgGQMAAJcHACAMAACZBwAgDQAAmgcAIBEAAJwHACASAACbBwAgFgAAmAcAINACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEAAAAB1QIgAAAAAdYCQAAAAAHXAkAAAAAB2AJAAAAAAdkCAQAAAAGGAwAAAIYDApcDAQAAAAGcAwEAAAABnQMCAAAAAZ4DCAAAAAGfAwEAAAABoAMBAAAAAaEDAQAAAAGiAwgAAAABAR4AAIkCACAT0AIBAAAAAdECAQAAAAHSAgEAAAAB0wIBAAAAAdQCAQAAAAHVAiAAAAAB1gJAAAAAAdcCQAAAAAHYAkAAAAAB2QIBAAAAAYYDAAAAhgMClwMBAAAAAZwDAQAAAAGdAwIAAAABngMIAAAAAZ8DAQAAAAGgAwEAAAABoQMBAAAAAaIDCAAAAAEBHgAAiwIAMAEeAACLAgAwGQMAAN8GACAMAADhBgAgDQAA4gYAIBEAAOQGACASAADjBgAgFgAA4AYAINACAQCEBQAh0QIBAIQFACHSAgEAhAUAIdMCAQCFBQAh1AIBAIUFACHVAiAAhgUAIdYCQACHBQAh1wJAAIgFACHYAkAAiAUAIdkCAQCEBQAhhgMAAN4GhgMilwMBAIUFACGcAwEAhAUAIZ0DAgDdBgAhngMIAMEFACGfAwEAhAUAIaADAQCEBQAhoQMBAIQFACGiAwgAwQUAIQIAAACCAgAgHgAAjgIAIBPQAgEAhAUAIdECAQCEBQAh0gIBAIQFACHTAgEAhQUAIdQCAQCFBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACHZAgEAhAUAIYYDAADeBoYDIpcDAQCFBQAhnAMBAIQFACGdAwIA3QYAIZ4DCADBBQAhnwMBAIQFACGgAwEAhAUAIaEDAQCEBQAhogMIAMEFACECAAAANgAgHgAAkAIAIAIAAAA2ACAeAACQAgAgAwAAAIICACAlAACJAgAgJgAAjgIAIAEAAACCAgAgAQAAADYAIAkLAADYBgAgKwAA2wYAICwAANoGACCtAQAA2QYAIK4BAADcBgAg0wIAAIAFACDUAgAAgAUAINYCAACABQAglwMAAIAFACAWzQIAAMYEADDOAgAAlwIAEM8CAADGBAAw0AIBAP8DACHRAgEA_wMAIdICAQD_AwAh0wIBAIAEACHUAgEAgAQAIdUCIACBBAAh1gJAAIIEACHXAkAAgwQAIdgCQACDBAAh2QIBAP8DACGGAwAAyASGAyKXAwEAgAQAIZwDAQD_AwAhnQMCAMcEACGeAwgAnAQAIZ8DAQD_AwAhoAMBAP8DACGhAwEA_wMAIaIDCACcBAAhAwAAADYAIAEAAJYCADAqAACXAgAgAwAAADYAIAEAAIUCADACAACCAgAgAQAAABkAIAEAAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACAJCAAAsQUAIAkAALIFACAKAADmBQAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB6wIBAAAAAZoDAQAAAAGbAyAAAAABAR4AAJ8CACAG0AIBAAAAAdcCQAAAAAHYAkAAAAAB6wIBAAAAAZoDAQAAAAGbAyAAAAABAR4AAKECADABHgAAoQIAMAkIAACuBQAgCQAArwUAIAoAANoFACDQAgEAhAUAIdcCQACIBQAh2AJAAIgFACHrAgEAhAUAIZoDAQCEBQAhmwMgAIYFACECAAAAGQAgHgAApAIAIAbQAgEAhAUAIdcCQACIBQAh2AJAAIgFACHrAgEAhAUAIZoDAQCEBQAhmwMgAIYFACECAAAAFwAgHgAApgIAIAIAAAAXACAeAACmAgAgAwAAABkAICUAAJ8CACAmAACkAgAgAQAAABkAIAEAAAAXACADCwAA1QYAICsAANcGACAsAADWBgAgCc0CAADFBAAwzgIAAK0CABDPAgAAxQQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIesCAQD_AwAhmgMBAP8DACGbAyAAgQQAIQMAAAAXACABAACsAgAwKgAArQIAIAMAAAAXACABAAAYADACAAAZACABAAAAMAAgAQAAADAAIAMAAAAuACABAAAvADACAAAwACADAAAALgAgAQAALwAwAgAAMAAgAwAAAC4AIAEAAC8AMAIAADAAIAcGAADUBgAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB6gIBAAAAAZgDAQAAAAGZAwEAAAABAR4AALUCACAG0AIBAAAAAdcCQAAAAAHYAkAAAAAB6gIBAAAAAZgDAQAAAAGZAwEAAAABAR4AALcCADABHgAAtwIAMAcGAADTBgAg0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6gIBAIQFACGYAwEAhAUAIZkDAQCEBQAhAgAAADAAIB4AALoCACAG0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6gIBAIQFACGYAwEAhAUAIZkDAQCEBQAhAgAAAC4AIB4AALwCACACAAAALgAgHgAAvAIAIAMAAAAwACAlAAC1AgAgJgAAugIAIAEAAAAwACABAAAALgAgAwsAANAGACArAADSBgAgLAAA0QYAIAnNAgAAxAQAMM4CAADDAgAQzwIAAMQEADDQAgEA_wMAIdcCQACDBAAh2AJAAIMEACHqAgEA_wMAIZgDAQD_AwAhmQMBAP8DACEDAAAALgAgAQAAwgIAMCoAAMMCACADAAAALgAgAQAALwAwAgAAMAAgFAMAAJYEACAHAADABAAgDQAAmgQAIBEAAMEEACASAADCBAAgEwAAwwQAIM0CAAC_BAAwzgIAAA8AEM8CAAC_BAAw0AIBAAAAAdECAQCRBAAh0gIBAAAAAdMCAQCSBAAh1AIBAJIEACHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIdkCAQAAAAGXAwEAkgQAIQEAAADGAgAgAQAAAMYCACAKAwAAiwUAIAcAAMwGACANAADqBQAgEQAAzQYAIBIAAM4GACATAADPBgAg0wIAAIAFACDUAgAAgAUAINYCAACABQAglwMAAIAFACADAAAADwAgAQAAyQIAMAIAAMYCACADAAAADwAgAQAAyQIAMAIAAMYCACADAAAADwAgAQAAyQIAMAIAAMYCACARAwAAxgYAIAcAAMcGACANAADIBgAgEQAAyQYAIBIAAMoGACATAADLBgAg0AIBAAAAAdECAQAAAAHSAgEAAAAB0wIBAAAAAdQCAQAAAAHVAiAAAAAB1gJAAAAAAdcCQAAAAAHYAkAAAAAB2QIBAAAAAZcDAQAAAAEBHgAAzQIAIAvQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAAAAAdUCIAAAAAHWAkAAAAAB1wJAAAAAAdgCQAAAAAHZAgEAAAABlwMBAAAAAQEeAADPAgAwAR4AAM8CADARAwAAjgYAIAcAAI8GACANAACQBgAgEQAAkQYAIBIAAJIGACATAACTBgAg0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh0wIBAIUFACHUAgEAhQUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAh2QIBAIQFACGXAwEAhQUAIQIAAADGAgAgHgAA0gIAIAvQAgEAhAUAIdECAQCEBQAh0gIBAIQFACHTAgEAhQUAIdQCAQCFBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACHZAgEAhAUAIZcDAQCFBQAhAgAAAA8AIB4AANQCACACAAAADwAgHgAA1AIAIAMAAADGAgAgJQAAzQIAICYAANICACABAAAAxgIAIAEAAAAPACAHCwAAiwYAICsAAI0GACAsAACMBgAg0wIAAIAFACDUAgAAgAUAINYCAACABQAglwMAAIAFACAOzQIAAL4EADDOAgAA2wIAEM8CAAC-BAAw0AIBAP8DACHRAgEA_wMAIdICAQD_AwAh0wIBAIAEACHUAgEAgAQAIdUCIACBBAAh1gJAAIIEACHXAkAAgwQAIdgCQACDBAAh2QIBAP8DACGXAwEAgAQAIQMAAAAPACABAADaAgAwKgAA2wIAIAMAAAAPACABAADJAgAwAgAAxgIAIBgGAAC9BAAgzQIAALkEADDOAgAAEQAQzwIAALkEADDQAgEAAAAB1wJAAJUEACHYAkAAlQQAIeoCAQAAAAGGAwAAugSGAyOHA0AAlAQAIYkDAAC7BIkDI4oDIAC8BAAhiwMgALwEACGMAwEAkgQAIY0DAQCSBAAhjgMgALwEACGPAwEAkgQAIZADIAC8BAAhkQMBAJIEACGSAwEAkgQAIZMDIAC8BAAhlAMgALwEACGVAyAAvAQAIZYDAQCSBAAhAQAAAN4CACABAAAA3gIAIBEGAACKBgAghgMAAIAFACCHAwAAgAUAIIkDAACABQAgigMAAIAFACCLAwAAgAUAIIwDAACABQAgjQMAAIAFACCOAwAAgAUAII8DAACABQAgkAMAAIAFACCRAwAAgAUAIJIDAACABQAgkwMAAIAFACCUAwAAgAUAIJUDAACABQAglgMAAIAFACADAAAAEQAgAQAA4QIAMAIAAN4CACADAAAAEQAgAQAA4QIAMAIAAN4CACADAAAAEQAgAQAA4QIAMAIAAN4CACAVBgAAiQYAINACAQAAAAHXAkAAAAAB2AJAAAAAAeoCAQAAAAGGAwAAAIYDA4cDQAAAAAGJAwAAAIkDA4oDIAAAAAGLAyAAAAABjAMBAAAAAY0DAQAAAAGOAyAAAAABjwMBAAAAAZADIAAAAAGRAwEAAAABkgMBAAAAAZMDIAAAAAGUAyAAAAABlQMgAAAAAZYDAQAAAAEBHgAA5QIAIBTQAgEAAAAB1wJAAAAAAdgCQAAAAAHqAgEAAAABhgMAAACGAwOHA0AAAAABiQMAAACJAwOKAyAAAAABiwMgAAAAAYwDAQAAAAGNAwEAAAABjgMgAAAAAY8DAQAAAAGQAyAAAAABkQMBAAAAAZIDAQAAAAGTAyAAAAABlAMgAAAAAZUDIAAAAAGWAwEAAAABAR4AAOcCADABHgAA5wIAMBUGAACIBgAg0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6gIBAIQFACGGAwAAhQaGAyOHA0AAhwUAIYkDAACGBokDI4oDIACHBgAhiwMgAIcGACGMAwEAhQUAIY0DAQCFBQAhjgMgAIcGACGPAwEAhQUAIZADIACHBgAhkQMBAIUFACGSAwEAhQUAIZMDIACHBgAhlAMgAIcGACGVAyAAhwYAIZYDAQCFBQAhAgAAAN4CACAeAADqAgAgFNACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeoCAQCEBQAhhgMAAIUGhgMjhwNAAIcFACGJAwAAhgaJAyOKAyAAhwYAIYsDIACHBgAhjAMBAIUFACGNAwEAhQUAIY4DIACHBgAhjwMBAIUFACGQAyAAhwYAIZEDAQCFBQAhkgMBAIUFACGTAyAAhwYAIZQDIACHBgAhlQMgAIcGACGWAwEAhQUAIQIAAAARACAeAADsAgAgAgAAABEAIB4AAOwCACADAAAA3gIAICUAAOUCACAmAADqAgAgAQAAAN4CACABAAAAEQAgEwsAAIIGACArAACEBgAgLAAAgwYAIIYDAACABQAghwMAAIAFACCJAwAAgAUAIIoDAACABQAgiwMAAIAFACCMAwAAgAUAII0DAACABQAgjgMAAIAFACCPAwAAgAUAIJADAACABQAgkQMAAIAFACCSAwAAgAUAIJMDAACABQAglAMAAIAFACCVAwAAgAUAIJYDAACABQAgF80CAACvBAAwzgIAAPMCABDPAgAArwQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIeoCAQD_AwAhhgMAALAEhgMjhwNAAIIEACGJAwAAsQSJAyOKAyAAsgQAIYsDIACyBAAhjAMBAIAEACGNAwEAgAQAIY4DIACyBAAhjwMBAIAEACGQAyAAsgQAIZEDAQCABAAhkgMBAIAEACGTAyAAsgQAIZQDIACyBAAhlQMgALIEACGWAwEAgAQAIQMAAAARACABAADyAgAwKgAA8wIAIAMAAAARACABAADhAgAwAgAA3gIAIA4KAACuBAAgzQIAAKsEADDOAgAAIgAQzwIAAKsEADDQAgEAAAAB1wJAAJUEACHYAkAAlQQAIewCAQAAAAH-AggArAQAIf8CAQAAAAGAAwEAAAABggMAAK0EggMigwMBAJIEACGEAwAAowQAIAEAAAD2AgAgAQAAAPYCACAECgAAgQYAIIADAACABQAggwMAAIAFACCEAwAAgAUAIAMAAAAiACABAAD5AgAwAgAA9gIAIAMAAAAiACABAAD5AgAwAgAA9gIAIAMAAAAiACABAAD5AgAwAgAA9gIAIAsKAACABgAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB7AIBAAAAAf4CCAAAAAH_AgEAAAABgAMBAAAAAYIDAAAAggMCgwMBAAAAAYQDgAAAAAEBHgAA_QIAIArQAgEAAAAB1wJAAAAAAdgCQAAAAAHsAgEAAAAB_gIIAAAAAf8CAQAAAAGAAwEAAAABggMAAACCAwKDAwEAAAABhAOAAAAAAQEeAAD_AgAwAR4AAP8CADALCgAA_wUAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIewCAQCEBQAh_gIIAMEFACH_AgEAhAUAIYADAQCFBQAhggMAAJwFggMigwMBAIUFACGEA4AAAAABAgAAAPYCACAeAACCAwAgCtACAQCEBQAh1wJAAIgFACHYAkAAiAUAIewCAQCEBQAh_gIIAMEFACH_AgEAhAUAIYADAQCFBQAhggMAAJwFggMigwMBAIUFACGEA4AAAAABAgAAACIAIB4AAIQDACACAAAAIgAgHgAAhAMAIAMAAAD2AgAgJQAA_QIAICYAAIIDACABAAAA9gIAIAEAAAAiACAICwAA-gUAICsAAP0FACAsAAD8BQAgrQEAAPsFACCuAQAA_gUAIIADAACABQAggwMAAIAFACCEAwAAgAUAIA3NAgAApQQAMM4CAACLAwAQzwIAAKUEADDQAgEA_wMAIdcCQACDBAAh2AJAAIMEACHsAgEA_wMAIf4CCACcBAAh_wIBAKYEACGAAwEAgAQAIYIDAACnBIIDIoMDAQCABAAhhAMAAKAEACADAAAAIgAgAQAAigMAMCoAAIsDACADAAAAIgAgAQAA-QIAMAIAAPYCACABAAAAKQAgAQAAACkAIAMAAAAkACABAAAoADACAAApACADAAAAJAAgAQAAKAAwAgAAKQAgAwAAACQAIAEAACgAMAIAACkAIAwGAAC6BQAgCAAAuwUAIAoAAPkFACDQAgEAAAAB1wJAAAAAAdgCQAAAAAHqAgEAAAAB6wIBAAAAAewCAQAAAAH7AkAAAAAB_AIBAAAAAf0CAQAAAAEBHgAAkwMAIAnQAgEAAAAB1wJAAAAAAdgCQAAAAAHqAgEAAAAB6wIBAAAAAewCAQAAAAH7AkAAAAAB_AIBAAAAAf0CAQAAAAEBHgAAlQMAMAEeAACVAwAwDAYAALgFACAIAAC5BQAgCgAA-AUAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeoCAQCEBQAh6wIBAIQFACHsAgEAhAUAIfsCQACIBQAh_AIBAIQFACH9AgEAhQUAIQIAAAApACAeAACYAwAgCdACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeoCAQCEBQAh6wIBAIQFACHsAgEAhAUAIfsCQACIBQAh_AIBAIQFACH9AgEAhQUAIQIAAAAkACAeAACaAwAgAgAAACQAIB4AAJoDACADAAAAKQAgJQAAkwMAICYAAJgDACABAAAAKQAgAQAAACQAIAQLAAD1BQAgKwAA9wUAICwAAPYFACD9AgAAgAUAIAzNAgAApAQAMM4CAAChAwAQzwIAAKQEADDQAgEA_wMAIdcCQACDBAAh2AJAAIMEACHqAgEA_wMAIesCAQD_AwAh7AIBAP8DACH7AkAAgwQAIfwCAQD_AwAh_QIBAIAEACEDAAAAJAAgAQAAoAMAMCoAAKEDACADAAAAJAAgAQAAKAAwAgAAKQAgDs0CAACiBAAwzgIAAKcDABDPAgAAogQAMNACAQAAAAHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIe8CAQAAAAHwAgEAkQQAIfECAQCRBAAh8gIBAJIEACHzAgEAkQQAIfQCAACjBAAgAQAAAKQDACABAAAApAMAIA7NAgAAogQAMM4CAACnAwAQzwIAAKIEADDQAgEAkQQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAh7wIBAJEEACHwAgEAkQQAIfECAQCRBAAh8gIBAJIEACHzAgEAkQQAIfQCAACjBAAgA9YCAACABQAg8gIAAIAFACD0AgAAgAUAIAMAAACnAwAgAQAAqAMAMAIAAKQDACADAAAApwMAIAEAAKgDADACAACkAwAgAwAAAKcDACABAACoAwAwAgAApAMAIAvQAgEAhAUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAh7wIBAIQFACHwAgEAhAUAIfECAQCEBQAh8gIBAIUFACHzAgEAhAUAIfQCgAAAAAECAAAApAMAIB4AAKwDACAL0AIBAIQFACHVAiAAhgUAIdYCQACHBQAh1wJAAIgFACHYAkAAiAUAIe8CAQCEBQAh8AIBAIQFACHxAgEAhAUAIfICAQCFBQAh8wIBAIQFACH0AoAAAAABAgAAAKcDACAeAACuAwAgAgAAAKcDACAeAACuAwAgAQAAAKQDACABAAAApwMAIAYLAADyBQAgKwAA9AUAICwAAPMFACDWAgAAgAUAIPICAACABQAg9AIAAIAFACAOzQIAAJ8EADDOAgAAtAMAEM8CAACfBAAw0AIBAP8DACHVAiAAgQQAIdYCQACCBAAh1wJAAIMEACHYAkAAgwQAIe8CAQD_AwAh8AIBAP8DACHxAgEA_wMAIfICAQCABAAh8wIBAP8DACH0AgAAoAQAIAMAAACnAwAgAQAAswMAMCoAALQDACADAAAApwMAIAEAAKgDADACAACkAwAgAQAAACwAIAEAAAAsACADAAAAIAAgAQAAKwAwAgAALAAgAwAAACAAIAEAACsAMAIAACwAIAMAAAAgACABAAArADACAAAsACALBgAAyQUAIAgAAMoFACAKAADxBQAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB6gIBAAAAAesCAQAAAAHsAgEAAAAB7QIIAAAAAe4CAQAAAAEBHgAAvAMAIAjQAgEAAAAB1wJAAAAAAdgCQAAAAAHqAgEAAAAB6wIBAAAAAewCAQAAAAHtAggAAAAB7gIBAAAAAQEeAAC-AwAwAR4AAL4DADALBgAAxwUAIAgAAMgFACAKAADwBQAg0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6gIBAIQFACHrAgEAhAUAIewCAQCEBQAh7QIIAMEFACHuAgEAhQUAIQIAAAAsACAeAADBAwAgCNACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeoCAQCEBQAh6wIBAIQFACHsAgEAhAUAIe0CCADBBQAh7gIBAIUFACECAAAAIAAgHgAAwwMAIAIAAAAgACAeAADDAwAgAwAAACwAICUAALwDACAmAADBAwAgAQAAACwAIAEAAAAgACAGCwAA6wUAICsAAO4FACAsAADtBQAgrQEAAOwFACCuAQAA7wUAIO4CAACABQAgC80CAACbBAAwzgIAAMoDABDPAgAAmwQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIeoCAQD_AwAh6wIBAP8DACHsAgEA_wMAIe0CCACcBAAh7gIBAIAEACEDAAAAIAAgAQAAyQMAMCoAAMoDACADAAAAIAAgAQAAKwAwAgAALAAgCgwAAJkEACANAACaBAAgzQIAAJgEADDOAgAA0AMAEM8CAACYBAAw0AIBAAAAAdcCQACVBAAh2AJAAJUEACHlAkAAlQQAIeYCQACVBAAhAQAAAM0DACABAAAAzQMAIAoMAACZBAAgDQAAmgQAIM0CAACYBAAwzgIAANADABDPAgAAmAQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeUCQACVBAAh5gJAAJUEACECDAAA6QUAIA0AAOoFACADAAAA0AMAIAEAANEDADACAADNAwAgAwAAANADACABAADRAwAwAgAAzQMAIAMAAADQAwAgAQAA0QMAMAIAAM0DACAHDAAA5wUAIA0AAOgFACDQAgEAAAAB1wJAAAAAAdgCQAAAAAHlAkAAAAAB5gJAAAAAAQEeAADVAwAgBdACAQAAAAHXAkAAAAAB2AJAAAAAAeUCQAAAAAHmAkAAAAABAR4AANcDADABHgAA1wMAMAcMAACPBQAgDQAAkAUAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeUCQACIBQAh5gJAAIgFACECAAAAzQMAIB4AANoDACAF0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh5QJAAIgFACHmAkAAiAUAIQIAAADQAwAgHgAA3AMAIAIAAADQAwAgHgAA3AMAIAMAAADNAwAgJQAA1QMAICYAANoDACABAAAAzQMAIAEAAADQAwAgAwsAAIwFACArAACOBQAgLAAAjQUAIAjNAgAAlwQAMM4CAADjAwAQzwIAAJcEADDQAgEA_wMAIdcCQACDBAAh2AJAAIMEACHlAkAAgwQAIeYCQACDBAAhAwAAANADACABAADiAwAwKgAA4wMAIAMAAADQAwAgAQAA0QMAMAIAAM0DACAOAwAAlgQAIM0CAACQBAAwzgIAADoAEM8CAACQBAAw0AIBAAAAAdECAQCRBAAh0gIBAAAAAdMCAQCSBAAh1AIBAJIEACHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIdkCAQAAAAEBAAAA5gMAIAEAAADmAwAgBAMAAIsFACDTAgAAgAUAINQCAACABQAg1gIAAIAFACADAAAAOgAgAQAA6QMAMAIAAOYDACADAAAAOgAgAQAA6QMAMAIAAOYDACADAAAAOgAgAQAA6QMAMAIAAOYDACALAwAAigUAINACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEAAAAB1QIgAAAAAdYCQAAAAAHXAkAAAAAB2AJAAAAAAdkCAQAAAAEBHgAA7QMAIArQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAAAAAdUCIAAAAAHWAkAAAAAB1wJAAAAAAdgCQAAAAAHZAgEAAAABAR4AAO8DADABHgAA7wMAMAsDAACJBQAg0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh0wIBAIUFACHUAgEAhQUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAh2QIBAIQFACECAAAA5gMAIB4AAPIDACAK0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh0wIBAIUFACHUAgEAhQUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAh2QIBAIQFACECAAAAOgAgHgAA9AMAIAIAAAA6ACAeAAD0AwAgAwAAAOYDACAlAADtAwAgJgAA8gMAIAEAAADmAwAgAQAAADoAIAYLAACBBQAgKwAAgwUAICwAAIIFACDTAgAAgAUAINQCAACABQAg1gIAAIAFACANzQIAAP4DADDOAgAA-wMAEM8CAAD-AwAw0AIBAP8DACHRAgEA_wMAIdICAQD_AwAh0wIBAIAEACHUAgEAgAQAIdUCIACBBAAh1gJAAIIEACHXAkAAgwQAIdgCQACDBAAh2QIBAP8DACEDAAAAOgAgAQAA-gMAMCoAAPsDACADAAAAOgAgAQAA6QMAMAIAAOYDACANzQIAAP4DADDOAgAA-wMAEM8CAAD-AwAw0AIBAP8DACHRAgEA_wMAIdICAQD_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_wMAIdcCQACDBAAh2AJAAIMEACHlAkAAgwQAIeYCQACDBAAhCgwAAJkEACANAACaBAAgzQIAAJgEADDOAgAA0AMAEM8CAACYBAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh5QJAAJUEACHmAkAAlQQAIQPnAgAAFwAg6AIAABcAIOkCAAAXACAD5wIAABMAIOgCAAATACDpAgAAEwAgC80CAACbBAAwzgIAAMoDABDPAgAAmwQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIeoCAQD_AwAh6wIBAP8DACHsAgEA_wMAIe0CCACcBAAh7gIBAIAEACENCwAAhQQAICsAAJ4EACAsAACeBAAgrQEAAJ4EACCuAQAAngQAINoCCAAAAAHbAggAAAAE3AIIAAAABN0CCAAAAAHeAggAAAAB3wIIAAAAAeACCAAAAAHhAggAnQQAIQ0LAACFBAAgKwAAngQAICwAAJ4EACCtAQAAngQAIK4BAACeBAAg2gIIAAAAAdsCCAAAAATcAggAAAAE3QIIAAAAAd4CCAAAAAHfAggAAAAB4AIIAAAAAeECCACdBAAhCNoCCAAAAAHbAggAAAAE3AIIAAAABN0CCAAAAAHeAggAAAAB3wIIAAAAAeACCAAAAAHhAggAngQAIQ7NAgAAnwQAMM4CAAC0AwAQzwIAAJ8EADDQAgEA_wMAIdUCIACBBAAh1gJAAIIEACHXAkAAgwQAIdgCQACDBAAh7wIBAP8DACHwAgEA_wMAIfECAQD_AwAh8gIBAIAEACHzAgEA_wMAIfQCAACgBAAgDwsAAIgEACArAAChBAAgLAAAoQQAINoCgAAAAAHdAoAAAAAB3gKAAAAAAd8CgAAAAAHgAoAAAAAB4QKAAAAAAfUCAQAAAAH2AgEAAAAB9wIBAAAAAfgCgAAAAAH5AoAAAAAB-gKAAAAAAQzaAoAAAAAB3QKAAAAAAd4CgAAAAAHfAoAAAAAB4AKAAAAAAeECgAAAAAH1AgEAAAAB9gIBAAAAAfcCAQAAAAH4AoAAAAAB-QKAAAAAAfoCgAAAAAEOzQIAAKIEADDOAgAApwMAEM8CAACiBAAw0AIBAJEEACHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIe8CAQCRBAAh8AIBAJEEACHxAgEAkQQAIfICAQCSBAAh8wIBAJEEACH0AgAAowQAIAzaAoAAAAAB3QKAAAAAAd4CgAAAAAHfAoAAAAAB4AKAAAAAAeECgAAAAAH1AgEAAAAB9gIBAAAAAfcCAQAAAAH4AoAAAAAB-QKAAAAAAfoCgAAAAAEMzQIAAKQEADDOAgAAoQMAEM8CAACkBAAw0AIBAP8DACHXAkAAgwQAIdgCQACDBAAh6gIBAP8DACHrAgEA_wMAIewCAQD_AwAh-wJAAIMEACH8AgEA_wMAIf0CAQCABAAhDc0CAAClBAAwzgIAAIsDABDPAgAApQQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIewCAQD_AwAh_gIIAJwEACH_AgEApgQAIYADAQCABAAhggMAAKcEggMigwMBAIAEACGEAwAAoAQAIAsLAACFBAAgKwAAjwQAICwAAI8EACDaAgEAAAAB2wIBAAAABNwCAQAAAATdAgEAAAAB3gIBAAAAAd8CAQAAAAHgAgEAAAAB4QIBAKoEACEHCwAAhQQAICsAAKkEACAsAACpBAAg2gIAAACCAwLbAgAAAIIDCNwCAAAAggMI4QIAAKgEggMiBwsAAIUEACArAACpBAAgLAAAqQQAINoCAAAAggMC2wIAAACCAwjcAgAAAIIDCOECAACoBIIDIgTaAgAAAIIDAtsCAAAAggMI3AIAAACCAwjhAgAAqQSCAyILCwAAhQQAICsAAI8EACAsAACPBAAg2gIBAAAAAdsCAQAAAATcAgEAAAAE3QIBAAAAAd4CAQAAAAHfAgEAAAAB4AIBAAAAAeECAQCqBAAhDgoAAK4EACDNAgAAqwQAMM4CAAAiABDPAgAAqwQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIewCAQCRBAAh_gIIAKwEACH_AgEA8QQAIYADAQCSBAAhggMAAK0EggMigwMBAJIEACGEAwAAowQAIAjaAggAAAAB2wIIAAAABNwCCAAAAATdAggAAAAB3gIIAAAAAd8CCAAAAAHgAggAAAAB4QIIAJ4EACEE2gIAAACCAwLbAgAAAIIDCNwCAAAAggMI4QIAAKkEggMiFQYAAL0EACAIAADvBAAgCQAA9QQAIAwAAJkEACAOAAD4BAAgDwAA-QQAIBAAAPoEACDNAgAA9gQAMM4CAAATABDPAgAA9gQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAh6wIBAJEEACGCAwAA9wS7AyKaAwEAkQQAIbkDAQDxBAAhuwMAAK0EggMiwgMAABMAIMMDAAATACAXzQIAAK8EADDOAgAA8wIAEM8CAACvBAAw0AIBAP8DACHXAkAAgwQAIdgCQACDBAAh6gIBAP8DACGGAwAAsASGAyOHA0AAggQAIYkDAACxBIkDI4oDIACyBAAhiwMgALIEACGMAwEAgAQAIY0DAQCABAAhjgMgALIEACGPAwEAgAQAIZADIACyBAAhkQMBAIAEACGSAwEAgAQAIZMDIACyBAAhlAMgALIEACGVAyAAsgQAIZYDAQCABAAhBwsAAIgEACArAAC4BAAgLAAAuAQAINoCAAAAhgMD2wIAAACGAwncAgAAAIYDCeECAAC3BIYDIwcLAACIBAAgKwAAtgQAICwAALYEACDaAgAAAIkDA9sCAAAAiQMJ3AIAAACJAwnhAgAAtQSJAyMFCwAAiAQAICsAALQEACAsAAC0BAAg2gIgAAAAAeECIACzBAAhBQsAAIgEACArAAC0BAAgLAAAtAQAINoCIAAAAAHhAiAAswQAIQLaAiAAAAAB4QIgALQEACEHCwAAiAQAICsAALYEACAsAAC2BAAg2gIAAACJAwPbAgAAAIkDCdwCAAAAiQMJ4QIAALUEiQMjBNoCAAAAiQMD2wIAAACJAwncAgAAAIkDCeECAAC2BIkDIwcLAACIBAAgKwAAuAQAICwAALgEACDaAgAAAIYDA9sCAAAAhgMJ3AIAAACGAwnhAgAAtwSGAyME2gIAAACGAwPbAgAAAIYDCdwCAAAAhgMJ4QIAALgEhgMjGAYAAL0EACDNAgAAuQQAMM4CAAARABDPAgAAuQQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAhhgMAALoEhgMjhwNAAJQEACGJAwAAuwSJAyOKAyAAvAQAIYsDIAC8BAAhjAMBAJIEACGNAwEAkgQAIY4DIAC8BAAhjwMBAJIEACGQAyAAvAQAIZEDAQCSBAAhkgMBAJIEACGTAyAAvAQAIZQDIAC8BAAhlQMgALwEACGWAwEAkgQAIQTaAgAAAIYDA9sCAAAAhgMJ3AIAAACGAwnhAgAAuASGAyME2gIAAACJAwPbAgAAAIkDCdwCAAAAiQMJ4QIAALYEiQMjAtoCIAAAAAHhAiAAtAQAIRYDAACWBAAgBwAAwAQAIA0AAJoEACARAADBBAAgEgAAwgQAIBMAAMMEACDNAgAAvwQAMM4CAAAPABDPAgAAvwQAMNACAQCRBAAh0QIBAJEEACHSAgEAkQQAIdMCAQCSBAAh1AIBAJIEACHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIdkCAQCRBAAhlwMBAJIEACHCAwAADwAgwwMAAA8AIA7NAgAAvgQAMM4CAADbAgAQzwIAAL4EADDQAgEA_wMAIdECAQD_AwAh0gIBAP8DACHTAgEAgAQAIdQCAQCABAAh1QIgAIEEACHWAkAAggQAIdcCQACDBAAh2AJAAIMEACHZAgEA_wMAIZcDAQCABAAhFAMAAJYEACAHAADABAAgDQAAmgQAIBEAAMEEACASAADCBAAgEwAAwwQAIM0CAAC_BAAwzgIAAA8AEM8CAAC_BAAw0AIBAJEEACHRAgEAkQQAIdICAQCRBAAh0wIBAJIEACHUAgEAkgQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAh2QIBAJEEACGXAwEAkgQAIRoGAAC9BAAgzQIAALkEADDOAgAAEQAQzwIAALkEADDQAgEAkQQAIdcCQACVBAAh2AJAAJUEACHqAgEAkQQAIYYDAAC6BIYDI4cDQACUBAAhiQMAALsEiQMjigMgALwEACGLAyAAvAQAIYwDAQCSBAAhjQMBAJIEACGOAyAAvAQAIY8DAQCSBAAhkAMgALwEACGRAwEAkgQAIZIDAQCSBAAhkwMgALwEACGUAyAAvAQAIZUDIAC8BAAhlgMBAJIEACHCAwAAEQAgwwMAABEAIAPnAgAAJAAg6AIAACQAIOkCAAAkACAD5wIAACAAIOgCAAAgACDpAgAAIAAgA-cCAAAuACDoAgAALgAg6QIAAC4AIAnNAgAAxAQAMM4CAADDAgAQzwIAAMQEADDQAgEA_wMAIdcCQACDBAAh2AJAAIMEACHqAgEA_wMAIZgDAQD_AwAhmQMBAP8DACEJzQIAAMUEADDOAgAArQIAEM8CAADFBAAw0AIBAP8DACHXAkAAgwQAIdgCQACDBAAh6wIBAP8DACGaAwEA_wMAIZsDIACBBAAhFs0CAADGBAAwzgIAAJcCABDPAgAAxgQAMNACAQD_AwAh0QIBAP8DACHSAgEA_wMAIdMCAQCABAAh1AIBAIAEACHVAiAAgQQAIdYCQACCBAAh1wJAAIMEACHYAkAAgwQAIdkCAQD_AwAhhgMAAMgEhgMilwMBAIAEACGcAwEA_wMAIZ0DAgDHBAAhngMIAJwEACGfAwEA_wMAIaADAQD_AwAhoQMBAP8DACGiAwgAnAQAIQ0LAACFBAAgKwAAhQQAICwAAIUEACCtAQAAngQAIK4BAACFBAAg2gICAAAAAdsCAgAAAATcAgIAAAAE3QICAAAAAd4CAgAAAAHfAgIAAAAB4AICAAAAAeECAgDLBAAhBwsAAIUEACArAADKBAAgLAAAygQAINoCAAAAhgMC2wIAAACGAwjcAgAAAIYDCOECAADJBIYDIgcLAACFBAAgKwAAygQAICwAAMoEACDaAgAAAIYDAtsCAAAAhgMI3AIAAACGAwjhAgAAyQSGAyIE2gIAAACGAwLbAgAAAIYDCNwCAAAAhgMI4QIAAMoEhgMiDQsAAIUEACArAACFBAAgLAAAhQQAIK0BAACeBAAgrgEAAIUEACDaAgIAAAAB2wICAAAABNwCAgAAAATdAgIAAAAB3gICAAAAAd8CAgAAAAHgAgIAAAAB4QICAMsEACEcAwAAlgQAIAwAAJkEACANAACaBAAgEQAAwQQAIBIAAMIEACAWAADPBAAgzQIAAMwEADDOAgAANgAQzwIAAMwEADDQAgEAkQQAIdECAQCRBAAh0gIBAJEEACHTAgEAkgQAIdQCAQCSBAAh1QIgAJMEACHWAkAAlAQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIYYDAADOBIYDIpcDAQCSBAAhnAMBAJEEACGdAwIAzQQAIZ4DCACsBAAhnwMBAJEEACGgAwEAkQQAIaEDAQCRBAAhogMIAKwEACEI2gICAAAAAdsCAgAAAATcAgIAAAAE3QICAAAAAd4CAgAAAAHfAgIAAAAB4AICAAAAAeECAgCFBAAhBNoCAAAAhgMC2wIAAACGAwjcAgAAAIYDCOECAADKBIYDIgPnAgAAAwAg6AIAAAMAIOkCAAADACAJzQIAANAEADDOAgAA_wEAEM8CAADQBAAw0AIBAP8DACHXAkAAgwQAIdgCQACDBAAhowMBAP8DACGkAwEA_wMAIaUDQACDBAAhCc0CAADRBAAwzgIAAOwBABDPAgAA0QQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIaMDAQCRBAAhpAMBAJEEACGlA0AAlQQAIRHNAgAA0gQAMM4CAADmAQAQzwIAANIEADDQAgEA_wMAIdcCQACDBAAh2AJAAIMEACHZAgEA_wMAIaYDAQD_AwAhpwMBAP8DACGoAwEAgAQAIakDAQCABAAhqgMBAIAEACGrA0AAggQAIawDQACCBAAhrQMBAIAEACGuAwEAgAQAIa8DAQCABAAhC80CAADTBAAwzgIAANABABDPAgAA0wQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIdkCAQD_AwAhpQNAAIMEACGwAwEA_wMAIbEDAQCABAAhsgMBAIAEACEPzQIAANQEADDOAgAAugEAEM8CAADUBAAw0AIBAP8DACHRAgEA_wMAIdICAQD_AwAh1QIgAIEEACHWAkAAggQAIdcCQACDBAAh2AJAAIMEACGCAwAA1gS3AyKzAyAAgQQAIbUDAADVBLUDIrcDIACBBAAhuAMBAIAEACEHCwAAhQQAICsAANoEACAsAADaBAAg2gIAAAC1AwLbAgAAALUDCNwCAAAAtQMI4QIAANkEtQMiBwsAAIUEACArAADYBAAgLAAA2AQAINoCAAAAtwMC2wIAAAC3AwjcAgAAALcDCOECAADXBLcDIgcLAACFBAAgKwAA2AQAICwAANgEACDaAgAAALcDAtsCAAAAtwMI3AIAAAC3AwjhAgAA1wS3AyIE2gIAAAC3AwLbAgAAALcDCNwCAAAAtwMI4QIAANgEtwMiBwsAAIUEACArAADaBAAgLAAA2gQAINoCAAAAtQMC2wIAAAC1AwjcAgAAALUDCOECAADZBLUDIgTaAgAAALUDAtsCAAAAtQMI3AIAAAC1AwjhAgAA2gS1AyIVBAAA3gQAIAUAAN8EACAGAADgBAAgCAAA4QQAIBQAAOIEACAVAADjBAAgzQIAANsEADDOAgAApwEAEM8CAADbBAAw0AIBAJEEACHRAgEAkQQAIdICAQCRBAAh1QIgAJMEACHWAkAAlAQAIdcCQACVBAAh2AJAAJUEACGCAwAA3QS3AyKzAyAAkwQAIbUDAADcBLUDIrcDIACTBAAhuAMBAJIEACEE2gIAAAC1AwLbAgAAALUDCNwCAAAAtQMI4QIAANoEtQMiBNoCAAAAtwMC2wIAAAC3AwjcAgAAALcDCOECAADYBLcDIgPnAgAABwAg6AIAAAcAIOkCAAAHACAD5wIAAAsAIOgCAAALACDpAgAACwAgFgMAAJYEACAHAADABAAgDQAAmgQAIBEAAMEEACASAADCBAAgEwAAwwQAIM0CAAC_BAAwzgIAAA8AEM8CAAC_BAAw0AIBAJEEACHRAgEAkQQAIdICAQCRBAAh0wIBAJIEACHUAgEAkgQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAh2QIBAJEEACGXAwEAkgQAIcIDAAAPACDDAwAADwAgHgMAAJYEACAMAACZBAAgDQAAmgQAIBEAAMEEACASAADCBAAgFgAAzwQAIM0CAADMBAAwzgIAADYAEM8CAADMBAAw0AIBAJEEACHRAgEAkQQAIdICAQCRBAAh0wIBAJIEACHUAgEAkgQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAh2QIBAJEEACGGAwAAzgSGAyKXAwEAkgQAIZwDAQCRBAAhnQMCAM0EACGeAwgArAQAIZ8DAQCRBAAhoAMBAJEEACGhAwEAkQQAIaIDCACsBAAhwgMAADYAIMMDAAA2ACAQAwAAlgQAIM0CAADpBAAwzgIAADgAEM8CAADpBAAw0AIBAJEEACHRAgEAkQQAIdICAQCRBAAh0wIBAJIEACHUAgEAkgQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAh2QIBAJEEACHCAwAAOAAgwwMAADgAIBADAACWBAAgzQIAAJAEADDOAgAAOgAQzwIAAJAEADDQAgEAkQQAIdECAQCRBAAh0gIBAJEEACHTAgEAkgQAIdQCAQCSBAAh1QIgAJMEACHWAkAAlAQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIcIDAAA6ACDDAwAAOgAgDM0CAADkBAAwzgIAAKEBABDPAgAA5AQAMNACAQD_AwAh1wJAAIMEACHYAkAAgwQAIeoCAQD_AwAh6wIBAP8DACGCAwAA5QS7AyKaAwEA_wMAIbkDAQCmBAAhuwMAAKcEggMiBwsAAIUEACArAADnBAAgLAAA5wQAINoCAAAAuwMC2wIAAAC7AwjcAgAAALsDCOECAADmBLsDIgcLAACFBAAgKwAA5wQAICwAAOcEACDaAgAAALsDAtsCAAAAuwMI3AIAAAC7AwjhAgAA5gS7AyIE2gIAAAC7AwLbAgAAALsDCNwCAAAAuwMI4QIAAOcEuwMiDc0CAADoBAAwzgIAAIsBABDPAgAA6AQAMNACAQD_AwAh0QIBAP8DACHSAgEA_wMAIdMCAQCABAAh1AIBAIAEACHVAiAAgQQAIdYCQACCBAAh1wJAAIMEACHYAkAAgwQAIdkCAQD_AwAhDgMAAJYEACDNAgAA6QQAMM4CAAA4ABDPAgAA6QQAMNACAQCRBAAh0QIBAJEEACHSAgEAkQQAIdMCAQCSBAAh1AIBAJIEACHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIdkCAQCRBAAhBs0CAADqBAAwzgIAAHMAEM8CAADqBAAw0AIBAP8DACHrAgEA_wMAIbwDAQD_AwAhC80CAADrBAAwzgIAAF0AEM8CAADrBAAw0AIBAP8DACHVAiAAgQQAIdYCQACCBAAh1wJAAIMEACHYAkAAgwQAIb0DAQD_AwAhvgMBAIAEACG_AwEAgAQAIQwYAADPBAAgzQIAAOwEADDOAgAASgAQzwIAAOwEADDQAgEAkQQAIdUCIACTBAAh1gJAAJQEACHXAkAAlQQAIdgCQACVBAAhvQMBAJEEACG-AwEAkgQAIb8DAQCSBAAhCgYAAL0EACDNAgAA7QQAMM4CAAAuABDPAgAA7QQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAhmAMBAJEEACGZAwEAkQQAIQ4GAAC9BAAgCAAA7wQAIAoAAK4EACDNAgAA7gQAMM4CAAAgABDPAgAA7gQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAh6wIBAJEEACHsAgEAkQQAIe0CCACsBAAh7gIBAJIEACEeAwAAlgQAIAwAAJkEACANAACaBAAgEQAAwQQAIBIAAMIEACAWAADPBAAgzQIAAMwEADDOAgAANgAQzwIAAMwEADDQAgEAkQQAIdECAQCRBAAh0gIBAJEEACHTAgEAkgQAIdQCAQCSBAAh1QIgAJMEACHWAkAAlAQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIYYDAADOBIYDIpcDAQCSBAAhnAMBAJEEACGdAwIAzQQAIZ4DCACsBAAhnwMBAJEEACGgAwEAkQQAIaEDAQCRBAAhogMIAKwEACHCAwAANgAgwwMAADYAIA8GAAC9BAAgCAAA7wQAIAoAAK4EACDNAgAA8AQAMM4CAAAkABDPAgAA8AQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAh6wIBAJEEACHsAgEAkQQAIfsCQACVBAAh_AIBAJEEACH9AgEAkgQAIQjaAgEAAAAB2wIBAAAABNwCAQAAAATdAgEAAAAB3gIBAAAAAd8CAQAAAAHgAgEAAAAB4QIBAPIEACEI2gIBAAAAAdsCAQAAAATcAgEAAAAE3QIBAAAAAd4CAQAAAAHfAgEAAAAB4AIBAAAAAeECAQDyBAAhAusCAQAAAAGaAwEAAAABDAgAAO8EACAJAAD1BAAgCgAAmgQAIM0CAAD0BAAwzgIAABcAEM8CAAD0BAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh6wIBAJEEACGaAwEAkQQAIZsDIACTBAAhDAwAAJkEACANAACaBAAgzQIAAJgEADDOAgAA0AMAEM8CAACYBAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh5QJAAJUEACHmAkAAlQQAIcIDAADQAwAgwwMAANADACATBgAAvQQAIAgAAO8EACAJAAD1BAAgDAAAmQQAIA4AAPgEACAPAAD5BAAgEAAA-gQAIM0CAAD2BAAwzgIAABMAEM8CAAD2BAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh6gIBAJEEACHrAgEAkQQAIYIDAAD3BLsDIpoDAQCRBAAhuQMBAPEEACG7AwAArQSCAyIE2gIAAAC7AwLbAgAAALsDCNwCAAAAuwMI4QIAAOcEuwMiEAYAAL0EACAIAADvBAAgCgAArgQAIM0CAADuBAAwzgIAACAAEM8CAADuBAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh6gIBAJEEACHrAgEAkQQAIewCAQCRBAAh7QIIAKwEACHuAgEAkgQAIcIDAAAgACDDAwAAIAAgEAoAAK4EACDNAgAAqwQAMM4CAAAiABDPAgAAqwQAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIewCAQCRBAAh_gIIAKwEACH_AgEA8QQAIYADAQCSBAAhggMAAK0EggMigwMBAJIEACGEAwAAowQAIMIDAAAiACDDAwAAIgAgEQYAAL0EACAIAADvBAAgCgAArgQAIM0CAADwBAAwzgIAACQAEM8CAADwBAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh6gIBAJEEACHrAgEAkQQAIewCAQCRBAAh-wJAAJUEACH8AgEAkQQAIf0CAQCSBAAhwgMAACQAIMMDAAAkACASAwAAlgQAIM0CAAD7BAAwzgIAAAsAEM8CAAD7BAAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh2QIBAJEEACGmAwEAkQQAIacDAQCRBAAhqAMBAJIEACGpAwEAkgQAIaoDAQCSBAAhqwNAAJQEACGsA0AAlAQAIa0DAQCSBAAhrgMBAJIEACGvAwEAkgQAIQwDAACWBAAgzQIAAPwEADDOAgAABwAQzwIAAPwEADDQAgEAkQQAIdcCQACVBAAh2AJAAJUEACHZAgEAkQQAIaUDQACVBAAhsAMBAJEEACGxAwEAkgQAIbIDAQCSBAAhAusCAQAAAAG8AwEAAAABCAgAAO8EACAXAAD_BAAgzQIAAP4EADDOAgAAAwAQzwIAAP4EADDQAgEAkQQAIesCAQCRBAAhvAMBAJEEACEOGAAAzwQAIM0CAADsBAAwzgIAAEoAEM8CAADsBAAw0AIBAJEEACHVAiAAkwQAIdYCQACUBAAh1wJAAJUEACHYAkAAlQQAIb0DAQCRBAAhvgMBAJIEACG_AwEAkgQAIcIDAABKACDDAwAASgAgAAAAAAHHAwEAAAABAccDAQAAAAEBxwMgAAAAAQHHA0AAAAABAccDQAAAAAEFJQAAhAkAICYAAIcJACDEAwAAhQkAIMUDAACGCQAgygMAAKQBACADJQAAhAkAIMQDAACFCQAgygMAAKQBACAIBAAA6AcAIAUAAOkHACAGAACKBgAgCAAA6gcAIBQAAOsHACAVAADsBwAg1gIAAIAFACC4AwAAgAUAIAAAAAslAADSBQAwJgAA1gUAMMQDAADTBQAwxQMAANQFADDGAwAA1QUAIMcDAACnBQAwyAMAAKcFADDJAwAApwUAMMoDAACnBQAwywMAANcFADDMAwAAqgUAMAslAACRBQAwJgAAlgUAMMQDAACSBQAwxQMAAJMFADDGAwAAlAUAIMcDAACVBQAwyAMAAJUFADDJAwAAlQUAMMoDAACVBQAwywMAAJcFADDMAwAAmAUAMA4GAADMBQAgCAAAzQUAIAwAANEFACAOAADOBQAgDwAAzwUAIBAAANAFACDQAgEAAAAB1wJAAAAAAdgCQAAAAAHqAgEAAAAB6wIBAAAAAYIDAAAAuwMCuQMBAAAAAbsDAAAAggMCAgAAABUAICUAAMsFACADAAAAFQAgJQAAywUAICYAAJ0FACABHgAAgwkAMBMGAAC9BAAgCAAA7wQAIAkAAPUEACAMAACZBAAgDgAA-AQAIA8AAPkEACAQAAD6BAAgzQIAAPYEADDOAgAAEwAQzwIAAPYEADDQAgEAAAAB1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAh6wIBAJEEACGCAwAA9wS7AyKaAwEAkQQAIbkDAQAAAAG7AwAArQSCAyICAAAAFQAgHgAAnQUAIAIAAACZBQAgHgAAmgUAIAzNAgAAmAUAMM4CAACZBQAQzwIAAJgFADDQAgEAkQQAIdcCQACVBAAh2AJAAJUEACHqAgEAkQQAIesCAQCRBAAhggMAAPcEuwMimgMBAJEEACG5AwEA8QQAIbsDAACtBIIDIgzNAgAAmAUAMM4CAACZBQAQzwIAAJgFADDQAgEAkQQAIdcCQACVBAAh2AJAAJUEACHqAgEAkQQAIesCAQCRBAAhggMAAPcEuwMimgMBAJEEACG5AwEA8QQAIbsDAACtBIIDIgjQAgEAhAUAIdcCQACIBQAh2AJAAIgFACHqAgEAhAUAIesCAQCEBQAhggMAAJsFuwMiuQMBAIQFACG7AwAAnAWCAyIBxwMAAAC7AwIBxwMAAACCAwIOBgAAngUAIAgAAJ8FACAMAACjBQAgDgAAoAUAIA8AAKEFACAQAACiBQAg0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6gIBAIQFACHrAgEAhAUAIYIDAACbBbsDIrkDAQCEBQAhuwMAAJwFggMiBSUAAN0IACAmAACBCQAgxAMAAN4IACDFAwAAgAkAIMoDAADGAgAgBSUAANsIACAmAAD-CAAgxAMAANwIACDFAwAA_QgAIMoDAACCAgAgByUAAMIFACAmAADFBQAgxAMAAMMFACDFAwAAxAUAIMgDAAAgACDJAwAAIAAgygMAACwAIAclAAC8BQAgJgAAvwUAIMQDAAC9BQAgxQMAAL4FACDIAwAAIgAgyQMAACIAIMoDAAD2AgAgByUAALMFACAmAAC2BQAgxAMAALQFACDFAwAAtQUAIMgDAAAkACDJAwAAJAAgygMAACkAIAolAACkBQAwJgAAqAUAMMQDAAClBQAwxQMAAKYFADDHAwAApwUAMMgDAACnBQAwyQMAAKcFADDKAwAApwUAMMsDAACpBQAwzAMAAKoFADAICAAAsQUAIAkAALIFACDQAgEAAAAB1wJAAAAAAdgCQAAAAAHrAgEAAAABmgMBAAAAAZsDIAAAAAECAAAAGQAgJQAAsAUAIAMAAAAZACAlAACwBQAgJgAArQUAIA0IAADvBAAgCQAA9QQAIAoAAJoEACDNAgAA9AQAMM4CAAAXABDPAgAA9AQAMNACAQAAAAHXAkAAlQQAIdgCQACVBAAh6wIBAJEEACGaAwEAkQQAIZsDIACTBAAhwAMAAPMEACACAAAAGQAgHgAArQUAIAIAAACrBQAgHgAArAUAIAnNAgAAqgUAMM4CAACrBQAQzwIAAKoFADDQAgEAkQQAIdcCQACVBAAh2AJAAJUEACHrAgEAkQQAIZoDAQCRBAAhmwMgAJMEACEJzQIAAKoFADDOAgAAqwUAEM8CAACqBQAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh6wIBAJEEACGaAwEAkQQAIZsDIACTBAAhBtACAQCEBQAh1wJAAIgFACHYAkAAiAUAIesCAQCEBQAhmgMBAIQFACGbAyAAhgUAIQgIAACuBQAgCQAArwUAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIesCAQCEBQAhmgMBAIQFACGbAyAAhgUAIQUlAAD1CAAgJgAA-wgAIMQDAAD2CAAgxQMAAPoIACDKAwAAggIAIAUlAADzCAAgJgAA-AgAIMQDAAD0CAAgxQMAAPcIACDKAwAAzQMAIAgIAACxBQAgCQAAsgUAINACAQAAAAHXAkAAAAAB2AJAAAAAAesCAQAAAAGaAwEAAAABmwMgAAAAAQMlAAD1CAAgxAMAAPYIACDKAwAAggIAIAMlAADzCAAgxAMAAPQIACDKAwAAzQMAIAoGAAC6BQAgCAAAuwUAINACAQAAAAHXAkAAAAAB2AJAAAAAAeoCAQAAAAHrAgEAAAAB-wJAAAAAAfwCAQAAAAH9AgEAAAABAgAAACkAICUAALMFACADAAAAJAAgJQAAswUAICYAALcFACAMAAAAJAAgBgAAuAUAIAgAALkFACAeAAC3BQAg0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6gIBAIQFACHrAgEAhAUAIfsCQACIBQAh_AIBAIQFACH9AgEAhQUAIQoGAAC4BQAgCAAAuQUAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeoCAQCEBQAh6wIBAIQFACH7AkAAiAUAIfwCAQCEBQAh_QIBAIUFACEFJQAA6wgAICYAAPEIACDEAwAA7AgAIMUDAADwCAAgygMAAMYCACAFJQAA6QgAICYAAO4IACDEAwAA6ggAIMUDAADtCAAgygMAAIICACADJQAA6wgAIMQDAADsCAAgygMAAMYCACADJQAA6QgAIMQDAADqCAAgygMAAIICACAJ0AIBAAAAAdcCQAAAAAHYAkAAAAAB_gIIAAAAAf8CAQAAAAGAAwEAAAABggMAAACCAwKDAwEAAAABhAOAAAAAAQIAAAD2AgAgJQAAvAUAIAMAAAAiACAlAAC8BQAgJgAAwAUAIAsAAAAiACAeAADABQAg0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh_gIIAMEFACH_AgEAhAUAIYADAQCFBQAhggMAAJwFggMigwMBAIUFACGEA4AAAAABCdACAQCEBQAh1wJAAIgFACHYAkAAiAUAIf4CCADBBQAh_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_QIBAAAAAQIAAAApACAlAAC3BgAgAwAAACkAICUAALcGACAmAAC2BgAgAR4AALsIADAPBgAAvQQAIAgAAO8EACAKAACuBAAgzQIAAPAEADDOAgAAJAAQzwIAAPAEADDQAgEAAAAB1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAh6wIBAJEEACHsAgEAAAAB-wJAAJUEACH8AgEAkQQAIf0CAQCSBAAhAgAAACkAIB4AALYGACACAAAAtAYAIB4AALUGACAMzQIAALMGADDOAgAAtAYAEM8CAACzBgAw0AIBAJEEACHXAkAAlQQAIdgCQACVBAAh6gIBAJEEACHrAgEAkQQAIewCAQCRBAAh-wJAAJUEACH8AgEAkQQAIf0CAQCSBAAhDM0CAACzBgAwzgIAALQGABDPAgAAswYAMNACAQCRBAAh1wJAAJUEACHYAkAAlQQAIeoCAQCRBAAh6wIBAJEEACHsAgEAkQQAIfsCQACVBAAh_AIBAJEEACH9AgEAkgQAIQjQAgEAhAUAIdcCQACIBQAh2AJAAIgFACHrAgEAhAUAIewCAQCEBQAh-wJAAIgFACH8AgEAhAUAIf0CAQCFBQAhCggAALkFACAKAAD4BQAg0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6wIBAIQFACHsAgEAhAUAIfsCQACIBQAh_AIBAIQFACH9AgEAhQUAIQoIAAC7BQAgCgAA-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_QIBAAAAAQIAAAApACAlAADtBgAgAwAAACkAICUAAO0GACAmAADsBgAgAR4AAK8IADACAAAAKQAgHgAA7AYAIAIAAAC0BgAgHgAA6wYAIAjQAgEAhAUAIdcCQACIBQAh2AJAAIgFACHqAgEAhAUAIewCAQCEBQAh-wJAAIgFACH8AgEAhAUAIf0CAQCFBQAhCgYAALgFACAKAAD4BQAg0AIBAIQFACHXAkAAiAUAIdgCQACIBQAh6gIBAIQFACHsAgEAhAUAIfsCQACIBQAh_AIBAIQFACH9AgEAhQUAIQoGAAC6BQAgCgAA-QUAINACAQAAAAHXAkAAAAAB2AJAAAAAAeoCAQAAAAHsAgEAAAAB-wJAAAAAAfwCAQAAAAH9AgEAAAABCQYAAMkFACAKAADxBQAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB6gIBAAAAAewCAQAAAAHtAggAAAAB7gIBAAAAAQIAAAAsACAlAAD2BgAgAwAAACwAICUAAPYGACAmAAD1BgAgAR4AAK4IADACAAAALAAgHgAA9QYAIAIAAACoBgAgHgAA9AYAIAfQAgEAhAUAIdcCQACIBQAh2AJAAIgFACHqAgEAhAUAIewCAQCEBQAh7QIIAMEFACHuAgEAhQUAIQkGAADHBQAgCgAA8AUAINACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeoCAQCEBQAh7AIBAIQFACHtAggAwQUAIe4CAQCFBQAhCQYAAMkFACAKAADxBQAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB6gIBAAAAAewCAQAAAAHtAggAAAAB7gIBAAAAAQ4GAADMBQAgCQAA5AUAIAwAANEFACAOAADOBQAgDwAAzwUAIBAAANAFACDQAgEAAAAB1wJAAAAAAdgCQAAAAAHqAgEAAAABggMAAAC7AwKaAwEAAAABuQMBAAAAAbsDAAAAggMCAgAAABUAICUAAP8GACADAAAAFQAgJQAA_wYAICYAAP4GACABHgAArQgAMAIAAAAVACAeAAD-BgAgAgAAAJkFACAeAAD9BgAgCNACAQCEBQAh1wJAAIgFACHYAkAAiAUAIeoCAQCEBQAhggMAAJsFuwMimgMBAIQFACG5AwEAhAUAIbsDAACcBYIDIg4GAACeBQAgCQAA4gUAIAwAAKMFACAOAACgBQAgDwAAoQUAIBAAAKIFACDQAgEAhAUAIdcCQACIBQAh2AJAAIgFACHqAgEAhAUAIYIDAACbBbsDIpoDAQCEBQAhuQMBAIQFACG7AwAAnAWCAyIOBgAAzAUAIAkAAOQFACAMAADRBQAgDgAAzgUAIA8AAM8FACAQAADQBQAg0AIBAAAAAdcCQAAAAAHYAkAAAAAB6gIBAAAAAYIDAAAAuwMCmgMBAAAAAbkDAQAAAAG7AwAAAIIDAgcJAACyBQAgCgAA5gUAINACAQAAAAHXAkAAAAAB2AJAAAAAAZoDAQAAAAGbAyAAAAABAgAAABkAICUAAIgHACADAAAAGQAgJQAAiAcAICYAAIcHACABHgAArAgAMAIAAAAZACAeAACHBwAgAgAAAKsFACAeAACGBwAgBdACAQCEBQAh1wJAAIgFACHYAkAAiAUAIZoDAQCEBQAhmwMgAIYFACEHCQAArwUAIAoAANoFACDQAgEAhAUAIdcCQACIBQAh2AJAAIgFACGaAwEAhAUAIZsDIACGBQAhBwkAALIFACAKAADmBQAg0AIBAAAAAdcCQAAAAAHYAkAAAAABmgMBAAAAAZsDIAAAAAEDFwAAlgcAINACAQAAAAG8AwEAAAABAgAAAAUAICUAAJUHACADAAAABQAgJQAAlQcAICYAAJMHACABHgAAqwgAMAkIAADvBAAgFwAA_wQAIM0CAAD-BAAwzgIAAAMAEM8CAAD-BAAw0AIBAAAAAesCAQCRBAAhvAMBAJEEACHBAwAA_QQAIAIAAAAFACAeAACTBwAgAgAAAJEHACAeAACSBwAgBs0CAACQBwAwzgIAAJEHABDPAgAAkAcAMNACAQCRBAAh6wIBAJEEACG8AwEAkQQAIQbNAgAAkAcAMM4CAACRBwAQzwIAAJAHADDQAgEAkQQAIesCAQCRBAAhvAMBAJEEACEC0AIBAIQFACG8AwEAhAUAIQMXAACUBwAg0AIBAIQFACG8AwEAhAUAIQUlAACmCAAgJgAAqQgAIMQDAACnCAAgxQMAAKgIACDKAwAAAQAgAxcAAJYHACDQAgEAAAABvAMBAAAAAQMlAACmCAAgxAMAAKcIACDKAwAAAQAgAyUAAKQIACDEAwAApQgAIMoDAACkAQAgBCUAAIkHADDEAwAAigcAMMYDAACMBwAgygMAAI0HADAEJQAAgAcAMMQDAACBBwAwxgMAAIMHACDKAwAApwUAMAQlAAD3BgAwxAMAAPgGADDGAwAA-gYAIMoDAACVBQAwBCUAAO4GADDEAwAA7wYAMMYDAADxBgAgygMAAKQGADAEJQAA5QYAMMQDAADmBgAwxgMAAOgGACDKAwAAsAYAMAAAAAAAAAAFJQAAnwgAICYAAKIIACDEAwAAoAgAIMUDAAChCAAgygMAAKQBACADJQAAnwgAIMQDAACgCAAgygMAAKQBACAAAAAFJQAAmggAICYAAJ0IACDEAwAAmwgAIMUDAACcCAAgygMAAKQBACADJQAAmggAIMQDAACbCAAgygMAAKQBACAAAAABxwMAAAC1AwIBxwMAAAC3AwILJQAA1gcAMCYAANsHADDEAwAA1wcAMMUDAADYBwAwxgMAANkHACDHAwAA2gcAMMgDAADaBwAwyQMAANoHADDKAwAA2gcAMMsDAADcBwAwzAMAAN0HADALJQAAygcAMCYAAM8HADDEAwAAywcAMMUDAADMBwAwxgMAAM0HACDHAwAAzgcAMMgDAADOBwAwyQMAAM4HADDKAwAAzgcAMMsDAADQBwAwzAMAANEHADAHJQAAxQcAICYAAMgHACDEAwAAxgcAIMUDAADHBwAgyAMAAA8AIMkDAAAPACDKAwAAxgIAIAclAADABwAgJgAAwwcAIMQDAADBBwAgxQMAAMIHACDIAwAANgAgyQMAADYAIMoDAACCAgAgByUAALsHACAmAAC-BwAgxAMAALwHACDFAwAAvQcAIMgDAAA4ACDJAwAAOAAgygMAAHYAIAclAAC2BwAgJgAAuQcAIMQDAAC3BwAgxQMAALgHACDIAwAAOgAgyQMAADoAIMoDAADmAwAgCdACAQAAAAHRAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEAAAAB1QIgAAAAAdYCQAAAAAHXAkAAAAAB2AJAAAAAAQIAAADmAwAgJQAAtgcAIAMAAAA6ACAlAAC2BwAgJgAAugcAIAsAAAA6ACAeAAC6BwAg0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh0wIBAIUFACHUAgEAhQUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAhCdACAQCEBQAh0QIBAIQFACHSAgEAhAUAIdMCAQCFBQAh1AIBAIUFACHVAiAAhgUAIdYCQACHBQAh1wJAAIgFACHYAkAAiAUAIQnQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAAAAAdUCIAAAAAHWAkAAAAAB1wJAAAAAAdgCQAAAAAECAAAAdgAgJQAAuwcAIAMAAAA4ACAlAAC7BwAgJgAAvwcAIAsAAAA4ACAeAAC_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-BwAwJgAAgggAMMQDAAD_BwAwxQMAAIAIADDGAwAAgQgAIMcDAACNBwAwyAMAAI0HADDJAwAAjQcAMMoDAACNBwAwywMAAIMIADDMAwAAkAcAMAMIAAD5BwAg0AIBAAAAAesCAQAAAAECAAAABQAgJQAAhggAIAMAAAAFACAlAACGCAAgJgAAhQgAIAEeAACNCAAwAgAAAAUAIB4AAIUIACACAAAAkQcAIB4AAIQIACAC0AIBAIQFACHrAgEAhAUAIQMIAAD4BwAg0AIBAIQFACHrAgEAhAUAIQMIAAD5BwAg0AIBAAAAAesCAQAAAAEEJQAA_gcAMMQDAAD_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_AwEAhQUAIQjQAgEAhAUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAhvQMBAIQFACG-AwEAhQUAIb8DAQCFBQAhAtACAQAAAAG8AwEAAAABBdACAQAAAAHXAkAAAAAB2AJAAAAAAZoDAQAAAAGbAyAAAAABCNACAQAAAAHXAkAAAAAB2AJAAAAAAeoCAQAAAAGCAwAAALsDApoDAQAAAAG5AwEAAAABuwMAAACCAwIH0AIBAAAAAdcCQAAAAAHYAkAAAAAB6gIBAAAAAewCAQAAAAHtAggAAAAB7gIBAAAAAQjQAgEAAAAB1wJAAAAAAdgCQAAAAAHqAgEAAAAB7AIBAAAAAfsCQAAAAAH8AgEAAAAB_QIBAAAAAQMAAACnAQAgJQAApAgAICYAALIIACATAAAApwEAIAQAALAHACAFAACxBwAgBgAAsgcAIBQAALQHACAVAAC1BwAgHgAAsggAINACAQCEBQAh0QIBAIQFACHSAgEAhAUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAhggMAAK8HtwMiswMgAIYFACG1AwAArge1AyK3AyAAhgUAIbgDAQCFBQAhEQQAALAHACAFAACxBwAgBgAAsgcAIBQAALQHACAVAAC1BwAg0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACGCAwAArwe3AyKzAyAAhgUAIbUDAACuB7UDIrcDIACGBQAhuAMBAIUFACEQAwAAxgYAIAcAAMcGACANAADIBgAgEQAAyQYAIBIAAMoGACDQAgEAAAAB0QIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAAAAAdUCIAAAAAHWAkAAAAAB1wJAAAAAAdgCQAAAAAHZAgEAAAABlwMBAAAAAQIAAADGAgAgJQAAswgAIAMAAAAPACAlAACzCAAgJgAAtwgAIBIAAAAPACADAACOBgAgBwAAjwYAIA0AAJAGACARAACRBgAgEgAAkgYAIB4AALcIACDQAgEAhAUAIdECAQCEBQAh0gIBAIQFACHTAgEAhQUAIdQCAQCFBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACHZAgEAhAUAIZcDAQCFBQAhEAMAAI4GACAHAACPBgAgDQAAkAYAIBEAAJEGACASAACSBgAg0AIBAIQFACHRAgEAhAUAIdICAQCEBQAh0wIBAIUFACHUAgEAhQUAIdUCIACGBQAh1gJAAIcFACHXAkAAiAUAIdgCQACIBQAh2QIBAIQFACGXAwEAhQUAIREEAADiBwAgBQAA4wcAIAgAAOUHACAUAADmBwAgFQAA5wcAINACAQAAAAHRAgEAAAAB0gIBAAAAAdUCIAAAAAHWAkAAAAAB1wJAAAAAAdgCQAAAAAGCAwAAALcDArMDIAAAAAG1AwAAALUDArcDIAAAAAG4AwEAAAABAgAAAKQBACAlAAC4CAAgCNACAQAAAAHXAkAAAAAB2AJAAAAAAesCAQAAAAGCAwAAALsDApoDAQAAAAG5AwEAAAABuwMAAACCAwII0AIBAAAAAdcCQAAAAAHYAkAAAAAB6wIBAAAAAewCAQAAAAH7AkAAAAAB_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_AgAIBoAAAA2ACADAADfBgAgDQAA4gYAIBEAAOQGACASAADjBgAgFgAA4AYAIB4AAPwIACDQAgEAhAUAIdECAQCEBQAh0gIBAIQFACHTAgEAhQUAIdQCAQCFBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACHZAgEAhAUAIYYDAADeBoYDIpcDAQCFBQAhnAMBAIQFACGdAwIA3QYAIZ4DCADBBQAhnwMBAIQFACGgAwEAhAUAIaEDAQCEBQAhogMIAMEFACEYAwAA3wYAIA0AAOIGACARAADkBgAgEgAA4wYAIBYAAOAGACDQAgEAhAUAIdECAQCEBQAh0gIBAIQFACHTAgEAhQUAIdQCAQCFBQAh1QIgAIYFACHWAkAAhwUAIdcCQACIBQAh2AJAAIgFACHZAgEAhAUAIYYDAADeBoYDIpcDAQCFBQAhnAMBAIQFACGdAwIA3QYAIZ4DCADBBQAhnwMBAIQFACGgAwEAhAUAIaEDAQCEBQAhogMIAMEFACEDAAAANgAgJQAA2wgAICYAAP8IACAaAAAANgAgAwAA3wYAIAwAAOEGACARAADkBgAgEgAA4wYAIBYAAOAGACAeAAD_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AH4sAH-tAQB8rgEAfQAAAAAABQsAeysAfiwAf60BAHyuAQB9AwYABwgAAwoACQMGAAcIAAMKAAkDCwCEASsAhQEsAIYBAAAAAwsAhAErAIUBLACGAQAAAwsAiwErAIwBLACNAQAAAAMLAIsBKwCMASwAjQEDBgAHCAADCgAJAwYABwgAAwoACQULAJIBKwCVASwAlgGtAQCTAa4BAJQBAAAAAAAFCwCSASsAlQEsAJYBrQEAkwGuAQCUAQAAAwsAmwErAJwBLACdAQAAAAMLAJsBKwCcASwAnQEBAwAEAQMABAMLAKIBKwCjASwApAEAAAADCwCiASsAowEsAKQBGQIBGkkBG0wBHE0BHU4BH1ABIFIZIVMaIlUBI1cZJFgbJ1kBKFoBKVsZLV4cLl8gL2ACMGECMWICMmMCM2QCNGYCNWgZNmkhN2sCOG0ZOW4iOm8CO3ACPHEZPXQjPnUnP3cUQHgUQXoUQnsUQ3wURH4URYABGUaBAShHgwEUSIUBGUmGASlKhwEUS4gBFEyJARlNjAEqTo0BLk-OAQlQjwEJUZABCVKRAQlTkgEJVJQBCVWWARlWlwEvV5kBCVibARlZnAEwWp0BCVueAQlcnwEZXaIBMV6jATVfpQEEYKYBBGGpAQRiqgEEY6sBBGStAQRlrwEZZrABNmeyAQRotAEZabUBN2q2AQRrtwEEbLgBGW27AThuvAE8b70BBXC-AQVxvwEFcsABBXPBAQV0wwEFdcUBGXbGAT13yAEFeMoBGXnLAT56zAEFe80BBXzOARl90QE_ftIBQ3_TAQaAAdQBBoEB1QEGggHWAQaDAdcBBoQB2QEGhQHbARmGAdwBRIcB3gEGiAHgARmJAeEBRYoB4gEGiwHjAQaMAeQBGY0B5wFGjgHoAUqPAeoBS5AB6wFLkQHuAUuSAe8BS5MB8AFLlAHyAUuVAfQBGZYB9QFMlwH3AUuYAfkBGZkB-gFNmgH7AUubAfwBS5wB_QEZnQGAAk6eAYECUp8BgwIDoAGEAgOhAYYCA6IBhwIDowGIAgOkAYoCA6UBjAIZpgGNAlOnAY8CA6gBkQIZqQGSAlSqAZMCA6sBlAIDrAGVAhmvAZgCVbABmQJbsQGaAguyAZsCC7MBnAILtAGdAgu1AZ4CC7YBoAILtwGiAhm4AaMCXLkBpQILugGnAhm7AagCXbwBqQILvQGqAgu-AasCGb8BrgJewAGvAmLBAbACEsIBsQISwwGyAhLEAbMCEsUBtAISxgG2AhLHAbgCGcgBuQJjyQG7AhLKAb0CGcsBvgJkzAG_AhLNAcACEs4BwQIZzwHEAmXQAcUCadEBxwIH0gHIAgfTAcoCB9QBywIH1QHMAgfWAc4CB9cB0AIZ2AHRAmrZAdMCB9oB1QIZ2wHWAmvcAdcCB90B2AIH3gHZAhnfAdwCbOAB3QJw4QHfAgjiAeACCOMB4gII5AHjAgjlAeQCCOYB5gII5wHoAhnoAekCcekB6wII6gHtAhnrAe4CcuwB7wII7QHwAgjuAfECGe8B9AJz8AH1AnfxAfcCD_IB-AIP8wH6Ag_0AfsCD_UB_AIP9gH-Ag_3AYADGfgBgQN4-QGDAw_6AYUDGfsBhgN5_AGHAw_9AYgDD_4BiQMZ_wGMA3qAAo0DgAGBAo4DEIICjwMQgwKQAxCEApEDEIUCkgMQhgKUAxCHApYDGYgClwOBAYkCmQMQigKbAxmLApwDggGMAp0DEI0CngMQjgKfAxmPAqIDgwGQAqMDhwGRAqUDiAGSAqYDiAGTAqkDiAGUAqoDiAGVAqsDiAGWAq0DiAGXAq8DGZgCsAOJAZkCsQOIAZoCsgMZmwK1A4oBnAK2A44BnQK3Aw6eArgDDp8CuQMOoAK6Aw6hArsDDqICvQMOowK_AxmkAsADjwGlAsIDDqYCxAMZpwLFA5ABqALGAw6pAscDDqoCyAMZqwLLA5EBrALMA5cBrQLOAwquAs8DCq8C0gMKsALTAwqxAtQDCrIC1gMKswLYAxm0AtkDmAG1AtsDCrYC3QMZtwLeA5kBuALfAwq5AuADCroC4QMZuwLkA5oBvALlA54BvQLnAxW-AugDFb8C6gMVwALrAxXBAuwDFcIC7gMVwwLwAxnEAvEDnwHFAvMDFcYC9QMZxwL2A6AByAL3AxXJAvgDFcoC-QMZywL8A6EBzAL9A6UB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("node:buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AppointmentScalarFieldEnum: () => AppointmentScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DoctorScalarFieldEnum: () => DoctorScalarFieldEnum,
  DoctorSchedulesScalarFieldEnum: () => DoctorSchedulesScalarFieldEnum,
  DoctorSpecialtyScalarFieldEnum: () => DoctorSpecialtyScalarFieldEnum,
  DocumentEmbeddingScalarFieldEnum: () => DocumentEmbeddingScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  MedicalReportScalarFieldEnum: () => MedicalReportScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PatientHealthDataScalarFieldEnum: () => PatientHealthDataScalarFieldEnum,
  PatientScalarFieldEnum: () => PatientScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrescriptionScalarFieldEnum: () => PrescriptionScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  ScheduleScalarFieldEnum: () => ScheduleScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  SpecialtyScalarFieldEnum: () => SpecialtyScalarFieldEnum,
  Sql: () => Sql2,
  SuperAdminScalarFieldEnum: () => SuperAdminScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.9.1",
  engine: "e922089b7d7502aff4249d5da3420f6fa55fc6ad"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Specialty: "Specialty",
  DoctorSpecialty: "DoctorSpecialty",
  Admin: "Admin",
  Appointment: "Appointment",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Doctor: "Doctor",
  DoctorSchedules: "DoctorSchedules",
  MedicalReport: "MedicalReport",
  Patient: "Patient",
  PatientHealthData: "PatientHealthData",
  Payment: "Payment",
  Prescription: "Prescription",
  DocumentEmbedding: "DocumentEmbedding",
  Review: "Review",
  Schedule: "Schedule",
  SuperAdmin: "SuperAdmin"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var SpecialtyScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  icon: "icon",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt"
};
var DoctorSpecialtyScalarFieldEnum = {
  id: "id",
  doctorId: "doctorId",
  specialtyId: "specialtyId"
};
var AdminScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var AppointmentScalarFieldEnum = {
  id: "id",
  patientId: "patientId",
  doctorId: "doctorId",
  videoCallingId: "videoCallingId",
  status: "status",
  paymentStatus: "paymentStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  scheduleId: "scheduleId"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  issuer: "issuer"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DoctorScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  address: "address",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  registrationNumber: "registrationNumber",
  experience: "experience",
  gender: "gender",
  appointmentFee: "appointmentFee",
  qualification: "qualification",
  currentWorkingPlace: "currentWorkingPlace",
  designation: "designation",
  averageRating: "averageRating",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var DoctorSchedulesScalarFieldEnum = {
  id: "id",
  doctorId: "doctorId",
  scheduleId: "scheduleId",
  isBooked: "isBooked",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MedicalReportScalarFieldEnum = {
  id: "id",
  reportName: "reportName",
  reportLink: "reportLink",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  patientId: "patientId"
};
var PatientScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  address: "address",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var PatientHealthDataScalarFieldEnum = {
  id: "id",
  patientId: "patientId",
  gender: "gender",
  dateOfBirth: "dateOfBirth",
  bloodGroup: "bloodGroup",
  hasAllergies: "hasAllergies",
  hasDiabetes: "hasDiabetes",
  height: "height",
  weight: "weight",
  smokingStatus: "smokingStatus",
  dietaryPreferences: "dietaryPreferences",
  pregnancyStatus: "pregnancyStatus",
  mentalHealthHistory: "mentalHealthHistory",
  immunizationStatus: "immunizationStatus",
  hasPastSurgeries: "hasPastSurgeries",
  recentAnxiety: "recentAnxiety",
  recentDepression: "recentDepression",
  maritalStatus: "maritalStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  status: "status",
  invoiceUrl: "invoiceUrl",
  paymentGatewayData: "paymentGatewayData",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  appointmentId: "appointmentId"
};
var PrescriptionScalarFieldEnum = {
  id: "id",
  followUpDate: "followUpDate",
  instructions: "instructions",
  pdfUrl: "pdfUrl",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  appointmentId: "appointmentId",
  patientId: "patientId",
  doctorId: "doctorId"
};
var DocumentEmbeddingScalarFieldEnum = {
  id: "id",
  chunkKey: "chunkKey",
  sourceType: "sourceType",
  sourceId: "sourceId",
  sourceLevel: "sourceLevel",
  content: "content",
  metadata: "metadata",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  patientId: "patientId",
  doctorId: "doctorId",
  appointmentId: "appointmentId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ScheduleScalarFieldEnum = {
  id: "id",
  startDateTime: "startDateTime",
  endDateTime: "endDateTime",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SuperAdminScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT"
};
var UserStatus = {
  BLOCKED: "BLOCKED",
  DELETED: "DELETED",
  ACTIVE: "ACTIVE"
};
var Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER"
};
var AppointmentStatus = {
  SCHEDULED: "SCHEDULED",
  INPROGRESS: "INPROGRESS",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID"
};
var BloodGroup = {
  A_POSITIVE: "A_POSITIVE",
  A_NEGATIVE: "A_NEGATIVE",
  B_POSITIVE: "B_POSITIVE",
  B_NEGATIVE: "B_NEGATIVE",
  AB_POSITIVE: "AB_POSITIVE",
  AB_NEGATIVE: "AB_NEGATIVE",
  O_POSITIVE: "O_POSITIVE",
  O_NEGATIVE: "O_NEGATIVE"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariable = () => {
  const missingVars = [];
  const requireEnvVariable = [
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "DATABASE_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "FRONTEND_URL"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      missingVars.push(variable);
    }
  });
  if (missingVars.length > 0) {
    console.warn(`[Config Warning] Missing environment variables on server: ${missingVars.join(", ")}`);
  }
  return {
    PORT: process.env.PORT || "5000",
    NODE_ENV: process.env.NODE_ENV || "production",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
    DATABASE_URL: process.env.DATABASE_URL || "",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret",
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN || "1d",
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE || "1d",
    EMAIL_SENDER: {
      SMPT_USER: process.env.EMAIL_SENDER_SMTP_USER || "",
      SMPT_PASS: process.env.EMAIL_SENDER_SMTP_PASS || "",
      SMPT_HOST: process.env.EMAIL_SENDER_SMTP_HOST || "",
      SMPT_PORT: process.env.EMAIL_SENDER_SMTP_PORT || "587",
      SMPT_FROM: process.env.EMAIL_SENDER_SMTP_FROM || ""
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_CALLBACE_URL: process.env.GOOGLE_CALLBACE_URL || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || ""
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || ""
    },
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL || "",
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "",
    RAG: {
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
      OPENROUTER_EMBEDDING_MODEL: process.env.OPENROUTER_EMBEDDING_MODEL || "",
      OPENROUTER_LLM_MODEL: process.env.OPENROUTER_LLM_MODEL || ""
    },
    REDIS_URL: process.env.REDIS_URL || ""
  };
};
var envVars = loadEnvVariable();

// src/app/lib/prisma.ts
var connectionString = `${envVars.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/module/specialty/specialty.servive.ts
var createSpecialty = async (payload) => {
  const specilaty = await prisma.specialty.create({
    data: payload
  });
  return specilaty;
};
var getAllSpecialty = async () => {
  const specialties = await prisma.specialty.findMany();
  return specialties;
};
var deleteSpecialty = async (id) => {
  const specialty = await prisma.specialty.delete({
    where: {
      id
    }
  });
  return specialty;
};
var updateSpecialty = async (id, payload) => {
  const specialty = await prisma.specialty.update({
    where: {
      id
    },
    data: payload
  });
  return specialty;
};
var SpecialtyService = {
  createSpecialty,
  getAllSpecialty,
  deleteSpecialty,
  updateSpecialty
};

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/specialty/specialty.controller.ts
var createSpecialty2 = catchAsync(
  async (req, res) => {
    let iconPath;
    if (req.file) {
      iconPath = req.file.path;
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      iconPath = req.files[0].path;
    }
    const payload = {
      ...req.body,
      icon: iconPath
    };
    const result = await SpecialtyService.createSpecialty(payload);
    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Specialty created successfully",
      data: result
    });
  }
);
var getAllSpecialty2 = catchAsync(
  async (req, res) => {
    const result = await SpecialtyService.getAllSpecialty();
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Specialty get successfully",
      data: result
    });
  }
);
var deleteSpecialty2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await SpecialtyService.deleteSpecialty(id);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Specialty deleted successfully",
      data: result
    });
  }
);
var updateSpecialty2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    let iconPath;
    if (req.file) {
      iconPath = req.file.path;
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      iconPath = req.files[0].path;
    }
    const payload = {
      ...req.body,
      ...iconPath ? { icon: iconPath } : {}
    };
    const result = await SpecialtyService.updateSpecialty(id, payload);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Specialty updated successfully",
      data: result
    });
  }
);
var SpecialtyController = {
  createSpecialty: createSpecialty2,
  getAllSpecialty: getAllSpecialty2,
  deleteSpecialty: deleteSpecialty2,
  updateSpecialty: updateSpecialty2
};

// src/app/middlewares/checkAuth.ts
import status from "http-status";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var cookieUtils = {
  setCookie,
  clearCookie,
  getCookie
};
var cookie_default = cookieUtils;

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decode = jwt.verify(token, secret);
    return {
      success: true,
      data: decode
    };
  } catch (error) {
    return {
      success: false,
      message: error
    };
  }
};
var decodedToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodedToken
};
var jwt_default = jwtUtils;

// src/app/middlewares/checkAuth.ts
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = cookie_default.getCookie(req, "better-auth-session") || cookie_default.getCookie(req, "better-auth.session_token") || cookie_default.getCookie(req, "better-auth-session-token") || req.headers["x-session-token"] || req.headers["session-token"];
    const accessToken = cookie_default.getCookie(req, "accessToken") || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization) || req.headers["x-access-token"];
    if (!sessionToken && !accessToken) {
      throw new AppError_default(status.UNAUTHORIZED, "Unauthorized access! No authentication token provided.");
    }
    let user = null;
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
        }
      }
    }
    if (accessToken) {
      const verifiedToken = jwt_default.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
      if (verifiedToken.success && verifiedToken.data) {
        if (!user) {
          user = await prisma.user.findUnique({
            where: { id: verifiedToken.data.userId }
          });
        }
      } else if (!user) {
        throw new AppError_default(status.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
      }
    }
    if (!user) {
      throw new AppError_default(status.UNAUTHORIZED, "Unauthorized access! User session or token is invalid.");
    }
    if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
      throw new AppError_default(status.UNAUTHORIZED, "Unauthorized access! User is not active.");
    }
    if (user.isDeleted) {
      throw new AppError_default(status.UNAUTHORIZED, "Unauthorized access! User is deleted.");
    }
    if (authRoles.length > 0 && !authRoles.includes(user.role)) {
      throw new AppError_default(status.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
    }
    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email
    };
    next();
  } catch (error) {
    next(error);
  }
};

// src/config/multer.config.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/config/cloudinary.config.ts
import status2 from "http-status";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppError_default(status2.BAD_REQUEST, "File buffer and file name are required for upload");
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `ph-healthcare/${folder}/${uniqueName}`,
        folder: `ph-healthcare/${folder}`
      },
      (error, result) => {
        if (error) {
          return reject(new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image"
        }
      );
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};
var cloudinaryUpload = cloudinary;

// src/config/multer.config.ts
import multer from "multer";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `healthCare/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/app/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      try {
        req.body = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
      } catch (e) {
      }
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      return next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/module/specialty/specialty.validation.ts
import z from "zod";
var createSpecialtyZodSchema = z.object({
  title: z.string("Title is required"),
  description: z.string("Description is required").optional()
});
var SpecialtyValidation = {
  createSpecialtyZodSchema
};

// src/app/module/specialty/specialty.route.ts
var router = Router();
router.post(
  "/",
  multerUpload.any(),
  validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
  SpecialtyController.createSpecialty
);
router.get("/", SpecialtyController.getAllSpecialty);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.any(), SpecialtyController.updateSpecialty);
var SpecialtyRouter = router;

// src/app/module/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import status3 from "http-status";
import path2 from "path";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMPT_HOST,
  secure: Number(envVars.EMAIL_SENDER.SMPT_PORT) === 465,
  auth: {
    user: envVars.EMAIL_SENDER.SMPT_USER,
    pass: envVars.EMAIL_SENDER.SMPT_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMPT_PORT)
});
var sendEmail = async ({ to, subject, templateName, templateData, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMPT_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
  } catch (error) {
    console.error("email sending error: ", error);
    throw new AppError_default(status3.INTERNAL_SERVER_ERROR, "Email sending failed");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      // callbackUrl:envVars.GOOGLE_CALLBACE_URL,
      mapProfileToUser: () => {
        return {
          role: Role.PATIENT,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        try {
          if (type === "email-verification") {
            const user = await prisma.user.findUnique({
              where: {
                email
              }
            });
            if (!user) {
              console.error(`User with email ${email} not found. Cannot send verification OTP.`);
              return;
            }
            if (user && user.role === Role.SUPER_ADMIN) {
              return;
            }
            if (user && !user.emailVerified) {
              await sendEmail({
                to: email,
                subject: "Email Verification",
                templateName: "otp",
                templateData: {
                  name: user?.name || "User",
                  otp,
                  url: ``
                }
              });
            }
          } else if (type === "forget-password") {
            const user = await prisma.user.findUnique({
              where: {
                email
              }
            });
            if (user) {
              await sendEmail({
                to: email,
                subject: "Password Reset OTP",
                templateName: "otp",
                templateData: {
                  name: user.name,
                  otp
                }
              });
            }
          }
        } catch (error) {
          console.error("Error in sendVerificationOTP:", error);
          throw error;
        }
      },
      expiresIn: 2 * 60,
      // 2 minutes
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day
    updateAge: 60 * 60 * 60 * 24,
    // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/module/auth/auth.service.ts
import status4 from "http-status";

// src/app/utils/token.ts
import ms from "ms";
var getAccessToken = (payload) => {
  const accessToken = jwt_default.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN });
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwt_default.createToken(payload, envVars.REFRESH_TOKEN_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN });
  return refreshToken;
};
var storeTokenIntoCookie = (res, token) => {
  const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN);
  cookie_default.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: typeof maxAge === "number" ? maxAge : 1e3 * 60 * 60 * 24
  });
};
var storeRefreshTokenIntoCookie = (res, refreshToken) => {
  const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRES_IN);
  cookie_default.setCookie(res, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: typeof maxAge === "number" ? maxAge : 1e3 * 60 * 60 * 24 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  const maxAge = ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN);
  cookie_default.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: typeof maxAge === "number" ? maxAge : 1e3 * 60 * 60 * 24
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  storeTokenIntoCookie,
  storeRefreshTokenIntoCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
var registerPatient = async (payload) => {
  let createdUserId;
  try {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: Role.PATIENT
      }
    });
    if (!data.user) {
      throw new AppError_default(status4.BAD_REQUEST, "Failed to register patient");
    }
    createdUserId = data.user.id;
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name,
          email: payload.email
        }
      });
      return patientTx;
    });
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    return {
      ...data,
      patient,
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.error("Error in patient registration:", error);
    if (createdUserId) {
      await prisma.user.delete({
        where: {
          id: createdUserId
        }
      });
    }
    throw error;
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status4.BAD_REQUEST, "Account is blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status4.BAD_REQUEST, "Account is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      patient: {
        include: {
          appointments: true,
          medicalReports: true,
          reviews: true,
          prescriptions: true,
          patientHealthData: true
        }
      },
      doctor: {
        include: {
          specialties: {
            include: {
              specialty: true
            }
          },
          appointments: true,
          reviews: true
        }
      },
      admin: true,
      superAdmin: true
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status4.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status4.NOT_FOUND, "invalid session token");
  }
  const verifiedRefreshToken = jwt_default.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
  if (!verifiedRefreshToken.success) {
    throw new AppError_default(status4.UNAUTHORIZED, "Invalid Refresh Token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var chnagePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status4.UNAUTHORIZED, "Invalid Session Token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const newAccessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};
var logOutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var forgetPassword = async (email) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status4.NOT_FOUND, "User Not Found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status4.BAD_REQUEST, "Your Email Is Not Verified , Please Verify Your Email First");
  }
  if (isUserExists.status === UserStatus.BLOCKED) {
    throw new AppError_default(status4.BAD_REQUEST, "Your Account Is Blocked , Please Contact To The Admin");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status4.BAD_REQUEST, "Your Account Is Deleted , Please Contact To The Admin");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
  return {
    message: "Password Reset OTP Sent Successfully"
  };
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status4.NOT_FOUND, "User Not Found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status4.BAD_REQUEST, "Your Email Is Not Verified , Please Verify Your Email First");
  }
  if (isUserExists.status === UserStatus.BLOCKED) {
    throw new AppError_default(status4.BAD_REQUEST, "Your Account Is Blocked , Please Contact To The Admin");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status4.BAD_REQUEST, "Your Account Is Deleted , Please Contact To The Admin");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExists.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExists.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExists.id
    }
  });
};
var googleLoginSuccess = async (session) => {
  let user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  if (!user && session.user.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
  }
  if (user && user.role !== Role.PATIENT) {
    throw new AppError_default(status4.FORBIDDEN, "Google sign-in is exclusively available for patients");
  }
  if (user && (user.status === UserStatus.BLOCKED || user.isDeleted)) {
    throw new AppError_default(status4.FORBIDDEN, "Account is blocked or deleted");
  }
  const isPatientExists = await prisma.patient.findFirst({
    where: {
      OR: [
        { userId: session.user.id },
        { email: session.user.email }
      ]
    }
  });
  if (!isPatientExists) {
    await prisma.patient.create({
      data: {
        userId: session.user.id,
        name: session.user.name || "Patient",
        email: session.user.email,
        profilePhoto: session.user.image || null
      }
    });
  } else if (isPatientExists.userId !== session.user.id) {
    await prisma.patient.update({
      where: { id: isPatientExists.id },
      data: {
        userId: session.user.id
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: Role.PATIENT,
    name: session.user.name,
    email: session.user.email,
    status: user?.status || UserStatus.ACTIVE,
    isDeleted: user?.isDeleted || false,
    emailVerified: true
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: Role.PATIENT,
    name: session.user.name,
    email: session.user.email,
    status: user?.status || UserStatus.ACTIVE,
    isDeleted: user?.isDeleted || false,
    emailVerified: true
  });
  return {
    accessToken,
    refreshToken
  };
};
var AuthService = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
  chnagePassword,
  logOutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess
};

// src/app/module/auth/auth.controller.ts
import status5 from "http-status";
var registerPatient2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.registerPatient(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.storeTokenIntoCookie(res, accessToken);
    tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status5.CREATED,
      success: true,
      message: "Patient registered successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
);
var loginUser2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.storeTokenIntoCookie(res, accessToken);
    tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
);
var getMe2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await AuthService.getMe(user);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "User fetched successfully",
      data: result
    });
  }
);
var getNewToken2 = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth-session"] || req.cookies["better-auth.session_token"] || req.cookies["better-auth-session-token"] || req.body?.sessionToken || req.body?.token || req.headers["x-session-token"] || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization);
    if (!refreshToken || !betterAuthSessionToken) {
      throw new AppError_default(status5.BAD_REQUEST, "No refresh token or session token found");
    }
    const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.storeTokenIntoCookie(res, accessToken);
    tokenUtils.storeRefreshTokenIntoCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "New token generated successfully",
      data: {
        sessionToken,
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  }
);
var changePassword = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth-session"] || req.cookies["better-auth.session_token"] || req.cookies["better-auth-session-token"] || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization);
    if (!betterAuthSessionToken) {
      throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! No session token provided.");
    }
    const result = await AuthService.chnagePassword(payload, betterAuthSessionToken);
    const { accessToken, refreshToken, token } = result;
    tokenUtils.storeTokenIntoCookie(res, accessToken);
    tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Password changed successfully",
      data: result
    });
  }
);
var logOutUser2 = catchAsync(
  async (req, res) => {
    const betterAuthSessionToken = req.cookies["better-auth-session-token"];
    const result = await AuthService.logOutUser(betterAuthSessionToken);
    tokenUtils.storeTokenIntoCookie(res, "");
    tokenUtils.storeRefreshTokenIntoCookie(res, "");
    tokenUtils.setBetterAuthSessionCookie(res, "");
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "User logged out successfully",
      data: result
    });
  }
);
var verifyEmail2 = catchAsync(
  async (req, res) => {
    const { email, otp } = req.body;
    await AuthService.verifyEmail(email, otp);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Email verified successfully"
    });
  }
);
var forgetPassword2 = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    await AuthService.forgetPassword(email);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Password reset OTP sent to email successfully"
    });
  }
);
var resetPassword2 = catchAsync(
  async (req, res) => {
    const { email, otp, newPassword } = req.body;
    await AuthService.resetPassword(email, otp, newPassword);
    sendResponse(res, {
      httpStatusCode: status5.OK,
      success: true,
      message: "Password reset successfully"
    });
  }
);
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
    frontendUrl: envVars.FRONTEND_URL,
    redirectPath
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  if (session.user.role && session.user.role !== Role.PATIENT) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=patient_only`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.storeTokenIntoCookie(res, accessToken);
  tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  const isDoctorOrAdminRoute = redirectPath.startsWith("/doctor") || redirectPath.startsWith("/admin");
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//") && !isDoctorOrAdminRoute;
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  registerPatient: registerPatient2,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword,
  logOutUser: logOutUser2,
  verifyEmail: verifyEmail2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/module/auth/auth.route.ts
var router2 = Router2();
router2.post("/register", AuthController.registerPatient);
router2.post("/login", AuthController.loginUser);
router2.get("/me", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), AuthController.getMe);
router2.post("/refresh-token", AuthController.getNewToken);
router2.post("/change-password", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), AuthController.changePassword);
router2.post("/logout", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), AuthController.logOutUser);
router2.post("/verify-email", AuthController.verifyEmail);
router2.post("/forget-password", AuthController.forgetPassword);
router2.post("/reset-password", AuthController.resetPassword);
router2.get("/login/google", AuthController.googleLogin);
router2.get("/google/success", AuthController.googleLoginSuccess);
router2.get("/oauth/error", AuthController.handleOAuthError);
var authRouters = router2;

// src/app/module/user/user.route.ts
import { Router as Router3 } from "express";

// src/app/module/user/user.service.ts
import status6 from "http-status";
var createDoctor = async (payload) => {
  const specialties = [];
  for (const specialityId of payload.specialties) {
    const speciality = await prisma.specialty.findUnique({
      where: {
        id: specialityId
      }
    });
    if (!speciality) {
      throw new AppError_default(status6.BAD_REQUEST, `Specialty not found ${specialityId}`);
    }
    specialties.push(speciality);
  }
  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email
    }
  });
  if (userExist) {
    throw new AppError_default(status6.BAD_REQUEST, `User already exists with email: ${payload.doctor.email}`);
  }
  const doctorWithRegExist = await prisma.doctor.findUnique({
    where: {
      registrationNumber: payload.doctor.registrationNumber
    }
  });
  if (doctorWithRegExist) {
    throw new AppError_default(status6.BAD_REQUEST, `Doctor with registration number ${payload.doctor.registrationNumber} already exists`);
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true
    }
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userData.user.id },
        data: { emailVerified: true }
      });
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor
        }
      });
      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id
        };
      });
      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData
      });
      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              createdAt: true,
              updatedAt: true
            }
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  title: true,
                  id: true
                }
              }
            }
          }
        }
      });
      return doctor;
    });
    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};
var createAdmin = async (payload) => {
  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });
  if (userExist) {
    throw new AppError_default(status6.BAD_REQUEST, `User with this email already exists: ${payload.admin.email}`);
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true
    }
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userData.user.id },
        data: { emailVerified: true }
      });
      const admin = await tx.admin.create({
        data: {
          userId: userData.user.id,
          name: payload.admin.name,
          email: payload.admin.email,
          profilePhoto: payload.admin.profilePhoto,
          contactNumber: payload.admin.contactNumber
        }
      });
      const createdAdmin = await tx.admin.findUnique({
        where: { id: admin.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true
            }
          }
        }
      });
      return createdAdmin;
    });
    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};
var createSuperAdmin = async (payload) => {
  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.superAdmin.email
    }
  });
  if (userExist) {
    throw new AppError_default(status6.BAD_REQUEST, `User with this email already exists: ${payload.superAdmin.email}`);
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.superAdmin.email,
      password: payload.password,
      role: Role.SUPER_ADMIN,
      name: payload.superAdmin.name,
      needPasswordChange: true
    }
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userData.user.id },
        data: { emailVerified: true }
      });
      const superAdmin = await tx.superAdmin.create({
        data: {
          userId: userData.user.id,
          name: payload.superAdmin.name,
          email: payload.superAdmin.email,
          profilePhoto: payload.superAdmin.profilePhoto,
          contactNumber: payload.superAdmin.contactNumber
        }
      });
      const createdSuperAdmin = await tx.superAdmin.findUnique({
        where: { id: superAdmin.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true
            }
          }
        }
      });
      return createdSuperAdmin;
    });
    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};
var UserServices = {
  createDoctor,
  createAdmin,
  createSuperAdmin
};

// src/app/module/user/user.controller.ts
import status7 from "http-status";
var createDoctor2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await UserServices.createDoctor(payload);
    sendResponse(res, {
      httpStatusCode: status7.CREATED,
      success: true,
      message: "Doctor created successfully",
      data: result
    });
  }
);
var createAdmin2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await UserServices.createAdmin(payload);
    sendResponse(res, {
      httpStatusCode: status7.CREATED,
      success: true,
      message: "Admin created successfully",
      data: result
    });
  }
);
var createSuperAdmin2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await UserServices.createSuperAdmin(payload);
    sendResponse(res, {
      httpStatusCode: status7.CREATED,
      success: true,
      message: "Super Admin created successfully",
      data: result
    });
  }
);
var UserControllers = {
  createDoctor: createDoctor2,
  createAdmin: createAdmin2,
  createSuperAdmin: createSuperAdmin2
};

// src/app/module/user/user.validation.ts
import z2 from "zod";
var createDoctorZodSchema = z2.object({
  password: z2.string("Password is required").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  doctor: z2.object({
    name: z2.string("Name is required and must be string").min(5, "Name must be at least 5 characters").max(30, "Name must be at most 30 characters"),
    email: z2.email("Invalid email address"),
    contactNumber: z2.string("Contact number is required").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 15 characters"),
    address: z2.string("Address is required").min(10, "Address must be at least 10 characters").max(100, "Address must be at most 100 characters").optional(),
    registrationNumber: z2.string("Registration number is required"),
    experience: z2.int("Experience must be an integer").nonnegative("Experience cannot be negative").optional(),
    gender: z2.enum([Gender.MALE, Gender.FEMALE], "Gender must be either MALE or FEMALE"),
    appointmentFee: z2.number("Appointment fee must be a number").nonnegative("Appointment fee cannot be negative"),
    qualification: z2.string("Qualification is required").min(2, "Qualification must be at least 2 characters").max(50, "Qualification must be at most 50 characters"),
    currentWorkingPlace: z2.string("Current working place is required").min(2, "Current working place must be at least 2 characters").max(50, "Current working place must be at most 50 characters"),
    designation: z2.string("Designation is required").min(2, "Designation must be at least 2 characters").max(50, "Designation must be at most 50 characters")
  }),
  specialties: z2.array(z2.uuid(), "Specialties must be an array of strings").min(1, "At least one specialty is required")
});
var createAdminZodSchema = z2.object({
  password: z2.string("Password is required").min(6, "Password must be at least 6 characters"),
  admin: z2.object({
    name: z2.string("Name is required").min(1, "Name is required"),
    email: z2.email("Invalid email address"),
    contactNumber: z2.string("Contact number is required").min(1, "Contact number is required").optional(),
    profilePhoto: z2.url("Profile photo must be a valid URL").optional()
  })
});
var createSuperAdminZodSchema = z2.object({
  password: z2.string("Password is required").min(6, "Password must be at least 6 characters"),
  superAdmin: z2.object({
    name: z2.string("Name is required").min(1, "Name is required"),
    email: z2.email("Invalid email address"),
    contactNumber: z2.string("Contact number is required").min(1, "Contact number is required").optional(),
    profilePhoto: z2.url("Profile photo must be a valid URL").optional()
  })
});

// src/app/module/user/user.route.ts
var router3 = Router3();
router3.post(
  "/create-doctor",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createDoctorZodSchema),
  UserControllers.createDoctor
);
router3.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(createAdminZodSchema),
  UserControllers.createAdmin
);
router3.post(
  "/create-super-admin",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(createSuperAdminZodSchema),
  UserControllers.createSuperAdmin
);
var UserRoutes = router3;

// src/app/module/doctor/doctor.route.ts
import { Router as Router4 } from "express";

// src/app/module/doctor/doctor.controller.ts
import status9 from "http-status";

// src/app/module/doctor/doctor.service.ts
import status8 from "http-status";

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  model;
  queryParams;
  config;
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  [nestedField]: stringFilter2
                }
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter2
                    }
                  }
                }
              };
            }
          }
          const stringFilter = {
            contains: searchTerm,
            mode: "insensitive"
          };
          return {
            [field]: stringFilter
          };
        }
      );
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  // /doctors?searchTerm=john&page=1&sortBy=name&specialty=cardiology&appointmentFee[lt]=100 => {}
  // { specialty: 'cardiology', appointmentFee: { lt: '100' } }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include"];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") {
        return;
      }
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {
              some: {}
            };
            countQueryWhere[relation] = {
              some: {}
            };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) {
        return;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(value);
        countQueryWhere[key] = this.parseRangeFilter(value);
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedField]: sortOrder
          }
        };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedRelation]: {
              [nestedField]: sortOrder
            }
          }
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder
      };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam?.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray?.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) {
      return this;
    }
    this.query.include = { ...this.query.include, ...relation };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.include;
    if (includeParam && typeof includeParam === "string") {
      const requestedRelations = includeParam.split(",").map((relation) => relation.trim());
      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = { ...this.query.include, ...result };
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(this.query.where, condition);
    this.countQuery.where = this.deepMerge(this.countQuery.where, condition);
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query)
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages
      }
    };
  }
  async count() {
    return await this.model.count(this.countQuery);
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/app/module/doctor/doctor.constant.ts
var doctorSearchableFields = ["name", "email", "qualification", "designation", "currentWorkingPlace", "registrationNumber", "specialties.specialty.title"];
var doctorFilterableFields = ["gender", "isDeleted", "appointmentFee", "experience", "registrationNumber", "specialties.specialtyId", "currentWorkingPlace", "designation", "qualification", "specialties.specialty.title", "user.role"];
var doctorIncludeConfig = {
  user: true,
  specialties: {
    include: {
      specialty: true
    }
  },
  appointments: {
    include: {
      patient: true,
      doctor: true
    }
  },
  doctorSchedules: {
    include: {
      schedule: true
    }
  },
  prescriptions: true,
  reviews: true
};

// src/app/module/doctor/doctor.service.ts
var getAllDoctors = async (query) => {
  const queryBuilder = new QueryBuilder(
    prisma.doctor,
    query,
    {
      searchableFields: doctorSearchableFields,
      filterableFields: doctorFilterableFields
    }
  );
  const result = await queryBuilder.search().filter().where({
    isDeleted: false
  }).include({
    user: true,
    specialties: {
      include: {
        specialty: true
      }
    }
  }).dynamicInclude(doctorIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getDoctorById = async (id) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true
        }
      }
    }
  });
  if (!result) {
    throw new AppError_default(status8.NOT_FOUND, "Doctor not found");
  }
  return result;
};
var getSpecialtiesToUpdate = async (tx, id, specialties) => {
  const doctor = await tx.doctor.findUniqueOrThrow({
    where: { id }
  });
  const existingSpecialties = await tx.doctorSpecialty.findMany({
    where: { doctorId: doctor.id }
  });
  const existingSpecialtyIds = existingSpecialties.map((es) => es.specialtyId);
  const normalizedSpecialties = specialties.map((s) => {
    if (typeof s === "string") {
      return { specialtyId: s, shouldDelete: false };
    }
    if (typeof s === "object" && s !== null) {
      const specId = s.specialtyId || (s.specialty ? s.specialty.id : s.id);
      return { specialtyId: specId, shouldDelete: Boolean(s.shouldDelete) };
    }
    return s;
  }).filter((s) => Boolean(s?.specialtyId));
  const activeInputIds = normalizedSpecialties.filter((s) => !s.shouldDelete).map((s) => s.specialtyId);
  const specialtyIdsToDelete = existingSpecialtyIds.filter(
    (eId) => !activeInputIds.includes(eId) || normalizedSpecialties.some((s) => s.specialtyId === eId && s.shouldDelete)
  );
  const specialtyIdsToAdd = activeInputIds.filter(
    (eId) => !existingSpecialtyIds.includes(eId)
  );
  return {
    specialtyIdsToDelete,
    specialtyIdsToAdd
  };
};
var updateDoctor = async (id, payload) => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: { id, isDeleted: false }
  });
  if (!existingDoctor) {
    throw new AppError_default(status8.NOT_FOUND, "Doctor not found");
  }
  return await prisma.$transaction(async (tx) => {
    const { doctor, specialties, ...restPayload } = payload;
    const doctorData = { ...doctor || restPayload };
    delete doctorData.email;
    delete doctorData.userId;
    if (doctorData.registrationNumber) {
      const existingDoctorWithReg = await tx.doctor.findFirst({
        where: {
          registrationNumber: doctorData.registrationNumber,
          NOT: { id }
        }
      });
      if (existingDoctorWithReg) {
        throw new AppError_default(
          status8.BAD_REQUEST,
          "Registration number is already in use by another doctor."
        );
      }
    }
    if (doctorData.name || doctorData.profilePhoto) {
      const currentDoctor = await tx.doctor.findUniqueOrThrow({
        where: { id },
        select: { userId: true }
      });
      await tx.user.update({
        where: { id: currentDoctor.userId },
        data: {
          ...doctorData.name ? { name: doctorData.name } : {},
          ...doctorData.profilePhoto ? { image: doctorData.profilePhoto } : {}
        }
      });
    }
    const updatedDoctor = await tx.doctor.update({
      where: { id },
      data: doctorData
    });
    if (specialties) {
      const { specialtyIdsToDelete, specialtyIdsToAdd } = await getSpecialtiesToUpdate(
        tx,
        id,
        specialties
      );
      if (specialtyIdsToDelete.length > 0) {
        await tx.doctorSpecialty.deleteMany({
          where: {
            doctorId: updatedDoctor.id,
            specialtyId: { in: specialtyIdsToDelete }
          }
        });
      }
      if (specialtyIdsToAdd.length > 0) {
        const existingValidSpecialties = await tx.specialty.findMany({
          where: {
            id: { in: specialtyIdsToAdd },
            isDeleted: false
          },
          select: { id: true }
        });
        const validSpecialtyIdSet = new Set(existingValidSpecialties.map((s) => s.id));
        const invalidIds = specialtyIdsToAdd.filter((specId) => !validSpecialtyIdSet.has(specId));
        if (invalidIds.length > 0) {
          throw new AppError_default(
            status8.BAD_REQUEST,
            `Invalid specialty ID(s): ${invalidIds.join(", ")}`
          );
        }
        await tx.doctorSpecialty.createMany({
          data: specialtyIdsToAdd.map((specialtyId) => ({
            doctorId: updatedDoctor.id,
            specialtyId
          }))
        });
      }
    }
    return await tx.doctor.findUnique({
      where: { id: updatedDoctor.id },
      include: {
        user: true,
        specialties: {
          include: { specialty: true }
        }
      }
    });
  });
};
var softDeleteDoctor = async (id) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id }
  });
  if (!doctor) {
    throw new AppError_default(status8.NOT_FOUND, "Doctor not found");
  }
  if (doctor.isDeleted) {
    throw new AppError_default(status8.BAD_REQUEST, "Doctor is already deleted");
  }
  return prisma.doctor.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};
var DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor: softDeleteDoctor,
  softDeleteDoctor
};

// src/app/module/doctor/doctor.controller.ts
var getAllDoctors2 = catchAsync(
  async (req, res) => {
    const query = req.query;
    const result = await DoctorService.getAllDoctors(query);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Doctors fetched successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getDoctorById2 = catchAsync(
  async (req, res) => {
    const result = await DoctorService.getDoctorById(req.params.id);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Doctor fetched successfully",
      data: result
    });
  }
);
var updateDoctor2 = catchAsync(
  async (req, res) => {
    const result = await DoctorService.updateDoctor(req.params.id, req.body);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Doctor updated successfully",
      data: result
    });
  }
);
var softDeleteDoctor2 = catchAsync(
  async (req, res) => {
    const result = await DoctorService.softDeleteDoctor(req.params.id);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Doctor deleted successfully",
      data: result
    });
  }
);
var DoctorController = {
  getAllDoctors: getAllDoctors2,
  getDoctorById: getDoctorById2,
  updateDoctor: updateDoctor2,
  deleteDoctor: softDeleteDoctor2,
  softDeleteDoctor: softDeleteDoctor2
};

// src/app/module/doctor/doctor.validation.ts
import z3 from "zod";
var updateDoctorZodSchema = z3.object({
  name: z3.string().optional(),
  profilePhoto: z3.string().optional(),
  contactNumber: z3.string().optional(),
  address: z3.string().optional(),
  registrationNumber: z3.string().optional(),
  experience: z3.coerce.number().optional(),
  gender: z3.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
  appointmentFee: z3.coerce.number().optional(),
  qualification: z3.string().optional(),
  currentWorkingPlace: z3.string().optional(),
  designation: z3.string().optional(),
  specialties: z3.array(z3.string()).optional()
});

// src/app/middlewares/profileUpload.middleware.ts
var profileUploadMiddleware = (req, res, next) => {
  if (req.body.data) {
    try {
      const parsed = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
      req.body = { ...parsed, ...req.body };
      delete req.body.data;
    } catch (e) {
    }
  }
  const files = req.files;
  if (req.file?.path) {
    req.body.profilePhoto = req.file.path;
  } else if (files?.profilePhoto?.[0]?.path) {
    req.body.profilePhoto = files.profilePhoto[0].path;
  }
  next();
};

// src/app/module/doctor/doctor.route.ts
var router4 = Router4();
router4.get(
  "/",
  DoctorController.getAllDoctors
);
router4.get(
  "/:id",
  DoctorController.getDoctorById
);
router4.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  multerUpload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  profileUploadMiddleware,
  validateRequest(updateDoctorZodSchema),
  DoctorController.updateDoctor
);
router4.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DoctorController.softDeleteDoctor
);
var DoctorRoutes = router4;

// src/app/module/admin/admin.route.ts
import { Router as Router5 } from "express";

// src/app/module/admin/admin.controller.ts
import status11 from "http-status";

// src/app/module/admin/admin.service.ts
import status10 from "http-status";
var getAllAdmins = async () => {
  return prisma.admin.findMany({
    where: {
      isDeleted: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      }
    }
  });
};
var getAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      }
    }
  });
  if (!admin) {
    throw new AppError_default(status10.NOT_FOUND, "Admin not found");
  }
  return admin;
};
var updateAdmin = async (id, payload) => {
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [
        { id },
        { userId: id }
      ],
      isDeleted: false
    }
  });
  if (!existingAdmin) {
    throw new AppError_default(status10.NOT_FOUND, "Admin not found");
  }
  return prisma.$transaction(async (tx) => {
    if (payload.name || payload.profilePhoto) {
      await tx.user.update({
        where: { id: existingAdmin.userId },
        data: {
          ...payload.name ? { name: payload.name } : {},
          ...payload.profilePhoto ? { image: payload.profilePhoto } : {}
        }
      });
    }
    const updatedAdmin = await tx.admin.update({
      where: { id: existingAdmin.id },
      data: payload,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
          }
        }
      }
    });
    return updatedAdmin;
  });
};
var softDeleteAdmin = async (id, user) => {
  const admin = await prisma.admin.findUnique({
    where: { id }
  });
  if (!admin) {
    throw new AppError_default(status10.NOT_FOUND, "Admin not found");
  }
  if (admin.isDeleted) {
    throw new AppError_default(status10.BAD_REQUEST, "Admin is already deleted");
  }
  if (admin.id === admin.userId) {
    throw new AppError_default(status10.BAD_REQUEST, "you can't delete youself");
  }
  return prisma.admin.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};
var changeUserStatus = async (user, payload) => {
  const isAdminExists = await prisma.admin.findUniqueOrThrow({
    where: {
      email: user.email
    },
    include: {
      user: true
    }
  });
  const { userId, userStatus } = payload;
  const userToChangeStatus = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  const selfStatusChange = isAdminExists.userId === userId;
  if (selfStatusChange) {
    throw new AppError_default(status10.BAD_REQUEST, "You cannot change your own status");
  }
  ;
  if (isAdminExists.user.role === Role.ADMIN && userToChangeStatus.role === Role.SUPER_ADMIN) {
    throw new AppError_default(status10.BAD_REQUEST, "You cannot change the status of super admin. Only super admin can change the status of another super admin");
  }
  if (isAdminExists.user.role === Role.ADMIN && userToChangeStatus.role === Role.ADMIN) {
    throw new AppError_default(status10.BAD_REQUEST, "You cannot change the status of another admin. Only super admin can change the status of another admin");
  }
  if (userStatus === UserStatus.DELETED) {
    throw new AppError_default(status10.BAD_REQUEST, "You cannot set user status to deleted. To delete a user, you have to use role specific delete api. For example, to delete an doctor user, you have to use delete doctor api which will set the user status to deleted and also set isDeleted to true and also delete the user session and account");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: userStatus
    }
  });
  return updatedUser;
};
var changeUserRole = async (user, payload) => {
  const isSuperAdminExists = await prisma.admin.findFirstOrThrow({
    where: {
      email: user.email,
      user: {
        role: Role.SUPER_ADMIN
      }
    },
    include: {
      user: true
    }
  });
  const { userId, role } = payload;
  const userToChangeRole = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  const selfRoleChange = isSuperAdminExists.userId === userId;
  if (selfRoleChange) {
    throw new AppError_default(status10.BAD_REQUEST, "You cannot change your own role");
  }
  if (userToChangeRole.role === Role.DOCTOR || userToChangeRole.role === Role.PATIENT) {
    throw new AppError_default(status10.BAD_REQUEST, "You cannot change the role of doctor or patient user. If you want to change the role of doctor or patient user, you have to delete the user and recreate with new role");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      role
    }
  });
  return updatedUser;
};
var AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  softDeleteAdmin,
  changeUserStatus,
  changeUserRole
};

// src/app/module/admin/admin.controller.ts
var getAllAdmins2 = catchAsync(async (req, res) => {
  const result = await AdminService.getAllAdmins();
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Admins retrieved successfully",
    data: result
  });
});
var getAdminById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getAdminById(id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result
  });
});
var updateAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.updateAdmin(id, req.body);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Admin updated successfully",
    data: result
  });
});
var softDeleteAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const result = await AdminService.softDeleteAdmin(id, user);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result
  });
});
var changeUserStatus2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await AdminService.changeUserStatus(user, payload);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "User status changed successfully",
      data: result
    });
  }
);
var changeUserRole2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await AdminService.changeUserRole(user, payload);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "User role changed successfully",
      data: result
    });
  }
);
var AdminController = {
  getAllAdmins: getAllAdmins2,
  getAdminById: getAdminById2,
  updateAdmin: updateAdmin2,
  softDeleteAdmin: softDeleteAdmin2,
  changeUserStatus: changeUserStatus2,
  changeUserRole: changeUserRole2
};

// src/app/module/admin/admin.validation.ts
import z4 from "zod";
var updateAdminZodSchema = z4.object({
  name: z4.string().optional(),
  profilePhoto: z4.string().optional(),
  contactNumber: z4.string().optional()
});

// src/app/module/admin/admin.route.ts
var router5 = Router5();
router5.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  AdminController.getAllAdmins
);
router5.get(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  AdminController.getAdminById
);
router5.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  profileUploadMiddleware,
  validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin
);
router5.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  AdminController.softDeleteAdmin
);
router5.patch(
  "/change-user-status",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  AdminController.changeUserStatus
);
router5.patch(
  "/change-user-role",
  checkAuth(Role.SUPER_ADMIN),
  AdminController.changeUserRole
);
var AdminRoutes = router5;

// src/app/module/superAdmin/superAdmin.route.ts
import { Router as Router6 } from "express";

// src/app/module/superAdmin/superAdmin.controller.ts
import status13 from "http-status";

// src/app/module/superAdmin/superAdmin.service.ts
import status12 from "http-status";
var getAllSuperAdmins = async () => {
  return prisma.superAdmin.findMany({
    where: {
      isDeleted: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      }
    }
  });
};
var getSuperAdminById = async (id) => {
  const superAdmin = await prisma.superAdmin.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      }
    }
  });
  if (!superAdmin) {
    throw new AppError_default(status12.NOT_FOUND, "Super Admin not found");
  }
  return superAdmin;
};
var updateSuperAdmin = async (id, payload) => {
  const existingSuperAdmin = await prisma.superAdmin.findFirst({
    where: {
      OR: [
        { id },
        { userId: id }
      ],
      isDeleted: false
    }
  });
  if (!existingSuperAdmin) {
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { id },
          { userId: id }
        ],
        isDeleted: false
      }
    });
    if (existingAdmin) {
      return prisma.$transaction(async (tx) => {
        if (payload.name || payload.profilePhoto) {
          await tx.user.update({
            where: { id: existingAdmin.userId },
            data: {
              ...payload.name ? { name: payload.name } : {},
              ...payload.profilePhoto ? { image: payload.profilePhoto } : {}
            }
          });
        }
        const updatedAdmin = await tx.admin.update({
          where: { id: existingAdmin.id },
          data: payload,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true
              }
            }
          }
        });
        return updatedAdmin;
      });
    }
    throw new AppError_default(status12.NOT_FOUND, "Super Admin not found");
  }
  return prisma.$transaction(async (tx) => {
    if (payload.name || payload.profilePhoto) {
      await tx.user.update({
        where: { id: existingSuperAdmin.userId },
        data: {
          ...payload.name ? { name: payload.name } : {},
          ...payload.profilePhoto ? { image: payload.profilePhoto } : {}
        }
      });
    }
    const updatedSuperAdmin = await tx.superAdmin.update({
      where: { id: existingSuperAdmin.id },
      data: payload,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
          }
        }
      }
    });
    return updatedSuperAdmin;
  });
};
var softDeleteSuperAdmin = async (id) => {
  const superAdmin = await prisma.superAdmin.findUnique({
    where: { id }
  });
  if (!superAdmin) {
    throw new AppError_default(status12.NOT_FOUND, "Super Admin not found");
  }
  if (superAdmin.isDeleted) {
    throw new AppError_default(status12.BAD_REQUEST, "Super Admin is already deleted");
  }
  return prisma.superAdmin.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};
var SuperAdminService = {
  getAllSuperAdmins,
  getSuperAdminById,
  updateSuperAdmin,
  softDeleteSuperAdmin
};

// src/app/module/superAdmin/superAdmin.controller.ts
var getAllSuperAdmins2 = catchAsync(async (req, res) => {
  const result = await SuperAdminService.getAllSuperAdmins();
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Super Admins retrieved successfully",
    data: result
  });
});
var getSuperAdminById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SuperAdminService.getSuperAdminById(id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Super Admin retrieved successfully",
    data: result
  });
});
var updateSuperAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SuperAdminService.updateSuperAdmin(id, req.body);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Super Admin updated successfully",
    data: result
  });
});
var softDeleteSuperAdmin2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SuperAdminService.softDeleteSuperAdmin(id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Super Admin deleted successfully",
    data: result
  });
});
var SuperAdminController = {
  getAllSuperAdmins: getAllSuperAdmins2,
  getSuperAdminById: getSuperAdminById2,
  updateSuperAdmin: updateSuperAdmin2,
  softDeleteSuperAdmin: softDeleteSuperAdmin2
};

// src/app/module/superAdmin/superAdmin.validation.ts
import z5 from "zod";
var updateSuperAdminZodSchema = z5.object({
  name: z5.string().optional(),
  profilePhoto: z5.string().optional(),
  contactNumber: z5.string().optional()
});

// src/app/module/superAdmin/superAdmin.route.ts
var router6 = Router6();
router6.get(
  "/",
  checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.getAllSuperAdmins
);
router6.get(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.getSuperAdminById
);
router6.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  multerUpload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  profileUploadMiddleware,
  validateRequest(updateSuperAdminZodSchema),
  SuperAdminController.updateSuperAdmin
);
router6.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  SuperAdminController.softDeleteSuperAdmin
);
var SuperAdminRoutes = router6;

// src/app/module/schedule/schedule.route.ts
import { Router as Router7 } from "express";

// src/app/module/schedule/schedule.controller.ts
import status14 from "http-status";

// src/app/module/schedule/schedule.service.ts
import { addHours, addMinutes, format } from "date-fns";

// src/app/module/schedule/schedule.constant.ts
var scheduleFilterableFields = [
  "id",
  "startDateTime",
  "endDateTime"
];
var scheduleSearchableFields = [
  "id",
  "startDateTime",
  "endDateTime"
];
var scheduleIncludeConfig = {
  appointments: {
    include: {
      doctor: true,
      patient: true,
      payment: true,
      prescription: true,
      review: true
    }
  },
  doctorSchedules: {
    include: {
      doctor: true
    }
  }
};

// src/app/module/schedule/schedule.utils.ts
var convertDateTime = async (date) => {
  const offset = date.getTimezoneOffset() * 6e4;
  return new Date(date.getTime() + offset);
};

// src/app/module/schedule/schedule.service.ts
var createSchedule = async (payload) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const interval = 30;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const schedules = [];
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    while (startDateTime < endDateTime) {
      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, interval));
      const scheduleData = {
        startDateTime: s,
        endDateTime: e
      };
      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime
        }
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData
        });
        schedules.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};
var getAllSchedules = async (query) => {
  const queryBuilder = new QueryBuilder(
    prisma.schedule,
    query,
    {
      searchableFields: scheduleSearchableFields,
      filterableFields: scheduleFilterableFields
    }
  );
  const result = await queryBuilder.search().filter().paginate().dynamicInclude(scheduleIncludeConfig, ["doctorSchedules", "appointments"]).sort().fields().execute();
  return result;
};
var getScheduleById = async (id) => {
  const schedule = await prisma.schedule.findUnique({
    where: {
      id
    },
    include: scheduleIncludeConfig
  });
  return schedule;
};
var updateSchedule = async (id, payload) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const startDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(startDate), "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      ),
      Number(startTime.split(":")[1])
    )
  );
  const endDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(endDate), "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      ),
      Number(endTime.split(":")[1])
    )
  );
  const updatedSchedule = await prisma.schedule.update({
    where: {
      id
    },
    data: {
      startDateTime,
      endDateTime
    }
  });
  return updatedSchedule;
};
var deleteSchedule = async (id) => {
  await prisma.schedule.delete({
    where: {
      id
    }
  });
  return true;
};
var ScheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
};

// src/app/module/schedule/schedule.controller.ts
var createSchedule2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const schedule = await ScheduleService.createSchedule(payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status14.CREATED,
    message: "Schedule created successfully",
    data: schedule
  });
});
var getAllSchedules2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ScheduleService.getAllSchedules(query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status14.OK,
    message: "Schedules retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getScheduleById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const schedule = await ScheduleService.getScheduleById(id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status14.OK,
    message: "Schedule retrieved successfully",
    data: schedule
  });
});
var updateSchedule2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedSchedule = await ScheduleService.updateSchedule(id, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status14.OK,
    message: "Schedule updated successfully",
    data: updatedSchedule
  });
});
var deleteSchedule2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    await ScheduleService.deleteSchedule(id);
    sendResponse(res, {
      success: true,
      httpStatusCode: status14.OK,
      message: "Schedule deleted successfully"
    });
  }
);
var ScheduleController = {
  createSchedule: createSchedule2,
  getAllSchedules: getAllSchedules2,
  getScheduleById: getScheduleById2,
  updateSchedule: updateSchedule2,
  deleteSchedule: deleteSchedule2
};

// src/app/module/schedule/schedule.validation.ts
import z6 from "zod";
var createScheduleZodSchema = z6.object({
  startDate: z6.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  endDate: z6.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  startTime: z6.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }),
  endTime: z6.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  })
});
var updateScheduleZodSchema = z6.object({
  startDate: z6.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  endDate: z6.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  startTime: z6.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }).optional(),
  endTime: z6.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Invalid time format"
  }).optional()
});
var ScheduleValidation = {
  createScheduleZodSchema,
  updateScheduleZodSchema
};

// src/app/module/schedule/schedule.route.ts
var router7 = Router7();
router7.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(ScheduleValidation.createScheduleZodSchema), ScheduleController.createSchedule);
router7.get("/", ScheduleController.getAllSchedules);
router7.get("/:id", ScheduleController.getScheduleById);
router7.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(ScheduleValidation.updateScheduleZodSchema), ScheduleController.updateSchedule);
router7.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ScheduleController.deleteSchedule);
var scheduleRoutes = router7;

// src/app/module/doctorSchedule/doctorSchedule.route.ts
import { Router as Router8 } from "express";

// src/app/module/doctorSchedule/doctorSchedule.controller.ts
import status15 from "http-status";

// src/app/module/doctorSchedule/doctorSchedule.constant.ts
var doctorScheduleSearchableFields = [
  "id",
  "doctorId",
  "scheduleId"
];
var doctorScheduleFilterableFields = [
  "id",
  "doctorId",
  "scheduleId",
  "createdAt",
  "updatedAt",
  "isBooked",
  "schedule.startDateTime",
  "schedule.endDateTime"
];
var doctorScheduleIncludeConfig = {
  doctor: {
    include: {
      user: true,
      appointments: true,
      specialties: true
    }
  },
  schedule: true
};

// src/app/module/doctorSchedule/doctorSchedule.service.ts
var createMyDoctorSchedule = async (user, payload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId
  }));
  await prisma.doctorSchedules.createMany({
    data: doctorScheduleData
  });
  const result = await prisma.doctorSchedules.findMany({
    where: {
      doctorId: doctorData.id,
      scheduleId: {
        in: payload.scheduleIds
      }
    },
    include: {
      schedule: true
    }
  });
  return result;
};
var getMyDoctorSchedules = async (user, query) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const queryBuilder = new QueryBuilder(
    prisma.doctorSchedules,
    {
      doctorId: doctorData.id,
      ...query
    },
    {
      filterableFields: doctorScheduleFilterableFields,
      searchableFields: doctorScheduleSearchableFields
    }
  );
  const doctorSchedules = await queryBuilder.search().filter().paginate().include({
    schedule: true,
    doctor: {
      include: {
        user: true
      }
    }
  }).sort().fields().dynamicInclude(doctorScheduleIncludeConfig).execute();
  return doctorSchedules;
};
var getAllDoctorSchedules = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.doctorSchedules, query, {
    filterableFields: doctorScheduleFilterableFields,
    searchableFields: doctorScheduleSearchableFields
  });
  const result = await queryBuilder.search().filter().paginate().dynamicInclude(doctorScheduleIncludeConfig, ["schedule", "doctor"]).sort().execute();
  return result;
};
var getDoctorScheduleById = async (doctorId, scheduleId) => {
  const doctorSchedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId,
        scheduleId
      }
    },
    include: {
      schedule: true,
      doctor: true
    }
  });
  return doctorSchedule;
};
var updateMyDoctorSchedule = async (user, payload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const deleteIds = payload.scheduleIds.filter((schedule) => schedule.shouldDelete).map((schedule) => schedule.id);
  const createIds = payload.scheduleIds.filter((schedule) => !schedule.shouldDelete).map((schedule) => schedule.id);
  const result = await prisma.$transaction(async (tx) => {
    await tx.doctorSchedules.deleteMany({
      where: {
        isBooked: false,
        doctorId: doctorData.id,
        scheduleId: {
          in: deleteIds
        }
      }
    });
    const doctorScheduleData = createIds.map((scheduleId) => ({
      doctorId: doctorData.id,
      scheduleId
    }));
    const result2 = await tx.doctorSchedules.createMany({
      data: doctorScheduleData
    });
    return result2;
  });
  return result;
};
var deleteMyDoctorSchedule = async (id, user) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  await prisma.doctorSchedules.deleteMany({
    where: {
      isBooked: false,
      doctorId: doctorData.id,
      scheduleId: id
    }
  });
};
var DoctorScheduleService = {
  createMyDoctorSchedule,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
  getMyDoctorSchedules
};

// src/app/module/doctorSchedule/doctorSchedule.controller.ts
var createMyDoctorSchedule2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const doctorSchedule = await DoctorScheduleService.createMyDoctorSchedule(user, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.CREATED,
    message: "Doctor schedule created successfully",
    data: doctorSchedule
  });
});
var getMyDoctorSchedules2 = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await DoctorScheduleService.getMyDoctorSchedules(user, query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "Doctor schedules retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAllDoctorSchedules2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await DoctorScheduleService.getAllDoctorSchedules(query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "All doctor schedules retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getDoctorScheduleById2 = catchAsync(async (req, res) => {
  const doctorId = req.params.doctorId;
  const scheduleId = req.params.scheduleId;
  const doctorSchedule = await DoctorScheduleService.getDoctorScheduleById(doctorId, scheduleId);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "Doctor schedule retrieved successfully",
    data: doctorSchedule
  });
});
var updateMyDoctorSchedule2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const updatedDoctorSchedule = await DoctorScheduleService.updateMyDoctorSchedule(user, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "Doctor schedule updated successfully",
    data: updatedDoctorSchedule
  });
});
var deleteMyDoctorSchedule2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  await DoctorScheduleService.deleteMyDoctorSchedule(id, user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status15.OK,
    message: "Doctor schedule deleted successfully"
  });
});
var DoctorScheduleController = {
  createMyDoctorSchedule: createMyDoctorSchedule2,
  getMyDoctorSchedules: getMyDoctorSchedules2,
  getAllDoctorSchedules: getAllDoctorSchedules2,
  getDoctorScheduleById: getDoctorScheduleById2,
  updateMyDoctorSchedule: updateMyDoctorSchedule2,
  deleteMyDoctorSchedule: deleteMyDoctorSchedule2
};

// src/app/module/doctorSchedule/doctorSchedule.route.ts
var router8 = Router8();
router8.post(
  "/create-my-doctor-schedule",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.createMyDoctorSchedule
);
router8.get("/my-doctor-schedules", checkAuth(Role.DOCTOR), DoctorScheduleController.getMyDoctorSchedules);
router8.get("/", DoctorScheduleController.getAllDoctorSchedules);
router8.get("/:doctorId/schedule/:scheduleId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorScheduleController.getDoctorScheduleById);
router8.patch(
  "/update-my-doctor-schedule",
  checkAuth(Role.DOCTOR),
  DoctorScheduleController.updateMyDoctorSchedule
);
router8.delete("/delete-my-doctor-schedule/:id", checkAuth(Role.DOCTOR), DoctorScheduleController.deleteMyDoctorSchedule);
var DoctorScheduleRoutes = router8;

// src/app/module/appointment/appointment.route.ts
import { Router as Router9 } from "express";

// src/app/module/appointment/appointment.controller.ts
import status17 from "http-status";

// src/app/module/appointment/appointment.service.ts
import status16 from "http-status";
import { v7 as uuidv7 } from "uuid";

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/module/appointment/appointment.service.ts
var bookAppointment = async (payload, user) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false
    }
  });
  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: payload.scheduleId
    }
  });
  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleData.id
      }
    }
  });
  const videoCallingId = String(uuidv7());
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        doctorId: payload.doctorId,
        patientId: patientData.id,
        scheduleId: doctorSchedule.scheduleId,
        videoCallingId
      }
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId
        }
      },
      data: {
        isBooked: true
      }
    });
    const transactionId = String(uuidv7());
    const paymentData = await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId
      }
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Appointment with Dr. ${doctorData.name}`
            },
            unit_amount: doctorData.appointmentFee * 100
          },
          quantity: 1
        }
      ],
      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id
      },
      success_url: `${envVars.FRONTEND_URL}/dashboard/my-appointments?payment=success&status=PAID&appointment_id=${appointmentData.id}&payment_id=${paymentData.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/my-appointments?error=payment_cancelled`
    });
    return {
      appointmentData,
      paymentData,
      paymentUrl: session.url
    };
  });
  return {
    appointment: result.appointmentData,
    payment: result.paymentData,
    paymentUrl: result.paymentUrl
  };
};
var getMyAppointments = async (user) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email
    }
  });
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email
    }
  });
  let appointments = [];
  if (patientData) {
    appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientData.id
      },
      include: {
        doctor: true,
        schedule: true
      }
    });
  } else if (doctorData) {
    appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorData.id
      },
      include: {
        patient: true,
        schedule: true
      }
    });
  } else {
    throw new Error("User not found");
  }
  return appointments;
};
var changeAppointmentStatus = async (appointmentId, appointmentStatus, user) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId
      // status: AppointmentStatus.SCHEDULED
    },
    include: {
      doctor: true
    }
  });
  if (user?.role === Role.DOCTOR) {
    if (!(user?.email === appointmentData.doctor.email))
      throw new AppError_default(status16.BAD_REQUEST, "This is not your appointment");
  }
  return await prisma.appointment.update({
    where: {
      id: appointmentId
    },
    data: {
      status: appointmentStatus
    }
  });
};
var getMySingleAppointment = async (appointmentId, user) => {
  const patientData = await prisma.patient.findUnique({
    where: {
      email: user?.email
    }
  });
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email
    }
  });
  let appointment;
  if (patientData) {
    appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: patientData.id
      },
      include: {
        doctor: true,
        schedule: true
      }
    });
  } else if (doctorData) {
    appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctorData.id
      },
      include: {
        patient: true,
        schedule: true
      }
    });
  }
  if (!appointment) {
    throw new AppError_default(status16.NOT_FOUND, "Appointment not found");
  }
  return appointment;
};
var getAllAppointments = async () => {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: true,
      patient: true,
      schedule: true
    }
  });
  return appointments;
};
var bookAppointmentWithPayLater = async (payload, user) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false
    }
  });
  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: payload.scheduleId
    }
  });
  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleData.id
      }
    }
  });
  const videoCallingId = String(uuidv7());
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        doctorId: payload.doctorId,
        patientId: patientData.id,
        scheduleId: doctorSchedule.scheduleId,
        videoCallingId
      }
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId
        }
      },
      data: {
        isBooked: true
      }
    });
    const transactionId = String(uuidv7());
    const paymentData = await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId
      }
    });
    return {
      appointment: appointmentData,
      payment: paymentData
    };
  });
  return result;
};
var initiatePayment = async (appointmentId, user) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
      patientId: patientData.id
    },
    include: {
      doctor: true,
      payment: true
    }
  });
  if (!appointmentData) {
    throw new AppError_default(status16.NOT_FOUND, "Appointment not found");
  }
  if (!appointmentData.payment) {
    throw new AppError_default(status16.NOT_FOUND, "Payment data not found for this appointment");
  }
  if (appointmentData.payment?.status === PaymentStatus.PAID) {
    throw new AppError_default(status16.BAD_REQUEST, "Payment already completed for this appointment");
  }
  ;
  if (appointmentData.status === AppointmentStatus.CANCELED) {
    throw new AppError_default(status16.BAD_REQUEST, "Appointment is canceled");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Appointment with Dr. ${appointmentData.doctor.name}`
          },
          unit_amount: appointmentData.doctor.appointmentFee * 100
        },
        quantity: 1
      }
    ],
    metadata: {
      appointmentId: appointmentData.id,
      paymentId: appointmentData.payment.id
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/my-appointments?payment=success&status=PAID&appointment_id=${appointmentData.id}&payment_id=${appointmentData.payment.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/my-appointments?error=payment_cancelled`
  });
  return {
    paymentUrl: session.url
  };
};
var cancelUnpaidAppointments = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1e3);
  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      // status: AppointmentStatus.SCHEDULED,
      createdAt: {
        lte: thirtyMinutesAgo
      },
      paymentStatus: PaymentStatus.UNPAID
    }
  });
  const appointmentToCancel = unpaidAppointments.map((appointment) => appointment.id);
  await prisma.$transaction(async (tx) => {
    await tx.appointment.updateMany({
      where: {
        id: {
          in: appointmentToCancel
        }
      },
      data: {
        status: AppointmentStatus.CANCELED
      }
    });
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentToCancel
        }
      }
    });
    for (const unpaidAppointment of unpaidAppointments) {
      await tx.doctorSchedules.update({
        where: {
          doctorId_scheduleId: {
            doctorId: unpaidAppointment.doctorId,
            scheduleId: unpaidAppointment.scheduleId
          }
        },
        data: {
          isBooked: false
        }
      });
    }
  });
};
var AppointmentService = {
  bookAppointment,
  getMyAppointments,
  changeAppointmentStatus,
  getMySingleAppointment,
  getAllAppointments,
  bookAppointmentWithPayLater,
  initiatePayment,
  cancelUnpaidAppointments
};

// src/app/module/appointment/appointment.controller.ts
var bookAppointment2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const appointment = await AppointmentService.bookAppointment(payload, user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.CREATED,
    message: "Appointment booked successfully",
    data: appointment
  });
});
var getMyAppointments2 = catchAsync(async (req, res) => {
  const user = req.user;
  const appointments = await AppointmentService.getMyAppointments(user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.OK,
    message: "Appointments retrieved successfully",
    data: appointments
  });
});
var changeAppointmentStatus2 = catchAsync(async (req, res) => {
  const appointmentId = req.params.id;
  const payload = req.body;
  const user = req.user;
  const updatedAppointment = await AppointmentService.changeAppointmentStatus(appointmentId, payload, user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.OK,
    message: "Appointment status updated successfully",
    data: updatedAppointment
  });
});
var getMySingleAppointment2 = catchAsync(async (req, res) => {
  const appointmentId = req.params.id;
  const user = req.user;
  const appointment = await AppointmentService.getMySingleAppointment(appointmentId, user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.OK,
    message: "Appointment retrieved successfully",
    data: appointment
  });
});
var getAllAppointments2 = catchAsync(async (req, res) => {
  const appointments = await AppointmentService.getAllAppointments();
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.OK,
    message: "All appointments retrieved successfully",
    data: appointments
  });
});
var bookAppointmentWithPayLater2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const appointment = await AppointmentService.bookAppointmentWithPayLater(payload, user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.CREATED,
    message: "Appointment booked successfully with Pay Later option",
    data: appointment
  });
});
var initiatePayment2 = catchAsync(async (req, res) => {
  const appointmentId = req.params.id;
  const user = req.user;
  const paymentInfo = await AppointmentService.initiatePayment(appointmentId, user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status17.OK,
    message: "Payment initiated successfully",
    data: paymentInfo
  });
});
var AppointmentController = {
  bookAppointment: bookAppointment2,
  getMyAppointments: getMyAppointments2,
  changeAppointmentStatus: changeAppointmentStatus2,
  getMySingleAppointment: getMySingleAppointment2,
  getAllAppointments: getAllAppointments2,
  bookAppointmentWithPayLater: bookAppointmentWithPayLater2,
  initiatePayment: initiatePayment2
};

// src/app/module/appointment/appointment.route.ts
var router9 = Router9();
router9.post("/book-appointment", checkAuth(Role.PATIENT), AppointmentController.bookAppointment);
router9.get("/my-appointments", checkAuth(Role.PATIENT, Role.DOCTOR), AppointmentController.getMyAppointments);
router9.patch("/change-appointment-status/:id", checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN), AppointmentController.changeAppointmentStatus);
router9.get("/my-single-appointment/:id", checkAuth(Role.PATIENT, Role.DOCTOR), AppointmentController.getMySingleAppointment);
router9.get("/all-appointments", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AppointmentController.getAllAppointments);
router9.post("/book-appointment-with-pay-later", checkAuth(Role.PATIENT), AppointmentController.bookAppointmentWithPayLater);
router9.post("/initiate-payment/:id", checkAuth(Role.PATIENT), AppointmentController.initiatePayment);
var AppointmentRoutes = router9;

// src/app/module/patient/patient.route.ts
import { Router as Router10 } from "express";

// src/app/module/patient/patient.controller.ts
import status19 from "http-status";

// src/app/module/patient/patient.service.ts
import status18 from "http-status";

// src/app/module/patient/patient.utils.ts
import { isValid, parse } from "date-fns";
var convertToDateTime = (dateString) => {
  if (!dateString) return void 0;
  const date = parse(dateString, "yyyy-MM-dd", /* @__PURE__ */ new Date());
  if (!isValid(date)) return void 0;
  return date;
};

// src/app/module/patient/patient.constant.ts
var patientSearchableFields = ["name", "email", "contactNumber", "address"];
var patientFilterableFields = [
  "email",
  "contactNumber",
  "isDeleted",
  "patientHealthData.gender",
  "patientHealthData.bloodGroup",
  "patientHealthData.maritalStatus",
  "user.status",
  "user.role"
];
var patientIncludeConfig = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      image: true
    }
  },
  patientHealthData: true,
  medicalReports: true,
  appointments: {
    include: {
      doctor: true,
      schedule: true
    }
  },
  prescriptions: true,
  reviews: true
};

// src/app/module/patient/patient.service.ts
var getAllPatients = async (query) => {
  const queryBuilder = new QueryBuilder(
    prisma.patient,
    query,
    {
      searchableFields: patientSearchableFields,
      filterableFields: patientFilterableFields
    }
  );
  const result = await queryBuilder.search().filter().where({
    isDeleted: false
  }).include({
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true
      }
    },
    patientHealthData: true,
    medicalReports: true
  }).dynamicInclude(patientIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getPatientById = async (id) => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          image: true
        }
      },
      patientHealthData: true,
      medicalReports: true,
      appointments: {
        include: {
          doctor: true,
          schedule: true
        }
      },
      prescriptions: true,
      reviews: true
    }
  });
  if (!result) {
    throw new AppError_default(status18.NOT_FOUND, "Patient not found");
  }
  return result;
};
var updatePatient = async (id, payload) => {
  const isPatientExists = await prisma.patient.findUnique({
    where: { id, isDeleted: false }
  });
  if (!isPatientExists) {
    throw new AppError_default(status18.NOT_FOUND, "Patient not found");
  }
  return await prisma.$transaction(async (tx) => {
    if (payload.name || payload.profilePhoto) {
      await tx.user.update({
        where: { id: isPatientExists.userId },
        data: {
          ...payload.name ? { name: payload.name } : {},
          ...payload.profilePhoto ? { image: payload.profilePhoto } : {}
        }
      });
    }
    const updatedPatient = await tx.patient.update({
      where: { id },
      data: payload,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            image: true
          }
        },
        patientHealthData: true,
        medicalReports: true
      }
    });
    return updatedPatient;
  });
};
var softDeletePatient = async (id) => {
  const isPatientExists = await prisma.patient.findUnique({
    where: { id, isDeleted: false }
  });
  if (!isPatientExists) {
    throw new AppError_default(status18.NOT_FOUND, "Patient not found");
  }
  return await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: isPatientExists.userId },
      data: {
        status: UserStatus.DELETED
      }
    });
    const deletedPatient = await tx.patient.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    return deletedPatient;
  });
};
var updateMyProfile = async (user, payload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    },
    include: {
      patientHealthData: true,
      medicalReports: true
    }
  });
  await prisma.$transaction(async (tx) => {
    if (payload.patientInfo) {
      await tx.patient.update({
        where: {
          id: patientData.id
        },
        data: {
          ...payload.patientInfo
        }
      });
      if (payload.patientInfo.name || payload.patientInfo.profilePhoto) {
        const userData = {
          name: payload.patientInfo.name ? payload.patientInfo.name : patientData.name,
          image: payload.patientInfo.profilePhoto ? payload.patientInfo.profilePhoto : patientData.profilePhoto
        };
        await tx.user.update({
          where: {
            id: patientData.userId
          },
          data: {
            ...userData
          }
        });
      }
    }
    if (payload.patientHealthData) {
      const healthDataToSave = {
        ...payload.patientHealthData
      };
      if (payload.patientHealthData.dateOfBirth) {
        healthDataToSave.dateOfBirth = convertToDateTime(
          typeof healthDataToSave.dateOfBirth === "string" ? healthDataToSave.dateOfBirth : void 0
        );
      }
      await tx.patientHealthData.upsert({
        where: {
          patientId: patientData.id
        },
        update: healthDataToSave,
        create: {
          patientId: patientData.id,
          ...healthDataToSave
        }
      });
    }
    if (payload.medicalReports && Array.isArray(payload.medicalReports) && payload.medicalReports.length > 0) {
      for (const report of payload.medicalReports) {
        if (report.shouldDelete && report.reportId) {
          const deletedReport = await tx.medicalReport.delete({
            where: {
              id: report.reportId
            }
          });
          if (deletedReport.reportLink) {
            await deleteFileFromCloudinary(deletedReport.reportLink);
          }
        } else if (report.reportName && report.reportLink) {
          await tx.medicalReport.create({
            data: {
              patientId: patientData.id,
              reportName: report.reportName,
              reportLink: report.reportLink
            }
          });
        }
      }
    }
  });
  const result = await prisma.patient.findUnique({
    where: {
      id: patientData.id
    },
    include: {
      user: true,
      patientHealthData: true,
      medicalReports: true
    }
  });
  return result;
};
var PatientService = {
  getAllPatients,
  getPatientById,
  updatePatient,
  softDeletePatient,
  updateMyProfile
};

// src/app/module/patient/patient.controller.ts
var getAllPatients2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await PatientService.getAllPatients(query);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Patients fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getPatientById2 = catchAsync(async (req, res) => {
  const result = await PatientService.getPatientById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Patient fetched successfully",
    data: result
  });
});
var updatePatient2 = catchAsync(async (req, res) => {
  const result = await PatientService.updatePatient(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Patient updated successfully",
    data: result
  });
});
var softDeletePatient2 = catchAsync(async (req, res) => {
  const result = await PatientService.softDeletePatient(req.params.id);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result
  });
});
var updateMyProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await PatientService.updateMyProfile(user, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status19.OK,
    message: "Profile updated successfully",
    data: result
  });
});
var PatientController = {
  getAllPatients: getAllPatients2,
  getPatientById: getPatientById2,
  updatePatient: updatePatient2,
  softDeletePatient: softDeletePatient2,
  updateMyProfile: updateMyProfile2
};

// src/app/module/patient/patient.middlewares.ts
var updateMyPatientProfileMiddleware = (req, res, next) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }
  const payload = req.body;
  const files = req.files;
  if (files?.profilePhoto?.[0]) {
    if (!payload.patientInfo) {
      payload.patientInfo = {};
    }
    payload.patientInfo.profilePhoto = files.profilePhoto[0].path;
  }
  if (files?.medicalReports && files?.medicalReports.length > 0) {
    const newReports = files.medicalReports.map((file) => ({
      reportName: file.originalname || `Medical Report - ${(/* @__PURE__ */ new Date()).getTime()}`,
      reportLink: file.path
    }));
    if (payload.medicalReports && Array.isArray(payload.medicalReports)) {
      payload.medicalReports = [...payload.medicalReports, ...newReports];
    } else {
      payload.medicalReports = newReports;
    }
  }
  req.body = payload;
  next();
};

// src/app/module/patient/patient.validation.ts
import z7 from "zod";
var updatePatientProfileZodSchema = z7.object({
  patientInfo: z7.object({
    name: z7.string("Name must be a string").min(1, "Name cannot be empty").max(100, "Name must be less than 100 characters").optional(),
    profilePhoto: z7.url("Profile photo must be a valid URL").optional(),
    contactNumber: z7.string("Contact number must be a string").min(1, "Contact number cannot be empty").max(20, "Contact number must be less than 20 characters").optional(),
    address: z7.string("Address must be a string").min(1, "Address cannot be empty").max(200, "Address must be less than 200 characters").optional()
  }).optional(),
  patientHealthData: z7.object({
    gender: z7.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER]).optional(),
    dateOfBirth: z7.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    }).optional(),
    bloodGroup: z7.enum([BloodGroup.A_POSITIVE, BloodGroup.A_NEGATIVE, BloodGroup.B_POSITIVE, BloodGroup.B_NEGATIVE, BloodGroup.AB_POSITIVE, BloodGroup.AB_NEGATIVE, BloodGroup.O_POSITIVE, BloodGroup.O_NEGATIVE]).optional(),
    hasAllergies: z7.boolean().optional(),
    hasDiabetes: z7.boolean().optional(),
    height: z7.string().optional(),
    weight: z7.string().optional(),
    smokingStatus: z7.boolean().optional(),
    dietaryPreferences: z7.string().optional(),
    pregnancyStatus: z7.boolean().optional(),
    mentalHealthHistory: z7.string().optional(),
    immunizationStatus: z7.string().optional(),
    hasPastSurgeries: z7.boolean().optional(),
    recentAnxiety: z7.boolean().optional(),
    recentDepression: z7.boolean().optional(),
    maritalStatus: z7.string().optional()
  }).optional(),
  medicalReports: z7.array(z7.object({
    shouldDelete: z7.boolean().optional(),
    reportId: z7.uuid().optional(),
    reportName: z7.string().optional(),
    reportLink: z7.url().optional()
  })).optional().refine((reports) => {
    if (!reports || reports.length === 0) return true;
    for (const report of reports) {
      if (report.shouldDelete === true && !report.reportId) {
        return false;
      }
      if (report.reportId && !report.shouldDelete) {
        return false;
      }
      if (report.reportName && !report.reportLink) {
        return false;
      }
      if (report.reportLink && !report.reportName) {
        return false;
      }
      return true;
    }
  }, {
    message: "Invalid medical report data. If shouldDelete is true, reportId must be provided. If reportId is provided, shouldDelete must be true. If reportName is provided, reportLink must also be provided and vice versa."
  })
});
var updatePatientZodSchema = z7.object({
  name: z7.string().optional(),
  contactNumber: z7.string().optional(),
  address: z7.string().optional(),
  profilePhoto: z7.string().optional()
});
var PatientValidation = {
  updatePatientProfileZodSchema,
  updatePatientZodSchema
};

// src/app/module/patient/patient.route.ts
var router10 = Router10();
router10.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR),
  PatientController.getAllPatients
);
router10.patch(
  "/update-my-profile",
  checkAuth(Role.PATIENT),
  multerUpload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "medicalReports", maxCount: 5 }
  ]),
  updateMyPatientProfileMiddleware,
  validateRequest(PatientValidation.updatePatientProfileZodSchema),
  PatientController.updateMyProfile
);
router10.get(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  PatientController.getPatientById
);
router10.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(PatientValidation.updatePatientZodSchema),
  PatientController.updatePatient
);
router10.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  PatientController.softDeletePatient
);
var PatientRoutes = router10;

// src/app/module/prescription/prescription.route.ts
import express from "express";

// src/app/module/prescription/prescription.controller.ts
import httpStatus from "http-status";

// src/app/module/prescription/prescription.service.ts
import status20 from "http-status";

// src/app/module/prescription/prescription.utils.ts
import PDFDocument from "pdfkit";
var generatePrescriptionPDF = async (prescriptionData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50
      });
      const chunks = [];
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on("error", (error) => {
        reject(error);
      });
      doc.fontSize(24).font("Helvetica-Bold").text("PRESCRIPTION", {
        align: "center"
      });
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica").text("PH Healthcare Services", {
        align: "center"
      });
      doc.text("Your Health, Our Priority", { align: "center" });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").text("Doctor Information");
      doc.fontSize(10).font("Helvetica").text(`Name: ${prescriptionData.doctorName}`).text(`Email: ${prescriptionData.doctorEmail}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Patient Information");
      doc.fontSize(10).font("Helvetica").text(`Name: ${prescriptionData.patientName}`).text(`Email: ${prescriptionData.patientEmail}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Prescription Details");
      doc.fontSize(10).font("Helvetica").text(`Prescription ID: ${prescriptionData.prescriptionId}`).text(`Appointment Date: ${new Date(prescriptionData.appointmentDate).toLocaleDateString()}`).text(`Issued Date: ${new Date(prescriptionData.createdAt).toLocaleDateString()}`);
      if (prescriptionData.followUpDate) {
        doc.text(
          `Follow-up Date: ${new Date(prescriptionData.followUpDate).toLocaleDateString()}`
        );
      }
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").text("Instructions");
      doc.fontSize(10).font("Helvetica");
      doc.text(prescriptionData.instructions, {
        align: "left",
        width: 445
      });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(9).font("Helvetica").text(
        "This is an electronically generated prescription. Please follow all instructions provided by your doctor.",
        {
          align: "center"
        }
      );
      doc.text(`For more information, visit: ${envVars.FRONTEND_URL}`, {
        align: "center"
      });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// src/app/module/prescription/prescription.service.ts
var givePrescription = async (user, payload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email
    }
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId
    },
    include: {
      patient: true,
      doctor: {
        include: {
          specialties: true
        }
      },
      schedule: {
        include: {
          doctorSchedules: true
        }
      }
    }
  });
  if (appointmentData.doctorId !== doctorData.id) {
    throw new AppError_default(status20.BAD_REQUEST, "You can only give prescription for your own appointments");
  }
  const isAlreadyPrescribed = await prisma.prescription.findFirst({
    where: {
      appointmentId: payload.appointmentId
    }
  });
  if (isAlreadyPrescribed) {
    throw new AppError_default(status20.BAD_REQUEST, "You have already given prescription for this appointment. You can update the prescription instead.");
  }
  const followUpDate = new Date(payload.followUpDate);
  const result = await prisma.$transaction(async (tx) => {
    const result2 = await tx.prescription.create({
      data: {
        ...payload,
        followUpDate,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId
      }
    });
    const pdfBuffer = await generatePrescriptionPDF({
      doctorName: doctorData.name,
      patientName: appointmentData.patient.name,
      appointmentDate: appointmentData.schedule.startDateTime,
      instructions: payload.instructions,
      followUpDate,
      doctorEmail: doctorData.email,
      patientEmail: appointmentData.patient.email,
      prescriptionId: result2.id,
      createdAt: /* @__PURE__ */ new Date()
    });
    const fileName = `Prescription-${Date.now()}.pdf`;
    const uploadedFile = await uploadFileToCloudinary(pdfBuffer, fileName);
    const pdfUrl = uploadedFile.secure_url;
    const updatedPrescription = await tx.prescription.update({
      where: {
        id: result2.id
      },
      data: {
        pdfUrl
      }
    });
    try {
      const patient = appointmentData.patient;
      const doctor = appointmentData.doctor;
      await sendEmail({
        to: patient.email,
        subject: `You have received a new prescription from Dr. ${doctor.name}`,
        templateName: "prescription",
        templateData: {
          doctorName: doctor.name,
          patientName: patient.name,
          specialization: doctor.specialties.map((s) => s.title).join(", "),
          appointmentDate: new Date(appointmentData.schedule.startDateTime).toLocaleString(),
          issuedDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          prescriptionId: result2.id,
          instructions: payload.instructions,
          followUpDate: followUpDate.toLocaleDateString(),
          pdfUrl
        },
        attachments: [
          {
            filename: fileName,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      });
    } catch (error) {
      console.error("Failed to send email notification for prescription:", error);
    }
    return updatedPrescription;
  }, {
    maxWait: 15e3,
    timeout: 2e4
  });
  return result;
};
var myPrescriptions = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user?.email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status20.NOT_FOUND, "User not found");
  }
  if (isUserExists.role === Role.DOCTOR) {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        doctor: {
          email: user?.email
        }
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true
      }
    });
    return prescriptions;
  }
  if (isUserExists.role === Role.PATIENT) {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patient: {
          email: user?.email
        }
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true
      }
    });
    return prescriptions;
  }
};
var getAllPrescriptions = async () => {
  const result = await prisma.prescription.findMany({
    include: {
      patient: true,
      doctor: true,
      appointment: true
    }
  });
  return result;
};
var updatePrescription = async (user, prescriptionId, payload) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user?.email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status20.NOT_FOUND, "User not found");
  }
  const prescriptionData = await prisma.prescription.findUniqueOrThrow({
    where: {
      id: prescriptionId
    },
    include: {
      doctor: true,
      patient: true,
      appointment: {
        include: {
          schedule: true
        }
      }
    }
  });
  if (!(user?.email === prescriptionData.doctor.email)) {
    throw new AppError_default(status20.BAD_REQUEST, "This is not your prescription!");
  }
  const updatedInstructions = payload.instructions || prescriptionData.instructions;
  const updatedFollowUpDate = payload.followUpDate ? new Date(payload.followUpDate) : prescriptionData.followUpDate;
  const pdfBuffer = await generatePrescriptionPDF({
    doctorName: prescriptionData.doctor.name,
    doctorEmail: prescriptionData.doctor.email,
    patientName: prescriptionData.patient.name,
    patientEmail: prescriptionData.patient.email,
    appointmentDate: prescriptionData.appointment.schedule.startDateTime,
    instructions: updatedInstructions,
    followUpDate: updatedFollowUpDate,
    prescriptionId: prescriptionData.id,
    createdAt: prescriptionData.createdAt
  });
  const fileName = `prescription-updated-${Date.now()}.pdf`;
  const uploadedFile = await uploadFileToCloudinary(pdfBuffer, fileName);
  const newPdfUrl = uploadedFile.secure_url;
  if (prescriptionData.pdfUrl) {
    try {
      await deleteFileFromCloudinary(prescriptionData.pdfUrl);
    } catch (deleteError) {
      console.error("Failed to delete old PDF from Cloudinary:", deleteError);
    }
  }
  const result = await prisma.prescription.update({
    where: {
      id: prescriptionId
    },
    data: {
      instructions: updatedInstructions,
      followUpDate: updatedFollowUpDate,
      pdfUrl: newPdfUrl
    },
    include: {
      patient: true,
      doctor: true,
      appointment: {
        include: {
          schedule: true
        }
      }
    }
  });
  try {
    await sendEmail({
      to: result.patient.email,
      subject: `Your Prescription has been Updated by ${result.doctor.name}`,
      templateName: "prescription",
      templateData: {
        patientName: result.patient.name,
        doctorName: result.doctor.name,
        specialization: "Healthcare Provider",
        prescriptionId: result.id,
        appointmentDate: new Date(result.appointment.schedule.startDateTime).toLocaleString(),
        issuedDate: new Date(result.createdAt).toLocaleDateString(),
        followUpDate: new Date(result.followUpDate).toLocaleDateString(),
        instructions: result.instructions,
        pdfUrl: newPdfUrl
      },
      attachments: [
        {
          filename: `Prescription-${result.id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    });
  } catch (emailError) {
    console.error("Failed to send updated prescription email:", emailError);
  }
  return result;
};
var deletePrescription = async (user, prescriptionId) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user?.email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status20.NOT_FOUND, "User not found");
  }
  const prescriptionData = await prisma.prescription.findUniqueOrThrow({
    where: {
      id: prescriptionId
    },
    include: {
      doctor: true
    }
  });
  if (!(user?.email === prescriptionData.doctor.email)) {
    throw new AppError_default(status20.BAD_REQUEST, "This is not your prescription!");
  }
  if (prescriptionData.pdfUrl) {
    try {
      await deleteFileFromCloudinary(prescriptionData.pdfUrl);
    } catch (deleteError) {
      console.error("Failed to delete PDF from Cloudinary:", deleteError);
    }
  }
  await prisma.prescription.delete({
    where: {
      id: prescriptionId
    }
  });
};
var PrescriptionService = {
  givePrescription,
  myPrescriptions,
  getAllPrescriptions,
  updatePrescription,
  deletePrescription
};

// src/app/module/prescription/prescription.controller.ts
var givePrescription2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const result = await PrescriptionService.givePrescription(user, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescription created successfully",
    data: result
  });
});
var myPrescriptions2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await PrescriptionService.myPrescriptions(user);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescription fetched successfully",
    data: result
  });
});
var getAllPrescriptions2 = catchAsync(async (req, res) => {
  const result = await PrescriptionService.getAllPrescriptions();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescriptions retrieval successfully",
    data: result
  });
});
var updatePrescription2 = catchAsync(async (req, res) => {
  const user = req.user;
  const prescriptionId = req.params.id;
  const payload = req.body;
  const result = await PrescriptionService.updatePrescription(user, prescriptionId, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescription updated successfully",
    data: result
  });
});
var deletePrescription2 = catchAsync(async (req, res) => {
  const user = req.user;
  const prescriptionId = req.params.id;
  await PrescriptionService.deletePrescription(user, prescriptionId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Prescription deleted successfully"
  });
});
var PrescriptionController = {
  givePrescription: givePrescription2,
  myPrescriptions: myPrescriptions2,
  getAllPrescriptions: getAllPrescriptions2,
  updatePrescription: updatePrescription2,
  deletePrescription: deletePrescription2
};

// src/app/module/prescription/prescription.validation.ts
import { z as z8 } from "zod";
var createPrescriptionZodSchema = z8.object({
  appointmentId: z8.string("Appointment ID is required"),
  instructions: z8.string("Instructions is required").min(1, "Instructions cannot be empty"),
  followUpDate: z8.string("Follow-up date must be a valid date").optional()
});
var updatePrescriptionZodSchema = z8.object({
  instructions: z8.string("Instructions is required").min(1, "Instructions cannot be empty").optional(),
  followUpDate: z8.string("Follow-up date must be a valid date").optional()
});
var PrescriptionValidation = {
  createPrescriptionZodSchema,
  updatePrescriptionZodSchema
};

// src/app/module/prescription/prescription.route.ts
var router11 = express.Router();
router11.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  PrescriptionController.getAllPrescriptions
);
router11.get(
  "/my-prescriptions",
  checkAuth(Role.PATIENT, Role.DOCTOR),
  PrescriptionController.myPrescriptions
);
router11.post(
  "/",
  checkAuth(Role.DOCTOR),
  validateRequest(PrescriptionValidation.createPrescriptionZodSchema),
  PrescriptionController.givePrescription
);
router11.patch(
  "/:id",
  checkAuth(Role.DOCTOR),
  validateRequest(PrescriptionValidation.updatePrescriptionZodSchema),
  PrescriptionController.updatePrescription
);
router11.delete(
  "/:id",
  checkAuth(Role.DOCTOR),
  PrescriptionController.deletePrescription
);
var PrescriptionRoutes = router11;

// src/app/module/review/review.route.ts
import express2 from "express";

// src/app/module/review/review.controller.ts
import httpStatus2 from "http-status";

// src/app/module/review/review.service.ts
import status21 from "http-status";
var giveReview = async (user, payload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId
    }
  });
  if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError_default(status21.BAD_REQUEST, "You can only review after payment is done");
  }
  ;
  if (appointmentData.patientId !== patientData.id) {
    throw new AppError_default(status21.BAD_REQUEST, "You can only review for your own appointments");
  }
  ;
  const isReviewed = await prisma.review.findFirst({
    where: {
      appointmentId: payload.appointmentId
    }
  });
  if (isReviewed) {
    throw new AppError_default(status21.BAD_REQUEST, "You have already reviewed for this appointment. You can update your review instead.");
  }
  ;
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        ...payload,
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId
      }
    });
    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: appointmentData.doctorId
      },
      _avg: {
        rating: true
      }
    });
    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId
      },
      data: {
        averageRating: averageRating._avg.rating
      }
    });
    return review;
  });
  return result;
};
var getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      doctor: true,
      patient: true,
      appointment: true
    }
  });
  return reviews;
};
var myReviews = async (user) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: user?.email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status21.BAD_REQUEST, "Only patients can view their reviews");
  }
  if (isUserExist.role === Role.DOCTOR) {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: user?.email
      }
    });
    return await prisma.review.findMany({
      where: {
        doctorId: doctorData.id
      },
      include: {
        patient: true,
        appointment: true
      }
    });
  }
  if (isUserExist.role === Role.PATIENT) {
    const patientData = await prisma.patient.findUniqueOrThrow({
      where: {
        email: user?.email
      }
    });
    return await prisma.review.findMany({
      where: {
        patientId: patientData.id
      },
      include: {
        doctor: true,
        appointment: true
      }
    });
  }
};
var updateReview = async (user, reviewId, payload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email
    }
  });
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId
    }
  });
  if (!(patientData.id === reviewData.patientId)) {
    throw new AppError_default(status21.BAD_REQUEST, "This is not your review!");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: {
        id: reviewId
      },
      data: {
        ...payload
      }
    });
    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: reviewData.doctorId
      },
      _avg: {
        rating: true
      }
    });
    await tx.doctor.update({
      where: {
        id: updatedReview.doctorId
      },
      data: {
        averageRating: averageRating._avg.rating
      }
    });
    return updatedReview;
  });
  return result;
};
var deleteReview = async (user, reviewId) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email
    }
  });
  const reviewData = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId
    }
  });
  if (!(patientData.id === reviewData.patientId)) {
    throw new AppError_default(status21.BAD_REQUEST, "This is not your review!");
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedReview = await tx.review.delete({
      where: {
        id: reviewId
      }
    });
    const averageRating = await tx.review.aggregate({
      where: {
        doctorId: deletedReview.doctorId
      },
      _avg: {
        rating: true
      }
    });
    await tx.doctor.update({
      where: {
        id: deletedReview.doctorId
      },
      data: {
        averageRating: averageRating._avg.rating
      }
    });
    return deletedReview;
  });
  return result;
};
var ReviewService = {
  giveReview,
  getAllReviews,
  myReviews,
  updateReview,
  deleteReview
};

// src/app/module/review/review.controller.ts
var giveReview2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const result = await ReviewService.giveReview(user, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var getAllReviews2 = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllReviews();
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Reviews retrieval successfully",
    data: result
  });
});
var myReviews2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await ReviewService.myReviews(user);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Reviews retrieval successfully",
    data: result
  });
});
var updateReview2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const reviewId = req.params.id;
    const payload = req.body;
    const result = await ReviewService.updateReview(user, reviewId, payload);
    sendResponse(res, {
      httpStatusCode: httpStatus2.OK,
      success: true,
      message: "Review updated successfully",
      data: result
    });
  }
);
var deleteReview2 = catchAsync(async (req, res) => {
  const user = req.user;
  const reviewId = req.params.id;
  const result = await ReviewService.deleteReview(user, reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var ReviewController = {
  giveReview: giveReview2,
  getAllReviews: getAllReviews2,
  myReviews: myReviews2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/app/module/review/review.validation.ts
import { z as z9 } from "zod";
var createReviewZodSchema = z9.object({
  appointmentId: z9.string("Appointment ID is required"),
  rating: z9.number("Rating is required").min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
  comment: z9.string("Comment is required").min(1, "Comment cannot be empty")
});
var updateReviewZodSchema = z9.object({
  rating: z9.number("Rating is required").min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5").optional(),
  comment: z9.string("Comment is required").min(1, "Comment cannot be empty").optional()
});
var ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema
};

// src/app/module/review/review.route.ts
var router12 = express2.Router();
router12.get("/", ReviewController.getAllReviews);
router12.post(
  "/",
  checkAuth(Role.PATIENT),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.giveReview
);
router12.get("/my-reviews", checkAuth(Role.PATIENT, Role.DOCTOR), ReviewController.myReviews);
router12.patch("/:id", checkAuth(Role.PATIENT), validateRequest(ReviewValidation.updateReviewZodSchema), ReviewController.updateReview);
router12.delete("/:id", checkAuth(Role.PATIENT), ReviewController.deleteReview);
var ReviewRoutes = router12;

// src/app/module/payment/payment.route.ts
import { Router as Router11 } from "express";

// src/app/module/payment/payment.controller.ts
import httpStatus3 from "http-status";

// src/app/module/payment/payment.utils.ts
import PDFDocument2 from "pdfkit";
var generateInvoicePdf = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument2({
        size: "A4",
        margin: 50
      });
      const chunks = [];
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on("error", (error) => {
        reject(error);
      });
      doc.fontSize(24).font("Helvetica-Bold").text("INVOICE", {
        align: "center"
      });
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica").text("PH Healthcare Services", {
        align: "center"
      });
      doc.text("Your Health, Our Priority", { align: "center" });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").text("Invoice Information");
      doc.fontSize(10).font("Helvetica").text(`Invoice ID: ${data.invoiceId}`).text(`Payment Date: ${new Date(data.paymentDate).toLocaleDateString()}`).text(`Transaction ID: ${data.transactionId}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Patient Information");
      doc.fontSize(10).font("Helvetica").text(`Name: ${data.patientName}`).text(`Email: ${data.patientEmail}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Doctor Information");
      doc.fontSize(10).font("Helvetica").text(`Name: ${data.doctorName}`);
      doc.moveDown(0.8);
      doc.fontSize(11).font("Helvetica-Bold").text("Appointment Details");
      doc.fontSize(10).font("Helvetica").text(`Appointment Date: ${new Date(data.appointmentDate).toLocaleDateString()}`);
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      const tableTop = doc.y;
      const col1X = 50;
      const col2X = 450;
      doc.fontSize(11).font("Helvetica-Bold").text("Payment Summary", col1X, tableTop);
      doc.moveDown(0.8);
      const headerY = doc.y;
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("Description", col1X, headerY);
      doc.text("Amount", col2X, headerY, { align: "right" });
      doc.moveTo(col1X, doc.y).lineTo(col2X + 80, doc.y).stroke();
      doc.moveDown(0.5);
      const amountY = doc.y;
      doc.fontSize(10).font("Helvetica");
      doc.text("Consultation Fee", col1X, amountY);
      doc.text(`${data.amount.toFixed(2)} BDT`, col2X, amountY, { align: "right" });
      doc.moveDown(0.8);
      const totalY = doc.y;
      doc.fontSize(11).font("Helvetica-Bold");
      doc.text("Total Amount", col1X, totalY);
      doc.text(`${data.amount.toFixed(2)} BDT`, col2X, totalY, { align: "right" });
      doc.moveTo(col1X, doc.y).lineTo(col2X + 80, doc.y).stroke();
      doc.moveDown(1.5);
      doc.fontSize(9).font("Helvetica").text(
        "Thank you for choosing PH Healthcare. This is an electronically generated invoice.",
        {
          align: "center"
        }
      );
      doc.text("If you have any questions, please contact us at support@ph-healthcare.com", {
        align: "center"
      });
      doc.text("Payment processed securely through Stripe", {
        align: "center"
      });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// src/app/module/payment/payment.service.ts
var handleStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;
      if (!appointmentId || !paymentId) {
        console.error("\u26A0\uFE0F Missing metadata in webhook event");
        return { message: "Missing metadata" };
      }
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
        console.error(`\u26A0\uFE0F Appointment ${appointmentId} not found. Payment may be for expired appointment.`);
        return { message: "Appointment not found" };
      }
      let pdfBuffer = null;
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
        if (session.payment_status === "paid") {
          try {
            pdfBuffer = await generateInvoicePdf({
              invoiceId: appointment.payment?.id || paymentId,
              patientName: appointment.patient.name,
              patientEmail: appointment.patient.email,
              doctorName: appointment.doctor.name,
              appointmentDate: appointment.schedule.startDateTime.toString(),
              amount: appointment.payment?.amount || 0,
              transactionId: appointment.payment?.transactionId || "",
              paymentDate: (/* @__PURE__ */ new Date()).toISOString()
            });
            const cloudinaryResponse = await uploadFileToCloudinary(
              pdfBuffer,
              `ph-healthcare/invoices/invoice-${paymentId}-${Date.now()}.pdf`
            );
            invoiceUrl = cloudinaryResponse?.secure_url;
          } catch (pdfError) {
            console.error("\u274C Error generating/uploading invoice PDF:", pdfError);
          }
        }
        const updatedPayment = await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: session,
            invoiceUrl,
            // Store invoice URL
            stripeEventId: event.id
            // Store event ID for idempotency
          }
        });
        return { updatedAppointment, updatedPayment, invoiceUrl };
      });
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
              paymentDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
              doctorName: appointment.doctor.name,
              appointmentDate: new Date(appointment.schedule.startDateTime).toLocaleDateString(),
              amount: appointment.payment?.amount || 0,
              invoiceUrl: result.invoiceUrl
            },
            attachments: [
              {
                filename: `Invoice-${paymentId}.pdf`,
                content: pdfBuffer || Buffer.from(""),
                // Attach PDF if generated, else empty buffer
                contentType: "application/pdf"
              }
            ]
          });
        } catch (emailError) {
          console.error("\u274C Error sending invoice email:", emailError);
        }
      }
      break;
    }
    case "checkout.session.expired": {
      break;
    }
    case "payment_intent.payment_failed": {
      break;
    }
    default:
      break;
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var getAllPayments = async () => {
  const payments = await prisma.payment.findMany({
    include: {
      appointment: {
        include: {
          patient: true,
          doctor: true,
          schedule: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return payments;
};
var confirmPayment = async (payload) => {
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
        ...paymentId ? [{ id: paymentId }] : [],
        ...appointmentId ? [{ appointmentId }] : [],
        ...transactionId ? [{ transactionId }] : []
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
        paymentGatewayData: paymentGatewayData || { paymentMethod: "STRIPE", settledAt: (/* @__PURE__ */ new Date()).toISOString() }
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
};
var PaymentService = {
  handleStripeWebhookEvent,
  getAllPayments,
  confirmPayment
};

// src/app/module/payment/payment.controller.ts
var handleStripeWebhookEvent2 = catchAsync(async (req, res) => {
  const signature = req.headers[`stripe-signature`];
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return res.status(httpStatus3.BAD_REQUEST).json({ message: "missing webhook signature or secret" });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error(`Error processing stripe webhook signature:`, error);
    return res.status(httpStatus3.BAD_REQUEST).json({ message: "error processing stripe webhook" });
  }
  try {
    const result = await PaymentService.handleStripeWebhookEvent(event);
    sendResponse(
      res,
      {
        httpStatusCode: httpStatus3.OK,
        success: true,
        message: "stripe webhook event processed successfully",
        data: result
      }
    );
  } catch (error) {
    console.error(`Error processing stripe webhook event:`, error);
    sendResponse(res, {
      httpStatusCode: httpStatus3.INTERNAL_SERVER_ERROR,
      success: false,
      message: "error processing stripe webhook event"
    });
  }
});
var getAllPayments2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPayments();
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result
  });
});
var confirmPayment2 = catchAsync(async (req, res) => {
  const result = await PaymentService.confirmPayment(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Payment confirmed successfully",
    data: result
  });
});
var PaymentControler = {
  handleStripeWebhookEvent: handleStripeWebhookEvent2,
  getAllPayments: getAllPayments2,
  confirmPayment: confirmPayment2
};

// src/app/module/payment/payment.route.ts
var router13 = Router11();
router13.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT, Role.DOCTOR), PaymentControler.getAllPayments);
router13.post("/confirm-payment", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT), PaymentControler.confirmPayment);
var paymentRoutes = router13;

// src/app/module/stats/stats.route.ts
import express3 from "express";

// src/app/module/stats/stats.controller.ts
import status23 from "http-status";

// src/app/module/stats/stats.service.ts
import status22 from "http-status";
var getDashboardStatsData = async (user) => {
  let statsData;
  switch (user.role) {
    case Role.SUPER_ADMIN:
      statsData = getSuperAdminStatsData();
      break;
    case Role.ADMIN:
      statsData = getAdminStatsData();
      break;
    case Role.DOCTOR:
      statsData = getDoctorStatsData(user);
      break;
    case Role.PATIENT:
      statsData = getPatientStatsData(user);
      break;
    default:
      throw new AppError_default(status22.BAD_REQUEST, "Invalid user role");
  }
  return statsData;
};
var getSuperAdminStatsData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const superAdminCount = await prisma.admin.count({
    where: {
      user: {
        role: Role.SUPER_ADMIN
      }
    }
  });
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();
  const userCount = await prisma.user.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID
    }
  });
  const pieChartData = await getPieChartData();
  const barChartData = await getBarChartData();
  return {
    appointmentCount,
    doctorCount,
    patientCount,
    superAdminCount,
    adminCount,
    paymentCount,
    userCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    pieChartData,
    barChartData
  };
};
var getAdminStatsData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const paymentCount = await prisma.payment.count();
  const userCount = await prisma.user.count();
  const adminCount = await prisma.admin.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID
    }
  });
  const pieChartData = await getPieChartData();
  const barChartData = await getBarChartData();
  return {
    appointmentCount,
    doctorCount,
    patientCount,
    paymentCount,
    userCount,
    adminCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    pieChartData,
    barChartData
  };
};
var getDoctorStatsData = async (user) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id
    }
  });
  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true
    },
    where: {
      doctorId: doctorData.id
    }
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id
    }
  });
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      appointment: {
        doctorId: doctorData.id
      },
      status: PaymentStatus.PAID
    }
  });
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true
    },
    where: {
      doctorId: doctorData.id
    }
  });
  const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ _count, status: status29 }) => ({
    status: status29,
    count: _count.id
  }));
  return {
    reviewCount,
    patientCount: patientCount.length,
    appointmentCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    appointmentStatusDistribution: formattedAppointmentStatusDistribution
  };
};
var getPatientStatsData = async (user) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id
    }
  });
  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id
    }
  });
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true
    },
    where: {
      patientId: patientData.id
    }
  });
  const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ _count, status: status29 }) => ({
    status: status29,
    count: _count.id
  }));
  return {
    appointmentCount,
    reviewCount,
    appointmentStatusDistribution: formattedAppointmentStatusDistribution
  };
};
var getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true
    }
  });
  const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ _count, status: status29 }) => ({
    status: status29,
    count: _count.id
  }));
  return formattedAppointmentStatusDistribution;
};
var getBarChartData = async () => {
  const appointmentCountByMonth = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC;
    `;
  return appointmentCountByMonth;
};
var StatsService = {
  getDashboardStatsData
};

// src/app/module/stats/stats.controller.ts
var getDashboardStatsData2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await StatsService.getDashboardStatsData(user);
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Stats data retrieved successfully!",
    data: result
  });
});
var StatsController = {
  getDashboardStatsData: getDashboardStatsData2
};

// src/app/module/stats/stats.route.ts
var router14 = express3.Router();
router14.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  StatsController.getDashboardStatsData
);
var StatsRoutes = router14;

// src/app/module/rag/rag.route.ts
import { Router as Router12 } from "express";

// src/app/module/rag/embeddingService.ts
var EmbeddingService = class {
  apiKey;
  apiUrl = "https://openrouter.ai/api/v1";
  embeddingModel;
  constructor() {
    this.apiKey = envVars.RAG.OPENROUTER_API_KEY || "";
    this.embeddingModel = envVars.RAG.OPENROUTER_EMBEDDING_MODEL || "nvidia/nemotron-3-embed-1b:free";
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not set in env");
    }
  }
  async generateEmbeddings(text) {
    try {
      const response = await fetch(`${this.apiUrl}/embeddings`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: text,
          model: this.embeddingModel
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error("No embedding data returned from OpenRouter");
      }
      return data.data[0].embedding;
    } catch (error) {
      console.error("Failed to generate embeddings:", error);
      throw error;
    }
  }
};

// src/app/module/rag/indexingService.ts
var toVectorLiteral = (vector) => `[${vector.join(",")}]`;
var IndexingService = class {
  embeddingService;
  constructor() {
    this.embeddingService = new EmbeddingService();
  }
  async indexDocument(chunkKey, sourceType, sourceId, sourceLevel, content, metadata) {
    try {
      const embedding = await this.embeddingService.generateEmbeddings(content);
      const vectorLiteral = toVectorLiteral(embedding);
      await prisma.$executeRaw(prismaNamespace_exports.sql`
        INSERT INTO "document_embedding"
        (
          "id",
          "chunkKey",
          "sourceType",
          "sourceId",
          "sourceLevel",
          "content",
          "metadata",
          "embedding",
          "updatedAt"
        )
        VALUES
        (
          ${prismaNamespace_exports.raw("gen_random_uuid()")},
          ${chunkKey},
          ${sourceType},
          ${sourceId},
          ${sourceLevel || null},
          ${content},
          ${JSON.stringify(metadata || {})} :: jsonb,
          CAST(${vectorLiteral} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
          "sourceType" = EXCLUDED."sourceType",
          "sourceId" = EXCLUDED."sourceId",
          "sourceLevel" = EXCLUDED."sourceLevel",
          "content" = EXCLUDED."content",
          "metadata" = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW()
        `);
    } catch (error) {
      console.error("Failed to index document:", error);
      throw error;
    }
  }
  async indexDoctorData() {
    try {
      const doctors = await prisma.doctor.findMany({
        where: {
          isDeleted: false
        },
        include: {
          specialties: {
            include: {
              specialty: true
            }
          },
          reviews: true
        }
      });
      let indexCount = 0;
      for (const doctor of doctors) {
        const specialtiesList = doctor.specialties.map((ds) => ds.specialty?.title).filter(Boolean).join(", ");
        const reviewsText = doctor.reviews.map((r) => `- Rating: ${r.rating}/5. Comments: ${r.comments || "No comments"}`).join("\n");
        const content = `Doctor Name: ${doctor.name}
Experience: ${doctor.experience} years
Qualification: ${doctor.qualification}
Designation: ${doctor.designation}
Appointment Fee: $${doctor.appointmentFee}
Current Working Place: ${doctor.currentWorkingPlace}
Average Rating: ${doctor.averageRating}/5
Specialties: ${specialtiesList || "None listed"}

Patient Reviews:
${reviewsText || "No reviews yet."}`;
        const metadata = {
          doctorId: doctor.id,
          name: doctor.name,
          specialties: doctor.specialties.map((ds) => ds.specialty?.title).filter(Boolean),
          averageRating: doctor.averageRating,
          experience: doctor.experience
        };
        const chunkKey = `doctor-${doctor.id}`;
        await this.indexDocument(
          chunkKey,
          "DOCTOR",
          doctor.id,
          doctor.name,
          content,
          metadata
        );
        indexCount++;
      }
      return {
        success: true,
        message: `Successfully indexed ${indexCount} doctors.`,
        indexCount
      };
    } catch (error) {
      console.error("Indexing failed:", error);
      throw error;
    }
  }
};

// src/app/module/rag/llm.service.ts
var LlmService = class {
  apiKey;
  apiUrl = "https://openrouter.ai/api/v1";
  model;
  constructor() {
    this.apiKey = envVars.RAG.OPENROUTER_API_KEY || "";
    this.model = envVars.RAG.OPENROUTER_LLM_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
    if (!this.apiKey) {
      throw new Error("OpenRouter API key or model is not configured");
    }
  }
  async generateResponse(prompt, context = [], asJson = false) {
    try {
      let fullPrompt = context.length > 0 ? `Context information:
${context.join("\n\n")}

Question: ${prompt}

Answer based on the context above.` : prompt;
      if (asJson) {
        fullPrompt += `

Return ONLY a valid JSON object matching this structure: {"doctors": [{"name": "Doctor Name", "reason": "Why they are suitable", "specialty": "Their specialty"}]}. Do not include any markdown formatting like \`\`\`json.`;
      }
      const systemMessage = asJson ? "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. You MUST respond with ONLY valid JSON format. Do not include markdown tags." : "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. If the context does not contain the answer, say you don't have enough information.";
      const bodyPayload = {
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        temperature: 0.1,
        // Lower temperature for more deterministic JSON
        max_tokens: 1500
      };
      if (asJson && (this.model.includes("gpt") || this.model.includes("openai"))) {
        bodyPayload.response_format = { type: "json_object" };
      }
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://healthcare-management.local",
          "X-Title": "Healthcare Management System"
        },
        body: JSON.stringify(bodyPayload)
      });
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `OpenRouter API returned invalid JSON (${response.status}): ${responseText.slice(0, 300)}`
        );
      }
      if (!response.ok) {
        const errorMessage = data?.error?.message || data?.message || response.statusText || "unknown error";
        throw new Error(`OpenRouter API error: ${response.status} - ${errorMessage}`);
      }
      if (data?.error) {
        const errorMessage = typeof data.error === "string" ? data.error : data.error.message || JSON.stringify(data.error);
        throw new Error(`OpenRouter API error: ${errorMessage}`);
      }
      if (!data?.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new Error(`OpenRouter API returned no choices: ${JSON.stringify(data)}`);
      }
      const content = data.choices[0]?.message?.content;
      if (content === void 0 || content === null) {
        throw new Error(
          `OpenRouter API message content is missing: ${JSON.stringify(data.choices[0])}`
        );
      }
      return content;
    } catch (error) {
      console.error("LLM Service Error:", error);
      throw error;
    }
  }
};

// src/app/module/rag/rag.service.ts
var RAGService = class {
  embeddingService;
  llmService;
  indexingService;
  constructor() {
    this.embeddingService = new EmbeddingService();
    this.llmService = new LlmService();
    this.indexingService = new IndexingService();
  }
  async ingestDoctorData() {
    return this.indexingService.indexDoctorData();
  }
  async retrieveReleventDocs(query, limit = 5, sourceType) {
    try {
      const queryEmbedding = await this.embeddingService.generateEmbeddings(query);
      const vectorLiteral = `[${queryEmbedding.join(",")}]`;
      const results = await prisma.$queryRaw(prismaNamespace_exports.sql`
          SELECT id, "chunkKey", "sourceType", "sourceId", "sourceLevel", content, metadata, embedding, "isDeleted", "deletedAt", "createdAt", "updatedAt", 1 - (embedding <=> CAST(${vectorLiteral} AS vector)) as similarity
          FROM "document_embedding"
          WHERE "isDeleted" = false
          ${sourceType ? prismaNamespace_exports.sql`AND "sourceType" = ${sourceType}` : prismaNamespace_exports.empty}
          ORDER BY embedding <=> CAST(${vectorLiteral} AS vector)
          Limit ${limit}
          `);
      return results;
    } catch (error) {
      console.error("Error retrieving relevant docs:", error);
      return [];
    }
  }
  async generateAnswer(query, limit = 5, sourceType, asJson = false) {
    try {
      const releventDocs = await this.retrieveReleventDocs(query, limit, sourceType) || [];
      const context = releventDocs.filter((doc) => doc && doc.content).map((doc) => doc.content);
      let answer = await this.llmService.generateResponse(query, context, asJson);
      let parsedAnswer = answer;
      if (asJson && typeof answer === "string") {
        try {
          let cleaned = answer.trim();
          if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
          }
          parsedAnswer = JSON.parse(cleaned);
        } catch (error) {
          console.error("Failed to parse JSON response:", error);
          parsedAnswer = { raw: answer };
        }
      }
      return {
        answer: parsedAnswer,
        sources: releventDocs.map((doc) => ({
          id: doc.id,
          chunkKey: doc.chunkKey,
          sourceType: doc.sourceType,
          sourceId: doc.sourceId,
          sourceLevel: doc.sourceLevel,
          content: doc.content,
          similarity: doc.similarity
        })),
        contextUsed: context.length > 0
      };
    } catch (error) {
      console.error("Error in generateAnswer:", error);
      throw error;
    }
  }
  async getStats() {
    try {
      const totalDocuments = await prisma.$queryRaw(prismaNamespace_exports.sql`
        SELECT COUNT(*) as count FROM "document_embedding" WHERE "isDeleted" = false;
        `);
      const sourceTypeCounts = await prisma.$queryRaw(prismaNamespace_exports.sql`
        SELECT "sourceType", COUNT(*) as count FROM "document_embedding" WHERE "isDeleted" = false GROUP BY "sourceType"
        `);
      return {
        totalActiveDocuments: Number(totalDocuments[0]?.count ?? 0),
        sourceTypeBreakdown: sourceTypeCounts.reduce(
          (acc, curr) => {
            acc[curr.sourceType] = Number(curr.count);
            return acc;
          },
          {}
        ),
        timestamp: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Error getting RAG stats:", error);
      throw error;
    }
  }
};

// src/app/module/rag/rag.controller.ts
import status24 from "http-status";

// src/app/lib/redis.ts
import { createClient } from "redis";
var RedisService = class {
  client = null;
  isConnected = false;
  async connect() {
    try {
      const redisUrl = envVars.REDIS_URL;
      if (redisUrl) {
        this.client = createClient({ url: redisUrl });
      } else {
        const host = process.env.REDIS_HOST || "localhost";
        const port = parseInt(process.env.REDIS_PORT || "6379", 10);
        const password = process.env.REDIS_PASSWORD || void 0;
        this.client = createClient({
          socket: {
            host,
            port
          },
          ...password && { password }
        });
      }
      this.client.on("error", (err) => {
        console.error("Redis Client Error:", err);
        this.isConnected = false;
      });
      this.client.on("connect", () => {
        this.isConnected = true;
      });
      this.client.on("ready", () => {
        this.isConnected = true;
      });
      this.client.on("end", () => {
        this.isConnected = false;
      });
      this.client.on("reconnecting", () => {
      });
      await this.client.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      this.isConnected = false;
    }
  }
  ensureConnection() {
    if (!this.client) {
      throw new Error("Redis client not initialized. Call connect() first.");
    }
    if (!this.isConnected) {
      throw new Error("Redis client not connected.");
    }
    return this.client;
  }
  async get(key) {
    try {
      const client = this.ensureConnection();
      return await client.get(key);
    } catch (error) {
      console.error("Redis GET error:", error);
      return null;
    }
  }
  async set(key, value, ttlInSeconds) {
    try {
      const client = this.ensureConnection();
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      await client.set(key, stringValue, { EX: ttlInSeconds });
    } catch (error) {
      console.error("Redis SET error:", error);
    }
  }
  async update(key, value, ttlInSeconds) {
    await this.set(key, value, ttlInSeconds);
  }
  async delete(key) {
    try {
      const client = this.ensureConnection();
      await client.del(key);
    } catch (error) {
      console.error("Redis DELETE error:", error);
    }
  }
  async isAvailable() {
    try {
      const client = this.ensureConnection();
      await client.ping();
      return true;
    } catch {
      return false;
    }
  }
  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
};
var redisService = new RedisService();

// src/app/module/rag/rag.controller.ts
var RagService = new RAGService();
var getStats = async (req, res) => {
  const result = await RagService.getStats();
  sendResponse(res, {
    success: true,
    httpStatusCode: status24.OK,
    message: "Rag stats retrive succuessfull",
    data: result
  });
};
var ingestDoctor = catchAsync(async (req, res) => {
  const result = await RagService.ingestDoctorData();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "doctor data ingest successfuly",
    data: result
  });
});
var queryRag = catchAsync(async (req, res) => {
  const { query, limit, sourceType } = req.body;
  if (!query) {
    return sendResponse(res, {
      httpStatusCode: status24.BAD_REQUEST,
      success: false,
      message: "query is required",
      data: null
    });
  }
  const cacheKey = `rag:query:${query}:${limit ?? 5}:${sourceType || "all"}`;
  try {
    const cachedResult = await redisService.get(cacheKey);
    if (cachedResult) {
      const parsedData = JSON.parse(cachedResult);
      sendResponse(res, {
        success: true,
        httpStatusCode: status24.OK,
        message: "Answer retrieved from cache",
        data: parsedData
      });
      return;
    }
  } catch (cacheError) {
    console.warn("Cache read error, proceeding with normal processing:", cacheError);
  }
  const result = await RagService.generateAnswer(query, limit ?? 5, sourceType, true);
  try {
    await redisService.set(cacheKey, result, 1800);
  } catch (cacheError) {
    console.warn("Cache write error:", cacheError);
  }
  sendResponse(res, {
    httpStatusCode: status24.OK,
    success: true,
    message: "Doctor data retrieved successfully",
    data: result
  });
});
var RagController = {
  getStats,
  ingestDoctor,
  queryRag
};

// src/app/module/rag/rag.route.ts
var router15 = Router12();
router15.get("/stats", RagController.getStats);
router15.post("/ingest-doctor", RagController.ingestDoctor);
router15.post("/query", RagController.queryRag);
var RagRoutes = router15;

// src/app/routes/index.ts
var router16 = Router13();
router16.use("/auth", authRouters);
router16.use("/specialty", SpecialtyRouter);
router16.use("/users", UserRoutes);
router16.use("/doctors", DoctorRoutes);
router16.use("/admins", AdminRoutes);
router16.use("/super-admins", SuperAdminRoutes);
router16.use("/schedules", scheduleRoutes);
router16.use("/doctor-schedules", DoctorScheduleRoutes);
router16.use("/appointments", AppointmentRoutes);
router16.use("/patient", PatientRoutes);
router16.use("/patients", PatientRoutes);
router16.use("/prescription", PrescriptionRoutes);
router16.use("/review", ReviewRoutes);
router16.use("/payment", paymentRoutes);
router16.use("/stats", StatsRoutes);
router16.use("/rag", RagRoutes);
var indexRouter = router16;

// src/app/middlewares/globalErrorHandler.ts
import status27 from "http-status";
import z10 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status25 from "http-status";
var handleZodError = (err) => {
  const statusCode = status25.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/utils/deleteUploadedFileFromGolbalErrorHandler.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    const filesToDelete = [];
    if (req.file && req.file?.path) {
      filesToDelete.push(req.file.path);
    } else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.path) {
          filesToDelete.push(file.path);
        }
      });
    }
    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((url) => deleteFileFromCloudinary(url))
      );
    }
  } catch (error) {
    console.error("Error deleting uploaded files from Global Error Handler", error);
  }
};

// src/app/errorHelpers/handlePrismaErrors.ts
import status26 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status26.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status26.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status26.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status26.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status26.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status26.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status26.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status26.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status26.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status26.INTERNAL_SERVER_ERROR;
  }
  return status26.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message.replace(/Invalid `.*?` invocation in\s*\S+/gi, "").replace(/Invalid `.*?` invocation:?\s*/gi, "");
  const lines = cleanMessage.split("\n").map((line) => line.trim()).filter(Boolean);
  let mainMessage = lines.find(
    (line) => line.includes("Unique constraint") || line.includes("Foreign key") || line.includes("Record") || !line.startsWith("D:") && !line.startsWith("C:") && line.length > 5
  ) || lines[0] || "An error occurred with the database operation.";
  if (error.code === "P2002") {
    const targetFields = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : error.meta?.target ? String(error.meta.target) : "";
    const driverAdapterCause = error.meta?.driverAdapterError?.cause;
    const constraintName = driverAdapterCause?.constraint?.index || "";
    if (targetFields) {
      mainMessage = `Unique constraint failed on field(s): ${targetFields}`;
    } else if (constraintName) {
      mainMessage = `Unique constraint failed on constraint (${constraintName})`;
    } else {
      mainMessage = "A record with this unique value already exists.";
    }
  }
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status26.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status26.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status26.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
  }];
  return {
    success: false,
    statusCode: status26.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middlewares/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from Global Error Handler", err);
  }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let errorSources = [];
  let statusCode = status27.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z10.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err && typeof err === "object" && ("statusCode" in err || "status" in err || err.name === "APIError")) {
    const rawStatus = err.statusCode || err.status;
    if (typeof rawStatus === "number") {
      statusCode = rawStatus;
    } else if (typeof rawStatus === "string" && status27[rawStatus]) {
      statusCode = status27[rawStatus];
    } else {
      statusCode = status27.UNAUTHORIZED;
    }
    message = err.body?.message || err.message || message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status27.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};
var globalErrorHandler_default = globalErrorHandler;

// src/app/middlewares/notFound.ts
import status28 from "http-status";
var notFound = (req, res) => {
  res.status(status28.NOT_FOUND).json({
    success: false,
    message: "API not found"
  });
};
var notFound_default = notFound;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import path3 from "path";
import cors from "cors";
import qs from "qs";
var app = express4();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates`));
app.post("/webhook", express4.raw({ type: "application/json" }), PaymentControler.handleStripeWebhookEvent);
app.use(cors({
  origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/api/auth", toNodeHandler(auth));
app.use(express4.urlencoded({ extended: true }));
app.use(express4.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HealthCare Server is running live!",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.use("/api/v1", indexRouter);
app.use(globalErrorHandler_default);
app.use(notFound_default);
var app_default = app;
export {
  app_default as default
};
