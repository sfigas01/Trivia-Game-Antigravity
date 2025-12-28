"use client";
import { useState } from 'react';

export default function TeamSetup({ onTeamsConfirmed }) {
    const [teams, setTeams] = useState(['Team 1', 'Team 2']);

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
        onTeamsConfirmed(teams.filter(t => t.trim() !== ''));
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }} className="gradient-text">Assemble Your Teams</h2>

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
                        background: 'hsl(var(--color-accent-blue))',
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: 800,
                        boxShadow: '0 0 15px hsla(var(--color-accent-blue), 0.5)'
                    }}
                >
                    Start Game →
                </button>
            </div>
        </form>
    );
}
