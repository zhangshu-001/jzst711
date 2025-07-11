import React from 'react';
import { Question } from '../types/game';
import { Metronome } from './Metronome';

interface QuestionPanelProps {
  question: Question | null;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  currentBeat: number;
  isPlaying: boolean;
  gameMode: 'math' | 'english';
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  currentBeat,
  isPlaying,
  gameMode
}) => {
  // 根据游戏模式确定节拍数和答题阶段
  const beatsPerCycle = gameMode === 'math' ? 8 : 4;
  const answerPhaseEnd = beatsPerCycle - 1; // 答题阶段到倒数第二拍结束
  const isAnswerPhase = currentBeat < answerPhaseEnd;

  if (!question) {
    return (
      <div className="cyberpunk-panel min-h-[280px] lg:min-h-[400px] lg:h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-cyan-400 text-lg">等待题目...</p>
        </div>
        <div className="mt-4">
          <Metronome currentBeat={currentBeat} isPlaying={isPlaying} gameMode={gameMode} />
        </div>
      </div>
    );
  }


  return (
    <div className="cyberpunk-panel min-h-[280px] lg:min-h-[400px] lg:h-full flex flex-col p-3 lg:p-6">
      {/* Question Display */}
      <div className="mb-4 lg:mb-8">
        <div className="text-center p-3 lg:p-6 rounded-lg bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-cyan-400/50">
          <p className="text-xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{question.question}</p>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-2 lg:space-y-4 flex-1">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => isAnswerPhase && onSelectAnswer(index)}
            disabled={!isAnswerPhase}
            className={`
              w-full p-2 lg:p-6 rounded-lg font-bold text-base lg:text-2xl transition-all duration-300
              border-2 cyberpunk-button
              ${!isAnswerPhase ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              ${selectedAnswer === index
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 neon-glow'
                : 'bg-purple-900/30 border-purple-400/50 text-purple-300 hover:border-purple-400'
              }
            `}
          >
            {typeof option === 'string' ? option : option}
          </button>
        ))}
      </div>

      {/* 节拍器 */}
      <div className="mt-2">
        <Metronome currentBeat={currentBeat} isPlaying={isPlaying} gameMode={gameMode} />
      </div>
    </div>
  );
};