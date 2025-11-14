import { useState, useEffect } from 'react';
import { ScriptLine, VideoClip, AppConfig } from '../types';
import { Play, Pause, Scissors, RefreshCw, Download, Loader2, Video } from 'lucide-react';

interface VideoGenerationProps {
  scriptLines: ScriptLine[];
  videoClips: VideoClip[];
  setVideoClips: React.Dispatch<React.SetStateAction<VideoClip[]>>;
  config: AppConfig;
  updateProgress: (percentage: number, completed: boolean) => void;
}

export default function VideoGeneration({
  scriptLines,
  videoClips,
  setVideoClips,
  config,
  updateProgress,
}: VideoGenerationProps) {
  const [generating, setGenerating] = useState(false);
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);

  useEffect(() => {
    if (videoClips.length > 0) {
      const readyClips = videoClips.filter(clip => clip.status === 'ready').length;
      const percentage = (readyClips / scriptLines.length) * 100;
      updateProgress(percentage, readyClips === scriptLines.length);
    }
  }, [videoClips, scriptLines.length, updateProgress]);

  const generateAllClips = async () => {
    if (!config.qwenApiKey) {
      alert('Please configure your Qwen API key in settings');
      return;
    }

    setGenerating(true);

    // Create initial clips in generating state
    const initialClips: VideoClip[] = scriptLines.map(line => ({
      id: `clip-${line.id}`,
      scriptLineId: line.id,
      url: '',
      duration: 0,
      timestamp: new Date(),
      status: 'generating',
    }));

    setVideoClips(initialClips);

    // Simulate generation with staggered completion
    scriptLines.forEach((line, index) => {
      setTimeout(() => {
        setVideoClips((prev: VideoClip[]) =>
          prev.map((clip): VideoClip =>
            clip.scriptLineId === line.id
              ? {
                  ...clip,
                  url: `https://example.com/video-${line.id}.mp4`,
                  duration: Math.floor(Math.random() * 10) + 5,
                  status: 'ready',
                }
              : clip
          )
        );

        if (index === scriptLines.length - 1) {
          setGenerating(false);
        }
      }, (index + 1) * 1500);
    });
  };

  const regenerateClip = (clipId: string) => {
    setVideoClips(
      videoClips.map(clip =>
        clip.id === clipId
          ? { ...clip, status: 'generating' }
          : clip
      )
    );

    setTimeout(() => {
      setVideoClips((prev: VideoClip[]) =>
        prev.map((clip): VideoClip =>
          clip.id === clipId
            ? {
                ...clip,
                url: `https://example.com/video-${clipId}-${Date.now()}.mp4`,
                duration: Math.floor(Math.random() * 10) + 5,
                status: 'ready',
                timestamp: new Date(),
              }
            : clip
        )
      );
    }, 2000);
  };

  const togglePlayPause = (clipId: string) => {
    setPlayingClipId(playingClipId === clipId ? null : clipId);
  };

  const getScriptLineForClip = (clip: VideoClip) => {
    return scriptLines.find(line => line.id === clip.scriptLineId);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text">Video Generation</h2>
          <p className="text-sm text-textMuted mt-1">Generate video clips using Qwen AI</p>
        </div>
        <div className="flex gap-3">
          {videoClips.length === 0 && (
            <button
              onClick={generateAllClips}
              disabled={generating || scriptLines.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primaryHover disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors"
            >
              <Play className={`w-4 h-4 ${generating ? 'animate-pulse' : ''}`} />
              {generating ? 'Generating...' : 'Generate All Videos'}
            </button>
          )}
          {videoClips.length > 0 && videoClips.every(c => c.status === 'ready') && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-success hover:bg-success/80 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Timeline
            </button>
          )}
        </div>
      </div>

      {videoClips.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border p-12 text-center">
          <Play className="w-16 h-16 text-textMuted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">No Videos Generated Yet</h3>
          <p className="text-textMuted mb-6">
            {scriptLines.length === 0
              ? 'Create script and b-roll prompts first'
              : 'Click "Generate All Videos" to start creating video clips'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Timeline View */}
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Timeline
            </h3>

            <div className="relative">
              {/* Timeline ruler */}
              <div className="flex items-center gap-1 mb-2 overflow-x-auto pb-2">
                {videoClips.map((clip, index) => {
                  const scriptLine = getScriptLineForClip(clip);
                  const isPlaying = playingClipId === clip.id;

                  return (
                    <div
                      key={clip.id}
                      className={`flex-shrink-0 h-20 rounded border-2 transition-all ${
                        isPlaying
                          ? 'border-primary shadow-lg shadow-primary/30'
                          : clip.status === 'ready'
                          ? 'border-border hover:border-primary/50'
                          : 'border-border'
                      }`}
                      style={{ width: `${clip.duration * 20}px`, minWidth: '80px' }}
                    >
                      <div className="h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded flex flex-col items-center justify-center p-2 relative overflow-hidden">
                        {clip.status === 'generating' && (
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        )}
                        {clip.status === 'ready' && (
                          <>
                            <span className="text-xs font-mono text-text mb-1">#{index + 1}</span>
                            <span className="text-xs text-textMuted">{formatDuration(clip.duration)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="relative h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all"
                  style={{
                    width: `${(videoClips.filter(c => c.status === 'ready').length / videoClips.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Clip Details */}
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-3 bg-background border-b border-border">
              <h3 className="font-semibold text-text">Generated Clips</h3>
            </div>

            <div className="divide-y divide-border">
              {videoClips.map((clip, index) => {
                const scriptLine = getScriptLineForClip(clip);
                const isPlaying = playingClipId === clip.id;

                return (
                  <div key={clip.id} className="p-4 hover:bg-surfaceHover transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Preview thumbnail */}
                      <div className="w-32 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {clip.status === 'generating' ? (
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        ) : (
                          <>
                            <span className="text-2xl font-bold text-white opacity-50">#{index + 1}</span>
                            {isPlaying && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Clip info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-text mb-1">
                              Clip {index + 1} - Line {scriptLine?.lineNumber}
                            </h4>
                            <p className="text-sm text-textMuted line-clamp-2 mb-2">
                              {scriptLine?.text}
                            </p>
                            <div className="text-xs text-textMuted">
                              Prompt: <span className="text-text">{scriptLine?.editedPrompt || scriptLine?.generatedPrompt}</span>
                            </div>
                          </div>

                          {clip.status === 'ready' && (
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => togglePlayPause(clip.id)}
                                className="p-2 rounded-lg bg-primary hover:bg-primaryHover text-white transition-colors"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                              >
                                {isPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                className="p-2 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-textMuted hover:text-text transition-colors"
                                aria-label="Trim"
                              >
                                <Scissors className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => regenerateClip(clip.id)}
                                className="p-2 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-textMuted hover:text-text transition-colors"
                                aria-label="Regenerate"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {clip.status === 'ready' && (
                          <div className="flex items-center gap-4 text-xs text-textMuted">
                            <span>Duration: {formatDuration(clip.duration)}</span>
                            <span>•</span>
                            <span className="text-success">Ready</span>
                          </div>
                        )}
                        {clip.status === 'generating' && (
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Generating video...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {videoClips.length > 0 && (
        <div className="mt-4 bg-primary/10 border border-primary/30 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-text">
              <span className="font-semibold">{videoClips.filter(c => c.status === 'ready').length}</span> of{' '}
              <span className="font-semibold">{videoClips.length}</span> clips ready
            </div>
            <div className="text-textMuted">
              Total duration: {formatDuration(videoClips.reduce((sum, clip) => sum + clip.duration, 0))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
