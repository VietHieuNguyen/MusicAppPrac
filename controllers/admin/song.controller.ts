import { Request, Response } from "express";
import Song from "../../models/songs.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

export const index = async (req: Request, res: Response)=>{
  const songs = await Song.find({
    deleted: false
  })
  res.render("admin/pages/songs/index",{
    pageTitle: "Trang danh sách bài hát",
    songs: songs
  })
}
//[GET] /admin/songs/create
export const create = async(req: Request, res: Response)=>{
  let find = {
    deleted: false
  }
  const topics = await Topic.find(find).select("title")

  const singers = await Singer.find(find).select("fullName")
  res.render("admin/pages/songs/create",{
    pageTitle: "Thêm mới bài hát",
    topics,
    singers
  })
}

//[POST] /admin/songs/create
export const createPost = async (req: Request, res: Response)=>{
  const dataSong = {
    title: req.body.title || "",
    topicId: req.body.topicId,
    singerId: req.body.singerId,
    description: req.body.description,
    status: req.body.status,
    avatar: req.body.avatar,
    duration: req.body.duration
  }
  // console.log(dataSong)
  const song = new Song(dataSong);
  await song.save()
  res.redirect(`/${systemConfig.prefixAdmin}/songs`)
}
