"use client";
import { useState } from 'react';

const COUNTRIES = [
    { code: 'US', name: 'United States', region: 'Americas' },
    { code: 'GB', name: 'United Kingdom', region: 'Europe' },
    { code: 'CA', name: 'Canada', region: 'Americas' },
    { code: 'AU', name: 'Australia', region: 'Oceania' },
    { code: 'DE', name: 'Germany', region: 'Europe' },
    { code: 'FR', name: 'France', region: 'Europe' },
    { code: 'JP', name: 'Japan', region: 'Asia' },
    { code: 'BR', name: 'Brazil', region: 'Americas' },
    { code: 'IN', name: 'India', region: 'Asia' },
    { code: 'CN', name: 'China', region: 'Asia' },
    { code: 'MX', name: 'Mexico', region: 'Americas' },
    { code: 'ZA', name: 'South Africa', region: 'Africa' },
    { code: 'GLOBAL', name: 'Global / Other', region: 'World' }
];

export default function CountrySelector({ onSelect }) {
    const [selected, setSelected] = useState(null);

    const handleSelect = (country) => {
        setSelected(country);
        // Add a small delay for visual feedback before confirming
        setTimeout(() => onSelect(country), 300);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }} className="gradient-text">Select Your Region</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {COUNTRIES.map((country) => (
                    <button
                        key={country.code}
                        onClick={() => handleSelect(country)}
                        style={{
                            padding: '1rem',
                            background: selected?.code === country.code ? 'hsla(var(--color-accent-blue), 0.3)' : 'hsla(220, 20%, 20%, 0.4)',
                            border: selected?.code === country.code ? '1px solid hsl(var(--color-accent-blue))' : '1px solid transparent',
                            borderRadius: '8px',
                            color: 'var(--color-text-primary)',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <span>{country.name}</span>
                        {selected?.code === country.code && <span style={{ color: 'hsl(var(--color-accent-blue))' }}>✓</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}
