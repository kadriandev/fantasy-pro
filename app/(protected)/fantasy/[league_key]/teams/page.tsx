import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { attempt } from "@/lib/utils";
import { createYahooClient } from "@/lib/yahoo";
import { YahooStandings } from "@/lib/yahoo/types";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { league_key: string };
}) {
  const yf = await createYahooClient();

  const [err, data] = await attempt(
    yf.league.standings(params.league_key) as Promise<YahooStandings>,
  );
  if (err) throw new Error("Unable to get league standings.");

  return (
    <div className="w-full">
      <h1 className="my-4 text-xl font-bold">Teams</h1>
      <div className="grid grid-cols-3 gap-4">
        {data.standings.map((team) => (
          <Link
            key={team.team_id}
            href={`/fantasy/team/${params.league_key}.t.${team.team_id}`}
          >
            <Card>
              <CardHeader>
                <span className="flex">
                  <Avatar className="mr-4">
                    <AvatarImage
                      src={team.team_logos[0].url}
                      alt={`${team.name} logo`}
                    />
                  </Avatar>
                  <span>
                    <CardTitle className="align-middle">{team.name}</CardTitle>
                    <CardDescription>
                      {team.managers[0].nickname}
                    </CardDescription>
                  </span>
                </span>
                <CardContent></CardContent>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
