import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <h1 className="title">Banana Runner</h1>
      <p className="subtitle">A simple 2D side-scrolling game.</p>
      
      <Link href="/game" className="button">
        Start Game
      </Link>
    </main>
  );
}
