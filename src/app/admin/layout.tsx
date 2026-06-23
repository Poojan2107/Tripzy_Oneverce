import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Manage destinations, experiences, users, and view analytics for Tripzy India.',
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
