import { createYahooClient } from "../yahoo";
import { YahooTeamRoster } from "../yahoo/types";
import { createAIClient } from "./server";
import { TeamInsight } from "./types";
import { createClient } from "../supabase/server";
import dayjs from "dayjs";
import { sanitizeResponseJson } from "./utils";
import { getMatchupTeamId } from "../yahoo/utils";

export const getInsights = async (
	league_key: string,
	team_key: string,
): Promise<TeamInsight | null> => {
	let insight: TeamInsight | null = null;
	const supabase = createClient();

	const data = await supabase
		.from("user_leagues")
		.select("last_insight, team_id")
		.eq("league_key", league_key)
		.maybeSingle();

	const canGetNewInsight =
		!data?.data?.last_insight ||
		dayjs().isAfter(dayjs(data?.data?.last_insight).add(1, "week"));

	if (canGetNewInsight) {
		insight = await getNewInsight(league_key, team_key);
		await supabase
			.from("user_leagues")
			.update({
				last_insight: new Date().toISOString(),
				team_insights: JSON.stringify(insight),
			})
			.eq("league_key", league_key);
	}

	if (!insight) {
		let res = await supabase
			.from("user_leagues")
			.select("team_insights")
			.eq("league_key", league_key)
			.single();
		insight = JSON.parse(res.data?.team_insights as string);
	}

	return insight;
};

const getNewInsight = async (
	league_key: string,
	team_id: string,
): Promise<TeamInsight> => {
	const anthropic = createAIClient();
	const yf = createYahooClient();

	const opponent_team_key = await getMatchupTeamId(league_key, team_id);

	const [team, opponent] = await Promise.all([
		yf.team.roster(`${league_key}.t.${team_id}`) as Promise<YahooTeamRoster>,
		yf.team.roster(
			`${league_key}.t.${opponent_team_key}`,
		) as Promise<YahooTeamRoster>,
	]);

	const roster = team.roster.map((p) => p.name.full);
	const opponent_roster = opponent.roster.map((p) => p.name.full);

	const msg = await anthropic.messages.create({
		model: "claude-3-5-sonnet-20241022",
		max_tokens: 1000,
		temperature: 0,
		system: `You are a seasoned fantasy sports player, especially knowledgeable in nba head to
      head leagues on yahoo. We are managing a team with the goal of being the #1 fantasy player
      this season.`,
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `I have a fantasy team with the following roster: ${roster}. My week\'s
              matchup this week has this roster: ${opponent_roster}. Based on this team, can
              you tell me what categories I should focus and punt, and give me some trade
              suggestions for improving my team. Also give me some tips for this week\'s matchup.
              Structure the response as valid json. Only respond with json. Use abbreviations
              for the category names. Make sure json always returns in the following format:
              {"strong_categories":[],"weak_categories": [],"suggested_punt_categories": [],
              "weekly_matchup_tips": [], "trade_suggestions": [{"trade_away": [],
                "target_players": [], "reasoning": ""}],"waiver_wire_targets": [],
                  "drop_candidates": []}`,
					},
				],
			},
		],
	});

	return sanitizeResponseJson(msg);
};
