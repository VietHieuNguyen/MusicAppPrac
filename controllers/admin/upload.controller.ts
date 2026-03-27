import { Request, Response } from "express";

//[GET] /admin/upload
export const index = (req: Request, res: Response)=>{

  res.json({
    location: req.body.file
  })
}