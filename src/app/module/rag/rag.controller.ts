import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { RAGService } from "./rag.service";
import status from "http-status";


const RagService = new RAGService()

const getStats = async (req: Request, res: Response) => {
  const result = await RagService.getStats()

  sendResponse(res, {
    success: true,
    httpStatusCode:status.OK,
    message: "Rag stats retrive succuessfull",
    data: result
  });
};

const ingestDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await RagService.ingestDoctorData()

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'doctor data ingest successfuly',
    data: result
  })
})

const queryRag = catchAsync(async (req: Request, res: Response) => {

  const { query, limit, sourceType } = req.body;

  if (!query) {
    return sendResponse(res, {
      httpStatusCode: status.BAD_REQUEST,
      success: false,
      message: "query is required",
      data: null,
    });
  }

  const result = await RagService.generateAnswer(query, limit ?? 5, sourceType, true);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Doctor data retrieved successfully',
    data: result
  })
})

export const RagController = {
  getStats,
  ingestDoctor,
  queryRag
};