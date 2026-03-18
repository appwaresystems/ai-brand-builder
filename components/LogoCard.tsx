'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Heart, Download, Type as FontIcon, Palette, ChevronDown } from 'lucide-react';
import { LogoConcept } from '@/types';
import { useState } from 'react';
import { downloadBase64Image } from '@/lib/download';

interface LogoCardProps {
  item: LogoConcept;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function LogoCard({ item, isFavorite, onToggleFavorite }: LogoCardProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!item.imageUrl) return;
    setIsDownloading(true);
    try {
      await downloadBase64Image(item.imageUrl, `logo-concept-${item.id}`, format);
      setShowDownloadMenu(false);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Visual Placeholder / SVG Area */}
      <div className="h-64 bg-slate-50 flex items-center justify-center relative group overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.description} 
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-center space-y-2 z-10">
            <div className="w-16 h-16 mx-auto rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
               <div 
                 className="w-8 h-8 rounded-full" 
                 style={{ backgroundColor: item.colorPalette[0] }}
               />
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Concept Preview</p>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <button 
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-slate-400 hover:text-rose-500 transition-all z-20"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              Color Palette
            </h4>
            <div className="flex gap-2">
              {item.colorPalette.map((color, idx) => (
                <div key={idx} className="group relative">
                  <div 
                    className="w-8 h-8 rounded-lg border border-slate-200 shadow-sm cursor-help"
                    style={{ backgroundColor: color }}
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-slate-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FontIcon className="w-4 h-4 text-indigo-500" />
              Font Suggestion
            </h4>
            <p className="text-sm text-slate-600 font-medium">{item.fontSuggestion}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Visual Concept</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{item.visualIdea}</p>
          </div>
        </div>

        <div className="mt-6 relative">
          <button 
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            disabled={!item.imageUrl || isDownloading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Concept
                <ChevronDown className={`w-4 h-4 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          <AnimatePresence>
            {showDownloadMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-30"
              >
                <button
                  onClick={() => handleDownload('png')}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  Download as PNG
                  <span className="text-[10px] text-slate-400 uppercase">High Quality</span>
                </button>
                <div className="h-[1px] bg-slate-100" />
                <button
                  onClick={() => handleDownload('jpeg')}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  Download as JPEG
                  <span className="text-[10px] text-slate-400 uppercase">Compressed</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
