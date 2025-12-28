"use client";
import { useState, useEffect, useCallback } from 'react';
import CountrySelector from '@/components/CountrySelector';
import TeamSetup from '@/components/TeamSetup';
import ScoreBoard from '@/components/ScoreBoard';
import QuestionCard from '@/components/QuestionCard';

export default function Home() {
  const [phase, setPhase] = useState('COUNTRY_SELECT'); // COUNTRY_SELECT, TEAM_SETUP, PLAYING, GAME_OVER
  const [country, setCountry] = useState(null);
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState({});
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sound effects (Simulated with simple visual cues for now)

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setPhase('TEAM_SETUP');
  };

  const handleTeamsConfirmed = (teamNames) => {
    setTeams(teamNames);
    const initialScores = {};
    teamNames.forEach(name => initialScores[name] = 0);
    setScores(initialScores);
    setPhase('PLAYING');
    fetchQuestion();
  };

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Attempt to get questions. Note: OpenTDB doesn't strictly filter by country.
      // We prioritize Categories: 22 (Geography), 23 (History), 24 (Politics) for "relevance".
      const category = [22, 23, 24][Math.floor(Math.random() * 3)];
      const res = await fetch(`https://opentdb.com/api.php?amount=1&category=${category}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        setCurrentQuestion(data.results[0]);
      } else {
        setError("Could not fetch question. Trying again...");
        setTimeout(fetchQuestion, 1000);
      }
    } catch (e) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswer = (isCorrect) => {
    const currentTeam = teams[currentTeamIndex];

    setScores(prev => ({
      ...prev,
      [currentTeam]: prev[currentTeam] + (isCorrect ? 1 : -1)
    }));

    // Next turn
    const nextIndex = (currentTeamIndex + 1) % teams.length;
    setCurrentTeamIndex(nextIndex);
    fetchQuestion();
  };

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem' }}>

      {/* Background Elements */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, hsla(var(--color-accent-purple), 0.2) 0%, transparent 70%)' }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, hsla(var(--color-accent-blue), 0.15) 0%, transparent 70%)' }}></div>
      </div>

      {phase === 'PLAYING' && <ScoreBoard scores={scores} currentTeamIndex={currentTeamIndex} />}

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
          {loading ? (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div className="loader" style={{ fontSize: '1.2rem' }}>Fetching Intel...</div>
            </div>
          ) : error ? (
            <div style={{ color: '#ff6b6b' }}>{error} <button onClick={fetchQuestion} style={{ textDecoration: 'underline', color: 'inherit' }}>Retry</button></div>
          ) : (
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              teamName={teams[currentTeamIndex]}
            />
          )}
        </div>
      )}
    </main>
  );
}
