import YahooFantasy from "yahoo-fantasy";
import { cookies } from "next/headers";

// class MissingAccessTokenError extends Error {
//   name = "MissingAccessTokenError";
//   message = "Missing token required to access Yahoo! resources.";
//   // stack = undefined;
// }

export const createYahooClient = async () => {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const test = cookieStore.get("test");
  console.log(test);

  let token = access_token?.value;
  const yf = new YahooFantasy(
    process.env.YAHOO_CLIENT_ID!,
    process.env.YAHOO_CLIENT_SECRET!,
  );

  yf.setUserToken(token);

  return yf;
};
