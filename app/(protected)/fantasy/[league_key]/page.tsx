import { fetchAndSaveLeagueStats, getUsersTeamId } from "@/lib/yahoo/queries";
import { groupStatsByWeek } from "@/lib/yahoo/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processRadarChartData } from "@/components/team-overview/utils";
import TeamGraphs from "@/components/team-overview/team-graphs";
import TeamProfile from "@/components/team-overview/team-profile";

export interface OverviewPageProps {
  params: { league_key: string };
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const userTeamId = await getUsersTeamId(params.league_key);
  const { cats, stats, insights } = await fetchAndSaveLeagueStats(
    params.league_key,
    userTeamId,
  );

  const teams = groupStatsByWeek(stats)[0]
    .filter((t) => t.team_id !== userTeamId)
    .map((t) => t.name);

  const radarChartData = processRadarChartData(
    userTeamId!,
    cats,
    stats,
    "league",
  );

  return (
    <Tabs defaultValue="profile">
      <div className="flex items-center">
        <h1 className="py-4 flex text-xl font-bold">Overview</h1>
        <TabsList className="ml-auto">
          <TabsTrigger value="profile">My Team</TabsTrigger>
          <TabsTrigger value="graphs">Graphs</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="profile">
        <TeamProfile data={radarChartData} insights={insights!} />
      </TabsContent>
      <TabsContent value="graphs">
        <TeamGraphs
          userTeamId={userTeamId ?? ""}
          teams={teams}
          cats={cats}
          stats={stats ?? []}
        />
      </TabsContent>
    </Tabs>
  );
}
