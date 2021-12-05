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
    const apiSearchResults = await search.getSongs(query);
    console.log("apiSearchResults:", apiSearchResults);
    res.json({ query, results: apiSearchResults });
  }
);

export default router;
