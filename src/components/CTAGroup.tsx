// src/components/CTAGroup.tsx
import React from "react";

interface CTAGroupProps {
    children: React.ReactNode;
    /** Optional label above the group */
    label?: string;
}

/**
 * Wraps 2 CTAButton components side-by-side on desktop, stacked on mobile.
 * Use at the end of an article or after a key section.
 */
export default function CTAGroup({ children, label }: CTAGroupProps) {
    return (
        <div className="my-8 flex flex-col items-center gap-2">
            {label && (
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    {label}
                </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
                {children}
            </div>
        </div>
    );
}
