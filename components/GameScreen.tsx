import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Button } from './Button';
import { explainAnswerWithAI } from '../services/geminiService';
// Added Sparkles to imports
import { CheckCircle2, XCircle, Bot, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

interface GameScreenProps {
  questions: Question[];
  onFinish: (score: number, correct: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null);
    setIsAnswered(false);
    setAiExplanation(null);
    setIsLoadingAI(false);
  }, [currentIndex]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish(score + (selectedOption === currentQuestion.answer ? 0 : 0), score);
    }
  };

  const handleAskAI = async () => {
    if (!isAnswered || selectedOption === null) return;
    
    setIsLoadingAI(true);
    const explanation = await explainAnswerWithAI(
      currentQuestion.q,
      currentQuestion.options[currentQuestion.answer],
      currentQuestion.options[selectedOption]
    );
    setAiExplanation(explanation);
    setIsLoadingAI(false);
  };

  // Progress percentage
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header / Progress */}
      <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
        <span>Questão {currentIndex + 1} de {questions.length}</span>
        <span>Pontos: {score}</span>
      </div>
      
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
          {currentQuestion.q}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonStyle = "bg-slate-700 hover:bg-slate-600 text-slate-200";
            let icon = null;

            if (isAnswered) {
              if (index === currentQuestion.answer) {
                buttonStyle = "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300";
                icon = <CheckCircle2 className="text-emerald-500" />;
              } else if (index === selectedOption) {
                buttonStyle = "bg-red-500/20 border-2 border-red-500 text-red-300";
                icon = <XCircle className="text-red-500" />;
              } else {
                buttonStyle = "bg-slate-800 text-slate-500 opacity-50";
              }
            } else if (selectedOption === index) {
              buttonStyle = "bg-blue-600 text-white";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
              >
                <div className="flex items-center">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-4 ${isAnswered && index === currentQuestion.answer ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg">{option}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Bar (Controls & AI) */}
      {isAnswered && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          <div className="flex gap-4">
            <Button 
              onClick={handleAskAI} 
              variant="outline" 
              className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
              disabled={isLoadingAI || aiExplanation !== null}
              icon={<Bot size={18} />}
            >
              {isLoadingAI ? "Perguntando ao Gemini..." : "Explicar com IA"}
            </Button>
            
            <Button 
              onClick={handleNext} 
              className="flex-1"
              icon={<ArrowRight size={18} />}
            >
              {currentIndex === questions.length - 1 ? "Finalizar" : "Próxima"}
            </Button>
          </div>

          {/* AI Explanation Card */}
          {aiExplanation && (
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Bot size={100} />
               </div>
               <div className="relative z-10">
                 <h3 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                   <Sparkles size={16} /> Tutor Gemini
                 </h3>
                 <p className="text-slate-200 leading-relaxed italic">
                   "{aiExplanation}"
                 </p>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};