import * as express from "express";

import { search } from "./search";

const router = express.Router();

router.get("/api/hello", (req, res, next) => {
  res.json("World");
});

router.get(
  "/api/search",
  async (req: express.Request, res: express.Response) => {
    const query = req.query.q as string;
    const songs = await search.getSongs(query);
    res.json({ query, songs: songs });
  }
);

export default router;
