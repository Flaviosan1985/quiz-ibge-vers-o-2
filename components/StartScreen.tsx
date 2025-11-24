import React from 'react';
import { Button } from './Button';
import { BrainCircuit, Play, Sparkles } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onGenerateAI, isGenerating }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
      
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full blur opacity-40 animate-pulse"></div>
        <div className="relative bg-slate-900 p-6 rounded-full border border-slate-700">
          <BrainCircuit size={64} className="text-blue-400" />
        </div>
      </div>

      <div className="space-y-4 max-w-lg">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          IBGE Master Quiz
        </h1>
        <p className="text-slate-400 text-lg">
          Teste seus conhecimentos sobre geografia, estatística e a história do instituto. 
          Use a IA para aprender enquanto joga.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button 
          onClick={onStart} 
          className="flex-1"
          icon={<Play size={20} />}
        >
          Jogar Clássico
        </Button>
        
        <Button 
          onClick={onGenerateAI} 
          variant="secondary"
          className="flex-1"
          isLoading={isGenerating}
          icon={<Sparkles size={20} />}
        >
          Gerar Quiz IA
        </Button>
      </div>

      <div className="pt-8 grid grid-cols-3 gap-8 text-center w-full max-w-2xl border-t border-slate-800">
        <div>
          <p className="text-2xl font-bold text-white">100+</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Questões</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">AI</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Tutor Virtual</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">Rank</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Global</p>
        </div>
      </div>
    </div>
  );
};