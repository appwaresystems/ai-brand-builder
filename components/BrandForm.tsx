'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { BrandStyle } from '@/types';

interface BrandFormProps {
  onGenerate: (data: { description: string; industry: string; style: BrandStyle }) => void;
  isLoading: boolean;
}

const INDUSTRIES = [
  'Technology', 'Health & Wellness', 'Finance', 'Education', 
  'Food & Beverage', 'Fashion', 'Real Estate', 'Entertainment', 'Other'
];

const STYLES: { value: BrandStyle; label: string }[] = [
  { value: 'modern', label: 'Modern' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'tech', label: 'Tech' },
  { value: 'playful', label: 'Playful' },
  { value: 'minimal', label: 'Minimal' },
];

export function BrandForm({ onGenerate, isLoading }: BrandFormProps) {
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [style, setStyle] = useState<BrandStyle>('modern');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onGenerate({ description, industry, style });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Business Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. AI platform that helps small businesses automate marketing"
            className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Industry
            </label>
            <div className="relative">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white text-slate-800"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Brand Style
            </label>
            <div className="relative">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as BrandStyle)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white text-slate-800"
              >
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Branding
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
