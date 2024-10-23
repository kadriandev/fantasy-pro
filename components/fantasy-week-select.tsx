"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

interface FantasyWeekSelectProps {
  weeks: string[];
}

export default function FantasyWeekSelect(props: FantasyWeekSelectProps) {
  const { weeks } = props;
  const [week, setWeek] = useQueryState("week");
  return (
    <Select value={week ?? undefined} onValueChange={(v) => setWeek(v)}>
      <SelectTrigger>
        <SelectValue placeholder="Current Week" />
      </SelectTrigger>
      <SelectContent>
        {weeks.map((week) => (
          <SelectItem value={week}>Week {week}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
