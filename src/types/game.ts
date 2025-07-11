export interface GameState {
  currentBeat: number;
  currentCycle: number;
  score: number;
  combo: number;
  isPlaying: boolean;
  gameMode: 'math' | 'english';
  character: CharacterState;
  currentQuestion: Question | null;
  selectedAnswer: number | null;
  lastActionTime: number;
  lastBeatTime: number;
  gameGrid: GridCell[][];
  actionResult?: 'perfect' | 'good' | 'miss';
}

export interface CharacterState {
  x: number;
  y: number;
  action: 'idle' | 'jump' | 'forward' | 'crouch';
  isMoving: boolean;
}

export interface Question {
  question: string;
  options: (number | string)[];
  correctAnswer: number | string;
  timestamp: number;
  type: 'math' | 'english';
}

export interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
  type: 'normal' | 'obstacle' | 'target';
}

export interface GameConfig {
  beatsPerCycle: number;
  bpm: number;
  gridWidth: number;
  gridHeight: number;
  timingTolerance: number;
}

export interface ToastMessage {
  message: string;
  type: 'miss' | 'celebration' | 'perfect';
  timestamp: number;
}