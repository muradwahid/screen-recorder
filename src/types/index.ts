export interface RecordingOptions {
  videoSource: 'screen' | 'webcam';
  audioEnabled: boolean;
  resolution: {
    width: number;
    height: number;
  };
}

export interface Recording {
  id: string;
  url: string;
  timestamp: number;
  duration: number;
  type: 'screen' | 'webcam';
}