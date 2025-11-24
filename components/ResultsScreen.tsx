import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Trophy, RefreshCw, Home, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, total, onRestart, onHome }) => {
  const percentage = Math.round((score / total) * 100);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (percentage > 60) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [percentage]);

  const handleShare = async () => {
    const text = `🇧🇷 IBGE Master Quiz\n\n🎯 Minha pontuação: ${score}/${total} (${percentage}%)\n\nVocê consegue superar meu resultado? #IBGE #Quiz`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resultado do IBGE Quiz',
          text: text,
        });
      } catch (err) {
        // Share cancelled or failed, ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  let feedback = "Continue estudando!";
  let colorClass = "text-slate-400";
  
  if (percentage === 100) {
    feedback = "Perfeito! Você é um mestre do IBGE!";
    colorClass = "text-emerald-400";
  } else if (percentage >= 80) {
    feedback = "Excelente trabalho!";
    colorClass = "text-blue-400";
  } else if (percentage >= 50) {
    feedback = "Bom trabalho, mas pode melhorar.";
    colorClass = "text-yellow-400";
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500 max-w-md mx-auto">
      
      <div className="relative">
        <div className={`absolute -inset-4 rounded-full blur-lg opacity-50 ${percentage > 50 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        <div className="bg-slate-800 p-8 rounded-full border-4 border-slate-700 relative z-10 shadow-2xl">
          <Trophy size={64} className={percentage > 50 ? 'text-yellow-400' : 'text-slate-500'} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-white">{percentage}%</h2>
        <p className={`text-xl font-medium ${colorClass}`}>{feedback}</p>
        <p className="text-slate-500">Você acertou {score} de {total} questões</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-500 uppercase">Média</p>
          <p className="text-xl font-bold text-white">{(score / total * 10).toFixed(1)}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-500 uppercase">Status</p>
          <p className="text-xl font-bold text-white">{percentage >= 70 ? 'Aprovado' : 'Reprovado'}</p>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3">
        <Button 
          onClick={handleShare} 
          variant="secondary" 
          icon={copied ? <Check size={18} /> : <Share2 size={18} />}
        >
          {copied ? 'Copiado para o Clipboard!' : 'Compartilhar Resultado'}
        </Button>
        
        <div className="flex gap-3 w-full">
          <Button onClick={onRestart} className="flex-1" icon={<RefreshCw size={18} />}>
            Jogar
          </Button>
          <Button onClick={onHome} variant="outline" className="flex-1" icon={<Home size={18} />}>
            Menu
          </Button>
        </div>
      </div>
    </div>
  );
};