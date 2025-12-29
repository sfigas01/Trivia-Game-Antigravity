"use client";
import { useState } from 'react';
import QuestionCard from './QuestionCard';

export default function Worksheet({ questions, teamName, onSubmitRound }) {
    // Local state to track answers for each question
    // Format: { [questionIndex]: { answer: string, locked: boolean } }
    const [answers, setAnswers] = useState({});

    const handleAnswerUpdate = (index, answer) => {
        setAnswers(prev => ({
            ...prev,
            [index]: { ...prev[index], answer, locked: false }
        }));
    };

    const handleLock = (index) => {
        setAnswers(prev => ({
            ...prev,
            [index]: { ...prev[index], locked: true }
        }));
    };

    const handleSubmit = () => {
        // Strip out the locked flag and just send the answers
        const submission = questions.map((_, index) => {
            const entry = answers[index];
            return entry?.locked ? entry.answer : (entry?.answer || ""); // Default to empty string if not locked/entered
        });
        onSubmitRound(submission);
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h2 className="gradient-text">{teamName}&apos;s Worksheet</h2>
                <p style={{ color: 'hsl(var(--color-text-secondary))' }}>
                    Type your answers. Lock them in when sure. Leave blank to skip (0 pts). Wrong answers deduct points!
                </p>
            </div>

            {questions.map((q, index) => (
                <QuestionCard
                    key={index}
                    index={index}
                    question={q}
                    currentValue={answers[index]?.answer || ''}
                    isLocked={answers[index]?.locked || false}
                    onUpdate={(val) => handleAnswerUpdate(index, val)}
                    onLock={() => handleLock(index)}
                />
            ))}

            <button
                onClick={handleSubmit}
                style={{
                    padding: '1.5rem',
                    background: 'hsl(var(--color-accent-blue))',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    boxShadow: '0 0 20px hsla(var(--color-accent-blue), 0.4)'
                }}
            >
                Submit Batch
            </button>
        </div>
    );
}
