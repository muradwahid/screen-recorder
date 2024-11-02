import { useState, useCallback, useRef } from 'react';
import type { RecordingOptions, Recording } from '../types';

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startTime = useRef<number>(0);

  const startRecording = useCallback(async (options: RecordingOptions) => {
    try {
      setError(null);
      let mediaStream: MediaStream;
      
      if (options.videoSource === 'screen') {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: options.resolution.width,
            height: options.resolution.height,
          },
          audio: options.audioEnabled,
        });
      } else {
        // Check if webcam is available first
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasWebcam = devices.some(device => device.kind === 'videoinput');
        
        if (!hasWebcam) {
          throw new Error('No webcam found. Please connect a webcam and try again.');
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: options.resolution.width,
            height: options.resolution.height,
          },
          audio: options.audioEnabled,
        });
      }

      setStream(mediaStream);
      mediaRecorder.current = new MediaRecorder(mediaStream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.start();
      startTime.current = Date.now();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      let errorMessage = 'An error occurred while starting the recording.';
      
      if (error instanceof Error) {
        if (error.name === 'NotFoundError' || error.name === 'NotReadableError') {
          errorMessage = 'Unable to access the camera. Please make sure it\'s properly connected and not in use by another application.';
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'Permission to use camera/microphone was denied. Please allow access and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error starting recording:', error);
    }
  }, []);

  const stopRecording = useCallback((): Promise<Recording> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current || !stream) return;

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const duration = (Date.now() - startTime.current) / 1000;

        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setIsRecording(false);
        setIsPaused(false);
        setError(null);

        resolve({
          id: Date.now().toString(),
          url,
          timestamp: startTime.current,
          duration,
          type: stream.getVideoTracks()[0].label.toLowerCase().includes('screen')
            ? 'screen'
            : 'webcam',
        });
      };

      mediaRecorder.current.stop();
    });
  }, [stream]);

  const pauseRecording = useCallback(() => {
    if (!mediaRecorder.current) return;
    
    if (isPaused) {
      mediaRecorder.current.resume();
    } else {
      mediaRecorder.current.pause();
    }
    setIsPaused(!isPaused);
  }, [isPaused]);

  return {
    isRecording,
    isPaused,
    stream,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
  };
}