import { Stage, StageProgress } from '../types';
import { Lightbulb, FileText, Image, Video } from 'lucide-react';

interface StageNavigatorProps {
  currentStage: Stage;
  onStageChange: (stage: Stage) => void;
  progress: StageProgress[];
}

const stages = [
  { id: 'idea-generation' as Stage, label: 'Idea Generation', icon: Lightbulb },
  { id: 'script-creation' as Stage, label: 'Script Creation', icon: FileText },
  { id: 'broll-prompting' as Stage, label: 'B-roll Prompting', icon: Image },
  { id: 'video-generation' as Stage, label: 'Video Generation', icon: Video },
];

export default function StageNavigator({ currentStage, onStageChange, progress }: StageNavigatorProps) {
  return (
    <nav className="bg-surface rounded-lg p-2 flex gap-2 overflow-x-auto">
      {stages.map((stage, index) => {
        const isActive = currentStage === stage.id;
        const stageProgress = progress.find(p => p.stage === stage.id);
        const isCompleted = stageProgress?.completed || false;
        const Icon = stage.icon;

        return (
          <button
            key={stage.id}
            onClick={() => onStageChange(stage.id)}
            className={`flex-1 min-w-[180px] px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              isActive
                ? 'bg-primary text-white shadow-lg'
                : isCompleted
                ? 'bg-success/20 text-success hover:bg-success/30'
                : 'bg-surface hover:bg-surfaceHover text-textMuted'
            }`}
            aria-label={stage.label}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <div className="text-left flex-1">
              <div className="font-medium text-sm">{stage.label}</div>
              {stageProgress && stageProgress.percentage > 0 && (
                <div className="text-xs mt-1 opacity-80">{stageProgress.percentage}%</div>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
