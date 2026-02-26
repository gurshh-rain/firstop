"use client";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

const MARQUEE = [
  "Software Engineering", "Product Design", "Finance", "Marketing",
  "Research", "Healthcare", "Data Science", "Journalism",
  "Architecture", "Public Policy", "Biotechnology", "Film & Media",
];

/* ── Interactive grid + fluid red trail ───────────── */
function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // ── Dot grid config ──────────────────────────────
    const CELL      = 34;    // dot spacing px
    const DOT       = 1.0;   // resting dot radius
    const DOT_DECAY = 0.945; // dot brightness decay per frame
    const DOT_REACH = 90;    // px radius cursor brightens dots

    // ── Fluid trail config ───────────────────────────
    const FLUID_LAG   = 1; // how fast red blob chases cursor (lower = more lag)
    const FLUID_FADE  = 0.08;  // how fast fluid erases per frame (higher = faster)
    const FLUID_R     = 110;   // radius of red blob
    const STILL_MS    = 60;    // ms of no movement = cursor is "still"

    // Offscreen canvas for fluid layer
    let fluidCanvas: HTMLCanvasElement | null = null;
    let fCtx: CanvasRenderingContext2D | null = null;

    let lagX = -9999, lagY = -9999;
    let mx   = -9999, my   = -9999;
    let isMoving = false;
    let stillTimer: ReturnType<typeof setTimeout>;

    let W = 0, H = 0, cols = 0, rows = 0;
    let heat: Float32Array;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = Math.round(W * devicePixelRatio);
      canvas.height = Math.round(H * devicePixelRatio);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      cols = Math.ceil(W / CELL) + 2;
      rows = Math.ceil(H / CELL) + 2;
      heat = new Float32Array(cols * rows);

      if (!fluidCanvas) {
        fluidCanvas = document.createElement("canvas");
      }
      fluidCanvas.width  = Math.round(W * devicePixelRatio);
      fluidCanvas.height = Math.round(H * devicePixelRatio);
      fCtx = fluidCanvas.getContext("2d")!;
      fCtx.scale(devicePixelRatio, devicePixelRatio);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      if (lagX === -9999) { lagX = mx; lagY = my; }

      isMoving = true;
      clearTimeout(stillTimer);
      stillTimer = setTimeout(() => { isMoving = false; }, STILL_MS);
    };

    const onLeave = () => {
      mx = -9999; my = -9999;
      isMoving = false;
      clearTimeout(stillTimer);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const ox = (W % CELL) / 2;
      const oy = (H % CELL) / 2;

      // ── 1. Lag cursor for fluid ──────────────────────
      if (mx !== -9999) {
        lagX += (mx - lagX) * FLUID_LAG;
        lagY += (my - lagY) * FLUID_LAG;
      }

      // ── 2. Update fluid offscreen canvas ────────────
      if (fCtx && fluidCanvas) {
        // Always fade — this erases existing trail
        fCtx.globalCompositeOperation = "source-over";
        fCtx.fillStyle = `rgba(5,5,5,${FLUID_FADE})`;
        fCtx.fillRect(0, 0, W, H);

        // Only paint new fluid when cursor is actively moving
        if (isMoving && mx !== -9999) {
          const grad = fCtx.createRadialGradient(lagX, lagY, 0, lagX, lagY, FLUID_R);
          grad.addColorStop(0,   "rgba(196,30,58,0.055)");
          grad.addColorStop(0.4, "rgba(196,30,58,0.022)");
          grad.addColorStop(1,   "rgba(196,30,58,0)");
          fCtx.fillStyle = grad;
          fCtx.fillRect(0, 0, W, H);
        }
      }

      // ── 3. Composite fluid behind dots ───────────────
      if (fluidCanvas) {
        ctx.drawImage(fluidCanvas, 0, 0, W, H);
      }

      // ── 4. Draw dot grid on top ──────────────────────
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x   = ox + c * CELL;
          const y   = oy + r * CELL;
          const idx = r * cols + c;

          const dx   = mx - x, dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const prox = dist < DOT_REACH
            ? (1 - dist / DOT_REACH) ** 2
            : 0;

          heat[idx] = Math.max(prox, heat[idx] * DOT_DECAY);
          const b = heat[idx];

          ctx.beginPath();
          ctx.arc(x, y, DOT + b * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(0.06 + b * 0.28).toFixed(3)})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(stillTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.gridCanvas} />;
}

/* ── Hero ─────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className={styles.hero}>
      <InteractiveGrid />

      {/* horizontal scan line that sweeps down once on load */}
      <div className={styles.scanLine} aria-hidden />

      {/* thin left vertical rule */}
      <div className={styles.vertRule} aria-hidden />

      <div className={styles.content}>

        {/* top meta bar */}
        <div className={styles.topBar}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Internships for students
          </span>
        </div>

        {/* asymmetric headline */}
        <h1 className={styles.headline}>
          <span className={styles.lineClip}>
            <span className={styles.line1}>Your first</span>
          </span>
          <span className={styles.lineClip}>
            <span className={styles.line2}>opportunity</span>
          </span>
          <span className={styles.lineClip}>
            <span className={styles.line3}>
              starts <em className={styles.redWord}>here.</em>
            </span>
          </span>
        </h1>

        {/* bottom: sub + ctas left, stats right */}
        <div className={styles.bottomRow}>
          <div className={styles.bottomLeft}>
            <p className={styles.sub}>
              FirstOpz connects students with structured startup opportunities, no experience required.
            </p>
            <div className={styles.ctas}>
              <a href="#waitlist" className={styles.ctaPrimary}>
                Join the Waitlist
              </a>
              <a href="/search" className={styles.ctaSecondary}>
                Browse Internships
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsShimmer} aria-hidden />
            <div className={styles.stat}>
              <span className={styles.statNum}>25+</span>
              <span className={styles.statLabel}>Partners</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>100+</span>
              <span className={styles.statLabel}>Waitlisted</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>Free</span>
              <span className={styles.statLabel}>Always</span>
            </div>
          </div>
        </div>
      </div>

      {/* marquee */}
      <div className={styles.marqueeWrap} aria-hidden>
        <div className={styles.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}