import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/src/backend/lib/auth';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Manage destinations, experiences, users, and view analytics for Travebie India.',
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }
  return children;
}
