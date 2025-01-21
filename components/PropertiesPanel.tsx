"use client";

import { useState, useEffect, useCallback } from 'react';
import { Node } from 'reactflow';
import { Game, EVENT_TYPES, EVENT_TYPE_NAMES, ACTION_TYPES, ACTION_TYPE_NAMES } from '@/lib/types/game';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X as XIcon, Plus, Trash2 } from 'lucide-react';

function LocationProperties({ data, onChange, game }: { data: any; onChange: (updates: any) => void; game: Game }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-300">Name</label>
        <Input
          value={data.label}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange({ label: newValue });
          }}
          className="bg-gray-800 border-gray-700 text-gray-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-300">Description</label>
        <Textarea
          value={data.description}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange({ description: newValue });
          }}
          className="bg-gray-800 border-gray-700 text-gray-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-300">Items</label>
        <Select
          onValueChange={(value) => {
            const newItems = [...(data.items || [])];
            if (!newItems.includes(value)) {
              newItems.push(value);
              onChange({ items: newItems });
            }
          }}
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
            <SelectValue placeholder="Add an item..." />
          </SelectTrigger>
          <SelectContent>
            {game.Items.map((item) => (
              <SelectItem key={item.Id} value={item.Id}>
                {item.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 space-y-2">
          {data.items?.map((itemId: string, index: number) => {
            const item = game.Items.find(i => i.Id === itemId);
            return item ? (
              <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                <span className="text-gray-200">{item.Name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newItems = data.items.filter((_: string, i: number) => i !== index);
                    onChange({ items: newItems });
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

interface PropertiesPanelProps {
  node: Node;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
  onChange: (nodeId: string, data: any) => void;
  game: Game;
}

function FocalPointProperties({ data, onChange, game }: { data: any; onChange: (updates: any) => void; game: Game }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-300">Name</label>
        <Input
          value={data.label}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange({ label: newValue });
          }}
          className="bg-gray-800 border-gray-700 text-gray-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-300">Description</label>
        <Textarea
          value={data.description}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange({ description: newValue });
          }}
          className="bg-gray-800 border-gray-700 text-gray-200"
        />
      </div>
    </>
  );
}

function EventProperties({ data, onChange, game }: { data: any; onChange: (updates: any) => void; game: Game }) {
  const [event, setEvent] = useState(() => data.event || { 
    Event: EVENT_TYPES.EXAMINE, 
    Actions: [] 
  });

  // Update local event state when data changes
  useEffect(() => {
    setEvent(data.event || { Event: EVENT_TYPES.EXAMINE, Actions: [] });
  }, [data.event]);

  const updateEvent = useCallback((updates: any) => {
    const updatedEvent = { ...event, ...updates };
    setEvent(updatedEvent);
    onChange({ event: updatedEvent });
  }, [event, onChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-300">Event Type</label>
        <Select
          value={event.Event.toString()}
          onValueChange={(value) => updateEvent({
            Event: parseInt(value),
            ItemId: parseInt(value) === EVENT_TYPES.USE_ITEM ? '' : undefined
          })}
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EVENT_TYPE_NAMES).map(([value, name]) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(event.Event === EVENT_TYPES.USE_ITEM || event.Event === EVENT_TYPES.USE_WITH_ITEM) && (
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-300">Required Item</label>
          <Select
            value={event.ItemId || ''}
            onValueChange={(value) => updateEvent({ ItemId: value })}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue placeholder="Select required item" />
            </SelectTrigger>
            <SelectContent>
              {game.Items.map((item) => (
                <SelectItem key={item.Id} value={item.Id}>
                  {item.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-300">Actions</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newActions = [...(event.Actions || []), {
                Event: ACTION_TYPES.DISPLAY_MESSAGE,
                Arguments: ['']
              }];
              updateEvent({ Actions: newActions });
            }}
            className="text-gray-400 hover:text-gray-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Action
          </Button>
        </div>

        {event.Actions?.map((action: any, actionIndex: number) => (
          <div key={actionIndex} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <Select
                value={action.Event.toString()}
                onValueChange={(value) => {
                  const newActions = [...event.Actions];
                  newActions[actionIndex] = {
                    Event: parseInt(value),
                    Arguments: ['']
                  };
                  updateEvent({ Actions: newActions });
                }}
              >
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTION_TYPE_NAMES).map(([value, name]) => (
                    <SelectItem key={value} value={value}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newActions = event.Actions.filter((_: any, i: number) => i !== actionIndex);
                  updateEvent({ Actions: newActions });
                }}
                className="h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {action.Event === ACTION_TYPES.DISPLAY_MESSAGE && (
              <Textarea
                value={action.Arguments[0] || ''}
                onChange={(e) => {
                  const newActions = [...event.Actions];
                  newActions[actionIndex] = {
                    ...action,
                    Arguments: [e.target.value]
                  };
                  updateEvent({ Actions: newActions });
                }}
                placeholder="Enter message text..."
                className="bg-gray-900 border-gray-700 text-sm"
                rows={2}
              />
            )}

            {action.Event === ACTION_TYPES.ADD_ITEM && (
              <Select
                value={action.Arguments[0] || ''}
                onValueChange={(itemId) => {
                  const newActions = [...event.Actions];
                  newActions[actionIndex] = {
                    ...action,
                    Arguments: [itemId]
                  };
                  updateEvent({ Actions: newActions });
                }}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select item to spawn..." />
                </SelectTrigger>
                <SelectContent>
                  {game.Items.map((item) => (
                    <SelectItem key={item.Id} value={item.Id}>
                      {item.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {action.Event === ACTION_TYPES.REMOVE_ITEM && (
              <Select
                value={action.Arguments[0] || ''}
                onValueChange={(itemId) => {
                  const newActions = [...event.Actions];
                  newActions[actionIndex] = {
                    ...action,
                    Arguments: [itemId]
                  };
                  updateEvent({ Actions: newActions });
                }}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select item to take..." />
                </SelectTrigger>
                <SelectContent>
                  {game.Items.map((item) => (
                    <SelectItem key={item.Id} value={item.Id}>
                      {item.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {action.Event === ACTION_TYPES.SET_FLAG && (
              <div className="space-y-2">
                <Input
                  value={action.Arguments[0] || ''}
                  onChange={(e) => {
                    const newActions = [...event.Actions];
                    newActions[actionIndex] = {
                      ...action,
                      Arguments: [e.target.value, action.Arguments[1] || 'true']
                    };
                    updateEvent({ Actions: newActions });
                  }}
                  placeholder="Flag name..."
                  className="bg-gray-900 border-gray-700"
                />
                <Select
                  value={action.Arguments[1] || 'true'}
                  onValueChange={(value) => {
                    const newActions = [...event.Actions];
                    newActions[actionIndex] = {
                      ...action,
                      Arguments: [action.Arguments[0] || '', value]
                    };
                    updateEvent({ Actions: newActions });
                  }}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Select flag value..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PropertiesPanel({ node, onClose, onDelete, onChange, game }: PropertiesPanelProps) {
  const [localData, setLocalData] = useState(node.data);

  useEffect(() => {
    setLocalData(node.data);
  }, [node.data]);

  const handleSave = () => {
    onChange(node.id, localData);
    onClose();
  };

  const updateLocalData = useCallback((updates: any) => {
    setLocalData(prev => ({ ...prev, ...updates }));
  }, []);

  const getNodeTypeLabel = () => {
    switch (node.type) {
      case 'location':
        return 'Location';
      case 'focalPoint':
        return 'Focal Point';
      case 'event':
        return 'Event';
      default:
        return 'Node';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-gray-200">{getNodeTypeLabel()} Properties</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
          <XIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {node.type === 'location' && (
          <LocationProperties data={localData} onChange={updateLocalData} game={game} />
        )}

        {node.type === 'focalPoint' && (
          <FocalPointProperties data={localData} onChange={updateLocalData} game={game} />
        )}
        
        {node.type === 'event' && (
          <EventProperties data={localData} onChange={updateLocalData} game={game} />
        )}
      </div>

      <div className="p-6 border-t border-gray-800 bg-gray-900/50">
        <Button
          variant="destructive"
          className="w-full mb-2"
          onClick={() => {
            onDelete(node.id);
            onClose();
          }}
        >
          Delete {getNodeTypeLabel()}
        </Button>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}