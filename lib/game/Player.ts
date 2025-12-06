import { Rect, Point, Size } from './types';
import { Input } from './Input';
import { Level } from './Level';

export class Player implements Rect {
  public x: number;
  public y: number;
  public width: number = 40;
  public height: number = 60;
  public vx: number = 0;
  public vy: number = 0;
  public speed: number = 300;
  public jumpStrength: number = 750;
  public gravity: number = 1500;
  public grounded: boolean = false;

  public image: HTMLImageElement | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    if (typeof window !== 'undefined') {
      console.log('Loading player image...');
      this.image = new Image();
      this.image.src = '/player.png';
      this.image.onload = () => console.log('Player image loaded');
      this.image.onerror = (e) => console.error('Player image failed to load', e);
    }
  }

  public update(dt: number, input: Input, level: Level) {
    // Horizontal movement
    if (input.isDown('ArrowLeft')) {
      this.vx = -this.speed;
    } else if (input.isDown('ArrowRight')) {
      this.vx = this.speed;
    } else {
      this.vx = 0;
    }

    // Jump
    if (input.isDown('Space') && this.grounded) {
      this.vy = -this.jumpStrength;
      this.grounded = false;
    }

    // Apply physics
    this.vy += this.gravity * dt;
    
    // Move X
    this.x += this.vx * dt;
    this.checkHorizontalCollision(level);

    // Move Y
    this.y += this.vy * dt;
    this.grounded = false; // Assume falling until collision
    this.checkVerticalCollision(level);

    // Check world bounds (fall off)
    if (this.y > 600) {
      // Game Over logic handled in Game class
    }
  }

  private checkHorizontalCollision(level: Level) {
    for (const p of level.platforms) {
      if (this.checkCollision(this, p)) {
        if (this.vx > 0) {
          this.x = p.x - this.width;
        } else if (this.vx < 0) {
          this.x = p.x + p.width;
        }
        this.vx = 0;
      }
    }
  }

  private checkVerticalCollision(level: Level) {
    for (const p of level.platforms) {
      if (this.checkCollision(this, p)) {
        if (this.vy > 0) {
          this.y = p.y - this.height;
          this.grounded = true;
          this.vy = 0;
        } else if (this.vy < 0) {
          this.y = p.y + p.height;
          this.vy = 0;
        }
      }
    }
  }

  private checkCollision(r1: Rect, r2: Rect): boolean {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  public draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    if (this.image && this.image.complete && this.image.naturalWidth > 0) {
      ctx.drawImage(this.image, this.x - cameraX, this.y, this.width, this.height);
    } else {
      // Fallback
      ctx.fillStyle = '#3B82F6'; // Blue (Debug color)
      ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }
  }
}
