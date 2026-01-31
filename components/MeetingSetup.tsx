'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-react';

import Alert from './Alert';
import { Button } from './ui/button';
import { useMeetingContext } from '@/context/MeetingContext';

interface MediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
}

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();
  const { participantName } = useMeetingContext();

  // Separate state for audio and video
  const [mediaState, setMediaState] = useState<MediaState>({
    audioEnabled: true,
    videoEnabled: true,
  });
  const [isDeviceSettingsOpen, setIsDeviceSettingsOpen] = useState(false);

  // Initialize media devices
  useEffect(() => {
    if (!call) return;

    // Enable both audio and video by default
    call.microphone.enable().catch(console.error);
    call.camera.enable().catch(console.error);
  }, [call]);

  // Handle media state changes
  const toggleAudio = useCallback(async () => {
    if (!call) return;

    setMediaState((prev) => {
      const newAudioState = !prev.audioEnabled;

      if (newAudioState) {
        call.microphone.enable().catch(console.error);
      } else {
        call.microphone.disable().catch(console.error);
      }

      return { ...prev, audioEnabled: newAudioState };
    });
  }, [call]);

  const toggleVideo = useCallback(async () => {
    if (!call) return;

    setMediaState((prev) => {
      const newVideoState = !prev.videoEnabled;

      if (newVideoState) {
        call.camera.enable().catch(console.error);
      } else {
        call.camera.disable().catch(console.error);
      }

      return { ...prev, videoEnabled: newVideoState };
    });
  }, [call]);

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  if (callTimeNotArrived) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="w-full max-w-md">
          <Alert
            title={`Meeting Scheduled`}
            description={`Your meeting is scheduled for ${callStartsAt.toLocaleString()}. Please join at the scheduled time.`}
            icon={<Calendar className="h-10 w-10 text-blue-600" />}
            className="bg-white border border-gray-200 rounded-xl shadow-lg p-6"
          />
        </div>
      </div>
    );
  }

  if (callHasEnded) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="w-full max-w-md">
          <Alert
            title="Meeting Ended"
            description="The host has ended this call. Thank you for participating."
            icon={<AlertCircle className="h-10 w-10 text-red-500" />}
            className="bg-white border border-gray-200 rounded-xl shadow-lg p-6"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 sm:p-6">
      <div className="flex w-full max-w-6xl flex-col gap-8 rounded-2xl bg-white p-6 shadow-xl border border-gray-200 lg:flex-row lg:p-8">
        {/* Header for mobile */}
        <div className="lg:hidden text-center mb-2">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Meeting Setup
          </h1>
          <p className="text-gray-600 text-sm">
            Configure your audio and video settings before joining
          </p>
        </div>

        {/* Video Preview Section */}
        <div className="flex-1">
          <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 z-10 pointer-events-none" />
            <VideoPreview className="w-full rounded-xl" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-sm backdrop-blur-sm border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                {mediaState.audioEnabled ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Mic className="h-4 w-4" />
                    <span className="font-medium">On</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500">
                    <MicOff className="h-4 w-4" />
                    <span className="font-medium">Off</span>
                  </div>
                )}
                <div className="w-px h-4 bg-gray-300 mx-1" />
                {mediaState.videoEnabled ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Video className="h-4 w-4" />
                    <span className="font-medium">On</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500">
                    <VideoOff className="h-4 w-4" />
                    <span className="font-medium">Off</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="flex w-full flex-col gap-6 lg:w-96">
          {/* Header for desktop */}
          <div className="hidden lg:block text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Meeting Setup
            </h1>
            <p className="text-gray-600 text-sm">
              Configure your audio and video settings before joining
            </p>
          </div>

          {/* Audio Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-200 transition-all duration-200 hover:bg-gray-100/60 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${mediaState.audioEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
              >
                {mediaState.audioEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Microphone</p>
                <p className="text-sm text-gray-500">
                  {mediaState.audioEnabled
                    ? 'Your microphone is active'
                    : 'Microphone is muted'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mediaState.audioEnabled}
                onChange={toggleAudio}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer transition-colors duration-200 ${mediaState.audioEnabled ? 'bg-green-500' : ''}`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-all duration-200 ${mediaState.audioEnabled ? 'transform translate-x-5 border-green-500' : ''}`}
                />
              </div>
            </label>
          </div>

          {/* Video Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-200 transition-all duration-200 hover:bg-gray-100/60 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${mediaState.videoEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
              >
                {mediaState.videoEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">Camera</p>
                <p className="text-sm text-gray-500">
                  {mediaState.videoEnabled
                    ? 'Your camera is active'
                    : 'Camera is disabled'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mediaState.videoEnabled}
                onChange={toggleVideo}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer transition-colors duration-200 ${mediaState.videoEnabled ? 'bg-green-500' : ''}`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-all duration-200 ${mediaState.videoEnabled ? 'transform translate-x-5 border-green-500' : ''}`}
                />
              </div>
            </label>
          </div>

          <Button
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-500/20"
            onClick={() => {
              call.join();
              setIsSetupComplete(true);
            }}
          >
            Join Meeting Now
          </Button>

          {/* Participant Info */}
          {participantName && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Joining as:{' '}
                <span className="font-medium text-gray-900">
                  {participantName}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingSetup;
