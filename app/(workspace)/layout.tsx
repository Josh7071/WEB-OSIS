import { Sidebar } from '@/components/sidebar';
import { ReactNode } from 'react';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Sidebar />
      <main className="min-h-screen pl-72">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
