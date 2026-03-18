'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ExternalLink } from 'lucide-react';
import { BusinessName } from '@/types';
import { CopyButton } from './CopyButton';

interface NameCardProps {
  item: BusinessName;
  onSelect: (name: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function NameCard({ item, onSelect, isFavorite, onToggleFavorite }: NameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {item.name}
        </h3>
        <div className="flex gap-1">
          <CopyButton text={item.name} />
          <button 
            onClick={onToggleFavorite}
            className={`p-2 rounded-md transition-all ${isFavorite ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 leading-relaxed mb-4">
        {item.explanation}
      </p>

      <button
        onClick={() => onSelect(item.name)}
        className="w-full py-2 px-4 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
      >
        Use this name
        <ExternalLink className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
