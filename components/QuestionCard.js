"use client";

export default function QuestionCard({ question, index, currentValue, isLocked, onUpdate, onLock }) {
    // Decode HTML entities
    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    if (!question) return <div>Loading...</div>;

    const category = decodeHTML(question.category);
    const text = decodeHTML(question.question);

    return (
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '-10px',
                left: '20px',
                background: 'hsl(var(--color-accent-purple))',
                padding: '0.2rem 0.8rem',
                borderRadius: '15px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                Q{index + 1}: {category}
            </div>

            <h3 style={{ fontSize: '1.2rem', marginTop: '1rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                {text}
            </h3>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => onUpdate(e.target.value)}
                    disabled={isLocked}
                    placeholder={isLocked ? "Answer Locked" : "Type answer here..."}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '8px',
                        border: isLocked ? '2px solid #2ecc71' : '1px solid var(--glass-border)',
                        background: isLocked ? 'rgba(46, 204, 113, 0.1)' : 'rgba(0,0,0,0.3)',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />

                <button
                    onClick={onLock}
                    disabled={isLocked || !currentValue.trim()}
                    style={{
                        padding: '0 1.5rem',
                        borderRadius: '8px',
                        background: isLocked
                            ? '#2ecc71'
                            : (currentValue.trim() ? 'hsl(var(--color-accent-pink))' : 'rgba(255,255,255,0.1)'),
                        color: 'white',
                        border: 'none',
                        cursor: (isLocked || !currentValue.trim()) ? 'default' : 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                >
                    {isLocked ? "LOCKED" : "LOCK"}
                </button>
            </div>
        </div>
    );
}
