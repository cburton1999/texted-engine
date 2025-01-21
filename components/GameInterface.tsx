"use client";

import { useState, useEffect, useRef } from 'react';
import { GameEngine } from '@/lib/game-engine';
import { Game } from '@/lib/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import templateGame from '@/lib/template-game';
import GameLoader from '@/components/GameLoader';

export default function GameInterface() {
  const [gameEngine] = useState(() => {
    const savedGame = localStorage.getItem('loadedGame');
    let gameData = templateGame;
    
    if (savedGame) {
      try {
        const parsed = JSON.parse(savedGame);
        if (Array.isArray(parsed.Items) && Array.isArray(parsed.Maps)) {
          gameData = parsed;
        }
      } catch (error) {
        console.error('Error parsing saved game:', error);
      }
    }
    
    return new GameEngine(gameData);
  });

  const [messages, setMessages] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameStarted) {
      const currentMap = gameEngine.getCurrentLocation();
      const gameName = localStorage.getItem('selectedGameFile') || 'Default Game';
      setMessages([
        `Loading "${gameName}"...`,
        gameEngine.game.Maps[0].Introduction,
        `\nLocation: ${currentMap.Name}\n${currentMap.Description}`,
        '',
        'Type "help" for available commands.',
      ]);
      setGameStarted(true);
    }
  }, [gameStarted, gameEngine]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;

    addMessage(`> ${command}`);
    const messages = gameEngine.handleCommand(command);
    messages.forEach(addMessage);
    setCommand('');
  };

  if (!localStorage.getItem('selectedGameFile')) {
    return (
      <div className="terminal min-h-screen p-4">
        <div className="scanline"></div>
        <div className="terminal-content max-w-4xl mx-auto">
          <Card className="bg-transparent border-2 border-green-500 p-8">
            <div className="text-center mb-8">
              <h1 className="terminal-text text-4xl mb-4">ROBCO INDUSTRIES</h1>
              <p className="terminal-text text-xl">TERMINAL INTERFACE v2.5.0</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link 
                href="/editor" 
                className="border-2 border-green-500 bg-transparent text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono uppercase p-6 rounded flex flex-col items-center justify-center gap-3 h-40"
              >
                <Plus className="w-10 h-10" />
                <span className="text-xl text-center">Create New Terminal Program</span>
              </Link>
              
              <button
                onClick={() => {
                  localStorage.setItem('selectedGameFile', 'Blackwood Manor');
                  localStorage.setItem('loadedGame', JSON.stringify(templateGame));
                  window.location.reload();
                }}
                className="border-2 border-green-500 bg-transparent text-green-500 hover:bg-green-500 hover:text-black transition-colors font-mono uppercase p-6 rounded flex flex-col items-center justify-center gap-3 h-40"
              >
                <PlayCircle className="w-10 h-10" />
                <span className="text-xl text-center">Play Blackwood Manor</span>
              </button>
              
              <div className="h-40">
                <GameLoader />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal min-h-screen p-4">
      <div className="scanline"></div>
      <div className="terminal-content max-w-4xl mx-auto">
        <Card className="bg-transparent border-2 border-green-500">
          <div className="terminal-header flex justify-between items-center p-4">
            <span className="terminal-text font-mono">
              ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM
              <br />
              COPYRIGHT 2075-2077 ROBCO INDUSTRIES
              <br />
              - {localStorage.getItem('selectedGameFile')} -
            </span>
            <Button
              onClick={() => {
                localStorage.removeItem('loadedGame');
                localStorage.removeItem('selectedGameFile');
                window.location.reload();
              }}
              className="bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors font-mono uppercase"
            >
              TERMINATE
            </Button>
          </div>
          <div 
            ref={scrollAreaRef}
            className="terminal-messages font-mono text-green-500 h-[600px] overflow-y-auto p-4 whitespace-pre-wrap"
          >
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                {message}
              </div>
            ))}
          </div>
          <form onSubmit={handleCommand} className="p-4 border-t-2 border-green-500">
            <div className="flex gap-2 items-center">
              <span className="terminal-text">{'>'}</span>
              <Input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="terminal-input flex-1 bg-transparent text-green-500 font-mono border-green-500 focus:border-green-400 focus:ring-green-400"
                placeholder="Enter command..."
                autoFocus
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}