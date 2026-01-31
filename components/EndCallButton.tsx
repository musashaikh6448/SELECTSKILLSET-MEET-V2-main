'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useSearchParams } from 'next/navigation';

import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get('usertype');
  const candidateName = searchParams.get('name');

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    await call.endCall();
    
    // If candidate, redirect to feedback page
    if (userType === 'candidate') {
      const candidateId = searchParams.get('candidateId');
      const interviewerId = searchParams.get('interviewerId');
      const roomId = window.location.pathname.split('/meeting/')[1]?.split('?')[0];
      const feedbackUrl = `/feedback/${roomId}?name=${encodeURIComponent(candidateName || 'Candidate')}&usertype=candidate&candidateId=${candidateId}&interviewerId=${interviewerId}`;
      router.push(feedbackUrl);
    } else {
      // For interviewers, go to home
      router.push('/');
    }
  };

  return (
    <Button 
      onClick={endCall} 
      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
    >
      {userType === 'candidate' ? 'End Call & Provide Feedback' : 'End call for everyone'}
    </Button>
  );
};

export default EndCallButton;
