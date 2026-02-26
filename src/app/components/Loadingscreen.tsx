"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./Loadingscreen.module.css";

const SHARDS = [
  { letter: "F",  ex: -1, ey: -1 },
  { letter: "",   ex:  0, ey: -1 },
  { letter: "I",  ex:  1, ey: -1 },
  { letter: "R",  ex: -1, ey:  0 },
  { letter: "—",  ex:  0, ey:  0 },
  { letter: "S",  ex:  1, ey:  0 },
  { letter: "T",  ex: -1, ey:  1 },
  { letter: "OP", ex:  0, ey:  1 },
  { letter: "",   ex:  1, ey:  1 },
];

export default function LoadingScreen() {
  const [shown,   setShown]   = useState(false);  // shards scaled in
  const [exiting, setExiting] = useState(false);  // shards flying out
  const [gone,    setGone]    = useState(false);  // unmounted
  const [count,   setCount]   = useState(0);      // 0→100 counter
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Tiny defer so CSS is ready before we trigger the enter transition
    const t0 = setTimeout(() => setShown(true), 40);

    // Animate counter 0→100 over 1800ms
    const start = performance.now();
    const DURATION = 1800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(ease * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    // Exit after counter finishes + beat
    const t1 = setTimeout(() => setExiting(true), 1800 + 300);
    const t2 = setTimeout(() => setGone(true),    1800 + 300 + 800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={styles.root}>
      {/* 3×3 grid */}
      <div className={styles.grid}>
        {SHARDS.map((s, i) => (
          <div
            key={i}
            className={styles.shard}
            style={{
              "--delay":   `${i * 50}ms`,
              "--ex":      s.ex,
              "--ey":      s.ey,
              "--opacity": shown && !exiting ? 1 : 0,
              "--scale":   shown && !exiting ? 1 : exiting ? 0.88 : 0.9,
              "--tx":      exiting ? `${s.ex * 105}%` : "0%",
              "--ty":      exiting ? `${s.ey * 105}%` : "0%",
            } as React.CSSProperties}
          >
            {/* Per-shard noise */}
            <ShardNoise />

            {s.letter && (
              <span
                className={styles.letter}
                style={{
                  opacity:   shown && !exiting ? 1 : 0,
                  transform: shown && !exiting ? "translateY(0)" : "translateY(14px)",
                  transitionDelay: shown ? `${i * 50 + 100}ms` : "0ms",
                }}
              >
                {s.letter}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Counter — bottom right */}
      <div
        className={styles.counter}
        style={{ opacity: exiting ? 0 : 1, transform: exiting ? "translateY(6px)" : "none" }}
      >
        <span className={styles.counterNum}>{String(count).padStart(3, "0")}</span>
        <span className={styles.counterLabel}>/ 100</span>
      </div>

      {/* Brand — bottom left */}
      <div
        className={styles.brand}
        style={{ opacity: exiting ? 0 : shown ? 1 : 0, transitionDelay: shown ? "350ms" : "0ms" }}
      >
        <span className={styles.brandName}>FirstOp</span>
        <span className={styles.brandSub}>Find your first opportunity</span>
      </div>

      {/* Red progress line — bottom */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ transform: `scaleX(${count / 100})` }}
        />
      </div>
    </div>
  );
}

/* Sparse random pixel noise per shard */
function ShardNoise() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const draw = () => {
      const W = canvas.width  = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      // Scatter ~0.8% of pixels as dim white flecks
      const count = Math.floor(W * H * 0.008);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      for (let i = 0; i < count; i++) {
        ctx.fillRect(
          Math.floor(Math.random() * W),
          Math.floor(Math.random() * H),
          1, 1
        );
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className={styles.noise} />;
}