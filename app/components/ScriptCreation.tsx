import { useState } from 'react';
import { Script, ScriptVersion, NewsIdea, AppConfig } from '../types';
import { Sparkles, History, Users, Save, Undo, Redo } from 'lucide-react';
import { format } from 'date-fns';

interface ScriptCreationProps {
  script: Script;
  setScript: (script: Script) => void;
  ideas: NewsIdea[];
  config: AppConfig;
  updateProgress: (percentage: number, completed: boolean) => void;
  onNext: () => void;
}

export default function ScriptCreation({
  script,
  setScript,
  ideas,
  config,
  updateProgress,
  onNext,
}: ScriptCreationProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [collaborators] = useState(['You', 'AI Assistant']);

  const approvedIdeas = ideas.filter(i => i.approved === true);

  const generateScript = async () => {
    setGenerating(true);

    // Simulate AI script generation
    setTimeout(() => {
      const generatedContent = `# Video Script: ${approvedIdeas[0]?.title || 'Trending Topic'}

## Opening (0:00 - 0:15)
[Dynamic music fades in]
Hey everyone! Today we're diving into something that's taking the internet by storm...

## Main Content (0:15 - 1:30)
${approvedIdeas.map((idea, index) => `
### Segment ${index + 1}: ${idea.title}
${idea.description}

This story from ${idea.source} has been generating massive buzz online. Let's break down why this matters...
`).join('\n')}

## Analysis (1:30 - 2:15)
So what does this all mean? Well, when we look at the bigger picture...

## Conclusion (2:15 - 2:45)
That's it for today's video! What do you think about these developments? Let me know in the comments below.

[End card with subscribe button]`;

      const newVersion: ScriptVersion = {
        id: `v${script.versions.length + 1}`,
        content: generatedContent,
        timestamp: new Date(),
        author: 'AI Assistant',
      };

      setScript({
        ...script,
        content: generatedContent,
        versions: [...script.versions, newVersion],
        currentVersion: script.versions.length,
      });

      updateProgress(100, true);
      setGenerating(false);
    }, 2000);
  };

  const saveVersion = () => {
    const newVersion: ScriptVersion = {
      id: `v${script.versions.length + 1}`,
      content: script.content,
      timestamp: new Date(),
      author: 'You',
    };

    setScript({
      ...script,
      versions: [...script.versions, newVersion],
      currentVersion: script.versions.length,
    });
  };

  const loadVersion = (index: number) => {
    setScript({
      ...script,
      content: script.versions[index].content,
      currentVersion: index,
    });
  };

  const handleContentChange = (content: string) => {
    setScript({ ...script, content });
    const progress = content.length > 0 ? Math.min((content.length / 500) * 100, 100) : 0;
    updateProgress(progress, content.length > 100);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text">Script Creation</h2>
          <p className="text-sm text-textMuted mt-1">Using model: {config.aiModel}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surfaceHover border border-border text-text rounded-lg font-medium transition-colors"
          >
            <History className="w-4 h-4" />
            Version History
          </button>
          {approvedIdeas.length > 0 && (
            <button
              onClick={generateScript}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white rounded-lg font-medium transition-colors"
            >
              <Sparkles className={`w-4 h-4 ${generating ? 'animate-pulse' : ''}`} />
              {generating ? 'Generating...' : 'Generate Script'}
            </button>
          )}
          {script.content.length > 0 && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg font-medium transition-colors"
            >
              Continue to B-roll Prompting
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text">Script Editor</span>
                {script.versions.length > 0 && (
                  <span className="text-xs text-textMuted">
                    Version {script.currentVersion + 1} of {script.versions.length}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveVersion}
                  disabled={script.content.length === 0}
                  className="p-1.5 rounded hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Save version"
                >
                  <Save className="w-4 h-4 text-textMuted" />
                </button>
                <button
                  onClick={() => script.currentVersion > 0 && loadVersion(script.currentVersion - 1)}
                  disabled={script.currentVersion === 0}
                  className="p-1.5 rounded hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous version"
                >
                  <Undo className="w-4 h-4 text-textMuted" />
                </button>
                <button
                  onClick={() => script.currentVersion < script.versions.length - 1 && loadVersion(script.currentVersion + 1)}
                  disabled={script.currentVersion === script.versions.length - 1}
                  className="p-1.5 rounded hover:bg-surfaceHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next version"
                >
                  <Redo className="w-4 h-4 text-textMuted" />
                </button>
              </div>
            </div>

            <textarea
              value={script.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing your script here, or generate one using AI..."
              className="w-full h-[600px] p-4 bg-surface text-text placeholder-textMuted resize-none focus:outline-none font-mono text-sm leading-relaxed"
            />

            <div className="px-4 py-2 border-t border-border bg-background flex items-center justify-between text-xs text-textMuted">
              <span>{script.content.length} characters</span>
              <span>~{Math.ceil(script.content.split(/\s+/).filter(w => w.length > 0).length / 150)} min read</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-text">Collaborators</h3>
            </div>
            <div className="space-y-2">
              {collaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                    {collaborator[0]}
                  </div>
                  <span className="text-sm text-text">{collaborator}</span>
                </div>
              ))}
            </div>
          </div>

          {showHistory && script.versions.length > 0 && (
            <div className="bg-surface rounded-lg border border-border p-4">
              <h3 className="font-semibold text-text mb-3">Version History</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {script.versions.map((version, index) => (
                  <button
                    key={version.id}
                    onClick={() => loadVersion(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === script.currentVersion
                        ? 'bg-primary/20 border border-primary/30'
                        : 'bg-background hover:bg-surfaceHover'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text">Version {index + 1}</span>
                      {index === script.currentVersion && (
                        <span className="text-xs px-2 py-0.5 bg-primary text-white rounded">Current</span>
                      )}
                    </div>
                    <div className="text-xs text-textMuted">
                      {version.author} • {format(version.timestamp, 'MMM d, h:mm a')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {approvedIdeas.length > 0 && (
            <div className="bg-surface rounded-lg border border-border p-4">
              <h3 className="font-semibold text-text mb-3">Source Ideas</h3>
              <div className="space-y-2">
                {approvedIdeas.slice(0, 3).map(idea => (
                  <div key={idea.id} className="text-xs p-2 bg-background rounded border border-border">
                    <div className="font-medium text-text line-clamp-1">{idea.title}</div>
                    <div className="text-textMuted mt-1 line-clamp-2">{idea.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
