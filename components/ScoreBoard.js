export default function ScoreBoard({ scores, currentTeamIndex }) {
    return (
        <div
            className="glass-panel"
            style={{
                position: 'fixed',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.75rem 2rem',
                display: 'flex',
                gap: '2rem',
                zIndex: 100,
                borderRadius: '50px'
            }}
        >
            {Object.entries(scores).map(([team, score], index) => (
                <div
                    key={team}
                    style={{
                        textAlign: 'center',
                        opacity: index === currentTeamIndex ? 1 : 0.5,
                        transform: index === currentTeamIndex ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                    }}
                >
                    {index === currentTeamIndex && (
                        <div style={{
                            position: 'absolute',
                            top: '-5px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'hsl(var(--color-accent-pink))'
                        }}></div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: 'hsl(var(--color-text-secondary))', fontWeight: 600 }}>{team}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: index === currentTeamIndex ? 'hsl(var(--color-accent-blue))' : 'white' }}>{score}</div>
                </div>
            ))}
        </div>
    );
}
