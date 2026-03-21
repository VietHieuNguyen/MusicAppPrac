import { Request, Response } from "express"
import Topic from "../../models/topic.model"
//[GET] /topics
export const topics = async(req: Request, res:Response)=>{
  const topic = await Topic.find({
    deleted: false
  })
  console.log(topic)
  res.render("client/pages/topics/index",{
    topic: topic
  })
}