'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { User, ArrowRight, X, Video, Lock } from 'lucide-react';

interface NameInputModalProps {
  meetingId: string;
  isOpen: boolean;
  onClose: () => void;
}

const NameInputModal = ({ meetingId, isOpen, onClose }: NameInputModalProps) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleJoinMeeting = async () => {
    if (!name.trim()) {
      toast({
        title: 'Name is required',
        description: 'Please enter your name to join the meeting',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Navigate to meeting with name as query parameter
      const encodedName = encodeURIComponent(name.trim());
      const url = `/meeting/${meetingId}?name=${encodedName}`;
      router.push(url);
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to join the meeting. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinMeeting();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white text-black rounded-xl shadow-2xl border overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full p-1.5 hover:bg-muted transition-colors"
              disabled={isLoading}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="relative p-6 bg-primary text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-xl backdrop-blur-sm">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Join Meeting</h2>
                  <p className="text-primary-foreground/80 text-sm">Enter your name to continue</p>
                </div>
              </div>
              
              {/* Security badge */}
              <div className="flex items-center gap-2 mt-4 text-xs bg-primary-foreground/10 px-3 py-1.5 rounded-full w-fit">
                <Lock className="w-3 h-3" />
                <span>Secure meeting room</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
                
                <div className="p-2  bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Meeting ID:</span>
                    <code className="font-mono text-foreground bg-background px-2 py-1 rounded text-sm">
                      {meetingId}
                    </code>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <button
                  onClick={handleJoinMeeting}
                  disabled={isLoading || !name.trim()}
                  className="flex-1 gap-2 bg-primary rounded-lg flex items-center justify-center text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Meeting
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NameInputModal;