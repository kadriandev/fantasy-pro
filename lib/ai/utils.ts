import { Message } from "@anthropic-ai/sdk";

export const sanitizeResponseJson = (msg: Message) => {
	if (msg.content[0].type === "text") {
		let json = msg.content[0].text;
		json = json.replace("\n", "");
		return JSON.parse(json);
	}
};
