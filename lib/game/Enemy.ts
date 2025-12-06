import { Rect } from './types';
import { Level } from './Level';

export class Enemy implements Rect {
  public x: number;
  public y: number;
  public width: number = 40;
  public height: number = 40;
  public vx: number = 100;
  public startX: number;
  public patrolRange: number = 200;
  public dead: boolean = false;

  public image: HTMLImageElement | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.startX = x;

    if (typeof window !== 'undefined') {
      this.image = new Image();
      this.image.src = '/enemy.png';
    }
  }

  public update(dt: number, level: Level) {
    if (this.dead) return;

    this.x += this.vx * dt;

    // Wall collision
    for (const p of level.platforms) {
      if (this.checkCollision(this, p)) {
        if (this.vx > 0) {
          this.x = p.x - this.width;
          this.vx = -this.vx;
        } else if (this.vx < 0) {
          this.x = p.x + p.width;
          this.vx = -this.vx;
        }
      }
    }

    // Edge detection (Turn around at cliffs)
    const lookAheadX = this.vx > 0 ? this.x + this.width + 1 : this.x - 1;
    const lookAheadY = this.y + this.height + 1; // Check below feet

    let hasGround = false;
    for (const p of level.platforms) {
      if (lookAheadX >= p.x && lookAheadX <= p.x + p.width &&
          lookAheadY >= p.y && lookAheadY <= p.y + p.height) {
        hasGround = true;
        break;
      }
    }

    if (!hasGround) {
      this.vx = -this.vx;
    }

    // Patrol limits (optional, can keep or remove if using walls)
    // if (this.x > this.startX + this.patrolRange) {
    //   this.vx = -Math.abs(this.vx);
    // } else if (this.x < this.startX) {
    //   this.vx = Math.abs(this.vx);
    // }
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
    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, this.x - cameraX, this.y, this.width, this.height);
    } else {
      // Fallback
      ctx.fillStyle = '#DC2626'; // Red
      ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }
  }
}
