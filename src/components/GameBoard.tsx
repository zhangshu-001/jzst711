import React from 'react';
import { CharacterState, GridCell } from '../types/game';

interface GameBoardProps {
  grid: GridCell[][];
  character: CharacterState;
  currentBeat: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, character, currentBeat }) => {
  const getCharacterSprite = () => {
    switch (character.action) {
      case 'jump':
        return '🦘';
      case 'forward':
        return '🏃';
      case 'crouch':
        return '🙇';
      default:
        return '🧙‍♂️';
    }
  };

  const getCharacterTransform = () => {
    const baseTransform = `translate(${character.x * 100}%, ${character.y * 100}%)`;
    if (character.action === 'jump') {
      return `${baseTransform} translateY(-20px)`;
    }
    return baseTransform;
  };

  return (
    <div className="cyberpunk-panel relative h-full">
      {/* Game area with cyberpunk cityscape background */}
      <div className="relative w-full h-64 lg:h-[500px] bg-gradient-to-b from-sky-400 via-sky-300 to-green-300 rounded-lg overflow-hidden">
        {/* Sky and clouds background */}
        <div className="absolute inset-0">
          {/* Animated clouds */}
          <div className="absolute top-8 left-0 w-full h-20 opacity-70">
            <div className="cloud cloud-1">☁️</div>
            <div className="cloud cloud-2">☁️</div>
            <div className="cloud cloud-3">☁️</div>
          </div>
          
          {/* Mountains in background */}
          <div className="absolute bottom-24 left-0 w-full h-32 bg-gradient-to-t from-green-600 to-green-400 opacity-80">
            <div className="mountain-range"></div>
          </div>
          
          {/* Road surface */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-600 to-gray-500">
            {/* Road markings - animated dashed lines */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-300 opacity-80">
              <div className="road-lines"></div>
            </div>
            
            {/* Road edges */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-60"></div>
            <div className="absolute bottom-2 left-0 w-full h-1 bg-white opacity-60"></div>
          </div>
          
          {/* Side elements - trees and buildings scrolling */}
          <div className="absolute bottom-20 left-0 w-full h-16">
            <div className="scrolling-elements">
              <div className="element">🌲</div>
              <div className="element">🏠</div>
              <div className="element">🌳</div>
              <div className="element">🏢</div>
              <div className="element">🌲</div>
              <div className="element">🏪</div>
              <div className="element">🌲</div>
              <div className="element">🏭</div>
              <div className="element">🌳</div>
            </div>
          </div>
        </div>

        {/* Character */}
        <div
          className={`
            absolute w-10 h-10 lg:w-20 lg:h-20 flex items-center justify-center text-3xl lg:text-5xl
            transition-all duration-300 ease-in-out z-10
            ${character.isMoving ? 'scale-110' : 'scale-100'}
          `}
          style={{
            left: '20%',
            bottom: '96px', // 调整到新的路面高度
            transform: character.action === 'jump' ? 'translateY(-40px)' : 'translateY(0)'
          }}
        >
          <div className="animate-bounce filter drop-shadow-lg">
            {getCharacterSprite()}
          </div>
        </div>

        {/* Action indicator */}
        <div className="absolute top-6 right-6">
          <div className={`
            w-6 h-6 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-lg lg:text-3xl
            ${currentBeat === 7 ? 'animate-pulse bg-green-400/30 border-2 border-green-400' : 'bg-gray-600/30 border border-gray-400'}
          `}>
            ⚡
          </div>
        </div>

        {/* Beat progress bar */}
        <div className="absolute bottom-3 lg:bottom-6 left-3 lg:left-6 right-3 lg:right-6">
          <div className="flex space-x-1">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`
                  flex-1 h-2 lg:h-3 rounded-full transition-all duration-150
                  ${currentBeat === i
                    ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                    : currentBeat > i
                    ? 'bg-purple-400'
                    : 'bg-gray-600/50'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};