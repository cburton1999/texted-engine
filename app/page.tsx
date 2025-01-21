import Link from 'next/link';
import GameInterface from '@/components/GameInterface';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameLoader from '@/components/GameLoader';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        <GameInterface />
      </div>
    </div>
  );
}