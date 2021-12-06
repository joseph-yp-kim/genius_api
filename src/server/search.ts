import * as rp from "request-promise";

import config from "./config";

class Search {
  public async getSongs(query: string) {
    try {
      const results = await rp({
        uri: `https://api.genius.com/search?access_token=${config.GENIUS.CLIENT_ACCESS_TOKEN}&q=${query}?`,
        json: true,
      });

      return this.transformResults(results.response.hits);
    } catch (err) {
      console.log(err);
    }
  }

  private transformResults(songs: any[]) {
    return songs
      .map((song) => {
        try {
          return {
            id: song.result.id,
            title: song.result.title,
            artist: song.result.artist_names,
          };
        } catch {
          return null;
        }
      })
      .filter((song) => {
        return !!song;
      });
  }
}

export const search = new Search();
