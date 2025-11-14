export type Stage = 'idea-generation' | 'script-creation' | 'broll-prompting' | 'video-generation';

export type SentimentType = 'positive' | 'neutral' | 'negative';
export type InterestLevel = 'high' | 'medium' | 'low';

export interface NewsIdea {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
  sentiment: SentimentType;
  interestLevel: InterestLevel;
  approved: boolean | null;
  timestamp: Date;
}

export interface ScriptVersion {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
}

export interface Script {
  id: string;
  content: string;
  versions: ScriptVersion[];
  currentVersion: number;
}

export interface ScriptLine {
  id: string;
  lineNumber: number;
  text: string;
  generatedPrompt: string;
  editedPrompt: string;
}

export interface VideoClip {
  id: string;
  scriptLineId: string;
  url: string;
  duration: number;
  timestamp: Date;
  status: 'generating' | 'ready' | 'error';
}

export interface StageProgress {
  stage: Stage;
  completed: boolean;
  percentage: number;
}

export interface AppConfig {
  aiModel: string;
  qwenApiKey: string;
}
