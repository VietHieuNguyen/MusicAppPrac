import { Request, Response } from "express";

//[GET] /admin/dasboard
export const index = async(req: Request, res: Response)=>{
  res.render("admin/pages/dashboard/index",{
    pageTitle: "Trang tổng quan"
  })
}