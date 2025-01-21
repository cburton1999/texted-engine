"use client";

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Eye } from 'lucide-react';
import { EVENT_TYPE_NAMES } from '@/lib/types/game';

export const FocalPointNode = memo(({ data, isConnectable, selected }: any) => {
  return (
    <div className={`w-[280px] shadow-lg rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 ${
      selected ? 'ring-4 ring-purple-500 shadow-purple-500/20 scale-105' : ''
    }`}
    onClick={(e) => {
      e.stopPropagation();
      data.onClick?.();
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-purple-500" />
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {data.label}
            {data.events?.length > 0 && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({data.events.length} events)
              </span>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {data.description}
        </div>
        {data.events?.length > 0 && (
          <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Events: {data.events.map((event: any) => EVENT_TYPE_NAMES[event.Event]).join(', ')}
            </div>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
});