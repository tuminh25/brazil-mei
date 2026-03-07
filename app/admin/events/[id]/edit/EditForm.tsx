'use client';
import { useState } from 'react';
import { revalidatePath } from 'next/cache';

interface Event {
  id: string;
  title: string;
  description: string;
}

export default function EditForm({ event, id }: { event: Event; id: string }) {
  const [data, setData] = useState(event);

  const handleSave = async () => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      revalidatePath('/events');
      alert('Saved!');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1>Edit {data.title}</h1>
      <textarea
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        className="w-full p-4 border rounded mb-4 h-40"
      />
      <button onClick={handleSave} className="bg-blue-500 text-white px-6 py-2 rounded">
        Save Update
      </button>
    </div>
  );
}
