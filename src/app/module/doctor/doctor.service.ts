import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload, IUpdateDoctorSpecialtyPayload } from "./doctor.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interface/query.interface";
import { Doctor, Prisma } from "../../../generated/prisma/client";
import { doctorFilterableFields, doctorIncludeConfig, doctorSearchableFields } from "./doctor.constant";

/**
 * Service to retrieve all doctors in the database.
 * Includes related user account details and specialty mapping details.
 *
 * @returns Array of doctor objects with nested user and specialties.
 */
/**
 * Service to retrieve all doctors in the database.
 * Includes related user account details and specialty mapping details.
 *
 * @returns Array of doctor objects with nested user and specialties.
 */
export const getAllDoctors = async (query:IQueryParams) => {
    // return prisma.doctor.findMany({
    //     where: {
    //         isDeleted: false,
    //     },
    //     include: {
    //         user: true,
    //         specialties: {
    //             include: {
    //                 specialty: true,
    //             },
    //         },
    //     },
    // });

    const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(
        prisma.doctor,
        query,
        {
            searchableFields: doctorSearchableFields,
            filterableFields: doctorFilterableFields,
        }
    )

    const result = await queryBuilder
        .search()
        .filter()
        .where({
            isDeleted: false,
        })
        .include({
            user: true,
            specialties: {
                include:{
                    specialty: true
                }
            },
        })
        .dynamicInclude(doctorIncludeConfig)
        .paginate()
        .sort()
        .fields()
        .execute();

    return result;

};

/**
 * Service to fetch a single doctor by ID.
 *
 * @param id - The unique UUID of the doctor.
 * @returns The doctor record with nested relations.
 * @throws AppError - 404 Not Found if no doctor is found with given ID or if deleted.
 */
const getDoctorById = async (id: string) => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true,
                },
            },
        },
    });
    if (!result) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }
    return result;
};

/**
 * Helper function to compute the diff of specialties to add or delete for a doctor.
 * Handles input payloads provided either as string array of IDs or objects with `shouldDelete` flags.
 *
 * @param tx - Active Prisma transaction client.
 * @param id - Doctor ID.
 * @param specialties - Array of specialty IDs or specialty update objects.
 * @returns Object containing `specialtyIdsToDelete` and `specialtyIdsToAdd`.
 */
const getSpecialtiesToUpdate = async (
    tx: any,
    id: string,
    specialties: (string | IUpdateDoctorSpecialtyPayload | { id?: string; specialtyId?: string; shouldDelete?: boolean })[]
) => {
    const doctor = await tx.doctor.findUniqueOrThrow({
        where: { id },
    });
    const existingSpecialties = await tx.doctorSpecialty.findMany({
        where: { doctorId: doctor.id },
    });
    const existingSpecialtyIds = existingSpecialties.map((es: any) => es.specialtyId);

    // Standardize input payload (handles string array, object array with specialtyId or id, etc.)
    const normalizedSpecialties: IUpdateDoctorSpecialtyPayload[] = specialties
        .map((s: any) => {
            if (typeof s === "string") {
                return { specialtyId: s, shouldDelete: false };
            }
            if (typeof s === "object" && s !== null) {
                const specId = s.specialtyId || (s.specialty ? s.specialty.id : s.id);
                return { specialtyId: specId, shouldDelete: Boolean(s.shouldDelete) };
            }
            return s;
        })
        .filter((s: any) => Boolean(s?.specialtyId));

    const activeInputIds = normalizedSpecialties
        .filter((s) => !s.shouldDelete)
        .map((s) => s.specialtyId);

    // Determine specialties that need to be removed from the join table
    const specialtyIdsToDelete = existingSpecialtyIds.filter(
        (eId: string) =>
            !activeInputIds.includes(eId) ||
            normalizedSpecialties.some((s) => s.specialtyId === eId && s.shouldDelete)
    );

    // Determine new specialties that need to be inserted into the join table
    const specialtyIdsToAdd = activeInputIds.filter(
        (eId: string) => !existingSpecialtyIds.includes(eId)
    );

    return {
        specialtyIdsToDelete,
        specialtyIdsToAdd,
    };
};

