// Server component chính
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';  // Fix path theo project bạn
import EditForm from './EditForm';  // Tạo client component riêng

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let event;
  try {
    event = await prisma.event.findUnique({ where: { id: Number(id) } });
  } catch (error) {
    console.error('DB error:', error);
  }
  if (!event) notFound();

  return <EditForm event={event} id={id} />;
}
