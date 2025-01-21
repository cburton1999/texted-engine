import dynamic from 'next/dynamic';

const GameInterface = dynamic(() => import('@/components/GameInterface'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        <GameInterface />
      </div>
    </div>
  );
}
