import React, { useState } from 'react';
import { INITIAL_QUESTIONS } from './constants';
import { Question, GameState } from './types';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { generateNewQuestions } from './services/geminiService';
import { AlertCircle, Github } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = () => {
    setScore(0);
    // Shuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setGameState(GameState.PLAYING);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const newQuestions = await generateNewQuestions();
      if (newQuestions && newQuestions.length > 0) {
        setQuestions(newQuestions);
        setGameState(GameState.PLAYING);
      } else {
        throw new Error("Não foi possível gerar perguntas válidas.");
      }
    } catch (err) {
      setError("Erro ao gerar quiz com IA. Verifique sua chave de API ou tente novamente.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const finishGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.RESULTS);
  };

  const goHome = () => {
    setQuestions(INITIAL_QUESTIONS);
    setGameState(GameState.MENU);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black opacity-80"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Simple Navbar */}
        <header className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
             <span className="text-blue-500">●</span> IBGE<span className="text-slate-600">QUIZ</span>
          </div>
          <div className="text-xs font-medium text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
             v2.1 • AI Powered
          </div>
        </header>

        {/* Error Toast */}
        {error && (
           <div className="mx-auto mb-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3 max-w-md animate-in slide-in-from-top-4">
             <AlertCircle size={20} />
             <p className="text-sm">{error}</p>
             <button onClick={() => setError(null)} className="ml-auto hover:text-white">✕</button>
           </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          {gameState === GameState.MENU && (
            <StartScreen 
              onStart={startGame} 
              onGenerateAI={handleGenerateAI}
              isGenerating={isGenerating}
            />
          )}

          {gameState === GameState.PLAYING && (
            <GameScreen 
              questions={questions} 
              onFinish={finishGame} 
            />
          )}

          {gameState === GameState.RESULTS && (
            <ResultsScreen 
              score={score} 
              total={questions.length} 
              onRestart={startGame}
              onHome={goHome}
            />
          )}
        </div>

        <footer className="mt-12 text-center text-slate-600 text-sm py-4 flex flex-col items-center gap-2">
          <p>© {new Date().getFullYear()} IBGE Master Quiz. Powered by Google Gemini.</p>
          <a 
            href="https://github.com/seu-usuario/ibge-quiz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-400 transition-colors opacity-70 hover:opacity-100"
          >
            <Github size={16} /> <span>Ver no GitHub</span>
          </a>
        </footer>
      </main>
    </div>
  );
}