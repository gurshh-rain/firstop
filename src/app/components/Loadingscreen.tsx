"use client";
import { useEffect, useState } from "react";
import styles from "./Loadingscreen.module.css";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase]    = useState<"loading" | "done" | "hidden">("loading");

  useEffect(() => {
    // Animate progress bar to 100 over ~1.8s
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = elapsed / duration;
      // Ease out — fast at start, slow near end
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3);
      setProgress(Math.round(eased * 100));

      if (raw < 1) {
        requestAnimationFrame(tick);
      } else {
        setProgress(100);
        // Brief pause at 100%, then fade out
        setTimeout(() => setPhase("done"), 300);
        setTimeout(() => setPhase("hidden"), 1000);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  if (phase === "hidden") return null;

  return (
    <div className={`${styles.overlay} ${phase === "done" ? styles.exit : ""}`}>
      {/* Background orbs — same as site */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <span className={styles.logo}>FirstOp</span>
          <span className={styles.logoDot} />
        </div>

        {/* Progress bar */}
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Counter */}
        <span className={styles.counter}>{progress}%</span>
      </div>
    </div>
  );
}