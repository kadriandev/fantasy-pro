export type YahooGameLeagues = {
  guid: string;
  games: [
    {
      game_key: string;
      game_id: string;
      name: string;
      code: string;
      type: string;
      url: string;
      season: string;
      leagues: [
        {
          league_key: string;
          league_id: string;
          name: string;
          url: string;
          draft_status: string;
          num_teams: number;
          edit_key: string;
          weekly_deadline: string;
          league_update_timestamp: string;
          scoring_type: string;
          league_type: string;
          renew: string;
          renewed: string;
          short_invitation_url: string;
          is_pro_league: string;
          start_date: string;
          end_date: string;
          is_finished: number;
        },
      ];
    },
  ];
};

export type LeagueMeta = {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: null;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  felo_tier: string;
  iris_group_chat_id: string;
  allow_add_to_dl_extra_pos: number;
  is_pro_league: string;
  is_cash_league: string;
  current_week: number;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_plus_league: string;
  game_code: string;
  season: string;
};

type YahooTeamStandings = {
  team_key: string;
  team_id: string;
  name: string;
  url: string;
  team_logos: { size: string; url: string }[];
  waiver_priority: number;
  number_of_moves: number;
  number_of_trades: number;
  roster_adds: any[];
  league_scoring_type: string;
  has_draft_grade: number;
  auction_budget_total: string;
  auction_budget_spent: number;
  managers: any[];
  standings: {
    rank: string;
    outcome_totals: {
      wins: string;
      losses: string;
      ties: string;
      percentage: string;
    };
  };
};

export type YahooLeagueStandings = {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: string;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  felo_tier: string;
  iris_group_chat_id: string;
  allow_add_to_dl_extra_pos: number;
  is_pro_league: string;
  is_cash_league: string;
  current_week: number;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_plus_league: string;
  game_code: string;
  season: string;
  standings: YahooTeamStandings[];
};

export type YahooPlayer = {
  player_key: string;
  player_id: string;
  name: {
    full: string;
    first: string;
    last: string;
    ascii_first: string;
    ascii_last: string;
  };
  editorial_player_key: string;
  editorial_team_key: string;
  editorial_team_full_name: string;
  editorial_team_abbr: string;
  uniform_number: string;
  display_position: string;
  headshot: string;
  is_undroppable: string;
  position_type: string;
  eligible_positions: string[];
};

export type YahooTeamRoster = {
  team_key: string;
  team_id: string;
  name: string;
  url: string;
  team_logo: string;
  waiver_priority: number;
  number_of_moves: string;
  number_of_trades: number;
  clinched_playoffs: number;
  managers: [
    {
      manager_id: string;
      nickname: string;
      guid: string;
      is_commissioner: string;
    },
  ];
  roster: YahooPlayer[];
};
