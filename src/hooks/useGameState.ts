import { useState, useCallback, useRef } from 'react';
import { GameState, Question, ToastMessage } from '../types/game';

const GAME_CONFIG = {
  beatsPerCycle: 8,
  bpm: 140,
  gridWidth: 5,
  gridHeight: 3,
  timingTolerance: 200
};

// 小学3年级英语单词库
const ELEMENTARY_WORDS = [
  { english: 'apple', chinese: '苹果' },
  { english: 'book', chinese: '书' },
  { english: 'cat', chinese: '猫' },
  { english: 'dog', chinese: '狗' },
  { english: 'egg', chinese: '鸡蛋' },
  { english: 'fish', chinese: '鱼' },
  { english: 'girl', chinese: '女孩' },
  { english: 'hand', chinese: '手' },
  { english: 'ice', chinese: '冰' },
  { english: 'jump', chinese: '跳' },
  { english: 'key', chinese: '钥匙' },
  { english: 'lion', chinese: '狮子' },
  { english: 'milk', chinese: '牛奶' },
  { english: 'nose', chinese: '鼻子' },
  { english: 'orange', chinese: '橙子' },
  { english: 'pen', chinese: '笔' },
  { english: 'queen', chinese: '女王' },
  { english: 'red', chinese: '红色' },
  { english: 'sun', chinese: '太阳' },
  { english: 'tree', chinese: '树' },
  { english: 'umbrella', chinese: '雨伞' },
  { english: 'water', chinese: '水' },
  { english: 'yellow', chinese: '黄色' },
  { english: 'zoo', chinese: '动物园' },
  { english: 'ball', chinese: '球' },
  { english: 'car', chinese: '汽车' },
  { english: 'door', chinese: '门' },
  { english: 'eye', chinese: '眼睛' },
  { english: 'face', chinese: '脸' },
  { english: 'green', chinese: '绿色' },
  { english: 'house', chinese: '房子' },
  { english: 'bird', chinese: '鸟' },
  { english: 'cake', chinese: '蛋糕' },
  { english: 'desk', chinese: '桌子' },
  { english: 'ear', chinese: '耳朵' },
  { english: 'flower', chinese: '花' },
  { english: 'game', chinese: '游戏' },
  { english: 'hat', chinese: '帽子' },
  { english: 'kite', chinese: '风筝' },
  { english: 'moon', chinese: '月亮' }
];

