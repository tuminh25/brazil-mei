// Server component chính
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';  // Fix path theo project bạn
import EditForm from './EditForm';  // Tạo client component riêng

export default async function EditEventPage({ params }: { params: { id: string } }) {
  let event;
  try {
    event = await prisma.event.findUnique({ where: { id: params.id } });
  } catch (error) {
    console.error('DB error:', error);
  }
  if (!event) notFound();

  return <EditForm event={event} id={params.id} />;
}
