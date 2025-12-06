'use client';

import { useEffect, useRef } from 'react';
import { Game } from '@/lib/game/Game';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Initialize game
    const game = new Game(ctx);
    gameRef.current = game;
    game.start();

    // Cleanup
    return () => {
      game.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={450}
      className="canvas-container"
    />
  );
}
