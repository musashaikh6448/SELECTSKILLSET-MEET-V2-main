'use client';
import { useState, useEffect } from 'react';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';
import NameInputModal from '@/components/NameInputModal';
import { useMeetingContext } from '@/context/MeetingContext';
import InterviewerFeedbackSidebar from '@/components/InterviewerFeedbackSidebar';

const MeetingPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { call, isCallLoading } = useGetCallById(id);
  const { setParticipantName } = useMeetingContext();

  // Get name from URL params
  const userName = searchParams.get('name');
  const action = searchParams.get('action');
  const userType = searchParams.get('usertype');

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showFeedbackSidebar, setShowFeedbackSidebar] = useState(false);

  // Auto-show sidebar for interviewers
  useEffect(() => {
    if (userType === 'interviewer') {
      setShowFeedbackSidebar(true);
    }
  }, [userType]);

  // Handle name input logic
  useEffect(() => {
    if (action === 'join' && !userName) {
      setShowNameInput(true);
    } else if (userName) {
      const decodedName = decodeURIComponent(userName);
      setParticipantName(decodedName);
      setShowNameInput(false);
    } else if (!action && !userName) {
      setShowNameInput(true);
    }
  }, [action, userName, setParticipantName]);

  const toggleSidebar = () => {
    setShowFeedbackSidebar(!showFeedbackSidebar);
  };

  const closeSidebar = () => {
    setShowFeedbackSidebar(false);
  };

  if (isCallLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="size-10 animate-spin text-primary-light" />
          <p className="text-primary font-xl">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader className="size-10 animate-spin text-blue-600" />
          <p className="text-gray-600 font-medium">Preparing your room…</p>
        </div>
      </div>
    );
  }

  // Show name input modal if needed
  if (showNameInput) {
    return (
      <NameInputModal
        meetingId={id as string}
        isOpen={showNameInput}
        onClose={() => setShowNameInput(false)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-purple-100 blur-3xl" />
      </div>

      <StreamCall call={call}>
        <StreamTheme>
          <div className="relative z-10">
            {/* Sidebar Toggle Button */}
            {userType === 'interviewer' && isSetupComplete && (
              <button
                onClick={toggleSidebar}
                className={`fixed top-4 z-30 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ${
                  showFeedbackSidebar ? 'right-96 mr-4' : 'right-4'
                }`}
              >
                {showFeedbackSidebar ? (
                  <>
                    <PanelLeftClose className="size-4" />
                    <span className="text-sm">Close Feedback</span>
                  </>
                ) : (
                  <>
                    <PanelLeft className="size-4" />
                    <span className="text-sm">Open Feedback</span>
                  </>
                )}
              </button>
            )}

            {/* Main Content Area */}
            <div
              className={`transition-all duration-300 ${
                showFeedbackSidebar ? 'mr-96' : 'mr-0'
              }`}
            >
              {!isSetupComplete ? (
                <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
              ) : (
                <MeetingRoom />
              )}
            </div>

            {/* Feedback Sidebar for Interviewers */}
            {showFeedbackSidebar && isSetupComplete && (
              <InterviewerFeedbackSidebar
                candidateName={userName || 'Candidate'}
                candidateId={searchParams.get('candidateId') || ''}
                interviewerId={searchParams.get('interviewerId') || ''}
                roomId={id as string}
                onClose={closeSidebar}
                isOpen={showFeedbackSidebar}
              />
            )}
          </div>
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
