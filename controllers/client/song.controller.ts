import { Request, Response } from "express"
import Topic from "../../models/topic.model";
import Song from "../../models/songs.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";


//[GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const id: string = req.params.slugTopic as string;
  const topic = await Topic.findOne({
    slug: req.params.slugTopic,
    status: "active",
    deleted: false
  })
  if (!topic) {
    return res.redirect("/topics")
  }
  const songs = await Song.find({
    topicId: topic.id,
    status: "active",
    deleted: false
  }).select("avatar title slug singerId like").lean()
  if (songs.length === 0) {
    return res.redirect("/topics")
  }
  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      status: "active",
      deleted: false
    });

    (song as any).infoSinger = infoSinger;

  }
  res.render("client/pages/songs/list", {
    pageTitle: topic.title,
    songs: songs,
    topic: topic
  })
}

//[GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  const redirectUrl: string = req.get("Referer")!
  const song = await Song.findOne({
    slug: req.params.slugSong,
    deleted: false,
    status: "active"
  })
  if (!song) {
    return res.redirect(redirectUrl)
  }
  const singer = await Singer.findOne({
    _id: song.singerId,
    deleted: false,
    status: "active"
  })
  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false
  })
  const favoriteSong = await FavoriteSong.findOne({
    songId: song.id
  });
  
  (song as any).isFavoriteSong = favoriteSong ? true: false;
  res.render("client/pages/songs/detail", {
    pageTitle: song.title,
    song: song,
    singer: singer,
    topic: topic
  })

}

//[PATCH] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  const id = req.params.idSong;
  const typeLike = req.params.typeLike;

  const song = await Song.findOne({
    _id: id,
    status: "active",
    deleted: false
  })
  if (!song) {
    return res.status(404).json({ message: "Không tìm thấy bài hát" });

  }
  const newLike = typeLike == "like" ? song.like! + 1 : song.like! -1;
    await Song.updateOne({
    _id: id
  }, { like: newLike })
  res.status(200).json({
    message: "Thành công",
    like: newLike
  })
}
export const favorite = async (req: Request, res: Response)=>{
  const id = req.params.idSong;
  const type = req.params.typeFavorite;
 
  
  switch (type){
    case "favorite":
      const existFavoriteSong = await FavoriteSong.findOne({
        songId: id
      })
      if(!existFavoriteSong){
        const record = new FavoriteSong({
          // userId: "",
          songId: id
        });
        await record.save();
      }
      break;
    case "unfavorite":
      await FavoriteSong.deleteOne({
        songId: id
      })
      break;
    default:
      break;
  }
  res.status(200).json({
    code: 200,
    message: "Thành công"
  })
}