const generateMathQuestion = (): Question => {
  const operations = ['+', '-', '×', '÷'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let a: number, b: number, correctAnswer: number, question: string;
  
  switch (operation) {
    case '+':
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      correctAnswer = a + b;
      question = `${a} + ${b} = ?`;
      break;
    case '-':
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * (a - 1)) + 1;
      correctAnswer = a - b;
      question = `${a} - ${b} = ?`;
      break;
    case '×':
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      correctAnswer = a * b;
      question = `${a} × ${b} = ?`;
      break;
    case '÷':
      correctAnswer = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      a = correctAnswer * b;
      question = `${a} ÷ ${b} = ?`;
      break;
    default:
      a = 1; b = 1; correctAnswer = 2; question = '1 + 1 = ?';
  }
  
  // 生成1个错误答案
  const wrongAnswers = [];
  while (wrongAnswers.length < 1) {
    const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
    if (wrong !== correctAnswer && wrong > 0 && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }
  
  const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
  
  return {
    question,
    options,
    correctAnswer,
    timestamp: Date.now(),
    type: 'math'
  };
};

const generateEnglishQuestion = (): Question => {
  const word = ELEMENTARY_WORDS[Math.floor(Math.random() * ELEMENTARY_WORDS.length)];
  const isChineseToEnglish = Math.random() > 0.5;
  
  let question: string;
  let correctAnswer: number;
  let options: number[];
  
  if (isChineseToEnglish) {
    // 中译英
    question = `"${word.chinese}" 的英文是？`;
    
    // 生成错误选项
    const wrongWords = ELEMENTARY_WORDS.filter(w => w.english !== word.english);
    const wrongWord = wrongWords[Math.floor(Math.random() * wrongWords.length)];
    
    const allOptions = [word.english, wrongWord.english];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    options = shuffledOptions as any;
    correctAnswer = word.english as any;
  } else {
    // 英译中
    question = `"${word.english}" 的中文是？`;
    
    // 生成错误选项
    const wrongWords = ELEMENTARY_WORDS.filter(w => w.chinese !== word.chinese);
    const wrongWord = wrongWords[Math.floor(Math.random() * wrongWords.length)];
    
    const allOptions = [word.chinese, wrongWord.chinese];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    options = shuffledOptions as any;
    correctAnswer = word.chinese as any;
  }
  
  return {
    question,
    options: options as any, // 临时类型转换，因为英语题目的options是字符串数组
    correctAnswer,
    timestamp: Date.now(),
    type: 'english'
  };
};

const generateQuestion = (gameMode: 'math' | 'english'): Question => {
  return gameMode === 'math' ? generateMathQuestion() : generateEnglishQuestion();
};

const createInitialGrid = () => {
  return Array(GAME_CONFIG.gridHeight).fill(null).map((_, y) =>
    Array(GAME_CONFIG.gridWidth).fill(null).map((_, x) => ({
      x,
      y,
      occupied: false,
      type: 'normal' as const
    }))
  );
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentBeat: 0,
    currentCycle: 1,
    score: 0,
    combo: 0,
    isPlaying: false,
    gameMode: 'math',
    character: {
      x: 1,
      y: 1,
      action: 'idle',
      isMoving: false
    },
    currentQuestion: null,
    selectedAnswer: null,
    lastActionTime: 0,
    lastBeatTime: Date.now(),
    gameGrid: createInitialGrid()
  });

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const lastComboRef = useRef(0);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const showToast = useCallback((message: string, type: ToastMessage['type']) => {
    setToastMessage({
      message,
      type,
      timestamp: Date.now()
    });
    
    // Auto clear after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const setGameMode = useCallback((mode: 'math' | 'english') => {
    setGameState(prev => ({
      ...prev,
      gameMode: mode
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      currentQuestion: generateQuestion(prev.gameMode),
      currentBeat: 0,
      currentCycle: 1,
      lastBeatTime: Date.now()
    }));
  }, []);

  const stopGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      score: 0,
      combo: 0,
      currentBeat: 0,
      currentCycle: 1,
      currentQuestion: null,
      selectedAnswer: null,
      character: {
        ...prev.character,
        action: 'idle',
        isMoving: false
      },
      actionResult: undefined
    }));
    setToastMessage(null);
    lastComboRef.current = 0;
  }, []);

  const selectAnswer = useCallback((answerIndex: number) => {
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex
    }));
  }, []);

  const updateBeat = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying) return prev;

      const beatsPerCycle = prev.gameMode === 'math' ? GAME_CONFIG.mathBeatsPerCycle : GAME_CONFIG.englishBeatsPerCycle;
      const newBeat = (prev.currentBeat + 1) % beatsPerCycle;
      
      // 检查是否错过了答题时机（从最后一拍切换到第0拍时）
      const lastBeat = beatsPerCycle - 1;
      const missedAnswering = prev.currentBeat === lastBeat && newBeat === 0;
      
      let newState = {
        ...prev,
        currentBeat: newBeat,
        lastBeatTime: Date.now(),
        character: {
          ...prev.character,
          action: 'idle' as const,
          isMoving: false
        },
        actionResult: undefined
      };

      // 如果错过了答题时机，清零combo并显示miss提示
      if (missedAnswering && prev.selectedAnswer === null) {
        newState.combo = 0;
        showToast('错过答题时机！', 'miss');
      }

      // Start new cycle
      if (newBeat === 0) {
        newState = {
          ...newState,
          currentCycle: prev.currentCycle + 1,
          currentQuestion: generateQuestion(prev.gameMode),
          selectedAnswer: null
        };
      }

      return newState;
    });
  }, [showToast]);

  const executeAction = useCallback((action: 'jump' | 'forward' | 'crouch') => {
    const currentTime = Date.now();
    
    setGameState(prev => {
      const beatsPerCycle = prev.gameMode === 'math' ? GAME_CONFIG.mathBeatsPerCycle : GAME_CONFIG.englishBeatsPerCycle;
      const actionBeat = beatsPerCycle - 1; // 最后一拍是动作拍
      
      if (!prev.isPlaying || prev.currentBeat !== actionBeat) {
        return prev;
      }

      const timingDiff = Math.abs(currentTime - prev.lastBeatTime);
      let actionResult: 'perfect' | 'good' | 'miss';
      let points = 0;
      let newCombo = prev.combo;

      // Check if answer is correct
      const isAnswerCorrect = prev.selectedAnswer !== null && 
        prev.currentQuestion && 
        prev.currentQuestion.options[prev.selectedAnswer] === prev.currentQuestion.correctAnswer;

      if (!isAnswerCorrect) {
        // Wrong answer or no answer
        actionResult = 'miss';
        newCombo = 0;
        showToast('答题错误！', 'miss');
      } else {
        // Correct answer, check timing
        if (timingDiff < 100) {
          actionResult = 'perfect';
          points = 100 + (newCombo * 10);
          newCombo += 1;
          showToast(`完美时机！+${points}分`, 'perfect');
        } else if (timingDiff < 300) {
          actionResult = 'good';
          points = 50 + (newCombo * 5);
          newCombo += 1;
          showToast(`不错的节奏！+${points}分`, 'celebration');
        } else {
          actionResult = 'miss';
          newCombo = 0;
          showToast('时机不对！', 'miss');
        }
      }

      return {
        ...prev,
        score: prev.score + points,
        combo: newCombo,
        character: {
          ...prev.character,
          action,
          isMoving: true
        },
        lastActionTime: currentTime,
        actionResult
      };
    });
  }, [showToast]);

  return {
    gameState,
    setGameMode,
    startGame,
    stopGame,
    selectAnswer,
    executeAction,
    updateBeat,
    toastMessage,
    clearToast
  };
};