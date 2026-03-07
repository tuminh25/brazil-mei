// src/components/CTAButton.tsx
import React from "react";

type Partner = "klook" | "tripcom";
type Variant = "primary" | "secondary";

interface CTAButtonProps {
    href: string;
    label: string;
    partner: Partner;
    variant?: Variant;
    disclaimer?: string;
}

// Partner config: brand color, text color, subtle label
const PARTNER_CONFIG: Record<Partner, { color: string; hoverColor: string; textColor: string; borderColor: string; name: string; badge: string }> = {
    klook: {
        color: "bg-yellow-500",
        hoverColor: "hover:bg-yellow-400",
        textColor: "text-black",
        borderColor: "border-yellow-500",
        name: "Klook",
        badge: "K",
    },
    tripcom: {
        color: "bg-red-600",
        hoverColor: "hover:bg-red-500",
        textColor: "text-white",
        borderColor: "border-red-600",
        name: "Trip.com",
        badge: "T",
    },
};

export default function CTAButton({
    href,
    label,
    partner,
    variant = "primary",
    disclaimer,
}: CTAButtonProps) {
    const config = PARTNER_CONFIG[partner];

    const isPrimary = variant === "primary";

    return (
        <div className="my-4 flex flex-col items-center text-center">
            <a
                href={href}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className={[
                    // Base styles
                    "inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold tracking-wide transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    // Variant styles
                    isPrimary
                        ? `${config.color} ${config.hoverColor} ${config.textColor} shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-100`
                        : `bg-transparent border ${config.borderColor} ${config.textColor === "text-black" ? "text-yellow-400" : "text-red-400"} hover:bg-white/5 hover:scale-[1.02] active:scale-100`,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                {/* Partner badge dot */}
                <span
                    className={[
                        "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black shrink-0",
                        isPrimary
                            ? config.textColor === "text-black"
                                ? "bg-black/20 text-black"
                                : "bg-white/20 text-white"
                            : `${config.color} ${config.textColor}`,
                    ].join(" ")}
                    aria-hidden="true"
                >
                    {config.badge}
                </span>
                {label}
                {/* External link arrow */}
                <svg
                    className="ml-0.5 h-3.5 w-3.5 shrink-0 opacity-70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
            </a>

            {disclaimer && (
                <p className="mt-2 text-[11px] text-gray-500 leading-relaxed max-w-xs">
                    {disclaimer}
                </p>
            )}
        </div>
    );
}
