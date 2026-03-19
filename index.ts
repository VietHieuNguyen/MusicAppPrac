import express, { Express, Request, Response } from "express";
import * as database from "./config/database"
import dotenv from "dotenv"
import Topic from "./models/topic.model";
dotenv.config()
const app: Express = express();
const port: number | string = process.env.PORT || 3000

database.connect()
app.set("views","./views")
app.set("view engine","pug")

app.get("/topics",async (req: Request, res: Response)=>{
  const topic = await Topic.find({
    deleted: false
  })
  console.log(topic)
  res.render("client/pages/topics/index",{
    topic: topic
  })
});

app.listen(port, ()=>{
  console.log(`App listening on port: ${port}`)
})