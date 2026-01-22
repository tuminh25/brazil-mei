'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/events?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <input
        type="text"
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-white/10 border border-white/10 rounded-full px-5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-64 transition-all placeholder:text-gray-500"
      />
      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
        🔍
      </button>
    </form>
  );
}