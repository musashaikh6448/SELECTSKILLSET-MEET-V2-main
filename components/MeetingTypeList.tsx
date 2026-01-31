'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import {
  Plus,
  Video,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  Copy,
} from 'lucide-react';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

// Card data configuration
const meetingCards = [
  {
    id: 1,
    title: 'New Meeting',
    description: 'Start an instant meeting',
    icon: Plus,
    color: 'from-primary to-secondary',
    state: 'isInstantMeeting',
  },
  {
    id: 2,
    title: 'Join Meeting',
    description: 'via invitation link',
    icon: Video,
    color: 'from-blue-400 to-blue-600',
    state: 'isJoiningMeeting',
  },
  {
    id: 3,
    title: 'Schedule Meeting',
    description: 'Plan your meeting',
    icon: Calendar,
    color: 'from-purple-500 to-purple-700',
    state: 'isScheduleMeeting',
  }
];

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}?action=join`);
      }
      toast({
        title: 'Meeting Created',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };

  if (!client) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <motion.section
        className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {meetingCards.map((card) => {
          const IconComponent = card.icon;

          return (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
              onClick={() =>
                card.state === 'recordings'
                  ? router.push('/recordings')
                  : setMeetingState(card.state as any)
              }
            >
              {/* Main Card */}
              <div
                className={`
                relative h-48 rounded-2xl p-6 overflow-hidden
                bg-gradient-to-br ${card.color}
                shadow-lg transition-all duration-300
                group-hover:shadow-xl
              `}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-sm text-white/90">
                        {card.description}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80">
                      Click to start
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Glow effect */}
              <div
                className={`
                absolute -inset-2 rounded-2xl bg-gradient-to-br ${card.color} 
                opacity-0 group-hover:opacity-30 blur-xl transition-opacity
                -z-10
              `}
              ></div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Modals */}
      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-gray-700">
              Add a description
            </label>
            <Textarea
              className="border border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-primary"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              placeholder="Meeting description"
            />
          </div>
          <div className="flex w-full flex-col gap-2.5 mt-4">
            <label className="text-base font-normal leading-[22.4px] text-gray-700">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded border border-gray-300 bg-white p-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link Copied' });
          }}
          icon={CheckCircle}
          buttonIcon={Copy}
          className="text-center"
          buttonText="Copy Meeting Link"
        >
          <p className="text-gray-600 mb-4">
            Your meeting has been scheduled successfully!
          </p>
        </MeetingModal>
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Join Meeting"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => {
          // Extract meeting ID from the link and redirect to name input
          const meetingId = values.link.split('/meeting/')[1];
          if (meetingId) {
            router.push(`/meeting/${meetingId}?action=join`);
          } else {
            toast({ title: 'Invalid meeting link' });
          }
        }}
      >
        <Input
          placeholder="Paste meeting link here"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-primary"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={async () => {
          if (!client) return;
          try {
            const id = crypto.randomUUID();
            const call = client.call('default', id);
            if (!call) throw new Error('Failed to create meeting');
            await call.getOrCreate({
              data: {
                starts_at: new Date().toISOString(),
                custom: {
                  description: 'Instant Meeting',
                },
              },
            });
            toast({ title: 'Meeting Created' });
            router.push(`/meeting/${call.id}?action=join`);
          } catch (error) {
            console.error(error);
            toast({ title: 'Failed to create Meeting' });
          }
        }}
      >
        <p className="text-gray-600">
          Start a meeting immediately with default settings.
        </p>
      </MeetingModal>
    </>
  );
};

export default MeetingTypeList;
