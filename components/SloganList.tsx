'use client';

import { motion } from 'motion/react';
import { Slogan } from '@/types';
import { CopyButton } from './CopyButton';
import { Heart } from 'lucide-react';

interface SloganListProps {
  items: Slogan[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelect: (slogan: string) => void;
}

export function SloganList({ items, favorites, onToggleFavorite, onSelect }: SloganListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, idx) => (
        <motion.div
          key={item.id || idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-lg font-medium text-slate-800 leading-tight">{item.text}</span>
            <div className="flex gap-1">
              <CopyButton text={item.text} />
              <button 
                onClick={() => onToggleFavorite(item.id || item.text)}
                className={`p-2 rounded-md transition-all ${favorites.has(item.id || item.text) ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'}`}
              >
                <Heart className={`w-4 h-4 ${favorites.has(item.id || item.text) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          <button
            onClick={() => onSelect(item.text)}
            className="w-full py-2 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-xl text-sm font-bold transition-all"
          >
            Select this slogan
          </button>
        </motion.div>
      ))}
    </div>
  );
}
