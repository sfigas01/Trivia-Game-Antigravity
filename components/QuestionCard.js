"use client";
import { useState, useEffect } from 'react';

export default function QuestionCard({ question, onAnswer, teamName }) {
    // question object: { category, type, difficulty, question, correct_answer, incorrect_answers }
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (question) {
            const answers = [...question.incorrect_answers, question.correct_answer];
            // Simple shuffle
            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }
            setShuffledAnswers(answers);
            setSelectedAnswer(null);
            setRevealed(false);
        }
    }, [question]);

    const handleChoice = (answer) => {
        if (revealed) return;
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        if (!selectedAnswer) return;
        setRevealed(true);
        const isCorrect = selectedAnswer === question.correct_answer;
        setTimeout(() => onAnswer(isCorrect), 2000);
    };

    // Decode HTML entities (quick fix utility)
    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    if (!question) return <div>Loading...</div>;

    return (
        <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '700px', position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'hsl(var(--color-accent-purple))',
                padding: '0.25rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                {decodeHTML(question.category)}
            </div>

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'hsl(var(--color-text-secondary))', marginBottom: '0.5rem' }}>
                    Question for <span style={{ color: 'white', fontWeight: 'bold' }}>{teamName}</span>
                </p>
                <h3 style={{ fontSize: '1.5rem', lineHeight: 1.4 }}>{decodeHTML(question.question)}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {shuffledAnswers.map((answer, index) => {
                    let style = {
                        padding: '1.5rem',
                        background: 'hsla(var(--color-bg-secondary), 0.5)',
                        border: '2px solid transparent',
                        borderRadius: '12px',
                        color: 'var(--color-text-primary)',
                        fontSize: '1rem',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                    };

                    if (revealed) {
                        if (answer === question.correct_answer) {
                            style.background = 'hsla(120, 100%, 30%, 0.5)';
                            style.border = '2px solid #2ecc71';
                        } else if (answer === selectedAnswer) {
                            style.background = 'hsla(0, 100%, 50%, 0.3)';
                            style.border = '2px solid #e74c3c';
                        } else {
                            style.opacity = 0.5;
                        }
                    } else if (selectedAnswer === answer) {
                        style.background = 'hsla(var(--color-accent-blue), 0.2)';
                        style.border = '2px solid hsl(var(--color-accent-blue))';
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleChoice(answer)}
                            style={style}
                            disabled={revealed}
                        >
                            {decodeHTML(answer)}
                        </button>
                    );
                })}
            </div>

            {!revealed && (
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer}
                        style={{
                            padding: '1rem 3rem',
                            background: selectedAnswer ? 'hsl(var(--color-accent-pink))' : 'hsl(var(--color-bg-secondary))',
                            color: selectedAnswer ? 'white' : 'hsl(var(--color-text-secondary))',
                            borderRadius: '50px',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            opacity: selectedAnswer ? 1 : 0.5,
                            cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                            boxShadow: selectedAnswer ? '0 0 20px hsla(var(--color-accent-pink), 0.5)' : 'none'
                        }}
                    >
                        Lock Answer
                    </button>
                </div>
            )}
        </div>
    );
}
