import * as rp from "request-promise";

import config from "./config";

class Search {
  public async getSongs(query: string) {
    try {
      const results = await rp({
        uri: `https://api.genius.com/search?access_token=${config.GENIUS.CLIENT_ACCESS_TOKEN}&q=${query}?`,
        json: true,
      });

      return this.transformSongResults(results.response.hits);
    } catch (err) {
      console.log(err);
      return err.messaage;
    }
  }

  private transformSongResults(songs: any[]) {
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

  public async getSongAnnotations(songId: string) {
    try {
      const results = await rp({
        // https://api.genius.com/referents?access_token=emC4cfTJAb22O1L4l9Q97vXGfWLr73a0uHLuCNN9tW_z9KU0u5loAb5JsJriMv10&song_id=3039923&text_format=plain
        uri: `https://api.genius.com/referents?access_token=${config.GENIUS.CLIENT_ACCESS_TOKEN}&song_id=${songId}&text_format=plain`,
        json: true,
      });
      // return results;
      return this.transformReferentsResultsToSortedAnnotations(
        results.response.referents
      );
    } catch (err) {
      console.log(err);
      return err.messaage;
    }
  }

  private transformReferentsResultsToSortedAnnotations(referents: any[]) {
    const flattenedAnnotations: any[] = [];
    referents.forEach((referent) => {
      referent.annotations.forEach((annotation: any) => {
        flattenedAnnotations.push({
          fragment: referent.fragment,
          annotation: annotation.body.plain,
          votesTotal: annotation.votes_total,
        });
      });
    });
    flattenedAnnotations.sort((a, b) => b.votesTotal - a.votesTotal);
    return flattenedAnnotations;
  }
}

export const search = new Search();
