import { Request, Response } from "express"
import Topic from "../../models/topic.model";
import Song from "../../models/songs.model";
import Singer from "../../models/singer.model";
export const list = async (req: Request, res: Response)=>{
  const id: string = req.params.slugTopic as string;
  const topic = await Topic.findOne({
    slug: req.params.slugTopic,
    status: "active",
    deleted: false
  })
  if(!topic){
    return res.redirect("/topics")
  }
  const songs = await Song.find({
    topicId: topic.id,
    status: "active",
    deleted: false
  }).select("avatar title slug singerId like").lean()
  if(songs.length === 0){
    return res.redirect("/topics")
  }
  for(const song of songs){
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      status: "active",
      deleted: false
    });
    
    (song as any).infoSinger = infoSinger;
  
  }
  res.render("client/pages/songs/list",{
    pageTitle: topic.title,
    songs: songs,
    topic: topic
  })
}