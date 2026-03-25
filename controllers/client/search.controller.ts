import { Request, Response } from "express";
import Song from "../../models/songs.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

//[GET] /search/:type
export const result = async (req: Request, res: Response) => {
  const type = req.params.type;

  const keyword =
    typeof req.query.keyword === "string" ? req.query.keyword.trim() : "";

  let songs: any[] = [];

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    //Tạo ra 1 cái slug không dấu, thêm dấu - ngăn cách
    const stringSlug = convertToSlug(keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i")
    songs = await Song.find({
      $or: [{
        title: keywordRegex,
        deleted: false
      }, {
        slug: stringSlugRegex
      }]

    }).lean();

    songs = await Promise.all(
      songs.map(async (item) => {
        const infoSinger = await Singer.findOne({
          _id: item.singerId,
          deleted: false
        }).lean();

        return {
          ...item,
          infoSinger
        };
      })
    );
  }


  switch (type) {
    case "result":
      res.render("client/pages/search/result", {
        pageTitle: "Search",
        pageActive: "search",
        pageVariant: "search",
        keyword,
        songs
      });
      break;
    case "suggest":
      res.json({
        code: 200,
        keyword,
        songs
      });
      break;
    default:
      break;
  }
};

