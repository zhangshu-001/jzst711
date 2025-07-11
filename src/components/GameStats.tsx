import React from 'react';
import { GameState } from '../types/game';
import { ToastNotification } from './ToastNotification';

interface GameStatsProps {
  gameState: GameState;
  currentBeat: number;
  toastMessage?: { message: string; type: 'miss' | 'celebration' | 'perfect'; timestamp: number } | null;
  onClearToast: () => void;
}

export const GameStats: React.FC<GameStatsProps> = ({ 
  gameState, 
  currentBeat, 
  toastMessage, 
  onClearToast 
}) => {
  // 只有在没有toast消息时才显示combo提示，且combo > 0
  const shouldShowComboMessage = !toastMessage && gameState.combo > 0;
  
  return (
    <div className="cyberpunk-panel p-3 lg:p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Combo Display */}
        <div className="text-center">
          <div className="relative">
            <p className="text-lg lg:text-3xl font-bold text-yellow-400 mb-1">COMBO</p>
            <p className="text-2xl lg:text-5xl font-bold text-yellow-300 neon-text">
              x{gameState.combo}
            </p>
            {gameState.combo > 0 && (
              <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-3 h-3 lg:w-6 lg:h-6 bg-yellow-400 rounded-full animate-ping"></div>
            )}
          </div>
        </div>
        
        {/* Score */}
        <div className="text-center">
          <p className="text-sm lg:text-lg text-cyan-400 mb-1">分数</p>
          <p className="text-xl lg:text-3xl font-bold text-cyan-300">{gameState.score}</p>
        </div>
        
        {/* Round */}
        <div className="text-center">
          <p className="text-sm lg:text-lg text-purple-400 mb-1">回合</p>
          <p className="text-xl lg:text-3xl font-bold text-purple-300">{gameState.currentCycle}</p>
        </div>
      </div>

      {/* Combo提示 - 只在没有toast消息时显示 */}
      {shouldShowComboMessage && (
        <div className="mt-2 lg:mt-4 p-2 lg:p-3 bg-yellow-500/20 border border-yellow-400/50 rounded-lg neon-glow">
          <p className="text-yellow-300 text-sm font-medium text-center">
            🎉 连击 x{gameState.combo}！保持节奏！
          </p>
        </div>
      )}
      
      {/* Toast消息 - 与combo提示样式一致，优先显示 */}
      {toastMessage && (
        <div className={`
          mt-2 lg:mt-4 p-2 lg:p-3 rounded-lg neon-glow
          ${toastMessage.type === 'miss' 
            ? 'bg-red-500/20 border border-red-400/50'
            : toastMessage.type === 'perfect'
            ? 'bg-cyan-500/20 border border-cyan-400/50'
            : 'bg-yellow-500/20 border border-yellow-400/50'
          }
        `}>
          <p className={`
            text-sm font-medium text-center
            ${toastMessage.type === 'miss' 
              ? 'text-red-300'
              : toastMessage.type === 'perfect'
              ? 'text-cyan-300'
              : 'text-yellow-300'
            }
          `}>
            {toastMessage.type === 'miss' ? '❌' : toastMessage.type === 'perfect' ? '⭐' : '🎉'} {toastMessage.message}
          </p>
        </div>
      )}
    </div>
  );
};