import Anthropic from "@anthropic-ai/sdk";
import { env } from "../env";

export const createAIClient = () =>
  new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });
