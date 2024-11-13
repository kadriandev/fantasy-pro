import { cn } from "@/lib/utils";

interface LoaderProps {
	size?: "small" | "medium" | "large";
	color?: "primary" | "secondary" | "accent";
	label?: string;
}

export default function Loader({
	size = "medium",
	color = "primary",
	label = "Loading...",
}: LoaderProps) {
	const sizeClasses = {
		small: "w-4 h-4 border-2",
		medium: "w-8 h-8 border-4",
		large: "w-12 h-12 border-4",
	};

	const colorClasses = {
		primary: "border-primary",
		secondary: "border-secondary",
		accent: "border-accent",
	};

	return (
		<div className="flex justify-center items-center">
			<div
				className={cn(
					sizeClasses[size],
					colorClasses[color],
					"animate-spin rounded-full border-t-transparent",
				)}
				role="status"
				aria-label={label}
			>
				{label && <span className="sr-only">{label}</span>}
			</div>
		</div>
	);
}
