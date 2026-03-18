'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Heart, LayoutGrid, Type as FontIcon, Palette, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { BrandForm } from '@/components/BrandForm';
import { NameCard } from '@/components/NameCard';
import { SloganList } from '@/components/SloganList';
import { LogoCard } from '@/components/LogoCard';
import { CreativeLoader } from '@/components/CreativeLoader';
import { BusinessName, Slogan, LogoConcept, BrandStyle, AppStep } from '@/types';
import { generateNames, generateSlogans, generateLogoConcepts } from '@/lib/ai';

export default function Home() {
  const [step, setStep] = useState<AppStep>('input');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data state
  const [names, setNames] = useState<BusinessName[]>([]);
  const [slogans, setSlogans] = useState<Slogan[]>([]);
  const [logos, setLogos] = useState<LogoConcept[]>([]);
  
  // Selection state
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedSlogan, setSelectedSlogan] = useState<string | null>(null);
  
  // Input state
  const [inputs, setInputs] = useState<{
    description: string;
    industry: string;
    style: BrandStyle;
  } | null>(null);

  const [favorites, setFavorites] = useState<{
    names: Set<string>;
    slogans: Set<string>;
    logos: Set<string>;
  }>({
    names: new Set(),
    slogans: new Set(),
    logos: new Set(),
  });

  const handleStart = async (params: { description: string; industry: string; style: BrandStyle }) => {
    setIsLoading(true);
    setInputs(params);
    try {
      const generatedNames = await generateNames(params.description, params.industry, params.style);
      setNames(generatedNames);
      setStep('names');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Failed to generate names. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectName = async (name: string) => {
    if (!inputs) return;
    setIsLoading(true);
    setSelectedName(name);
    try {
      const generatedSlogans = await generateSlogans(name, inputs.description, inputs.industry, inputs.style);
      setSlogans(generatedSlogans);
      setStep('slogans');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Failed to generate slogans.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSlogan = async (slogan: string) => {
    if (!inputs || !selectedName) return;
    setIsLoading(true);
    setSelectedSlogan(slogan);
    try {
      const generatedLogos = await generateLogoConcepts(selectedName, slogan, inputs.description, inputs.industry, inputs.style);
      setLogos(generatedLogos);
      setStep('logos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Failed to generate logo concepts.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (type: 'names' | 'slogans' | 'logos', id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev[type]);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return { ...prev, [type]: newSet };
    });
  };

  const reset = () => {
    setStep('input');
    setNames([]);
    setSlogans([]);
    setLogos([]);
    setSelectedName(null);
    setSelectedSlogan(null);
  };

  const renderStepIndicator = () => {
    const steps: { key: AppStep; label: string }[] = [
      { key: 'input', label: 'Start' },
      { key: 'names', label: 'Name' },
      { key: 'slogans', label: 'Slogan' },
      { key: 'logos', label: 'Logo' },
    ];

    return (
      <div className="flex items-center justify-center gap-4 mb-12">
        {steps.map((s, idx) => {
          const isActive = step === s.key;
          const isCompleted = steps.findIndex(st => st.key === step) > idx;

          return (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                  isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                  'bg-white border-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span>{idx + 1}</span>}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-12 h-[2px] mx-2 mb-6 transition-colors ${
                  steps.findIndex(st => st.key === step) > idx ? 'bg-green-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      {/* Header */}
      <header className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-6"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Branding
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-4"
        >
          AI Brand <span className="text-gradient">Builder</span>
        </motion.h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Step-by-step branding journey powered by advanced AI.
        </p>
      </header>

      {renderStepIndicator()}

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CreativeLoader 
                message={
                  step === 'input' ? "Brainstorming names..." :
                  step === 'names' ? "Crafting perfect slogans..." :
                  "Designing visual concepts..."
                } 
              />
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 'input' && (
                <div className="max-w-3xl mx-auto">
                  <BrandForm onGenerate={handleStart} isLoading={isLoading} />
                </div>
              )}

              {step === 'names' && (
                <section>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <LayoutGrid className="w-8 h-8 text-indigo-600" />
                        Choose a Name
                      </h2>
                      <p className="text-slate-500">Pick the perfect foundation for your brand</p>
                    </div>
                    <button 
                      onClick={() => inputs && handleStart(inputs)}
                      className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate Names
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {names.map((item) => (
                      <NameCard 
                        key={item.id} 
                        item={item} 
                        onSelect={handleSelectName}
                        isFavorite={favorites.names.has(item.id)}
                        onToggleFavorite={() => toggleFavorite('names', item.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {step === 'slogans' && (
                <section className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                      <button 
                        onClick={() => setStep('names')}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-4 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Names
                      </button>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <FontIcon className="w-8 h-8 text-indigo-600" />
                        Pick a Slogan
                      </h2>
                      <p className="text-slate-500">Selected Name: <span className="font-bold text-indigo-600">{selectedName}</span></p>
                    </div>
                    <button 
                      onClick={() => selectedName && handleSelectName(selectedName)}
                      className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate Slogans
                    </button>
                  </div>
                  <SloganList 
                    items={slogans} 
                    favorites={favorites.slogans} 
                    onToggleFavorite={(id) => toggleFavorite('slogans', id)}
                    onSelect={handleSelectSlogan}
                  />
                </section>
              )}

              {step === 'logos' && (
                <section>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                      <button 
                        onClick={() => setStep('slogans')}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-4 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Slogans
                      </button>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <Palette className="w-8 h-8 text-indigo-600" />
                        Logo Concepts
                      </h2>
                      <p className="text-slate-500">Visualizing <span className="font-bold text-indigo-600">{selectedName}</span> with "{selectedSlogan}"</p>
                    </div>
                    <button 
                      onClick={() => selectedSlogan && handleSelectSlogan(selectedSlogan)}
                      className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate Logos
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {logos.map((item) => (
                      <LogoCard 
                        key={item.id} 
                        item={item} 
                        isFavorite={favorites.logos.has(item.id)}
                        onToggleFavorite={() => toggleFavorite('logos', item.id)}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-20 text-center py-12 border-t border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Branding Complete!</h3>
                    <button 
                      onClick={reset}
                      className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                    >
                      Start New Project
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
