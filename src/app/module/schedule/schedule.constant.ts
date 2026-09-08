import { Prisma } from "../../../generated/prisma/client"

export const scheduleFilterableFields = [
    'id',
    'startDateTime',
    'endDateTime',
]

export const scheduleSearchableFields = [
    'id',
    'startDateTime',
    'endDateTime',
]

export const scheduleIncludeConfig : Prisma.ScheduleInclude ={
    appointments: {
        include: {
            doctor: true,
            patient: true,
            payment: true,
            prescription: true,
            review: true,
        }
    },
    doctorSchedules: {
        include: {
            doctor: true
        }
    }
}