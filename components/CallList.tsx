'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { motion, AnimatePresence } from 'framer-motion';

import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  const getHeaderConfig = () => {
    switch (type) {
      case 'ended':
        return {
          title: 'Previous Calls',
          subtitle: 'Review your past meeting sessions',
          icon: '/icons/previous.svg',
          gradient: 'from-blue-1 to-primary'
        };
      case 'upcoming':
        return {
          title: 'Upcoming Calls',
          subtitle: 'Your scheduled meetings',
          icon: '/icons/upcoming.svg',
          gradient: 'from-purple-1 to-secondary'
        };
      case 'recordings':
        return {
          title: 'Recordings',
          subtitle: 'Access your meeting recordings',
          icon: '/icons/recordings.svg',
          gradient: 'from-orange-1 to-yellow-1'
        };
      default:
        return {
          title: 'Calls',
          subtitle: '',
          icon: '',
          gradient: 'from-primary to-secondary'
        };
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  const headerConfig = getHeaderConfig();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
         type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <motion.div 
        className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
            <img 
              src={headerConfig.icon} 
              alt={headerConfig.title}
              className="w-8 h-8 filter brightness-0 invert"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{headerConfig.title}</h2>
            <p className="text-gray-600">{headerConfig.subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Calls Grid */}
      <motion.div
        className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {calls && calls.length > 0 ? (
            calls.map((meeting: Call | CallRecording, index) => (
              <motion.div
                key={(meeting as Call).id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ delay: index * 0.1 }}
              >
                <MeetingCard
                  icon={
                    type === 'ended'
                      ? '/icons/previous.svg'
                      : type === 'upcoming'
                        ? '/icons/upcoming.svg'
                        : '/icons/recordings.svg'
                  }
                  title={
                    (meeting as Call).state?.custom?.description ||
                    (meeting as CallRecording).filename?.substring(0, 20) ||
                    'Personal Meeting'
                  }
                  date={
                    (meeting as Call).state?.startsAt?.toLocaleString() ||
                    (meeting as CallRecording).start_time?.toLocaleString()
                  }
                  isPreviousMeeting={type === 'ended'}
                  link={
                    type === 'recordings'
                      ? (meeting as CallRecording).url
                      : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                  }
                  buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                  buttonText={type === 'recordings' ? 'Play' : 'Start'}
                  handleClick={
                    type === 'recordings'
                      ? () => router.push(`${(meeting as CallRecording).url}`)
                      : () => router.push(`/meeting/${(meeting as Call).id}`)
                  }
                  type={type}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gray-100">
                  <img 
                    src={headerConfig.icon} 
                    alt={noCallsMessage}
                    className="w-12 h-12 opacity-70"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{noCallsMessage}</h2>
                <p className="text-gray-600 max-w-md">
                  {type === 'upcoming' 
                    ? 'Schedule a new meeting to see it here.' 
                    : type === 'ended'
                      ? 'Your completed meetings will appear here.'
                      : 'Recordings from your meetings will be available here.'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats Footer */}
      {calls && calls.length > 0 && (
        <motion.div 
          className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-600 text-center">
            Showing {calls.length} {type === 'ended' ? 'completed' : type} 
            {calls.length === 1 ? ' call' : ' calls'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CallList;