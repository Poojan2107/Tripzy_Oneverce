"use client";
import { motion } from 'framer-motion';
import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <motion.div className="w-full min-h-[100dvh] bg-background text-ink font-sans flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 20 }}>
      <motion.div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}>
        <Compass className="w-8 h-8 text-gold" />
      </motion.div>
      <motion.h1 className="text-4xl font-display font-bold text-night mb-2"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}>404</motion.h1>
      <motion.p className="text-sm text-muted mb-8 text-center max-w-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.3 }}>
        This page does not exist. It may have been moved or the link may be incorrect.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}>
        <Link href="/" className="px-5 py-2.5 bg-gold text-night font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gold-light transition-all inline-block">
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
