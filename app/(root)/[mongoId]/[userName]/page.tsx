'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';

const normalizeUserName = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');

const generateRoomId = (mongoId: string, userName: string) => {
  const safeName = normalizeUserName(userName);
  return `room-${mongoId}-${safeName}`;
};

const DeepLinkRoomPage = () => {
  const params = useParams();
  const router = useRouter();
  const client = useStreamVideoClient();

  useEffect(() => {
    const bootstrap = async () => {
      if (!client) return;

      const mongoId = String(params?.mongoId || '');
      const userName = String(params?.userName || '');

      if (!mongoId || !userName) {
        router.replace('/');
        return;
      }

      const roomId = generateRoomId(mongoId, userName);

      try {
        const call = client.call('default', roomId);
        await call.getOrCreate({
          data: {
            starts_at: new Date().toISOString(),
            custom: { mongoId, created_for: userName },
          },
        });

        router.replace(`/meeting/${roomId}?name=${encodeURIComponent(userName)}`);
      } catch (err) {
        console.error('Failed to create or join room from deep link:', err);
        router.replace('/');
      }
    };

    bootstrap();
  }, [client, params, router]);

  return null;
};

export default DeepLinkRoomPage;


