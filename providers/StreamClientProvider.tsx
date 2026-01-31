'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useMeetingContext } from '@/context/MeetingContext';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { participantName } = useMeetingContext();

  useEffect(() => {
    if (!API_KEY) throw new Error('Stream API key is missing');

    // Create user with the current participant name
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      name: participantName || 'Anonymous User',
    };

    // Create a token provider that uses the specific user ID
    const userTokenProvider = async () => {
      return await tokenProvider(userId);
    };

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user,
      tokenProvider: userTokenProvider,
    });

    setVideoClient(client);
  }, [participantName]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
