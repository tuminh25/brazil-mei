"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("./src/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 md:h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
      <span className="text-gray-500 dark:text-gray-300">Loading map...</span>
    </div>
  ),
});

export default function InteractiveMapClient(props: {
  venueName: string;
  latitude?: number | null;
  longitude?: number | null;
}) {
  return <InteractiveMap {...props} />;
}
