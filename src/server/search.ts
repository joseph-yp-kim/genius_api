import * as rp from "request-promise";

import config from "./config";

class Search {
  public async getSongs(query: string) {
    try {
      const results = await rp({
        uri: `https://api.genius.com/search?access_token=${config.GENIUS.CLIENT_ACCESS_TOKEN}&q=${query}?`,
        json: true,
      });
      return results;
    } catch (err) {
      console.log(err);
    }
  }
}

export const search = new Search();
