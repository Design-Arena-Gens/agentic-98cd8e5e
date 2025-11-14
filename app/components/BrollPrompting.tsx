import { useState, useEffect } from 'react';
import { Script, ScriptLine, AppConfig } from '../types';
import { Sparkles, Edit2, Check, X } from 'lucide-react';

interface BrollPromptingProps {
  script: Script;
  scriptLines: ScriptLine[];
  setScriptLines: (lines: ScriptLine[]) => void;
  config: AppConfig;
  updateProgress: (percentage: number, completed: boolean) => void;
  onNext: () => void;
}

export default function BrollPrompting({
  script,
  scriptLines,
  setScriptLines,
  config,
  updateProgress,
  onNext,
}: BrollPromptingProps) {
  const [generating, setGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedLines, setSelectedLines] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (scriptLines.length > 0) {
      const withPrompts = scriptLines.filter(line => line.generatedPrompt.length > 0).length;
      const percentage = (withPrompts / scriptLines.length) * 100;
      updateProgress(percentage, percentage === 100);
    }
  }, [scriptLines, updateProgress]);

  const generatePrompts = async () => {
    setGenerating(true);

    // Parse script into lines
    const lines = script.content
      .split('\n')
      .filter(line => line.trim().length > 0 && !line.startsWith('#'))
      .map((line, index) => line.trim());

    // Simulate AI prompt generation
    setTimeout(() => {
      const generatedLines: ScriptLine[] = lines.map((text, index) => ({
        id: `line-${index}`,
        lineNumber: index + 1,
        text,
        generatedPrompt: generateBrollPrompt(text),
        editedPrompt: '',
      }));

      setScriptLines(generatedLines);
      setGenerating(false);
    }, 2000);
  };

  const generateBrollPrompt = (text: string): string => {
    // Simple keyword-based prompt generation
    const keywords = text.toLowerCase();

    if (keywords.includes('opening') || keywords.includes('hey')) {
      return 'Cinematic establishing shot, person entering modern tech office, bright natural lighting, shallow depth of field, 4K resolution';
    } else if (keywords.includes('ai') || keywords.includes('technology')) {
      return 'Futuristic technology montage, holographic interfaces, digital brain networks, neon blue and purple color grading, high-tech laboratory setting';
    } else if (keywords.includes('climate') || keywords.includes('environment')) {
      return 'Aerial drone footage of lush forest canopy, renewable energy wind turbines, golden hour lighting, environmental conservation theme';
    } else if (keywords.includes('stock market') || keywords.includes('financial')) {
      return 'Dynamic stock market charts and graphs, trading floor activity, multiple screens with financial data, professional business environment';
    } else if (keywords.includes('space') || keywords.includes('mars')) {
      return 'Stunning space imagery, rocket launch sequence, Mars surface panorama, astronaut perspective, epic cinematic space visuals';
    } else if (keywords.includes('social media')) {
      return 'Person scrolling on smartphone, social media app interfaces, notification animations, modern lifestyle setting, warm indoor lighting';
    } else if (keywords.includes('conclusion') || keywords.includes('subscribe')) {
      return 'Content creator in studio setup, gesture to camera, colorful LED background, YouTube end card graphics overlay';
    }

    return 'Professional b-roll footage relevant to narration, cinematic composition, 4K quality, neutral color grading, smooth camera movements';
  };

  const updatePrompt = (id: string, editedPrompt: string) => {
    setScriptLines(
      scriptLines.map(line =>
        line.id === id ? { ...line, editedPrompt } : line
      )
    );
  };

  const toggleLineSelection = (id: string) => {
    const newSelected = new Set(selectedLines);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLines(newSelected);
  };

  const bulkEditPrompts = (newPrompt: string) => {
    setScriptLines(
      scriptLines.map(line =>
        selectedLines.has(line.id) ? { ...line, editedPrompt: newPrompt } : line
      )
    );
    setSelectedLines(new Set());
    setBulkEditMode(false);
  };

  const getDisplayPrompt = (line: ScriptLine) => {
    return line.editedPrompt || line.generatedPrompt;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text">B-roll Prompting</h2>
          <p className="text-sm text-textMuted mt-1">Generate visual prompts for video b-roll</p>
        </div>
        <div className="flex gap-3">
          {scriptLines.length > 0 && (
            <button
              onClick={() => setBulkEditMode(!bulkEditMode)}
              className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surfaceHover border border-border text-text rounded-lg font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              {bulkEditMode ? 'Exit Bulk Edit' : 'Bulk Edit'}
            </button>
          )}
          <button
            onClick={generatePrompts}
            disabled={generating || script.content.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 disabled:bg-accent/50 text-white rounded-lg font-medium transition-colors"
          >
            <Sparkles className={`w-4 h-4 ${generating ? 'animate-pulse' : ''}`} />
            {generating ? 'Generating...' : 'Generate B-roll Prompts'}
          </button>
          {scriptLines.length > 0 && scriptLines.every(line => line.generatedPrompt) && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg font-medium transition-colors"
            >
              Continue to Video Generation
            </button>
          )}
        </div>
      </div>

      {bulkEditMode && selectedLines.size > 0 && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-text mb-3">
            {selectedLines.size} line{selectedLines.size !== 1 ? 's' : ''} selected for bulk editing
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter new prompt for all selected lines..."
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  bulkEditPrompts(e.currentTarget.value);
                }
              }}
            />
            <button
              onClick={() => setSelectedLines(new Set())}
              className="px-4 py-2 bg-danger hover:bg-danger/80 text-white rounded-lg font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {scriptLines.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border p-12 text-center">
          <Sparkles className="w-16 h-16 text-textMuted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text mb-2">No Script Lines Yet</h3>
          <p className="text-textMuted mb-6">Generate a script first, then create b-roll prompts</p>
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  {bulkEditMode && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-textMuted uppercase tracking-wider">
                      Select
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textMuted uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textMuted uppercase tracking-wider">
                    Script Line
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textMuted uppercase tracking-wider">
                    Generated Prompt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textMuted uppercase tracking-wider">
                    Edited Prompt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-textMuted uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scriptLines.map((line) => (
                  <tr key={line.id} className="hover:bg-surfaceHover transition-colors">
                    {bulkEditMode && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedLines.has(line.id)}
                          onChange={() => toggleLineSelection(line.id)}
                          className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-textMuted font-mono">
                      {line.lineNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-text max-w-xs">
                      <div className="line-clamp-2">{line.text}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-textMuted max-w-md">
                      <div className="line-clamp-2">{line.generatedPrompt}</div>
                    </td>
                    <td className="px-4 py-3 text-sm max-w-md">
                      {editingId === line.id ? (
                        <input
                          type="text"
                          defaultValue={line.editedPrompt}
                          autoFocus
                          onBlur={(e) => {
                            updatePrompt(line.id, e.target.value);
                            setEditingId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updatePrompt(line.id, e.currentTarget.value);
                              setEditingId(null);
                            } else if (e.key === 'Escape') {
                              setEditingId(null);
                            }
                          }}
                          className="w-full px-2 py-1 bg-background border border-primary rounded text-text text-sm focus:outline-none"
                        />
                      ) : (
                        <div className="line-clamp-2">
                          {line.editedPrompt ? (
                            <span className="text-success">{line.editedPrompt}</span>
                          ) : (
                            <span className="text-textMuted italic">Not edited</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditingId(line.id)}
                        className="p-1.5 rounded hover:bg-background transition-colors"
                        aria-label="Edit prompt"
                      >
                        <Edit2 className="w-4 h-4 text-textMuted hover:text-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {scriptLines.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-textMuted">
          <span>{scriptLines.length} script lines processed</span>
          <span>
            {scriptLines.filter(l => l.editedPrompt).length} prompts edited • {' '}
            {scriptLines.filter(l => !l.editedPrompt && l.generatedPrompt).length} using generated
          </span>
        </div>
      )}
    </div>
  );
}
