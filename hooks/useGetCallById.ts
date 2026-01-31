import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;
    
    const loadCall = async () => {
      try {
        const callId = Array.isArray(id) ? id[0] : id;
        if (!callId) {
          setIsCallLoading(false);
          return;
        }

        // Try to get the call directly
        const handle = client.call('default', callId);
        try {
          await handle.get();
          setCall(handle);
          setIsCallLoading(false);
          return;
        } catch {
          // If not found, create it on-demand
          try {
            await handle.getOrCreate({
              data: {
                starts_at: new Date().toISOString(),
              },
            });
            setCall(handle);
            setIsCallLoading(false);
            return;
          } catch {}
        }

        // Fallback to query if both direct get and create failed
        const { calls } = await client.queryCalls({ filter_conditions: { id: callId } });
        if (calls.length > 0) setCall(calls[0]);
        setIsCallLoading(false);
      } catch (error) {
        console.error(error);
        setIsCallLoading(false);
      }
    };

    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};
