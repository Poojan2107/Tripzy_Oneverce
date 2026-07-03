"use client";
import { Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may fail in insecure contexts
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-micro font-bold uppercase tracking-wider text-muted/40 hover:text-gold/60 border border-border/20 hover:border-gold/20 bg-background/60 hover:bg-gold/5 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer"
      title={label ?? 'Copy to clipboard'}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : (label ?? 'Copy')}
    </button>
  );
}
