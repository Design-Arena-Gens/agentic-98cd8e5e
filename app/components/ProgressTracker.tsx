import { Stage, StageProgress } from '../types';

interface ProgressTrackerProps {
  progress: StageProgress[];
  currentStage: Stage;
}

export default function ProgressTracker({ progress, currentStage }: ProgressTrackerProps) {
  const totalProgress =
    progress.reduce((sum, stage) => sum + stage.percentage, 0) / progress.length;

  const completedStages = progress.filter(p => p.completed).length;

  return (
    <div className="bg-surface rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-text">Overall Progress</h2>
        <span className="text-sm text-textMuted">
          {completedStages} / {progress.length} stages completed
        </span>
      </div>

      <div className="relative w-full h-2 bg-border rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      <div className="mt-3 text-sm text-textMuted">
        {totalProgress === 100 ? (
          <span className="text-success">All stages completed!</span>
        ) : (
          <span>Currently working on: <span className="text-text font-medium capitalize">{currentStage.replace('-', ' ')}</span></span>
        )}
      </div>
    </div>
  );
}
