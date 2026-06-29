"use client";
import { motion } from 'framer-motion';

export default function WaxSeal({ text = "TRAVEBIE SEAL", subtext = "ATLAS VIVANT" }) {
  return (
    <motion.div
      className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 select-none pointer-events-none z-30 drop-shadow-md"
      initial={{ opacity: 0, scale: 3.5, rotate: 45 }}
      animate={{ opacity: 1, scale: 1, rotate: -6 }}
      transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.8 }}
      style={{ transformOrigin: 'center' }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-coral border border-coral/60 opacity-95 shadow-inner flex items-center justify-center"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[84%] h-[84%] rounded-full border-2 border-dashed border-white/25 flex flex-col items-center justify-center bg-coral/15 text-white text-center font-display relative">
          <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-white/10 scale-95" />
          <span className="text-micro font-mono font-bold uppercase tracking-widest leading-none block mb-0.5 text-white/90">travebie ai</span>
          <span className="text-micro font-bold uppercase tracking-wide leading-none block text-white/95">{text}</span>
          <span className="text-micro font-mono uppercase tracking-[0.2em] leading-none block mt-1 text-white/60">{subtext}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
