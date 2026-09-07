import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { RAGService } from "./rag.service";


const RagService = new RAGService()

const getStats = async (req: Request, res: Response,next:NextFunction) => {
  console.log("hello from stats",req.query);

  res.status(200).json({
    success:true,
    message:"Rag stats",
    data:[]
  });
};

const ingestDoctor =catchAsync(async(req:Request,res:Response)=>{
    const result = await RagService.ingestDoctorData()

    sendResponse(res,{
        httpStatusCode:200,
        success:true,
        message:'doctor data ingest successfuly',
        data: result
    })
})

export const RagController = {
  getStats,
  ingestDoctor
};