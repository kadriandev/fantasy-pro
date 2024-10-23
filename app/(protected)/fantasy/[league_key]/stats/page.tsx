import FantasyWeekSelect from "@/components/fantasy-week-select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  createSearchParamsCache,
  parseAsString,
  type SearchParams,
} from "nuqs/server";

type PageProps = {
  params: { league_key: string };
  searchParams: Promise<SearchParams>; // Next.js 15+: async searchParams prop
};

const searchParamsCache = createSearchParamsCache({
  // List your search param keys and associated parsers here:
  week: parseAsString.withDefault(""),
});

export default async function StatsPage({ params, searchParams }: PageProps) {
  const { week } = searchParamsCache.parse(await searchParams);
  const yf = await createYahooClient();

  const [err, [settings, scoreboard]] = await attempt(
    Promise.all([
      yf.league.settings(params.league_key),
      yf.league.scoreboard(params.league_key, week),
    ]),
  );
  if (err) throw new Error("Error getting settings and scoreboard data");

  const stats = scoreboard.scoreboard.matchups
    .reduce((acc: any[], curr: any) => {
      acc.push(curr.teams);
      return acc;
    }, [])
    .flat();

  return (
    <>
      <h1 className="py-4 flex text-xl font-bold">
        Stats
        <span className="ml-auto">
          <FantasyWeekSelect weeks={["1", "2", "3"]} />
        </span>
      </h1>
      <ScrollArea className="h-[900px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background">
                Team
              </TableHead>
              {settings.settings.stat_categories.map(
                (category: any, index: number) => (
                  <TableHead key={index} className="text-xs">
                    {category.abbr}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((team: any) => (
              <TableRow key={team.team_key}>
                <TableCell className="sticky left-0 bg-background">
                  {team.name}
                </TableCell>
                {stats.map(
                  (stat: { stat_id: string; value: string }, index: number) => {
                    return (
                      <TableCell key={index}>
                        {stat ? stat.value : "N/A"}
                      </TableCell>
                    );
                  },
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