/**
 * Service to update doctor profile information and/or assigned specialties.
 * Uses a Prisma transaction to maintain consistency across tables.
 *
 * @param id - Doctor ID.
 * @param payload - Partial doctor details and/or specialties array.
 * @returns Updated Doctor object.
 */
const updateDoctor = async (id: string, payload: any) => {
    const existingDoctor = await prisma.doctor.findUnique({
        where: { id, isDeleted: false },
    });

    if (!existingDoctor) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    return await prisma.$transaction(async (tx) => {
        // Handle payload provided either as { doctor: {...}, specialties: [...] } or flat payload
        const { doctor, specialties, ...restPayload } = payload;
        const doctorData = { ...(doctor || restPayload) };

        // Prevent modification of email and userId via update payload
        delete (doctorData as any).email;
        delete (doctorData as any).userId;

        // Check if registrationNumber is unique before updating
        if (doctorData.registrationNumber) {
            const existingDoctorWithReg = await tx.doctor.findFirst({
                where: {
                    registrationNumber: doctorData.registrationNumber,
                    NOT: { id },
                },
            });

            if (existingDoctorWithReg) {
                throw new AppError(
                    status.BAD_REQUEST,
                    "Registration number is already in use by another doctor."
                );
            }
        }

        // Synchronize user's name and image if doctor's name or profilePhoto changes
        if (doctorData.name || doctorData.profilePhoto) {
            const currentDoctor = await tx.doctor.findUniqueOrThrow({
                where: { id },
                select: { userId: true },
            });
            await tx.user.update({
                where: { id: currentDoctor.userId },
                data: {
                    ...(doctorData.name ? { name: doctorData.name } : {}),
                    ...(doctorData.profilePhoto ? { image: doctorData.profilePhoto } : {}),
                },
            });
        }

        // Step 1: Update doctor basic info
        const updatedDoctor = await tx.doctor.update({
            where: { id },
            data: doctorData,
        });

        // Step 2: Update specialty relations if provided
        if (specialties) {
            const { specialtyIdsToDelete, specialtyIdsToAdd } = await getSpecialtiesToUpdate(
                tx,
                id,
                specialties as any
            );

            if (specialtyIdsToDelete.length > 0) {
                await tx.doctorSpecialty.deleteMany({
                    where: {
                        doctorId: updatedDoctor.id,
                        specialtyId: { in: specialtyIdsToDelete },
                    },
                });
            }

            if (specialtyIdsToAdd.length > 0) {
                // Verify all specialties to add exist in database
                const existingValidSpecialties = await tx.specialty.findMany({
                    where: {
                        id: { in: specialtyIdsToAdd },
                        isDeleted: false,
                    },
                    select: { id: true },
                });
                const validSpecialtyIdSet = new Set(existingValidSpecialties.map((s: any) => s.id));
                const invalidIds = specialtyIdsToAdd.filter((specId: string) => !validSpecialtyIdSet.has(specId));

                if (invalidIds.length > 0) {
                    throw new AppError(
                        status.BAD_REQUEST,
                        `Invalid specialty ID(s): ${invalidIds.join(", ")}`
                    );
                }

                await tx.doctorSpecialty.createMany({
                    data: specialtyIdsToAdd.map((specialtyId: string) => ({
                        doctorId: updatedDoctor.id,
                        specialtyId,
                    })),
                });
            }
        }

        // Step 3: Return updated doctor with full relations
        return await tx.doctor.findUnique({
            where: { id: updatedDoctor.id },
            include: {
                user: true,
                specialties: {
                    include: { specialty: true },
                },
            },
        });
    });
};

/**
 * Service to soft delete a doctor record by ID.
 *
 * @param id - Unique UUID of doctor to soft delete.
 * @returns Soft deleted Doctor object.
 */
const softDeleteDoctor = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id },
    });

    if (!doctor) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    if (doctor.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Doctor is already deleted");
    }

    return prisma.doctor.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });
};

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor: softDeleteDoctor,
    softDeleteDoctor,
};

