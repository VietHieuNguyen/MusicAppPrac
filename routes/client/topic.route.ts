import { Request,Response, Router } from "express";
const router: Router = Router();

import Topic from "../../models/topic.model";

router.get("/", async(req: Request, res:Response)=>{
  const topic = await Topic.find({
    deleted: false
  })
  console.log(topic)
  res.render("client/pages/topics/index",{
    topic: topic
  })
})
export const topicRoutes: Router = router