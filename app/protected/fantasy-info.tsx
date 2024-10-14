"use client";

import { useEffect, useState } from "react";

export default function FantasyInfo() {
	const [yahooUser, setYahooUser] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			const options = {
				method: "get",
				json: true,
			};

			fetch("https://api.login.yahoo.com/openid/v1/userinfo", options)
				.then((res) => res.json())
				.then((json) => setYahooUser(json));
		};

		fetchData();
	}, []);

	return (
		<pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
			{JSON.stringify(yahooUser)}
		</pre>
	);
}
