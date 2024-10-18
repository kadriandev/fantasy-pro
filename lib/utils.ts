import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "next/navigation";

export function encodedRedirect(
	type: "error" | "success",
	path: string,
	message: string,
) {
	return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function attempt<T, E extends new (message?: string) => Error>(
	promise: Promise<T>,
	errorsToCatch?: E[],
): Promise<[undefined, T] | [InstanceType<E>]> {
	return promise
		.then((res) => [undefined, res] as [undefined, T])
		.catch((err) => {
			if (!errorsToCatch || errorsToCatch.some((e) => err instanceof e))
				return [err];
			else throw err;
		});
}
