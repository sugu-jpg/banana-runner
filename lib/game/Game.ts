import { Input } from './Input';
import { GameState } from './types';
import { Player } from './Player';
import { Level } from './Level';

export class Game {
  private ctx: CanvasRenderingContext2D;
  private input: Input;
  private state: GameState;
  private lastTime: number = 0;
  private player: Player;
  private level: Level;
  private cameraX: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.input = new Input();
    this.state = GameState.MENU;
    this.player = new Player(100, 300);
    this.level = new Level();
  }

  public start() {
    this.state = GameState.PLAYING;
    this.lastTime = performance.now();
    this.loop();
  }

  private loop = () => {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(dt);
    this.draw();

    if (this.state === GameState.PLAYING || this.state === GameState.GAME_OVER || this.state === GameState.GAME_CLEAR) {
      requestAnimationFrame(this.loop);
    }
  };

  private update(dt: number) {
    if (this.state === GameState.GAME_OVER || this.state === GameState.GAME_CLEAR) {
      if (this.input.isDown('Enter')) {
        this.reset();
      }
      return;
    }

    this.player.update(dt, this.input, this.level);
    
    // Update Enemies
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      enemy.update(dt, this.level);

      if (this.checkCollision(this.player, enemy)) {
        // Check for stomp (player falling and above enemy)
        const hitFromAbove = this.player.vy > 0 && this.player.y + this.player.height - this.player.vy * dt <= enemy.y + enemy.height * 0.5;
        
        if (hitFromAbove) {
          // Stomp success
          this.player.vy = -400; // Bounce
          this.level.enemies.splice(i, 1); // Remove enemy
        } else {
          // Player died
          this.state = GameState.GAME_OVER;
        }
      }
    }

    // Check Goal
    if (this.checkCollision(this.player, this.level.goal)) {
      this.state = GameState.GAME_CLEAR;
    }

    // Check Fall
    if (this.player.y > 600) {
      this.state = GameState.GAME_OVER;
    }

    // Simple camera follow
    const targetCamX = this.player.x - 200; // Keep player at 200px from left
    this.cameraX = Math.max(0, targetCamX); // Don't scroll left of 0
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    // Draw background
    this.ctx.fillStyle = '#87CEEB'; // Sky blue
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.level.draw(this.ctx, this.cameraX);
    this.player.draw(this.ctx, this.cameraX);

    // UI
    if (this.state === GameState.GAME_OVER) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.font = '48px Arial';
      this.ctx.fillText('GAME OVER', 250, 200);
      this.ctx.font = '24px Arial';
      this.ctx.fillText('Press Enter to Restart', 280, 250);
    } else if (this.state === GameState.GAME_CLEAR) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.fillStyle = 'yellow';
      this.ctx.font = '48px Arial';
      this.ctx.fillText('GAME CLEAR!', 250, 200);
      this.ctx.font = '24px Arial';
      this.ctx.fillText('Press Enter to Restart', 280, 250);
    }
  }

  private reset() {
    this.player = new Player(100, 300);
    this.level = new Level(); // Recreate level to reset enemies and platforms
    this.cameraX = 0;
    this.state = GameState.PLAYING;
    this.lastTime = performance.now();
  }

  private checkCollision(r1: any, r2: any): boolean {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  public destroy() {
    this.input.destroy();
    this.state = GameState.MENU; // Stop loop
  }
}
