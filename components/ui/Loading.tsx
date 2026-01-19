"use client";

import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <motion.div
        className="h-px w-16 bg-zinc-900"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

