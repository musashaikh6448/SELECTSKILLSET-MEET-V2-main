'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MeetingContextType {
  participantName: string;
  setParticipantName: (name: string) => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const useMeetingContext = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeetingContext must be used within a MeetingProvider');
  }
  return context;
};

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [participantName, setParticipantName] = useState<string>('Anonymous User');

  const updateParticipantName = (name: string) => {
    setParticipantName(name);
  };

  return (
    <MeetingContext.Provider value={{ participantName, setParticipantName: updateParticipantName }}>
      {children}
    </MeetingContext.Provider>
  );
};
