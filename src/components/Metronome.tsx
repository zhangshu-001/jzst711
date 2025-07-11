import React from 'react';

interface MetronomeProps {
  currentBeat: number;
  isPlaying: boolean;
}

export const Metronome: React.FC<MetronomeProps> = ({ currentBeat, isPlaying }) => {
  return (
    <div className="cyberpunk-panel p-2 lg:p-3">
      <div className="text-center mb-3">
        <h3 className="text-xs lg:text-sm font-bold text-cyan-400 mb-1">节拍器</h3>
        <div className="text-sm lg:text-lg font-bold text-white">
          {currentBeat + 1}/8
        </div>
      </div>
      
      {/* 节拍指示器 */}
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={`
              aspect-square rounded-full flex items-center justify-center text-xs font-bold
              transition-all duration-150
              ${currentBeat === i
                ? i === 7 
                  ? 'bg-green-400 text-gray-800 shadow-lg shadow-green-400/50 scale-105' // 动作拍
                  : 'bg-cyan-400 text-gray-800 shadow-lg shadow-cyan-400/50 scale-105'
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
      <div className="mt-2 text-center">
        {isPlaying ? (
          <div className={`text-xs font-medium ${
            currentBeat === 7 
              ? 'text-green-300' 
              : currentBeat < 7 
              ? 'text-cyan-300' 
              : 'text-purple-300'
          }`}>
            {currentBeat === 7 ? '⚡ 动作时间' : currentBeat < 7 ? '📝 答题时间' : '⏳ 准备中'}
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