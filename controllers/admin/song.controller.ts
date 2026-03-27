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
  let avatar = "";
  let audio = ""
  if(req.body.avatar){
    avatar = req.body.avatar[0]
  }
  if(req.body.audio){
    audio = req.body.audio[0];
  }
  const dataSong = {
    title: req.body.title || "",
    topicId: req.body.topicId,
    singerId: req.body.singerId,
    description: req.body.description,
    status: req.body.status,
    avatar: avatar,
    audio: audio,
    duration: req.body.duration,
    lyrics: req.body.lyrics
  }
  // console.log(dataSong)
  const song = new Song(dataSong);
  await song.save()
  res.redirect(`/${systemConfig.prefixAdmin}/songs`)
}


//[GET] /admin/songs/edit/:songId
export const edit = async(req: Request, res: Response)=>{
  const id = req.params.songId;
  const song = await Song.findOne({
    _id:id,
    deleted: false
  })
  console.log(song)
  const topics = await Topic.find({
    deleted: false
  })
  const singers = await Singer.find({
    deleted: false
  })
  res.render("admin/pages/songs/edit",{
    pageTitle: "Trang chỉnh sửa bài hát",
    song, 
    topics,
    singers
  })
}

//[PATCH] /admin/songs/edit/:id
export const editPatch = async (req: Request, res: Response)=>{
  const id = req.params.songId;

  const dataSong = {
    title: req.body.title,
    topicId: req.body.topicId,
    singerId: req.body.singerId,
    description: req.body.description,
    status: req.body.status,
    lyrics: req.body.lyrics
  }
  if(req.body.avatar){
    (dataSong as any).avatar = req.body.avatar[0];
  }

  if(req.body.audio){
    (dataSong as any).audio = req.body.audio[0];
  }
  
  await Song.updateOne({
    _id: id
  }, dataSong)
  
  const songs = await Song.findOne({
    _id: id
  })
  const redirectUrl : string = req.get("Referer") ||"back"

 
  res.redirect(redirectUrl)
}