import { auth } from "../../lib/auth";
import { Role, Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateAdminPayload, ICreateDoctorPayload, ICreateSuperAdminPayload } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

/**
 * Service to register a new Doctor user.
 * Performs validation, creates authentication account, executes database transactions,
 * and handles cleanup rollbacks on error.
 *
 * Workflow:
 * 1. Verify existence of all requested specialties in database.
 * 2. Check if a user with the target email already exists.
 * 3. Register user credentials with Better-Auth (`auth.api.signUpEmail`).
 * 4. Perform Prisma transaction to insert `Doctor` record and `DoctorSpecialty` relations.
 * 5. Roll back auth user registration if database creation fails.
 *
 * @param payload - Request payload including doctor info, credentials, and specialty IDs.
 * @returns The created Doctor record including associated user and specialties data.
 * @throws AppError - If specialty is invalid, user exists, or account creation fails.
 */
const createDoctor = async (payload: ICreateDoctorPayload) => {
    const specialties: Specialty[] = [];

    // Step 1: Validate that every provided specialty ID exists in DB
    for (const specialityId of payload.specialties) {
        const speciality = await prisma.specialty.findUnique({
            where: {
                id: specialityId,
            },
        });

        if (!speciality) {
            throw new AppError(status.BAD_REQUEST, `Specialty not found ${specialityId}`);
        }

        specialties.push(speciality);
    }

    // Step 2: Check if user or doctor already exists with the given email or registration number
    const userExist = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email,
        },
    });

    if (userExist) {
        throw new AppError(status.BAD_REQUEST, `User already exists with email: ${payload.doctor.email}`);
    }

    const doctorWithRegExist = await prisma.doctor.findUnique({
        where: {
            registrationNumber: payload.doctor.registrationNumber,
        },
    });

    if (doctorWithRegExist) {
        throw new AppError(status.BAD_REQUEST, `Doctor with registration number ${payload.doctor.registrationNumber} already exists`);
    }

    // Step 3: Register user account via Better-Auth engine
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            role: Role.DOCTOR,
            name: payload.doctor.name,
            needPasswordChange: true,
        },
    });

    try {
        // Step 4: Execute database transaction to create Doctor profile and join specialty records
        const result = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userData.user.id },
                data: { emailVerified: true },
            });

            // 4a. Create Doctor profile linked to created User ID
            const doctorData = await tx.doctor.create({
                data: { 
                    userId: userData.user.id,
                    ...payload.doctor,
                },
            });

            // 4b. Map specialties to DoctorSpecialty join table
            const doctorSpecialtyData = specialties.map((specialty) => {
                return {
                    doctorId: doctorData.id,
                    specialtyId: specialty.id,
                };
            });

            await tx.doctorSpecialty.createMany({
                data: doctorSpecialtyData,
            });

            // 4c. Fetch and return complete Doctor record with relations
            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id,
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
                            updatedAt: true,
                        },
                    },
                    specialties: {
                        select: {
                            specialty: {
                                select: {
                                    title: true,
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });
            return doctor;
        });

        return result;
    } catch (error) {
        // Step 5: Rollback - delete created auth user if transaction fails
        await prisma.user.delete({
            where: {
                id: userData.user.id,
            },
        });
        throw error;
    }
};

/**
 * Service to register a new Admin user.
 */
const createAdmin = async (payload: ICreateAdminPayload) => {
    const userExist = await prisma.user.findUnique({
        where: {
            email: payload.admin.email,
        },
    });

    if (userExist) {
        throw new AppError(status.BAD_REQUEST, `User with this email already exists: ${payload.admin.email}`);
    }

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            password: payload.password,
            role: Role.ADMIN,
            name: payload.admin.name,
            needPasswordChange: true,
        },
    });

    try {
        const result = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userData.user.id },
                data: { emailVerified: true },
            });

            const admin = await tx.admin.create({
                data: {
                    userId: userData.user.id,
                    name: payload.admin.name,
                    email: payload.admin.email,
                    profilePhoto: payload.admin.profilePhoto,
                    contactNumber: payload.admin.contactNumber,
                },
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
                            status: true,
                        },
                    },
                },
            });

            return createdAdmin;
        });

        return result;
    } catch (error) {
        await prisma.user.delete({
            where: {
                id: userData.user.id,
            },
        });
        throw error;
    }
};

/**
 * Service to register a new Super Admin user.
 */
const createSuperAdmin = async (payload: ICreateSuperAdminPayload) => {
    const userExist = await prisma.user.findUnique({
        where: {
            email: payload.superAdmin.email,
        },
    });

    if (userExist) {
        throw new AppError(status.BAD_REQUEST, `User with this email already exists: ${payload.superAdmin.email}`);
    }

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.superAdmin.email,
            password: payload.password,
            role: Role.SUPER_ADMIN,
            name: payload.superAdmin.name,
            needPasswordChange: true,
        },
    });

    try {
        const result = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userData.user.id },
                data: { emailVerified: true },
            });

            const superAdmin = await tx.superAdmin.create({
                data: {
                    userId: userData.user.id,
                    name: payload.superAdmin.name,
                    email: payload.superAdmin.email,
                    profilePhoto: payload.superAdmin.profilePhoto,
                    contactNumber: payload.superAdmin.contactNumber,
                },
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
                            status: true,
                        },
                    },
                },
            });

            return createdSuperAdmin;
        });

        return result;
    } catch (error) {
        await prisma.user.delete({
            where: {
                id: userData.user.id,
            },
        });
        throw error;
    }
};

export const UserServices = {
    createDoctor,
    createAdmin,
    createSuperAdmin,
};

