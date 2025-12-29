"use client";
import { useEffect, useState } from 'react';

export default function Timer({ durationSeconds, onTimeUp, isActive }) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);

    useEffect(() => {
        if (!isActive) return;

        // Reset timer if duration changes
        if (timeLeft === 0 && durationSeconds > 0) {
            setTimeLeft(durationSeconds);
        }
    }, [durationSeconds, isActive]);

    useEffect(() => {
        if (!isActive) return;

        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, isActive, onTimeUp]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress for visual bar (green -> yellow -> red)
    const progress = (timeLeft / durationSeconds) * 100;
    let color = '#2ecc71'; // green
    if (progress < 50) color = '#f1c40f'; // yellow
    if (progress < 20) color = '#e74c3c'; // red

    return (
        <div style={{ width: '100%', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>Time Remaining</span>
                <span style={{ color: color }}>{formatTime(timeLeft)}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: color,
                    transition: 'width 1s linear, background 0.5s ease'
                }} />
            </div>
        </div>
    );
}
