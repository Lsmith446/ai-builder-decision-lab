"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d % 3) + 1), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center space-y-2"
    >
      <p className="font-display text-[1.4rem] text-primary font-semibold tracking-tight">
        Building your framework
        <span className="tracking-[2px]">{".".repeat(dots)}</span>
      </p>
      <p className="font-body text-sm text-muted-light leading-relaxed">
        The orb is settling into its risk verdict.
      </p>
    </motion.div>
  );
}
