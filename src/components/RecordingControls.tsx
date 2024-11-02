import React from 'react';
import { Pause, Play, Square, Video, Monitor } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  videoSource: 'screen' | 'webcam';
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onSourceChange: (source: 'screen' | 'webcam') => void;
}

export function RecordingControls({
  isRecording,
  isPaused,
  videoSource,
  onStart,
  onStop,
  onPause,
  onSourceChange,
}: RecordingControlsProps) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-lg">
      <button
        onClick={() => onSourceChange('webcam')}
        className={`p-2 rounded-full transition-colors ${
          videoSource === 'webcam'
            ? 'bg-purple-100 text-purple-600'
            : 'hover:bg-gray-100'
        }`}
      >
        <Video className="w-5 h-5" />
      </button>
      <button
        onClick={() => onSourceChange('screen')}
        className={`p-2 rounded-full transition-colors ${
          videoSource === 'screen'
            ? 'bg-purple-100 text-purple-600'
            : 'hover:bg-gray-100'
        }`}
      >
        <Monitor className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-200" />
      {!isRecording ? (
        <button
          onClick={onStart}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 transition-colors"
        >
          <div className="w-3 h-3 rounded-full bg-white" />
        </button>
      ) : (
        <>
          <button
            onClick={onPause}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isPaused ? (
              <Play className="w-5 h-5" />
            ) : (
              <Pause className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onStop}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Square className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}