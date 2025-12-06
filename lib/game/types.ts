export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export enum GameState {
  MENU,
  PLAYING,
  GAME_OVER,
  GAME_CLEAR,
}

export type PlatformType = 'ground' | 'pipe' | 'block' | 'stairs';

export interface Platform extends Rect {
  type: PlatformType;
}
