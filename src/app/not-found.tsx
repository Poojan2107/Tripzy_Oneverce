"use client";
import { motion } from 'framer-motion';
import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <motion.div className="w-full min-h-[100dvh] bg-background text-night font-sans flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 20 }}>
      <motion.div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6 border border-gold/20"
        initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}>
        <Compass className="w-10 h-10 text-gold" />
      </motion.div>
      <motion.h1 className="font-display text-5xl md:text-6xl text-night font-light lowercase leading-none mb-3"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}>
        lost your <em className="italic text-gold not-italic">bearing</em>?
      </motion.h1>
      <motion.p className="text-xs text-muted/70 font-light mb-8 text-center max-w-xs leading-relaxed"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }}>
        This chapter doesn&rsquo;t exist in the atlas. It may have been moved or the link may be incorrect.
      </motion.p>
      <motion.div className="flex gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}>
        <Link href="/" className="px-6 py-3 rounded-full bg-gold text-night text-[10px] font-bold uppercase tracking-wider hover:bg-gold/80 transition-all inline-flex items-center gap-2 shadow-sm border-none cursor-pointer">
          <Compass className="w-3.5 h-3.5" />
          Back to Atlas
        </Link>
      </motion.div>
    </motion.div>
  );
}
