// This check can be removed
// it is just for tutorial purposes

import { env } from "../env";

export const hasEnvVars =
  env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
