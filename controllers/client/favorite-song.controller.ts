import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Singer from "../../models/singer.model";
import Song from "../../models/songs.model";
import Topic from "../../models/topic.model";

export const index = async (req: Request, res: Response) => {
  const favoriteSongs = await FavoriteSong.find({
    // userId: ""
    deleted: false
  }).lean()
  let totalLikes = 0;
  for (const item of favoriteSongs) {
    const infoSong = await Song.findOne({
      _id: item.songId
    })
    const infoSinger = await Singer.findOne({
      _id: infoSong?.singerId
    });
    const infoTopic = await Topic.findOne({
      _id: infoSong?.topicId
    });
    (item as any).infoSong = infoSong;
    (item as any).infoSinger = infoSinger;
    (item as any).infoTopic = infoTopic;
    if (infoSong && infoSong.like) {
      totalLikes += infoSong.like;
    }
  }
  const countPlaylist = favoriteSongs.length;
  res.render("client/pages/favorite-songs/index", {
    pageTitle: "Liked Songs",
    pageActive: "favorite-songs",
    favoriteSongs,
    countPlaylist,
    totalLikes
  });
};
