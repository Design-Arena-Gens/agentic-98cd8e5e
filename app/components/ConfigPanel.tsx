import { AppConfig } from '../types';
import { X } from 'lucide-react';

interface ConfigPanelProps {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  onClose: () => void;
}

export default function ConfigPanel({ config, setConfig, onClose }: ConfigPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg border border-border max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">Configuration</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surfaceHover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-textMuted" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="aiModel" className="block text-sm font-medium text-text mb-2">
              AI Model
            </label>
            <input
              id="aiModel"
              type="text"
              value={config.aiModel}
              onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
              placeholder="e.g., gpt-4, claude-3-opus"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="qwenApiKey" className="block text-sm font-medium text-text mb-2">
              Qwen API Key
            </label>
            <input
              id="qwenApiKey"
              type="password"
              value={config.qwenApiKey}
              onChange={(e) => setConfig({ ...config, qwenApiKey: e.target.value })}
              placeholder="Enter your Qwen API key"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg font-medium transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
