import React from 'react';
import { Settings } from 'lucide-react';
import { RecordingControls } from './components/RecordingControls';
import { RecordingPreview } from './components/RecordingPreview';
import { RecordingsList } from './components/RecordingsList';
import { useRecorder } from './hooks/useRecorder';
import type { Recording, RecordingOptions } from './types';

const DEFAULT_OPTIONS: RecordingOptions = {
  videoSource: 'webcam',
  audioEnabled: true,
  resolution: {
    width: 1280,
    height: 720,
  },
};

function App() {
  const [recordings, setRecordings] = React.useState<Recording[]>([]);
  const [options, setOptions] = React.useState<RecordingOptions>(DEFAULT_OPTIONS);
  const [showSettings, setShowSettings] = React.useState(false);
  const { isRecording, isPaused, stream, error, startRecording, stopRecording, pauseRecording } = useRecorder();

  const handleStartRecording = async () => {
    await startRecording(options);
  };

  const handleStopRecording = async () => {
    const recording = await stopRecording();
    setRecordings((prev) => [recording, ...prev]);
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((recording) => recording.id !== id));
  };

  const handleSourceChange = (source: 'screen' | 'webcam') => {
    setOptions((prev) => ({ ...prev, videoSource: source }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Video Recorder</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {showSettings && (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-lg font-semibold mb-4">Recording Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Audio
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.audioEnabled}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        audioEnabled: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Enable audio recording
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <select
                  value={`${options.resolution.width}x${options.resolution.height}`}
                  onChange={(e) => {
                    const [width, height] = e.target.value
                      .split('x')
                      .map(Number);
                    setOptions((prev) => ({
                      ...prev,
                      resolution: { width, height },
                    }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="1280x720">HD (1280x720)</option>
                  <option value="1920x1080">Full HD (1920x1080)</option>
                  <option value="2560x1440">2K (2560x1440)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="aspect-video">
            <RecordingPreview stream={stream} />
          </div>

          <div className="flex justify-center">
            <RecordingControls
              isRecording={isRecording}
              isPaused={isPaused}
              videoSource={options.videoSource}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
              onPause={pauseRecording}
              onSourceChange={handleSourceChange}
            />
          </div>

          <RecordingsList
            recordings={recordings}
            onDelete={handleDeleteRecording}
          />
        </div>
      </div>
    </div>
  );
}

export default App;