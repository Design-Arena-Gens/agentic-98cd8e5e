'use client';

import { useState } from 'react';
import { Stage, NewsIdea, Script, ScriptLine, VideoClip, StageProgress, AppConfig } from './types';
import StageNavigator from './components/StageNavigator';
import ProgressTracker from './components/ProgressTracker';
import IdeaGeneration from './components/IdeaGeneration';
import ScriptCreation from './components/ScriptCreation';
import BrollPrompting from './components/BrollPrompting';
import VideoGeneration from './components/VideoGeneration';
import ConfigPanel from './components/ConfigPanel';
import { Settings } from 'lucide-react';

export default function Home() {
  const [currentStage, setCurrentStage] = useState<Stage>('idea-generation');
  const [showConfig, setShowConfig] = useState(false);

  const [config, setConfig] = useState<AppConfig>({
    aiModel: 'gpt-4',
    qwenApiKey: '',
  });

  const [ideas, setIdeas] = useState<NewsIdea[]>([]);
  const [script, setScript] = useState<Script>({
    id: '1',
    content: '',
    versions: [],
    currentVersion: 0,
  });
  const [scriptLines, setScriptLines] = useState<ScriptLine[]>([]);
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);

  const [progress, setProgress] = useState<StageProgress[]>([
    { stage: 'idea-generation', completed: false, percentage: 0 },
    { stage: 'script-creation', completed: false, percentage: 0 },
    { stage: 'broll-prompting', completed: false, percentage: 0 },
    { stage: 'video-generation', completed: false, percentage: 0 },
  ]);

  const updateProgress = (stage: Stage, percentage: number, completed: boolean) => {
    setProgress(prev =>
      prev.map(p =>
        p.stage === stage ? { ...p, percentage, completed } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">AI Video Creation Agent</h1>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-lg hover:bg-surfaceHover transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 text-text" />
          </button>
        </div>
      </header>

      {showConfig && (
        <ConfigPanel config={config} setConfig={setConfig} onClose={() => setShowConfig(false)} />
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        <ProgressTracker progress={progress} currentStage={currentStage} />

        <StageNavigator
          currentStage={currentStage}
          onStageChange={setCurrentStage}
          progress={progress}
        />

        <main className="mt-6">
          {currentStage === 'idea-generation' && (
            <IdeaGeneration
              ideas={ideas}
              setIdeas={setIdeas}
              updateProgress={(percentage, completed) =>
                updateProgress('idea-generation', percentage, completed)
              }
              onNext={() => setCurrentStage('script-creation')}
            />
          )}

          {currentStage === 'script-creation' && (
            <ScriptCreation
              script={script}
              setScript={setScript}
              ideas={ideas}
              config={config}
              updateProgress={(percentage, completed) =>
                updateProgress('script-creation', percentage, completed)
              }
              onNext={() => setCurrentStage('broll-prompting')}
            />
          )}

          {currentStage === 'broll-prompting' && (
            <BrollPrompting
              script={script}
              scriptLines={scriptLines}
              setScriptLines={setScriptLines}
              config={config}
              updateProgress={(percentage, completed) =>
                updateProgress('broll-prompting', percentage, completed)
              }
              onNext={() => setCurrentStage('video-generation')}
            />
          )}

          {currentStage === 'video-generation' && (
            <VideoGeneration
              scriptLines={scriptLines}
              videoClips={videoClips}
              setVideoClips={setVideoClips}
              config={config}
              updateProgress={(percentage, completed) =>
                updateProgress('video-generation', percentage, completed)
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
