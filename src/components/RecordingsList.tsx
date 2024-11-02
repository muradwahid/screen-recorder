import React from 'react';
import { Clock, Download, Trash2 } from 'lucide-react';
import type { Recording } from '../types';

interface RecordingsListProps {
  recordings: Recording[];
  onDelete: (id: string) => void;
}

export function RecordingsList({ recordings, onDelete }: RecordingsListProps) {
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Recordings</h2>
      <div className="space-y-3">
        {recordings.map((recording) => (
          <div
            key={recording.id}
            className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <video
                  src={recording.url}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(recording.timestamp)}</span>
                  <span>•</span>
                  <span>{formatDuration(recording.duration)}</span>
                </div>
                <div className="text-sm font-medium mt-1">
                  {recording.type === 'webcam' ? 'Webcam' : 'Screen'} Recording
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={recording.url}
                download={`recording-${recording.timestamp}.webm`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                onClick={() => onDelete(recording.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {recordings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recordings yet. Start recording to see them here!
          </div>
        )}
      </div>
    </div>
  );
}