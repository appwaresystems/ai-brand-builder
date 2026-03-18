'use client';

import { motion } from 'motion/react';
import { Sparkles, Palette, Zap, Globe, Rocket } from 'lucide-react';

const ICONS = [Sparkles, Palette, Zap, Globe, Rocket];

export function CreativeLoader({ message = "Generating magic..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative w-32 h-32 mb-8">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-dashed border-indigo-200 rounded-full"
        />
        
        {/* Floating icons */}
        {ICONS.map((Icon, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
              x: Math.cos((idx * 2 * Math.PI) / ICONS.length) * 50,
              y: Math.sin((idx * 2 * Math.PI) / ICONS.length) * 50,
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: idx * 0.6,
              ease: "easeInOut"
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500"
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        {/* Central pulse */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-4 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <h3 className="text-2xl font-bold text-slate-900">{message}</h3>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              className="w-2 h-2 bg-indigo-400 rounded-full"
            />
          ))}
        </div>
        <p className="text-slate-500 text-sm max-w-xs mx-auto italic">
          &quot;Our engine is brainstorming unique concepts just for you. This might take a moment...&quot;
        </p>
      </motion.div>
    </div>
  );
}
