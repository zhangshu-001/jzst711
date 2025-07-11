import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ActionPanelProps {
  onAction: (action: 'jump' | 'forward' | 'crouch') => void;
  currentBeat: number;
  isPlaying: boolean;
  gameMode: 'math' | 'english';
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  onAction,
  currentBeat,
  isPlaying,
  gameMode
}) => {
  const beatsPerCycle = gameMode === 'math' ? 8 : 4;
  const actionBeat = beatsPerCycle - 1; // 数学第8拍(索引7)，英语第4拍(索引3)
  const isActionBeat = currentBeat === actionBeat;

  return (
    <div className="cyberpunk-panel min-h-[280px] lg:min-h-[400px] lg:h-full flex flex-col p-3 lg:p-6">
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={() => onAction('forward')}
          disabled={!isPlaying}
          className={`
            w-full h-32 lg:h-48 rounded-lg border-2 font-bold text-xl lg:text-4xl transition-all duration-300
            flex items-center justify-center gap-3 lg:gap-4 cyberpunk-button
            ${isActionBeat 
              ? 'bg-green-500/30 text-green-300 border-green-400 neon-glow animate-pulse' 
              : 'bg-cyan-900/30 text-cyan-300 border-cyan-400/50 hover:border-cyan-400'
            }
            ${!isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          <CheckCircle className="w-8 h-8 lg:w-12 lg:h-12" />
          确认
        </button>
      </div>
    </div>
  );
};