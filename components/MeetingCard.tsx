'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  type?: 'ended' | 'upcoming' | 'recordings';
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
  type = 'upcoming',
}: MeetingCardProps) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  // Get gradient based on meeting type
  const getGradient = () => {
    switch (type) {
      case 'ended':
        return 'bg-gradient-to-br from-dark-2 to-dark-3 border-dark-4';
      case 'upcoming':
        return 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20';
      case 'recordings':
        return 'bg-gradient-to-br from-orange-1/10 to-yellow-1/10 border-orange-1/20';
      default:
        return 'bg-gradient-to-br from-dark-2 to-dark-3 border-dark-4';
    }
  };

  // Get button style based on type
  const getButtonStyle = () => {
    switch (type) {
      case 'ended':
        return 'bg-blue-1 hover:bg-blue-1/90';
      case 'upcoming':
        return 'bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light';
      case 'recordings':
        return 'bg-gradient-to-r from-orange-1 to-yellow-1 hover:from-orange-1/90 hover:to-yellow-1/90';
      default:
        return 'bg-primary hover:bg-primary-light';
    }
  };

  return (
    <motion.section
      className={cn(
        'flex min-h-[280px] w-full flex-col justify-around rounded-2xl p-6 border-2 transition-all duration-300',
        getGradient(),
      )}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <article className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'p-3 rounded-xl backdrop-blur-sm transition-all duration-300',
                type === 'ended'
                  ? 'bg-blue-1/20'
                  : type === 'upcoming'
                    ? 'bg-primary/20'
                    : 'bg-orange-1/20',
              )}
            >
              <Image
                src={icon}
                alt="meeting type"
                width={24}
                height={24}
                className="filter brightness-0 invert"
              />
            </div>
            <motion.span
              className={cn(
                'text-xs font-medium px-3 py-1 rounded-full capitalize',
                type === 'ended'
                  ? 'bg-blue-1/20 text-blue-1'
                  : type === 'upcoming'
                    ? 'bg-primary/20 text-primary-light'
                    : 'bg-orange-1/20 text-orange-1',
              )}
              animate={{ scale: isHovered ? 1.1 : 1 }}
            >
              {type}
            </motion.span>
          </div>

          {/* Time indicator */}
          {type === 'upcoming' && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-green-400">Upcoming</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <motion.h1
            className="text-xl font-bold text-white line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-sm text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {new Date(date).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </motion.p>
        </div>
      </article>

      {/* Footer Section */}
      <article className="flex flex-col gap-4">
        {/* Action Buttons */}
        {!isPreviousMeeting && (
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button
              onClick={handleClick}
              className={cn(
                'flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300',
                getButtonStyle(),
              )}
            >
              {buttonIcon1 && (
                <Image
                  src={buttonIcon1}
                  alt="action"
                  width={16}
                  height={16}
                  className="mr-2 filter brightness-0 invert"
                />
              )}
              {buttonText ||
                (type === 'recordings' ? 'Play Recording' : 'Join Meeting')}
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: 'Link Copied',
                  description: 'Meeting link has been copied to clipboard',
                });
              }}
              className="p-3 rounded-xl bg-dark-4 hover:bg-dark-3 transition-colors duration-300"
            >
              <Image
                src="/icons/copy.svg"
                alt="copy"
                width={16}
                height={16}
                className="filter brightness-0 invert"
              />
            </Button>
          </motion.div>
        )}

        {/* Previous meeting indicator */}
        {isPreviousMeeting && (
          <motion.div
            className="text-center py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-xs text-gray-400 bg-dark-4 px-3 py-1 rounded-full">
              Meeting ended
            </span>
          </motion.div>
        )}
      </article>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-200 -z-10"
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.section>
  );
};

export default MeetingCard;
