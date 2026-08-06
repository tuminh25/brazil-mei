export default function ResultCard({
  label,
  value,
  sub,
  trend,
  warning,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  warning?: string;
}) {
  const trendColors = { up: 'text-green-400', down: 'text-red-400', neutral: 'text-gray-400' };
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
      <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">{label}</div>
      <div className="text-2xl font-black">{value}</div>
      {sub && <div className={`text-sm mt-1 ${trend ? trendColors[trend] : 'text-gray-500'}`}>{sub}</div>}
      {warning && <div className="mt-2 text-xs text-amber-400">{warning}</div>}
    </div>
  );
}