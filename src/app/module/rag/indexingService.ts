import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embeddingService";

const toVectorLiteral = (vector: number[]) => `[${vector.join(",")}]`;

export class IndexingService {
    private embeddingService: EmbeddingService;

    constructor() {
        this.embeddingService = new EmbeddingService()
    }

    async indexDocument(
        chunkKey: string,
        sourceType: string,
        sourceId: string,
        sourceLevel: string,
        content: string,
        metadata?: Record<string, unknown>) {

        try {

            const embedding = await this.embeddingService.generateEmbeddings(content)

            const vectorLiteral = toVectorLiteral(embedding)


            await prisma.$executeRaw(Prisma.sql`
        INSERT INTO "document_embeddings"
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
          ${Prisma.raw("gen_random_uuid()")},
          ${chunkKey},
          ${sourceType},
          ${sourceId},
          ${sourceLevel|| null},
          ${content},
          ${JSON.stringify(metadata || {})} :: jsonb,
          CAST(${vectorLiteral} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
          "sourceType" = EXCLUDED."sourceType",
          "sourceId" = EXCLUDED."sourceId",
          "sourceLevel" = EXCLUDED."sourceLabel",
          "content" = EXCLUDED."content",
          "metadata" = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW()
        `);
        } catch (error) {
            console.log("Failed to index document:", error);
            return { success: false, message: "Indexing failed", error }
        }

    }

    async indexDoctorData() {
        try {
            console.log("fatcing doctor data for indexing....")
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
                    reviews: true,

                }
            })
            let indexCount = 0;

            for (const doctor of doctors) {
                const specialtiesList = doctor.specialties.map((ds: any) => ds.specialties?.title).join("\n");

                const reviewsText = doctor.reviews.map((r: any) => `- Rating: ${r.rating}/5. Comments: ${r.comments} || "No comments"`);

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
                    specialties: doctor.specialties.map((ds: any) => ds.specialty.title),
                    averageRating: doctor.averageRating,
                    experience: doctor.experience,
                };

                const chunkKey = `doctor-${doctor.id}`;


                await this.indexDocument(
                    chunkKey,
                    "DOCTOR",
                    doctor.id,
                    content,
                    doctor.name,
                    metadata,
                )
                indexCount++
            }
            console.log(`Successfully indexed ${indexCount} doctors.`);
            return {
                success: true,
                message: `Successfully indexed ${indexCount} doctors.`,
                indexCount
            }

        } catch (error) {
            console.log("Indexing failed:", error);
            return { success: false, message: "Indexing failed", error }
        }
    }



}