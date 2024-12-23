"use server";

import { revalidatePath } from "next/cache";
import { createYahooClient } from ".";
import { attempt } from "../utils";
import { insertUserLeagues } from "./queries";
import {
  YahooLeagueSettings,
  YahooUserGameLeagues,
  YahooUserGameTeams,
  YahooUserGames,
} from "./types";

export async function fetchUserLeagues() {
  const yf = await createYahooClient();

  const games: YahooUserGames = await yf.user.games();
  const active_games = games.games.filter((game) => !game.is_game_over);

  for (const game of active_games) {
    const teams_promise: Promise<YahooUserGameTeams> = yf.user.game_teams(
      game.game_key,
    );
    const leagues_promise: Promise<YahooUserGameLeagues> = yf.user.game_leagues(
      game.game_key,
    );

    const [err, data] = await attempt(
      Promise.all([teams_promise, leagues_promise]),
    );
    if (err) throw new Error();
    const [teams, game_leagues] = data;

    const lls = game_leagues.games.find(
      (g) => g.game_key === game.game_key,
    )?.leagues;
    if (!lls) return;

    let leagues = [];
    for (const league of lls) {
      const settings: YahooLeagueSettings = await yf.league.settings(
        league.league_key,
      );
      leagues.push({
        league_key: league.league_key,
        name: league.name,
        num_teams: league.num_teams,
        game: game.code,
        url: league.url,
        stat_categories: settings.settings.stat_categories,
      });
    }

    const user_leagues = leagues.map((l) => {
      const team_id = teams.teams
        .find((t) => t.game_key === game.game_key)
        ?.teams.find((t) => t.team_key.startsWith(l.league_key))?.team_id;
      return {
        league_key: l.league_key,
        team_id: team_id ?? "",
      };
    });
    if (!user_leagues) return;

    await insertUserLeagues(leagues, user_leagues);
  }
  revalidatePath("/fantasy");
}
