'use client';

import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useGetCallById } from '@/hooks/useGetCallById';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center">
      <h2 className="text-base font-medium text-primary lg:text-xl xl:min-w-32">
        {title}:
      </h2>
      <p className="truncate text-sm font-semibold text-foreground max-sm:max-w-[320px] lg:text-xl">
        {description}
      </p>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const [userName, setUserName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Generate a personal meeting ID based on user input
  const meetingId = userName
    ? `personal-${userName.toLowerCase().replace(/\s+/g, '-')}`
    : '';

  const { call } = useGetCallById(meetingId);

  const startRoom = async () => {
    if (!client || !userName) return;

    setIsCreating(true);

    try {
      const newCall = client.call('default', meetingId);

      if (!call) {
        await newCall.getOrCreate({
          data: {
            starts_at: new Date().toISOString(),
          },
        });
      }

      router.push(
        `/meeting/${meetingId}?personal=true&name=${encodeURIComponent(userName)}`,
      );
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Failed to create room',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const meetingLink = userName
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink);
    toast({
      title: 'Link Copied to Clipboard',
    });
  };

  return (
    <section className="flex size-full flex-col gap-6 text-foreground p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className=" font-bold text-4xl text-primary">
          Personal Meeting Room
        </h1>
      </div>

      {!userName ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Your Room</CardTitle>
            <CardDescription>
              Enter your name to generate a personal meeting room
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Your Name</Label>
              <Input
                id="userName"
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full"
              />
            </div>
            <button
              className="w-full bg-primary py-3 text-white text-md rounded-lg"
              onClick={() => {
                if (userName.trim()) {
                  setUserName(userName.trim());
                } else {
                  toast({
                    title: 'Please enter your name',
                    variant: 'destructive',
                  });
                }
              }}
              disabled={!userName.trim()}
            >
              Create Personal Room
            </button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
              <CardDescription>
                Share these details with participants to join your meeting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table title="Topic" description={`${userName}'s Meeting Room`} />
              <Table title="Meeting ID" description={meetingId} />
              <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center">
                <h2 className="text-base font-medium text-primary lg:text-xl xl:min-w-32">
                  Invite Link:
                </h2>
                <div className="flex items-center gap-2 w-full max-w-full">
                  <p className="truncate text-sm font-semibold text-foreground max-w-[70%] lg:text-xl">
                    {meetingLink}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="flex-1 bg-primary rounded-lg"
              onClick={startRoom}
              disabled={isCreating}
            
            >
              {isCreating ? 'Creating...' : 'Start Meeting'}
            </button>
            <Button
              variant="outline"
              onClick={() => setUserName('')}
              className="flex-1  text-black"
            >
              Change Name
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default PersonalRoom;
