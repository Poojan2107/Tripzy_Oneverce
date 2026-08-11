import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/src/backend/lib/auth';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Manage destinations, experiences, users, and view analytics for Travebie India.',
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
