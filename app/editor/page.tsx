"use client";

import { useState } from 'react';
import { Game, Map, Location, FocalPoint, Item, Event, Action } from '@/lib/types/game';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Download, ArrowLeft, Upload, Box, Map as MapIcon, Boxes, Package, BookTemplate as FileTemplate, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { GameEditor } from '@/components/GameEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import templateGame from '@/lib/template-game';

export default function EditorPage() {
  const [game, setGame] = useState<Game>({
    Items: [],
    Maps: []
  });
  const [activeTab, setActiveTab] = useState("maps");

  const downloadGame = () => {
    const gameJson = JSON.stringify(game, null, 2);
    const blob = new Blob([gameJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadGame = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const loadedGame = JSON.parse(content);
          // Basic validation to ensure the file has the required structure
          if (Array.isArray(loadedGame.Items) && Array.isArray(loadedGame.Maps)) {
            setGame(loadedGame);
          } else {
            alert('Invalid game file format');
          }
        }
      } catch (error) {
        alert('Error loading game file');
        console.error('Error loading game file:', error);
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be loaded again if needed
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-24">
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[2000px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Game Editor
            </h1>
            <Button
              onClick={() => setGame(templateGame)}
              className="ml-4 bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg"
            >
              <FileTemplate className="w-4 h-4 mr-2" />
              Load Template
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="ml-2 bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 hover:border-gray-600"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Tips & Best Practices
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                      Game Structure
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Start with a strong introduction that sets up the story and player objectives</li>
                      <li>Create a logical flow between locations using descriptive focal points</li>
                      <li>Balance puzzle difficulty with clear hints in item and location descriptions</li>
                      <li>Use the visual node editor to plan and visualize game flow</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                      Items & Interactions
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Give items unique, descriptive IDs that match their purpose (e.g., "old_key", "ritual_book")</li>
                      <li>Create multi-step puzzles using item combinations and focal point interactions</li>
                      <li>Use the "examine" command to provide additional clues through detailed descriptions</li>
                      <li>Consider adding red herrings and optional items to encourage exploration</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                      Events & Actions
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Chain events together using flags to create complex sequences</li>
                      <li>Provide clear feedback messages for all player actions</li>
                      <li>Use conditional events to change the game state based on player choices</li>
                      <li>Test all possible interaction combinations to prevent dead ends</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                      Testing & Polish
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Save your game frequently using the "Save Game" button</li>
                      <li>Test the game from a new player's perspective using the terminal interface</li>
                      <li>Ensure all commands (look, examine, interact, move, inventory, use, take) work as expected</li>
                      <li>Add atmospheric descriptions to enhance immersion</li>
                    </ul>
                  </div>

                  <div className="md:col-span-2 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-medium bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                      Terminal Interface
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Players can use "help" to see all available commands</li>
                      <li>The terminal supports natural language commands for better immersion</li>
                      <li>Items can be used with "use [item] on [object]" syntax</li>
                      <li>Movement between locations uses "move [location]" or just "move" to list options</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="file"
                onChange={loadGame}
                accept=".json"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Load game file"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg">
                <Upload className="w-4 h-4 mr-2" />
                Load Game
              </Button>
            </div>
            <Button onClick={downloadGame} className="bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg">
              <Download className="w-4 h-4 mr-2" />
              Save Game
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-[2000px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="bg-gray-900/50 border border-gray-800">
              <TabsTrigger 
                value="items" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                Items
              </TabsTrigger>
              <TabsTrigger 
                value="maps" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <MapIcon className="w-4 h-4 mr-2" />
                Maps
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="items" className="px-6 mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-200">Items</h2>
                <Button
                  onClick={() => {
                    setGame(prev => ({
                      ...prev,
                      Items: [
                        ...prev.Items,
                        {
                          Id: `item_${prev.Items.length + 1}`,
                          Name: 'New Item',
                          Description: 'Item description'
                        }
                      ]
                    }));
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {game.Items.map((item, index) => (
                  <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">ID</label>
                      <Input
                        value={item.Id}
                        onChange={(e) => {
                          const newItems = [...game.Items];
                          newItems[index] = { ...item, Id: e.target.value };
                          setGame({ ...game, Items: newItems });
                        }}
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Name</label>
                      <Input
                        value={item.Name}
                        onChange={(e) => {
                          const newItems = [...game.Items];
                          newItems[index] = { ...item, Name: e.target.value };
                          setGame({ ...game, Items: newItems });
                        }}
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Description</label>
                      <Textarea
                        value={item.Description}
                        onChange={(e) => {
                          const newItems = [...game.Items];
                          newItems[index] = { ...item, Description: e.target.value };
                          setGame({ ...game, Items: newItems });
                        }}
                        className="bg-gray-800 border-gray-700 text-gray-200"
                        rows={3}
                      />
                    </div>
                    <div className="pt-2">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          const newItems = game.Items.filter((_, i) => i !== index);
                          setGame({ ...game, Items: newItems });
                        }}
                      >
                        Delete Item
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="maps" className="mt-6">
            <GameEditor game={game} onChange={setGame} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}