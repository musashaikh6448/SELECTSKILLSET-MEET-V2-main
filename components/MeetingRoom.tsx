'use client';
import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import InterviewerFeedbackSidebar from './InterviewerFeedbackSidebar';
import { cn } from '@/lib/utils';
import { useMeetingContext } from '@/context/MeetingContext';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const userType = searchParams.get('usertype');
  const isInterviewer = userType === 'interviewer';
  const isCandidate = userType === 'candidate';
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const { participantName } = useMeetingContext();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-50 pt-4 text-gray-800">
      {/* Participant Name Display */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm">
        <div className="size-2 animate-pulse rounded-full bg-green-500"></div>
        <span className="text-sm font-medium text-gray-800">
          {participantName}
        </span>
        {userType && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isInterviewer 
              ? 'bg-blue-100 text-blue-700' 
              : isCandidate 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-700'
          }`}>
            {userType}
          </span>
        )}
      </div>

      {/* Main Call Layout */}
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        {/* Show participants sidebar only for interviewers */}
        {isInterviewer && (
          <div
            className={cn(
              'absolute right-4 top-4 h-[calc(100vh-120px)] w-64 rounded-lg bg-white/90 p-4 shadow-lg transition-all duration-300 ease-in-out',
              {
                'translate-x-0 opacity-100': showParticipants,
                'translate-x-4 opacity-0': !showParticipants,
              },
            )}
          >
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="call-controlls fixed bottom-6 left-1/2 flex -translate-x-1/2  gap-2 rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur-sm">
        <CallControls onLeave={() => {
          // If candidate leaves, redirect to feedback page
          if (isCandidate) {
            const candidateName = searchParams.get('name');
            const candidateId = searchParams.get('candidateId');
            const interviewerId = searchParams.get('interviewerId');
            const roomId = window.location.pathname.split('/meeting/')[1]?.split('?')[0];
            const feedbackUrl = `/feedback/${roomId}?name=${encodeURIComponent(candidateName || 'Candidate')}&usertype=candidate&candidateId=${candidateId}&interviewerId=${interviewerId}`;
            router.push(feedbackUrl);
          } else {
            router.push('/');
          }
        }} />

        {/* Layout Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex size-10 items-center justify-center rounded-lg bg-primary p-2 text-white hover:bg-primary-dark">
              <LayoutList size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-40 border border-gray-200 bg-white shadow-lg">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

            {/* Participants Toggle - Only show for interviewers */}
            {isInterviewer && (
              <button
                onClick={() => setShowParticipants((prev) => !prev)}
                className="flex size-10 items-center justify-center rounded-lg bg-primary p-2 text-white hover:bg-primary-dark"
              >
                <Users size={20} />
              </button>
            )}

            {/* Feedback Toggle - Only show for interviewers */}
            {isInterviewer && (
              <button
                onClick={() => setShowFeedback((prev) => !prev)}
                className="flex size-10 items-center justify-center rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                title="Candidate Feedback"
              >
                <MessageSquare size={20} />
              </button>
            )}

        {/* End Call Button (if not personal room) */}
        {!isPersonalRoom && <EndCallButton />}
      </div>

      {/* Interviewer Feedback Sidebar */}
      {isInterviewer && (
        <InterviewerFeedbackSidebar
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          candidateName={participantName || 'Candidate'}
          candidateId={searchParams.get('candidateId') || ''}
          interviewerId={searchParams.get('interviewerId') || ''}
          roomId={window.location.pathname.split('/meeting/')[1]?.split('?')[0] || ''}
        />
      )}
    </section>
  );
};

export default MeetingRoom;
