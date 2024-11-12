export type TeamInsight = {
	strong_categories: string[];
	weak_categories: string[];
	suggested_punt_categories: string[];
	weekly_matchup_tips: string[];
	trade_suggestions: {
		trade_away: string[];
		target_players: string[];
		reasoning: string;
	}[];
	drop_candidates: string[];
	waiver_wire_targets: string[];
};
