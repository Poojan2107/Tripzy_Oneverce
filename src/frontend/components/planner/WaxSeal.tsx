"use client";
import { motion } from 'framer-motion';

export default function WaxSeal({ text = "TRIPZY APPROVED", subtext = "ATLAS VIVANT" }) {
  return (
    <motion.div
      className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 select-none pointer-events-none z-30 drop-shadow-md"
      initial={{ opacity: 0, scale: 3.5, rotate: 45 }}
      animate={{ opacity: 1, scale: 1, rotate: -6 }}
      transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.8 }}
      style={{ transformOrigin: 'center' }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-[#E6355A] border border-[#a01f37] opacity-95 shadow-inner flex items-center justify-center"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[84%] h-[84%] rounded-full border-2 border-dashed border-white/25 flex flex-col items-center justify-center bg-[#a01f37]/10 text-white text-center font-display relative">
          <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-white/10 scale-95" />
          <span className="text-[5px] font-mono font-bold uppercase tracking-widest leading-none block mb-0.5 text-white/90">tripzy ai</span>
          <span className="text-[7.5px] font-bold uppercase tracking-wide leading-none block text-white/95">{text}</span>
          <span className="text-[5px] font-mono uppercase tracking-[0.2em] leading-none block mt-1 text-white/60">{subtext}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
