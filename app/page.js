"use client";
import { useState, useCallback } from 'react';
import CountrySelector from '@/components/CountrySelector';
import TeamSetup from '@/components/TeamSetup';
import ScoreBoard from '@/components/ScoreBoard';
import Worksheet from '@/components/Worksheet';
import Timer from '@/components/Timer';

export default function Home() {
  const [phase, setPhase] = useState('COUNTRY_SELECT'); // COUNTRY_SELECT, TEAM_SETUP, PLAYING, ROUND_SUMMARY
  const [country, setCountry] = useState(null);
  const [teams, setTeams] = useState([]);
  const [gameMode, setGameMode] = useState('TEAM'); // 'HEAD_TO_HEAD' | 'TEAM'
  const [scores, setScores] = useState({});
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  // Round State
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [roundResults, setRoundResults] = useState(null); // { results: [], scoreDelta: 0 }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Constants
  const QUESTIONS_PER_ROUND = 4;
  const ROUND_DURATION = 300; // 5 minutes in seconds
  const SCORE_CORRECT = 100;
  const SCORE_PENALTY = -100;

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setPhase('TEAM_SETUP');
  };

  const handleTeamsConfirmed = (teamNames, mode) => {
    setTeams(teamNames);
    setGameMode(mode);
    const initialScores = {};
    teamNames.forEach(name => initialScores[name] = 0);
    setScores(initialScores);
    startRound();
  };

  const startRound = () => {
    setPhase('PLAYING');
    fetchBatch();
  };

  const fetchBatch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTimerActive(false);

    try {
      // Fetch a batch of questions
      // We prioritize Categories: 22 (Geography), 23 (History), 24 (Politics)
      const category = [22, 23, 24][Math.floor(Math.random() * 3)];
      const res = await fetch(`https://opentdb.com/api.php?amount=${QUESTIONS_PER_ROUND}&category=${category}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        // Decode and structure
        setCurrentQuestions(data.results);
        setTimerActive(true);
      } else {
        setError("Could not fetch questions. Trying again...");
        setTimeout(fetchBatch, 1000);
      }
    } catch (e) {
      console.error(e);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  const normalizeText = (text) => {
    if (!text) return "";
    return text.toString().toLowerCase().trim().replace(/[^\w\s]/gi, ''); // Remove punctuation
  };

  const handleRoundSubmit = (answers) => {
    setTimerActive(false);
    let scoreDelta = 0;
    const results = currentQuestions.map((q, index) => {
      const userAnswer = answers[index];
      const normalizedUser = normalizeText(userAnswer);
      const normalizedCorrect = normalizeText(q.correct_answer);

      let status = 'skipped'; // default

      if (!userAnswer || userAnswer.trim() === "") {
        status = 'skipped';
      } else if (normalizedUser === normalizedCorrect) {
        status = 'correct';
        scoreDelta += SCORE_CORRECT;
      } else {
        // Check if fuzzy match is close enough? valid for now strict
        // Or check incorrect answers if multiple choice data is useful? No, text input.
        status = 'incorrect';
        scoreDelta += SCORE_PENALTY;
      }

      return {
        question: q,
        userAnswer,
        correctAnswer: q.correct_answer,
        status
      };
    });

    // Update Scores
    const currentTeam = teams[currentTeamIndex];
    setScores(prev => ({
      ...prev,
      [currentTeam]: prev[currentTeam] + scoreDelta
    }));

    setRoundResults({ results, scoreDelta });
    setPhase('ROUND_SUMMARY');
  };

  const handleNextTurn = () => {
    // Advance turn
    const nextIndex = (currentTeamIndex + 1) % teams.length;
    setCurrentTeamIndex(nextIndex);
    startRound();
  };

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>

      {/* Background Elements */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, hsla(var(--color-accent-purple), 0.2) 0%, transparent 70%)' }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, hsla(var(--color-accent-blue), 0.15) 0%, transparent 70%)' }}></div>
      </div>

      {(phase === 'PLAYING' || phase === 'ROUND_SUMMARY') && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
          <ScoreBoard scores={scores} currentTeamIndex={currentTeamIndex} />
        </div>
      )}

      {phase === 'COUNTRY_SELECT' && (
        <>
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>Welcome to The Arena</h1>
          <CountrySelector onSelect={handleCountrySelect} />
        </>
      )}

      {phase === 'TEAM_SETUP' && (
        <>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <span style={{ color: 'hsl(var(--color-text-secondary))' }}>Selected Region:</span>
            <br />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{country.name}</span>
          </div>
          <TeamSetup onTeamsConfirmed={handleTeamsConfirmed} />
        </>
      )}

      {phase === 'PLAYING' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <div style={{ width: '100%', maxWidth: '800px' }}>
            <Timer
              durationSeconds={ROUND_DURATION}
              isActive={timerActive}
              onTimeUp={() => {
                // Trigger submission with whatever is in the worksheet? 
                // ideally Worksheet would auto-submit. 
                // For MVP, we force a "Timeout" state or simulate a submit button click logic?
                // We'll pass a ref or simply let the user fail if they don't submit. 
                // Better: The Timer is visual. But we need to enforce it.
                // We'll reload the page? No.
                // Let's make Timer just call handleRoundSubmit with empty answers or alert.
                // Actually, a clean way is to force update.
                // Limitation: Worksheet holds the local state.
                // Force submit is tricky without Refs/Context.
                // Simplification: When time is up, we count it as 0 points or penalty for everything not submitted.
                // Or we just alert "TIME'S UP" and move to summary with 0s.
                // Let's assume onTimeUp treats everything as skipped.
                handleRoundSubmit(new Array(QUESTIONS_PER_ROUND).fill(""));
              }}
            />
          </div>

          {loading ? (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div className="loader" style={{ fontSize: '1.2rem' }}>Fetching Logic...</div>
            </div>
          ) : error ? (
            <div style={{ color: '#ff6b6b' }}>{error} <button onClick={fetchBatch} style={{ textDecoration: 'underline', color: 'inherit' }}>Retry</button></div>
          ) : (
            <Worksheet
              questions={currentQuestions}
              teamName={teams[currentTeamIndex]}
              onSubmitRound={handleRoundSubmit}
            />
          )}
        </div>
      )}

      {phase === 'ROUND_SUMMARY' && roundResults && (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
          <h2 className="gradient-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Round Summary: {teams[currentTeamIndex]}
          </h2>

          <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>
            Round Score: {roundResults.scoreDelta >= 0 ? '+' : ''}{roundResults.scoreDelta}
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {roundResults.results.map((r, i) => (
              <div key={i} style={{
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)',
                borderLeft: `4px solid ${r.status === 'correct' ? '#2ecc71' : r.status === 'incorrect' ? '#e74c3c' : '#95a5a6'}`
              }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Q{i + 1}: {decodeHTML(r.question.question)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ marginRight: '0.5rem', color: '#999' }}>You said:</span>
                    <span style={{ fontWeight: 'bold' }}>{r.userAnswer || "(Skipped)"}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ marginRight: '0.5rem', color: '#999' }}>Answer:</span>
                    <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>{decodeHTML(r.correctAnswer)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNextTurn}
            style={{
              width: '100%',
              marginTop: '2rem',
              padding: '1rem',
              background: 'hsl(var(--color-accent-blue))',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {gameMode === 'TEAM' ? `Next Team: ${teams[(currentTeamIndex + 1) % teams.length]}` : 'Next Round'}
          </button>
        </div>
      )}
    </main>
  );
}

// Helper to decode HTML in the summary view locally since standard string
function decodeHTML(html) {
  if (typeof document === 'undefined') return html;
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
