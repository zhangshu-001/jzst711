import React from 'react';

interface MetronomeProps {
  currentBeat: number;
  isPlaying: boolean;
  gameMode: 'math' | 'english';
}

export const Metronome: React.FC<MetronomeProps> = ({ currentBeat, isPlaying, gameMode }) => {
  const beatsPerCycle = gameMode === 'math' ? 8 : 4;
  const actionBeat = beatsPerCycle - 1; // 数学第8拍(索引7)，英语第4拍(索引3)
  
  return (
    <div className="cyberpunk-panel p-2">
      <div className="text-center mb-2">
        <h3 className="text-xs font-bold text-cyan-400 mb-1">
          {gameMode === 'math' ? '数学节拍器' : '英语节拍器'}
        </h3>
        <div className="text-sm font-bold text-white">
          {currentBeat + 1}/{beatsPerCycle}
        </div>
      </div>
      
      {/* 节拍指示器 */}
      <div className={`grid gap-1 mb-2 ${gameMode === 'math' ? 'grid-cols-4' : 'grid-cols-2'}`}>
        {Array.from({ length: beatsPerCycle }, (_, i) => (
          <div
            key={i}
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              transition-all duration-150
              ${currentBeat === i
                ? i === actionBeat 
                  ? 'bg-green-400 text-gray-800 shadow-lg shadow-green-400/50' // 确认拍
                  : 'bg-cyan-400 text-gray-800 shadow-lg shadow-cyan-400/50'
                : currentBeat > i
                ? 'bg-purple-400/50 text-purple-200'
                : 'bg-gray-600/30 text-gray-400'
              }
              ${!isPlaying ? 'opacity-50' : ''}
            `}
          >
            {i + 1}
          </div>
        ))}
      </div>
      
      {/* 当前状态提示 */}
      <div className="text-center">
        {isPlaying ? (
          <div className={`text-xs font-medium ${
            currentBeat === actionBeat 
              ? 'text-green-300'
              : currentBeat < actionBeat 
              ? 'text-cyan-300' 
              : 'text-purple-300'
          }`}>
            {currentBeat === actionBeat 
              ? '⚡ 确认时间' 
              : currentBeat < actionBeat 
              ? '📝 答题时间' 
              : '⏳ 准备中'
            }
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            点击开始游戏
          </div>
        )}
      </div>
    </div>
  );
};