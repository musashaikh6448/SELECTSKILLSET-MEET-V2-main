'use client';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X } from 'lucide-react';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
  icon?: ReactNode;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  instantMeeting,
  image,
  buttonClassName,
  buttonIcon,
  icon,
}: MeetingModalProps) => {
  // Animation variants
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Modal animation
  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: { opacity: 0, scale: 0.8, y: 20 },
  };

  // Prevent body scroll when modal is open
  if (isOpen && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  } else if (typeof document !== 'undefined') {
    document.body.style.overflow = 'unset';
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={cn(
                'relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-gray-900 shadow-xl',
                className,
              )}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex flex-col items-center gap-6">
                {/* Icon or image */}
                {icon && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex justify-center"
                  >
                    {icon}
                  </motion.div>
                )}

                {image && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex justify-center"
                  >
                    <div className="relative p-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10">
                      <Image
                        src={image}
                        alt="modal icon"
                        width={64}
                        height={64}
                        className="text-primary"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 opacity-20 blur-md -z-10"></div>
                    </div>
                  </motion.div>
                )}

                <motion.h1
                  className={cn(
                    'text-2xl font-bold text-center text-gray-900',
                    className,
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h1>

                <motion.div
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {children}
                </motion.div>

                <motion.div
                  className="w-full mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    className={cn(
                      'w-full py-6 rounded-xl text-base font-semibold transition-all duration-300',
                      'bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light',
                      'hover:shadow-lg hover:shadow-primary/25 text-white',
                      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                      buttonClassName,
                    )}
                    onClick={handleClick}
                  >
                    {buttonIcon && (
                      <Image
                        src={buttonIcon}
                        alt="button icon"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                    )}
                    {buttonText || 'Schedule Meeting'}
                  </Button>
                </motion.div>

                {instantMeeting && (
                  <motion.p
                    className="text-sm text-gray-500 text-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Or{' '}
                    <button
                      onClick={onClose}
                      className="text-primary hover:text-primary-light underline transition-colors"
                    >
                      start later
                    </button>
                  </motion.p>
                )}
              </div>

              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-secondary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-xl"></div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MeetingModal;