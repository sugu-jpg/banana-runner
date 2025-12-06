import { Rect, Platform, PlatformType } from './types';
import { Enemy } from './Enemy';

export class Level {
  public platforms: Platform[] = [];
  public enemies: Enemy[] = [];
  public goal: Rect;
  public width: number = 3000; // Total level width

  public goalImage: HTMLImageElement | null = null;
  public pipeImage: HTMLImageElement | null = null;
  public blockImage: HTMLImageElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.goalImage = new Image();
      this.goalImage.src = '/goal.png';
      this.pipeImage = new Image();
      this.pipeImage.src = '/pipe.png';
      this.blockImage = new Image();
      this.blockImage.src = '/block.png';
    }

    // Ground (Floor y=400)
    // Section 1: Start to first pit
    this.platforms.push({ x: 0, y: 400, width: 2200, height: 50, type: 'ground' });
    
    // Section 2: After first pit
    this.platforms.push({ x: 2350, y: 400, width: 550, height: 50, type: 'ground' });
    
    // Section 3: After second pit (Split to create pit between stairs)
    this.platforms.push({ x: 3050, y: 400, width: 1150, height: 50, type: 'ground' }); // Ends at 4200
    this.platforms.push({ x: 4400, y: 400, width: 650, height: 50, type: 'ground' }); // Starts at 4400

    // Pipes
    this.addPipe(900, 400, 2); // 2 blocks high
    this.addPipe(1300, 400, 3); // 3 blocks high
    this.addPipe(1600, 400, 3); // 3 blocks high
    this.addPipe(2000, 400, 3); // 3 blocks high

    // Blocks & Bricks
    // First group
    this.addBlock(500, 250);
    this.addBlock(650, 250);
    this.addBlock(700, 250);
    this.addBlock(750, 250);
    this.addBlock(700, 100); // Top block

    // Second group
    this.addBlock(2450, 250);
    this.addBlock(2500, 250);
    this.addBlock(2550, 250);

    // Stairs
    this.addStairs(4000, 400, 4);
    this.addStairs(4400, 400, 4, true); // Reverse stairs (optional, just wall for now)

    // Enemies
    this.enemies.push(new Enemy(800, 360));
    this.enemies.push(new Enemy(1400, 360));
    this.enemies.push(new Enemy(1800, 360));
    this.enemies.push(new Enemy(2500, 360));
    this.enemies.push(new Enemy(3500, 360));

    // Goal
    this.goal = { x: 4800, y: 300, width: 50, height: 100 };
    this.width = 5000;
  }

  private addPipe(x: number, groundY: number, heightInBlocks: number) {
    const blockSize = 50;
    const height = heightInBlocks * blockSize;
    // Extend height slightly to ensure it connects with ground (fix floating issue)
    this.platforms.push({ x: x, y: groundY - height, width: 60, height: height + 10, type: 'pipe' });
  }

  private addBlock(x: number, y: number) {
    this.platforms.push({ x: x, y: y, width: 50, height: 50, type: 'block' });
  }

  private addStairs(startX: number, groundY: number, steps: number, reverse: boolean = false) {
    const blockSize = 50;
    for (let i = 0; i < steps; i++) {
      const x = reverse ? startX + (steps - 1 - i) * blockSize : startX + i * blockSize;
      const heightInBlocks = i + 1;
      
      // Stack blocks
      for (let j = 0; j < heightInBlocks; j++) {
        const y = groundY - (j + 1) * blockSize;
        this.addBlock(x, y);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D, cameraX: number) {
    // Draw platforms
    for (const p of this.platforms) {
      if (p.x + p.width > cameraX && p.x < cameraX + ctx.canvas.width) {
        if (p.type === 'pipe') {
          if (this.pipeImage && this.pipeImage.complete) {
            ctx.drawImage(this.pipeImage, p.x - cameraX, p.y, p.width, p.height);
          } else {
            ctx.fillStyle = '#22c55e'; // Green
            ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
          }
        } else if (p.type === 'block') {
          if (this.blockImage && this.blockImage.complete) {
            ctx.drawImage(this.blockImage, p.x - cameraX, p.y, p.width, p.height);
          } else {
            ctx.fillStyle = '#b45309'; // Brown
            ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
          }
        } else {
          // Ground
          ctx.fillStyle = '#654321'; // Brown
          ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
        }
      }
    }

    // Draw enemies
    for (const e of this.enemies) {
      if (e.x + e.width > cameraX && e.x < cameraX + ctx.canvas.width) {
        e.draw(ctx, cameraX);
      }
    }

    // Draw goal
    if (this.goalImage && this.goalImage.complete) {
      ctx.drawImage(this.goalImage, this.goal.x - cameraX, this.goal.y, this.goal.width, this.goal.height);
    } else {
      // Fallback
      ctx.fillStyle = '#EF4444'; // Red flag
      ctx.fillRect(this.goal.x - cameraX, this.goal.y, this.goal.width, this.goal.height);
      
      // Draw pole
      ctx.fillStyle = '#9CA3AF'; // Gray pole
      ctx.fillRect(this.goal.x - cameraX - 5, this.goal.y, 5, 100);
    }
  }
}
