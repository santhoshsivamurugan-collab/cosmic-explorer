/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, SpaceRank, Achievement } from '../types';
import { QUIZ_QUESTIONS } from '../data';
import { Trophy, Compass, Star, Award, RotateCcw, ArrowRight, Timer, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export const QuizSection: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');
  const [selectedCategory, setSelectedCategory] = useState<'all' | QuizQuestion['category']>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Quiz active indexes
  const [activeQuestionPool, setActiveQuestionPool] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Stats / Persistence
  const [historicCorrect, setHistoricCorrect] = useState(0);
  const [historicTotal, setHistoricTotal] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  // Timer Ref
  const [timeLeft, setTimeLeft] = useState(25);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Achievements Definition list
  const achievementsList: Achievement[] = [
    { id: 'ach-1', title: 'Solar Explorer', description: 'Complete any astronomical telemetry exam checklist.', iconName: 'Compass', unlocked: unlockedAchievements.includes('ach-1') },
    { id: 'ach-2', title: 'Planet Master', description: 'Secure a perfect 100% accuracy score on any exam.', iconName: 'Trophy', unlocked: unlockedAchievements.includes('ach-2') },
    { id: 'ach-3', title: 'Cosmic Scholar', description: 'Conquer a complete test on challenging "Hard" difficulty.', iconName: 'Award', unlocked: unlockedAchievements.includes('ach-3') }
  ];

  // Derive Rank
  const getSpaceRank = (correct: number, total: number): SpaceRank => {
    if (total === 0) return 'Cadet';
    const pct = correct / total;
    if (pct < 0.45) return 'Cadet';
    if (pct < 0.75) return 'Explorer';
    if (pct < 0.92) return 'Planet Specialist';
    return 'Space Commander';
  };

  // Start Quiz setup
  const startQuizExam = () => {
    // Filter questions based on criteria
    let subPool = QUIZ_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);
    if (selectedCategory !== 'all') {
      subPool = subPool.filter((q) => q.category === selectedCategory);
    }

    if (subPool.length === 0) {
      // Fallback pool in case filters are restricted
      subPool = QUIZ_QUESTIONS.filter(q => q.difficulty === selectedDifficulty).slice(0, 5);
    }

    // Shuffle pool
    const shuffled = [...subPool].sort(() => Math.random() - 0.5).slice(0, 5); // 5 questions exam
    setActiveQuestionPool(shuffled);
    setCurrentIdx(0);
    setSelectedAnswerIdx(null);
    setHasSubmitted(false);
    setScore(0);
    setTimeLeft(25);
    setGameState('playing');
  };

  // Handle ticking timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer ended! Auto-lock and fail this question
          handleSelectAnswer(-1); // special flag for failed
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState, currentIdx]);

  // Select option
  const handleSelectAnswer = (optionIdx: number) => {
    if (hasSubmitted) return;
    
    // Freeze timer ticking
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setSelectedAnswerIdx(optionIdx);
    setHasSubmitted(true);

    const question = activeQuestionPool[currentIdx];
    if (optionIdx === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  // Skip or Next Question
  const advanceToNextQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < activeQuestionPool.length) {
      setCurrentIdx(nextIdx);
      setSelectedAnswerIdx(null);
      setHasSubmitted(false);
      setTimeLeft(25);
    } else {
      // Quiz Game Session complete! Deduce final scoreboard stats
      setGameState('results');

      const finalCorrect = score;
      const finalTotal = activeQuestionPool.length;

      setHistoricCorrect((prev) => prev + finalCorrect);
      setHistoricTotal((prev) => prev + finalTotal);

      // Check for unlock triggers
      const newUnlocks = [...unlockedAchievements];
      
      // Solar Explorer: Complete any quiz
      if (!newUnlocks.includes('ach-1')) {
        newUnlocks.push('ach-1');
      }

      // Planet Master: 100% score
      if (finalCorrect === finalTotal && !newUnlocks.includes('ach-2')) {
        newUnlocks.push('ach-2');
      }

      // Cosmic Scholar: Hard difficulty conqueror
      if (selectedDifficulty === 'hard' && !newUnlocks.includes('ach-3')) {
        newUnlocks.push('ach-3');
      }

      setUnlockedAchievements(newUnlocks);
    }
  };

  const getDifficultyColor = (diff: QuizQuestion['difficulty']) => {
    switch (diff) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div id="quiz-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white select-none">
      
      {/* LOBBY INSTRUCTION ENGINE */}
      {gameState === 'lobby' && (
        <React.Fragment>
          {/* LEFT SIDE SETUP CHANNELS */}
          <div className="lg:col-span-8 bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Compass className="text-[#00E5FF]" size={20} />
                Astronomy Flight Exam Setup
              </h3>
              <p className="text-xs text-gray-400 font-mono">Commission cadet clearance checklists & coordinate evaluation parameters</p>
            </div>

            {/* SELECTION FOR CATEGORY */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 tracking-widest uppercase pl-1 block">DIAGNOSTIC TARGET CATEGORY</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'all', label: 'Composite Mix', desc: 'Universal systems integration' },
                  { id: 'basics', label: 'Solar Basics', desc: 'Core Solar System models' },
                  { id: 'structures', label: 'Geological Shells', desc: 'Inner layers & cores' },
                  { id: 'facts', label: 'Anomalies & Facts', desc: 'Rotational data & spots' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCategory(item.id as any)}
                    className={`text-left p-4 rounded-xl border flex flex-col justify-between h-[100px] transition-all cursor-pointer ${
                      selectedCategory === item.id 
                        ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50 shadow-lg shadow-cyan-950/20' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                    id={`quiz-cat-selector-${item.id}`}
                  >
                    <span className="text-xs font-bold text-gray-100">{item.label}</span>
                    <span className="text-[10px] text-gray-400 leading-tight font-mono">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SELECT DIFFICULTY */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 tracking-widest uppercase pl-1 block">RATING CLEARANCE LEVEL</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'easy', label: 'Cadet Flight', spec: 'Standard orbital metrics (Easy)' },
                  { id: 'medium', label: 'Explorer Probe', spec: 'Tectonic convection grids (Medium)' },
                  { id: 'hard', label: 'Specialist Vector', spec: 'Boundary Roche Limits (Hard)' },
                ].map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id as any)}
                    className={`text-left p-4 rounded-xl border flex flex-col justify-between h-[90px] transition-all cursor-pointer ${
                      selectedDifficulty === diff.id 
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-950/20' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                    id={`quiz-diff-selector-${diff.id}`}
                  >
                    <span className="text-xs font-bold text-gray-100">{diff.label}</span>
                    <span className="text-[10px] text-gray-400 font-mono leading-none">{diff.spec}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CALL TO START EXAM ACTION */}
            <button
              onClick={startQuizExam}
              className="w-full text-center py-4 bg-[#00E5FF] hover:bg-[#00E5FF]/90 font-mono text-[#050816] font-extrabold text-sm tracking-[0.2em] uppercase rounded-xl transition-all shadow-lg hover:shadow-cyan-400/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              id="quiz-start-exam-btn"
            >
              LAUNCH SYSTEM EVALUATION EXAM
            </button>
          </div>

          {/* RIGHT SIDE CADET STATS & ACHIEVEMENTS PANEL */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CURRENT FLIGHT CLEARANCE PROFILE */}
            <div className="bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Award className="text-[#00E5FF]" size={18} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">ASTRONAUT PROFILE CARD</span>
              </div>

              <div className="text-center py-3">
                <span className="text-[10px] font-mono text-gray-400 tracking-wider">CURRENT CLEARANCE RANK</span>
                <h4 className="text-2xl font-bold font-sans tracking-wide text-[#00E5FF]">
                  {getSpaceRank(historicCorrect, historicTotal)}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                <div>
                  <span className="text-gray-400 block font-mono text-[9px] mb-0.5">EXAMS COMPLETED</span>
                  <span className="text-sm font-bold text-gray-200">
                    {historicTotal > 0 ? (historicTotal / 5).toFixed(0) : 0} Exams
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-mono text-[9px] mb-0.5">CUMULATIVE STRIKES</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {historicTotal > 0 ? ((historicCorrect / historicTotal) * 100).toFixed(0) : 0}% Acc
                  </span>
                </div>
              </div>
            </div>

            {/* UNLOCKED TROPHY SHELF */}
            <div className="bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-5 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Trophy className="text-[#00E5FF]" size={18} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">CLEARANCE BADGES SHELF</span>
              </div>

              <div className="space-y-3">
                {achievementsList.map((ach) => (
                  <div 
                    key={ach.id} 
                    className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                      ach.unlocked
                        ? 'bg-amber-500/5 border-amber-500/25 text-white'
                        : 'bg-white/5 border-transparent opacity-45'
                    }`}
                    id={`quiz-badge-${ach.id}`}
                  >
                    <div className={`p-2 rounded-lg ${ach.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-gray-800 text-gray-500'}`}>
                      <Trophy size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-wide flex items-center gap-2">
                        {ach.title}
                        {ach.unlocked && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded uppercase font-mono">SECURED</span>}
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans mt-0.5 leading-tight">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </React.Fragment>
      )}

      {/* QUIZ GAMEPLAY CORE BOARD */}
      {gameState === 'playing' && activeQuestionPool[currentIdx] && (
        <div className="lg:col-span-12 bg-[#0A1128]/85 border border-[#00E5FF]/15 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative max-w-4xl mx-auto w-full">
          {/* Top telemetry state bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase block">
                DIAGNOSTIC EXAM SESSION
              </span>
              <span className="text-xs text-gray-400 font-mono">
                TELEMETRY STAGE {currentIdx + 1} OF {activeQuestionPool.length}
              </span>
            </div>

            {/* Glowing clock timer */}
            <div className="flex items-center gap-2 bg-zinc-950/50 border border-white/10 px-3.5 py-1.5 rounded-xl text-yellow-400 font-mono text-sm tracking-wide">
              <Timer size={15} className={`animate-pulse ${timeLeft < 10 ? 'text-rose-400' : 'text-yellow-400'}`} />
              00:{timeLeft.toString().padStart(2, '0')} SEC
            </div>
          </div>

          {/* Difficulty and Question label */}
          <div className="space-y-4">
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${getDifficultyColor(activeQuestionPool[currentIdx].difficulty)}`}>
              Clearance Level: {activeQuestionPool[currentIdx].difficulty}
            </span>
            <h3 className="text-2xl font-bold font-sans tracking-wide leading-snug mt-2 text-white">
              {activeQuestionPool[currentIdx].question}
            </h3>
          </div>

          {/* Multiple choice button rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {activeQuestionPool[currentIdx].options.map((opt, oIdx) => {
              const isSelected = selectedAnswerIdx === oIdx;
              const isCorrectTarget = oIdx === activeQuestionPool[currentIdx].correctIndex;
              const hasChosenIncorrect = hasSubmitted && isSelected && !isCorrectTarget;

              let btnStyle = 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-gray-200';
              if (hasSubmitted) {
                if (isCorrectTarget) {
                  btnStyle = 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 font-semibold';
                } else if (hasChosenIncorrect) {
                  btnStyle = 'bg-rose-500/15 border-rose-500/60 text-rose-300';
                } else {
                  btnStyle = 'bg-white/5 border-transparent opacity-40';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectAnswer(oIdx)}
                  disabled={hasSubmitted}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle} ${hasSubmitted ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'}`}
                  id={`quiz-option-${oIdx}`}
                >
                  <span className="flex items-center gap-3 pr-2">
                    <span className="text-[11px] font-mono bg-white/10 text-gray-400 w-5 h-5 rounded flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    {opt}
                  </span>
                  
                  {/* Option icons */}
                  {hasSubmitted && isCorrectTarget && <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />}
                  {hasSubmitted && hasChosenIncorrect && <AlertTriangle size={15} className="text-rose-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* TIMER EXPIRED OR EXPLANATION INJECTION SUMMARY CARD */}
          {hasSubmitted && (
            <div className="bg-zinc-950/45 border border-white/10 rounded-xl p-5 mt-6 space-y-2 animate-fade-in text-gray-300">
              <span className="text-[10px] font-mono text-[#00E5FF] tracking-widest uppercase block">
                SCIENTIFIC EXPLANATION MATRIX
              </span>
              <p className="text-xs text-gray-200 leading-relaxed font-mono">
                {activeQuestionPool[currentIdx].explanation}
              </p>

              {/* ACTION BTN */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={advanceToNextQuestion}
                  className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#050816] px-4 py-2 rounded-lg font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all text-right"
                  id="quiz-next-btn"
                >
                  {currentIdx + 1 < activeQuestionPool.length ? 'CONTINUE DIAGNOSIS' : 'HARVEST FINAL SCORE'}
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RECONNISANCE DEBRIEF REPORT RESULTS ENGINE */}
      {gameState === 'results' && (
        <div className="lg:col-span-12 bg-[#0A1128]/85 border border-[#00E5FF]/15 rounded-2xl p-8 backdrop-blur-xl max-w-2xl mx-auto w-full text-center space-y-6 relative overflow-hidden">
          
          <div className="absolute top-4 left-4 bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase">
            VECTOR COMPLETED
          </div>

          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-[#00E5FF] block">SYSTEM DIAGNOSIS REPORT</span>
            <h3 className="text-4xl font-bold font-sans tracking-tight mt-1 text-white">Verification Complete</h3>
          </div>

          {/* SCORE READOUT */}
          <div className="bg-zinc-950/40 border border-white/10 rounded-2xl p-6 inline-block w-full max-w-sm">
            <span className="text-[10px] font-mono text-gray-400 block tracking-wider mb-2">TELEMETRY ACCURACY HIGHLIGHTS</span>
            <div className="text-5xl font-extrabold text-amber-400 tracking-wide">
              {score} / {activeQuestionPool.length}
            </div>
            <div className="text-xs text-gray-300 mt-2 font-mono">
               Accuracy Secured: <span className="text-emerald-400 font-bold">{((score / activeQuestionPool.length) * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* EXPLANATORY RANKS COMPONENT INSIGHTS */}
          <div className="text-sm font-sans space-y-1.5 px-4 text-gray-300">
            <p>
              Your diagnostic rating on those telemetry checks has qualified you for:
            </p>
            <div className="text-xl font-bold font-sans tracking-wide text-[#00E5FF]">
              {score === 5 ? 'Space Commander' : score >= 4 ? 'Planet Specialist' : score >= 2 ? 'Explorer' : 'Cadet'}
            </div>
          </div>

          {/* CLOSE AND RESET BUTTONS */}
          <div className="flex gap-4 pt-4 justify-center">
            <button
              onClick={() => {
                setGameState('lobby');
              }}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 px-6 py-3 rounded-lg text-xs font-mono tracking-wider cursor-pointer transition-all active:scale-95 text-white"
              id="quiz-lobby-reset-btn"
            >
              <RotateCcw size={14} />
              RETURN COMMAND SCREEN
            </button>
            <button
              onClick={startQuizExam}
              className="flex items-center gap-2 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#050816] font-bold px-6 py-3 rounded-lg text-xs font-mono tracking-wider cursor-pointer shadow-lg shadow-cyan-500/15 transition-all active:scale-95"
              id="quiz-play-again-btn"
            >
              LAUNCH FRESH TRIAL
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
