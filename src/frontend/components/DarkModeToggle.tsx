"use client";
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('travebie_theme');
    if (stored === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('travebie_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('travebie_theme', 'light');
    }
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-secondary-surface"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-muted/60" />}
    </button>
  );
}
