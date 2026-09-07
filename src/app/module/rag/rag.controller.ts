import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { RAGService } from "./rag.service";
import status from "http-status";
import { redisService } from "../../lib/redis";


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
  // generate catch key from query params
 const cacheKey = `rag:query:${query}:${limit ?? 5}:${sourceType || 'all'}`;

  try {
    // Try to get from cache first
    const cachedResult = await redisService.get(cacheKey);

    if (cachedResult) {
      // Cache hit - parse and return cached data
      const parsedData = JSON.parse(cachedResult);

      sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Answer retrieved from cache",
        data: parsedData,
      });
      return;
    }
  } catch (cacheError) {
    // Log cache error but continue with normal processing
    console.warn('Cache read error, proceeding with normal processing:', cacheError);
  }
  // cache miss first time call 
  const result = await RagService.generateAnswer(query, limit ?? 5, sourceType, true);

  // Store result in cache with 30-minute TTL (1800 seconds)
  try {
    await redisService.set(cacheKey, result, 1800);
  } catch (cacheError) {
    // Log cache error but don't fail the request
    console.warn('Cache write error:', cacheError);
  }

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