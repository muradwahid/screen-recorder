import React from 'react';

interface RecordingPreviewProps {
  stream: MediaStream | null;
}

export function RecordingPreview({ stream }: RecordingPreviewProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-sm font-medium">Recording</span>
        </div>
      </div>
    </div>
  );
}