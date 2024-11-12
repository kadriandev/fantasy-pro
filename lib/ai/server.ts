import Anthropic from "@anthropic-ai/sdk";

export const createAIClient = () =>
	new Anthropic({
		apiKey: process.env.ANTHROPIC_API_KEY,
	});
