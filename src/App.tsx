import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Calculator, BookOpen } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import { useMetronome } from './hooks/useMetronome';
import { QuestionPanel } from './components/QuestionPanel';
import { GameBoard } from './components/GameBoard';
import { ActionPanel } from './components/ActionPanel';
import { GameStats } from './components/GameStats';
import { ToastNotification } from './components/ToastNotification';

function App() {
  const prevCombo = useRef(0);
  
  const {
    gameState,
    setGameMode,
    startGame,
    stopGame,
    selectAnswer,
    executeAction,
    updateBeat,
    toastMessage,
    clearToast
  } = useGameState();

  const { playSuccessSound, playErrorSound, playCelebrationSound } = useMetronome({
    bpm: 140, // 这个参数现在在useMetronome内部被忽略，固定使用140 BPM
    isPlaying: gameState.isPlaying,
    onBeat: updateBeat,
    onActionSuccess: () => {}
  });

  // 从同一个hook获取playPerfectSound
  const { playPerfectSound, playClickSound } = useMetronome({
    bpm: 140,
    isPlaying: false, // 这个实例只用于获取音效函数
    onBeat: () => {},
    onActionSuccess: () => {}
  });

  // 立即播放音效的函数
  const playImmediateSound = (type: 'success' | 'error' | 'perfect') => {
    switch (type) {
      case 'success':
        playSuccessSound();
        break;
      case 'error':
        playErrorSound();
        break;
      case 'perfect':
        playPerfectSound();
        break;
    }
  };

  // 处理答案选择时的即时音效
  const handleSelectAnswer = (answerIndex: number) => {
    selectAnswer(answerIndex);
    
    // 只播放选中音效，不显示正确/错误提示
    playClickSound();
  };

  useEffect(() => {
    // 处理combo变化的音效
    if (gameState.combo > prevCombo.current && gameState.combo > 0) {
      // 检查是否有actionResult来决定播放哪种音效
      if (gameState.actionResult === 'perfect') {
        playPerfectSound();
      } else {
        playSuccessSound();
      }
      
      // 连击里程碑庆祝
      if (gameState.combo === 5) {
        setTimeout(() => {
          playCelebrationSound();
        }, 200);
      }
    } else if (gameState.combo === 0 && prevCombo.current > 0) {
      playErrorSound();
    }
    
    prevCombo.current = gameState.combo;
  }, [gameState.combo, gameState.actionResult, playSuccessSound, playErrorSound, playCelebrationSound, playPerfectSound]);

  const handleGameToggle = () => {
    if (gameState.isPlaying) {
      stopGame();
    } else {
      startGame();
    }
  };

  const handleReset = () => {
    stopGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black relative">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen p-4 pb-8">
        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-6">
          {/* Game Mode Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setGameMode('math')}
              disabled={gameState.isPlaying}
              className={`
                px-4 py-2 rounded-lg font-bold transition-all duration-300
                flex items-center gap-2 shadow-lg hover:scale-105 text-sm
                border-2 neon-border
                ${gameState.gameMode === 'math'
                  ? 'bg-blue-500/30 border-blue-400 text-blue-300'
                  : 'bg-gray-500/20 border-gray-400 text-gray-300 hover:bg-gray-500/30'
                }
                ${gameState.isPlaying ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Calculator className="w-4 h-4" />
              口算
            </button>

            <button
              onClick={() => setGameMode('english')}
              disabled={gameState.isPlaying}
              className={`
                px-4 py-2 rounded-lg font-bold transition-all duration-300
                flex items-center gap-2 shadow-lg hover:scale-105 text-sm
                border-2 neon-border
                ${gameState.gameMode === 'english'
                  ? 'bg-purple-500/30 border-purple-400 text-purple-300'
                  : 'bg-gray-500/20 border-gray-400 text-gray-300 hover:bg-gray-500/30'
                }
                ${gameState.isPlaying ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <BookOpen className="w-4 h-4" />
              背单词
            </button>
          </div>

          <button
            onClick={handleGameToggle}
            className={`
              px-6 py-3 rounded-lg font-bold text-white transition-all duration-300
              flex items-center gap-2 shadow-lg hover:scale-105 text-lg
              border-2 neon-border
              ${gameState.isPlaying 
                ? 'bg-red-500/20 border-red-400 hover:bg-red-500/30 text-red-300' 
                : 'bg-green-500/20 border-green-400 hover:bg-green-500/30 text-green-300'
              }
            `}
          >
            {gameState.isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                暂停
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                开始
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-lg font-bold text-gray-300 bg-gray-500/20 border-2 border-gray-400 hover:bg-gray-500/30 transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105 text-lg neon-border"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        </div>

        {/* Game Layout - 优化移动端高度 */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-6 landscape:grid-cols-3 landscape:gap-1">
          {/* Left Panel - Questions */}
          <div className="lg:col-span-3 order-1">
            <QuestionPanel
              question={gameState.currentQuestion}
              selectedAnswer={gameState.selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
              currentBeat={gameState.currentBeat}
              isPlaying={gameState.isPlaying}
              gameMode={gameState.gameMode}
            />
          </div>

          {/* Center Panel - Game Board & Stats */}
          <div className="lg:col-span-6 space-y-2 lg:space-y-4 order-2 relative">
            <GameStats 
              gameState={gameState} 
              currentBeat={gameState.currentBeat}
              toastMessage={toastMessage}
              onClearToast={clearToast}
            />
            <GameBoard
              grid={gameState.gameGrid}
              character={gameState.character}
              currentBeat={gameState.currentBeat}
            />
          </div>

          {/* Right Panel - Actions */}
          <div className="lg:col-span-3 order-3">
            <ActionPanel
              onAction={executeAction}
              currentBeat={gameState.currentBeat}
              isPlaying={gameState.isPlaying}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;