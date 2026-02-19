"use client";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

const MARQUEE = [
  "Software Engineering", "Product Design", "Finance", "Marketing",
  "Research", "Healthcare", "Data Science", "Journalism",
  "Architecture", "Public Policy", "Biotechnology", "Film & Media",
];

function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 28;          // tighter grid spacing
    const RADIUS = 140;       // influence radius
    const BASE_ALPHA = 0.03;  // resting line opacity (more faint)
    const PEAK_ALPHA = 0.28;  // lit-up line opacity
    const DOT_RADIUS = 1.1;   // smaller intersection dots

    let W = 0, H = 0, cols = 0, rows = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      cols = Math.ceil(W / CELL) + 1;
      rows = Math.ceil(H / CELL) + 1;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    // Offset so grid is centered
    const offsetX = () => (W % CELL) / 2;
    const offsetY = () => (H % CELL) / 2;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const ox = offsetX();
      const oy = offsetY();

      // ── Draw vertical lines ──────────────────────
      for (let c = 0; c < cols; c++) {
        const x = ox + c * CELL;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);

        // Distance from mouse to this vertical line
        const dx = mx - x;
        // Closest point on the line to mouse
        const closestY = Math.max(0, Math.min(H, my));
        const dy = my - closestY;
        const dist = Math.sqrt(dx * dx);  // horizontal distance only for lines
        const distFull = Math.sqrt(dx * dx + Math.pow(my < 0 || my > H ? dy : 0, 2));
        const t = Math.max(0, 1 - distFull / RADIUS);
        const alpha = BASE_ALPHA + (PEAK_ALPHA - BASE_ALPHA) * t * t;

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = t > 0.01 ? 0.6 + t * 0.6 : 0.5;
        ctx.stroke();
      }

      // ── Draw horizontal lines ────────────────────
      for (let r = 0; r < rows; r++) {
        const y = oy + r * CELL;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);

        const dy = my - y;
        const dist = Math.abs(dy);
        const t = Math.max(0, 1 - dist / RADIUS);
        const alpha = BASE_ALPHA + (PEAK_ALPHA - BASE_ALPHA) * t * t;

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = t > 0.01 ? 0.6 + t * 0.6 : 0.5;
        ctx.stroke();
      }

      // ── Draw intersection dots ───────────────────
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = ox + c * CELL;
          const y = oy + r * CELL;
          const dx = mx - x;
          const dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = Math.max(0, 1 - dist / RADIUS);

          if (t < 0.01) continue; // skip dots far from cursor

          const alpha = 0.08 + 0.55 * t * t;
          const radius = DOT_RADIUS * (0.6 + t * 0.8);

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.gridCanvas} />;
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.orb1} aria-hidden />
      <div className={styles.orb2} aria-hidden />
      <div className={styles.orb3} aria-hidden />

      {/* Interactive canvas grid — replaces the CSS dot grid */}
      <InteractiveGrid />

      <div className={styles.content}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Internships for students
          </span>
        </div>

        <h1 className={styles.headline}>
          <span className={styles.line1}>Your first</span>
          <span className={styles.line2}>opportunity</span>
          <span className={styles.line3}>starts here.</span>
        </h1>

        <p className={styles.sub}>
          FirstOp connects high school students with real internships
          and co-ops — no degree needed, no experience required.
        </p>

        <div className={styles.ctas}>
          <a href="#waitlist" className={styles.ctaPrimary}>Join the Waitlist</a>
          <a href="/#waitlist" className={styles.ctaSecondary}>
            Browse Internships
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.stat}>
            <span className={styles.statNum}>25+</span>
            <span className={styles.statLabel}>Partner Companies</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>100+</span>
            <span className={styles.statLabel}>Students Waitlisted</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>Free</span>
            <span className={styles.statLabel}>Always</span>
          </div>
        </div>
      </div>

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