import GameCanvas from '@/components/GameCanvas';

export default function GamePage() {
  return (
    <main className="container">
      <h1 className="title">Banana Runner</h1>
      <GameCanvas />
      <div className="instructions">
        <p>← → : Move</p>
        <p>Space : Jump</p>
      </div>
    </main>
  );
}
