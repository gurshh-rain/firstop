"use client";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

const MARQUEE = [
  "Software Engineering", "Product Design", "Finance", "Marketing",
  "Research", "Healthcare", "Data Science", "Journalism",
  "Architecture", "Public Policy", "Biotechnology", "Film & Media",
];

const CHARS = ["Y", ">", "X", "$", "O", "*", "0", "1", "#", "+"];

function PixelBlocks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const BLOCK = 33;

    let W = 0, H = 0, cols = 0, rows = 0;
    let mx = -9999, my = -9999;

    // Each active block: position, char, born time, die time, alpha
    type Block = {
      c: number; r: number;
      char: string;
      born: number;    // ms — when it appeared
      dieAt: number;   // ms — when it starts fading
      alpha: number;   // current 0..1
      dead: boolean;
    };

    const active: Block[] = [];
    // Track which grid cells are already occupied
    let occupied: Uint8Array;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = Math.round(W * devicePixelRatio);
      canvas.height = Math.round(H * devicePixelRatio);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      cols = Math.ceil(W / BLOCK) + 1;
      rows = Math.ceil(H / BLOCK) + 1;
      occupied = new Uint8Array(cols * rows);
      active.length = 0;
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;

      const now    = performance.now();
      const RADIUS = 110; // spawn radius px
      const reach  = Math.ceil(RADIUS / BLOCK);
      const cc     = Math.floor(mx / BLOCK);
      const cr     = Math.floor(my / BLOCK);

      for (let dr = -reach; dr <= reach; dr++) {
        for (let dc = -reach; dc <= reach; dc++) {
          const nc = cc + dc, nr = cr + dr;
          if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;

          const px = (nc + 0.5) * BLOCK;
          const py = (nr + 0.5) * BLOCK;
          const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
          // Probability drops off with distance — no hard circle edge
          const falloff = 1 - dist / RADIUS;
          if (falloff <= 0) continue;
          // Random threshold: cells near center almost always activate,
          // cells at the edge rarely do — creates jagged organic shape
          const chance = Math.pow(falloff, 1.4) * 0.7;
          if (occupied[nr * cols + nc] || Math.random() > chance) continue;

          occupied[nr * cols + nc] = 1;

          // Random delay before dying: 80–350ms after born
          const lifetime = 100 + Math.random() * 350;

          active.push({
            c: nc, r: nr,
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
            born:  now,
            dieAt: now + lifetime,
            alpha: 0,
            dead:  false,
          });
        }
      }
    };

    const onLeave = () => { mx = -9999; my = -9999; };

    const APPEAR_MS = 30;  // how fast block fades IN  (ms)
    const FADE_MS   = 80;  // how fast block fades OUT (ms)

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const now  = performance.now();
      const fontSize = Math.round(BLOCK * 0.44);
      ctx.font         = `bold ${fontSize}px monospace`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";

      for (let i = active.length - 1; i >= 0; i--) {
        const b = active[i];

        if (now < b.dieAt) {
          // Appearing / fully on — snap in quickly
          const age = now - b.born;
          b.alpha = Math.min(1, age / APPEAR_MS);
        } else {
          // Fading out
          const dying = now - b.dieAt;
          b.alpha = Math.max(0, 1 - dying / FADE_MS);
          if (b.alpha <= 0) {
            b.dead = true;
            occupied[b.r * cols + b.c] = 0;
            active.splice(i, 1);
            continue;
          }
        }

        const x = b.c * BLOCK;
        const y = b.r * BLOCK;
        const cx = x + BLOCK / 2;
        const cy = y + BLOCK / 2;
        const a = b.alpha;

        // Solid black square
        ctx.fillStyle = `rgba(6,6,6,${a.toFixed(3)})`;
        ctx.fillRect(x, y, BLOCK, BLOCK);

        // White character
        ctx.fillStyle = `rgba(255,255,255,${(a * 0.9).toFixed(3)})`;
        ctx.fillText(b.char, cx, cy + 1);
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
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.pixelCanvas} aria-hidden />;
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <PixelBlocks />
      <div className={styles.scanLine} aria-hidden />
      <div className={styles.vertRule} aria-hidden />

      <div className={styles.content}>
        <div className={styles.topBar}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Internships for students
          </span>
        </div>

        <h1 className={styles.headline}>
          <span className={styles.lineClip}><span className={styles.line1}>Your first</span></span>
          <span className={styles.lineClip}><span className={styles.line2}>opportunity</span></span>
          <span className={styles.lineClip}>
            <span className={styles.line3}>starts <em className={styles.redWord}>here.</em></span>
          </span>
        </h1>

        <div className={styles.bottomRow}>
          <div className={styles.bottomLeft}>
            <p className={styles.sub}>
              FirstOp connects students with real structured startup opportunities, no experience required.
            </p>
            <div className={styles.ctas}>
              <a href="#waitlist" className={styles.ctaPrimary}>Join the Waitlist</a>
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