"use client";

import { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Map, Location, FocalPoint, Event } from '@/lib/types/game';
import { LocationNode } from '@/components/nodes/LocationNode';
import { FocalPointNode } from '@/components/nodes/FocalPointNode';
import { EventNode } from '@/components/nodes/EventNode';
import { CustomEventNode } from '@/components/nodes/CustomEventNode';
import { toast } from 'sonner';
import { ConnectionLine } from '@/components/nodes/ConnectionLine';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { Game } from '@/lib/types/game';

interface FlowEditorProps {
  map: Map;
  game: Game;
  onChange: (game: any) => void;
  mapIndex: number;
  onNodeSelect: (node: Node | null) => void;
  selectedNode: Node | null;
}

function Flow({ map, game, onChange, mapIndex, onNodeSelect, selectedNode }: FlowEditorProps) {
  const nodeTypes = useMemo(() => ({
    'location': LocationNode,
    'focalPoint': FocalPointNode,
    'event': EventNode,
    'customEvent': CustomEventNode,
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number; parentId?: string }>>({});
  const gameContext = useMemo(() => ({ ...game }), [game]);
  const { setCenter } = useReactFlow();

  // Update nodes when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      // Center the view on the new node with some zoom
      setCenter(selectedNode.position.x, selectedNode.position.y, { zoom: 0.75, duration: 800 });
      
      setNodes(nds => {
        // Remove any existing node with the same ID
        const filteredNodes = nds.filter(n => n.id !== selectedNode.id);
        // Add the new node
        return [...filteredNodes, selectedNode];
      });
    }
  }, [selectedNode, setNodes, setCenter]);
  const { project } = useReactFlow();

  const updateMap = useCallback((updatedMap: Partial<Map>) => {
    onChange((prevGame: any) => {
      const newMaps = [...prevGame.Maps];
      newMaps[mapIndex] = { ...newMaps[mapIndex], ...updatedMap };
      return { ...prevGame, Maps: newMaps };
    });
  }, [onChange, mapIndex]);

  const deleteNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const updatedMap = { ...map };
    const { nodeType, locationIndex, fpIndex, eventIndex, aliasIndex } = node.data;

    switch (nodeType) {
      case 'location':
        updatedMap.Locations = updatedMap.Locations.filter((_, i) => i !== locationIndex);
        break;
      case 'focalPoint':
        updatedMap.Locations[locationIndex].FoculPoints = 
          updatedMap.Locations[locationIndex].FoculPoints.filter((_, i) => i !== fpIndex);
        break;
      case 'event':
        updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Events = 
          updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Events.filter((_, i) => i !== eventIndex);
        break;
      case 'customEvent':
        if (updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases) {
          updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases = 
            updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases.filter((_, i) => i !== aliasIndex);
        }
        break;
    }

    // Remove the node and its edges
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    
    // Clear selection if the deleted node was selected
    if (selectedNode?.id === nodeId) {
      onNodeSelect(null);
    }

    updateMap(updatedMap);
  }, [nodes, map, updateMap, selectedNode, onNodeSelect]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    onNodeSelect(node);
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    setNodePositions(prev => ({
      ...prev,
      [node.id]: { 
        ...node.position,
        parentId: edges.find(e => e.target === node.id)?.source 
      }
    }));
  }, [edges]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Update node data with full game context for items
          const updatedData = { ...node.data, ...newData };
          if (newData.event?.Actions) {
            updatedData.event.Actions = newData.event.Actions.map((action: any) => {
              if (action.Event === 1) { // ADD_ITEM
                const item = game.Items.find(i => i.Id === action.Arguments[0]);
                if (item) {
                  return { ...action, itemName: item.Name };
                }
              }
              return action;
            });
          }
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const updatedMap: Partial<Map> = { ...map };
    const { nodeType, locationIndex, fpIndex, eventIndex, aliasIndex } = node.data;

    switch (nodeType) {
      case 'location':
        updatedMap.Locations[locationIndex] = {
          ...updatedMap.Locations[locationIndex],
          Name: newData.label,
          Description: newData.description,
          Items: newData.items || []
        };
        break;
      case 'focalPoint':
        updatedMap.Locations[locationIndex].FoculPoints[fpIndex] = {
          ...updatedMap.Locations[locationIndex].FoculPoints[fpIndex],
          Name: newData.label,
          Description: newData.description
        };
        break;
      case 'event':
        updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Events[eventIndex] = {
          ...updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Events[eventIndex],
          ...newData.event
        };
        break;
      case 'customEvent':
        if (!updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases) {
          updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases = [];
        }
        updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases[aliasIndex] = {
          Verb: newData.command || 'new_command',
          Actions: newData.actions || [],
          RequiredItems: newData.requiredItems || [],
          RequiredFlags: newData.requiredFlags || []
        };
        break;
    }

    updateMap(updatedMap);
  }, [nodes, map, updateMap]);

  useEffect(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Create location nodes
    map?.Locations?.forEach((location, locationIndex) => {
      const locationNodeId = `location-${locationIndex}`;
      const savedLocPosition = nodePositions[locationNodeId];
      const locPosition = savedLocPosition || { 
        x: 100, 
        y: 100 
      };

      const locationNode: Node = {
        id: locationNodeId,
        type: 'location',
        position: locPosition,
        data: { 
          label: location.Name,
          description: location.Description,
          nodeType: 'location',
          locationIndex,
          items: location.Items || []
        }
      };
      newNodes.push(locationNode);

      // Create focal point nodes
      location.FoculPoints?.forEach((focalPoint, fpIndex) => {
        const fpNodeId = `fp-${locationIndex}-${fpIndex}`;
        const savedFPPosition = nodePositions[fpNodeId];
        const fpPosition = savedFPPosition || {
          x: 100, 
          y: 100 
        };

        const fpNode: Node = {
          id: fpNodeId,
          type: 'focalPoint',
          position: fpPosition,
          data: { 
            label: focalPoint.Name,
            description: focalPoint.Description,
            nodeType: 'focalPoint',
            locationIndex,
            fpIndex
          }
        };
        newNodes.push(fpNode);

        // Connect location to focal point
        newEdges.push({
          id: `e-${locationNodeId}-${fpNodeId}`,
          source: locationNodeId,
          target: fpNodeId,
          type: 'smoothstep'
        });

        // Create event nodes
        focalPoint.Events?.forEach((event, eventIndex) => {
          const eventNodeId = `event-${locationIndex}-${fpIndex}-${eventIndex}`;
          const savedEventPosition = nodePositions[eventNodeId];
          const eventPosition = savedEventPosition || {
            x: 100, 
            y: 100 
          };

          const eventNode: Node = {
            id: eventNodeId,
            type: 'event',
            position: eventPosition,
            data: { 
              label: `Event ${eventIndex + 1}`,
              event,
              nodeType: 'event',
              locationIndex,
              fpIndex,
              eventIndex
            }
          };
          newNodes.push(eventNode);

          // Connect focal point to event
          newEdges.push({
            id: `e-${fpNodeId}-${eventNodeId}`,
            source: fpNodeId,
            target: eventNodeId,
            type: 'smoothstep'
          });
        });

        // Create custom event nodes
        focalPoint.Aliases?.forEach((alias, aliasIndex) => {
          const customEventNodeId = `custom-event-${locationIndex}-${fpIndex}-${aliasIndex}`;
          const savedCustomEventPosition = nodePositions[customEventNodeId];
          const customEventPosition = savedCustomEventPosition || {
            x: fpPosition.x + 400,
            y: fpPosition.y + (focalPoint.Events?.length || 0) * 250 + aliasIndex * 250
          };

          const customEventNode: Node = {
            id: customEventNodeId,
            type: 'customEvent',
            position: customEventPosition,
            data: {
              label: `Command: ${alias.Verb}`,
              command: alias.Verb,
              actions: alias.Actions,
              requiredItems: alias.RequiredItems || [],
              requiredFlags: alias.RequiredFlags || [],
              nodeType: 'customEvent',
              locationIndex,
              fpIndex,
              aliasIndex
            }
          };
          newNodes.push(customEventNode);

          // Connect focal point to custom event
          newEdges.push({
            id: `e-${fpNodeId}-${customEventNodeId}`,
            source: fpNodeId,
            target: customEventNodeId,
            type: 'smoothstep'
          });
        });
      });
    });

    setNodes(newNodes);
    setEdges(prev => {
      // Keep only edges that still have valid source and target nodes
      const validEdges = prev.filter(edge => 
        newNodes.some(n => n.id === edge.source) && 
        newNodes.some(n => n.id === edge.target)
      );
      // Add new edges that don't exist yet
      const existingEdgeIds = new Set(validEdges.map(e => e.id));
      const edgesToAdd = newEdges.filter(e => !existingEdgeIds.has(e.id));
      return [...validEdges, ...edgesToAdd];
    });
  }, [map, setNodes, setEdges, nodePositions]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);

      if (sourceNode?.type === 'focalPoint' && (targetNode?.type === 'event' || targetNode?.type === 'customEvent')) {
        const locationIndex = sourceNode.data.locationIndex;
        const fpIndex = sourceNode.data.fpIndex;
        const eventNode = nodes.find(n => n.id === targetNode.id);

        const updatedMap = { ...map };

        if (targetNode.type === 'event') {
          // Handle regular event connection
          if (eventNode.data.locationIndex !== undefined) {
            const oldLocationIndex = eventNode.data.locationIndex;
            const oldFpIndex = eventNode.data.fpIndex;
            const oldEventIndex = eventNode.data.eventIndex;
            
            updatedMap.Locations[oldLocationIndex].FoculPoints[oldFpIndex].Events = 
              updatedMap.Locations[oldLocationIndex].FoculPoints[oldFpIndex].Events.filter(
                (_: any, i: number) => i !== oldEventIndex
              );
          }

          // Add event to the new focal point
          const newEvent = { ...targetNode.data.event };
          updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Events.push(newEvent);
          const eventIndex = updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Events.length - 1;

          // Update node data
          setNodes(nds => nds.map(node => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  locationIndex,
                  fpIndex,
                  eventIndex
                }
              };
            }
            return node;
          }));
        } else if (targetNode.type === 'customEvent') {
          // Handle custom event connection
          if (!updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases) {
            updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases = [];
          }
          
          // Add custom event as an alias
          const newAlias = {
            Verb: targetNode.data.command || 'new_command',
            Actions: targetNode.data.actions || [],
            RequiredItems: targetNode.data.requiredItems || [],
            RequiredFlags: targetNode.data.requiredFlags || []
          };
          
          updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases.push(newAlias);
          
          // Update node data
          setNodes(nds => nds.map(node => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  locationIndex,
                  fpIndex,
                  aliasIndex: updatedMap.Locations[locationIndex].FoculPoints[fpIndex].Aliases.length - 1
                }
              };
            }
            return node;
          }));
        }

        updateMap(updatedMap);
        setEdges(eds => addEdge(params, eds));
      } else {
        toast.error('Events and custom events can only be connected to focal points');
      }
    },
    [setEdges, nodes, map, updateMap, setNodes]
  );

  return (
    <div className="flex-1 h-[calc(100vh-130px)]">
      <ReactFlow
        nodesDraggable={true}
        nodesConnectable={true}
        onPaneClick={onPaneClick}
        selectionMode="none"
        defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        nodes={nodes.map(node => ({
          ...node,
          className: `${node.type === 'location' ? 'location-node' : ''}`,
          data: {
            ...node.data,
            onDelete: () => deleteNode(node.id),
            onClick: () => onNodeSelect(node),
            selected: selectedNode?.id === node.id,
            locationIndex: node.data.locationIndex
          }
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        connectionMode="loose"
        connectionRadius={40}
        snapToGrid={true}
        snapGrid={[20, 20]}
        connectionLineComponent={ConnectionLine}
        className="bg-gray-950"
        fitView
      >
        <Background color="#374151" gap={16} />
        <Controls />
        <MiniMap
          style={{ width: 200, height: 150 }}
          nodeColor={(node) => {
            switch (node.type) {
              case 'location':
                return '#10B981';
              case 'focalPoint':
                return '#8B5CF6';
              case 'event':
                return '#F59E0B';
              default:
                return '#6B7280';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
          className="bg-gray-900 border-gray-800"
        />
      </ReactFlow>
      <div className={`absolute top-0 right-0 w-72 h-full bg-gray-900 border-l border-gray-800 transition-all duration-300 ${selectedNode ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedNode && (
          <PropertiesPanel
            node={selectedNode}
            onClose={() => onNodeSelect(null)}
            onDelete={deleteNode}
            onDelete={deleteNode}
            onChange={updateNodeData}
            game={gameContext}
          />
        )}
      </div>
    </div>
  );
}

export function FlowEditor(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
}
