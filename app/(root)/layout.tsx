import { ReactNode } from 'react';

import StreamVideoProvider from '@/providers/StreamClientProvider';
import { MeetingProvider } from '@/context/MeetingContext';

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <MeetingProvider>
        <StreamVideoProvider>{children}</StreamVideoProvider>
      </MeetingProvider>
    </main>
  );
};

export default RootLayout;
