import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SELECTSKILLSET-MEET',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const RootLayout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />
      <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-16 sm:px-10">
        <div className="w-full max-w-7xl mx-auto">{children}</div>
      </section>
    </main>
  );
};

export default RootLayout;
