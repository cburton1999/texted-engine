"use client";

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Command } from 'lucide-react';

export const CustomEventNode = memo(({ data, isConnectable, selected }: any) => {
  return (
    <div className={`w-[280px] shadow-lg rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 ${
      selected ? 'ring-4 ring-indigo-500 shadow-indigo-500/20 scale-105' : ''
    }`}
    onClick={(e) => {
      e.stopPropagation();
      data.onClick?.();
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500"
      />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Command className="w-4 h-4 text-indigo-500" />
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {data.label}
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Command: {data.command}
        </div>
        {data.requiredItems?.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Required Items: {data.requiredItems.join(', ')}
          </div>
        )}
        {data.requiredFlags?.length > 0 && (
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Required Flags: {data.requiredFlags.map((f: any) => `${f.Name}=${f.Flag}`).join(', ')}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500"
      />
    </div>
  );
});