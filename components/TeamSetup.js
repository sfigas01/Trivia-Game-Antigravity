"use client";
import { useState } from 'react';

export default function TeamSetup({ onTeamsConfirmed }) {
    const [teams, setTeams] = useState(['Team 1', 'Team 2']);
    const [mode, setMode] = useState('TEAM'); // 'HEAD_TO_HEAD' or 'TEAM'

    const addTeam = () => {
        if (teams.length < 6) {
            setTeams([...teams, `Team ${teams.length + 1}`]);
        }
    };

    const removeTeam = (index) => {
        if (teams.length > 2) {
            setTeams(teams.filter((_, i) => i !== index));
        }
    };

    const updateName = (index, name) => {
        const newTeams = [...teams];
        newTeams[index] = name;
        setTeams(newTeams);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onTeamsConfirmed(teams.filter(t => t.trim() !== ''), mode);
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }} className="gradient-text">Game Setup</h2>

            {/* Mode Selection */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    type="button"
                    onClick={() => setMode('HEAD_TO_HEAD')}
                    style={{
                        padding: '1rem',
                        flex: 1,
                        background: mode === 'HEAD_TO_HEAD' ? 'hsl(var(--color-accent-purple))' : 'rgba(255,255,255,0.1)',
                        border: mode === 'HEAD_TO_HEAD' ? '2px solid white' : '1px solid transparent',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <strong>Head-to-Head</strong><br />
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Simultaneous Play (2 Players)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setMode('TEAM')}
                    style={{
                        padding: '1rem',
                        flex: 1,
                        background: mode === 'TEAM' ? 'hsl(var(--color-accent-blue))' : 'rgba(255,255,255,0.1)',
                        border: mode === 'TEAM' ? '2px solid white' : '1px solid transparent',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <strong>Team Mode</strong><br />
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Turn-Based (Groups)</span>
                </button>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Teams</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {teams.map((team, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={team}
                            onChange={(e) => updateName(index, e.target.value)}
                            placeholder={`Team ${index + 1} Name`}
                            style={{
                                flex: 1,
                                padding: '0.8rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        {teams.length > 2 && (
                            <button
                                type="button"
                                onClick={() => removeTeam(index)}
                                style={{
                                    padding: '0 1rem',
                                    background: 'rgba(255, 50, 50, 0.2)',
                                    color: '#ff6b6b',
                                    border: '1px solid rgba(255, 50, 50, 0.3)',
                                    borderRadius: '8px'
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {teams.length < 6 && (
                    <button
                        type="button"
                        onClick={addTeam}
                        style={{
                            padding: '0.8rem 1.5rem',
                            background: 'transparent',
                            border: '1px solid hsl(var(--color-text-secondary))',
                            color: 'hsl(var(--color-text-secondary))',
                            borderRadius: '8px',
                            fontWeight: 600
                        }}
                    >
                        + Add Team
                    </button>
                )}
                <button
                    type="submit"
                    style={{
                        padding: '0.8rem 2rem',
                        background: 'linear-gradient(45deg, hsl(var(--color-accent-blue)), hsl(var(--color-accent-purple)))',
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        boxShadow: '0 0 20px hsla(var(--color-accent-blue), 0.5)',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Start Game →
                </button>
            </div>
        </form>
    );
}
