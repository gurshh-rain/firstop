"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Loadingscreen.module.css";

type Phase = "init" | "split" | "hold" | "gather" | "shrink" | "wipe" | "swipe" | "gone";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("init");
  const overlayRef  = useRef<HTMLDivElement>(null);
  // We track the live pixel positions of the h-lines for the clip rect
  const [gapTop,    setGapTop]    = useState(0);
  const [gapBottom, setGapBottom] = useState(0);
  const [ready, setReady] = useState(false);
  const rootH = useRef(0);

useEffect(() => {
  rootH.current = window.innerHeight;
  const mid = window.innerHeight * 0.5;

  setGapTop(mid);
  setGapBottom(mid);

  // Wait one frame so positions are set before enabling transitions
  requestAnimationFrame(() => setReady(true));

  const t0 = setTimeout(() => {
    setPhase("split");
    setGapTop(mid - 28);
    setGapBottom(mid + 28);
  }, 120);

    const t1 = setTimeout(() => setPhase("hold"),   120 + 1400);
    const t2 = setTimeout(() => {
      setPhase("gather");
      setGapTop(   window.innerHeight * 0.5);
      setGapBottom(window.innerHeight * 0.5);
    }, 120 + 1600 + 200);

    const t3 = setTimeout(() => setPhase("shrink"), 120 + 1600 + 1000 + 300);

    const t4 = setTimeout(() => {
      setPhase("wipe");
      const el = overlayRef.current;
      if (!el) return;
      el.animate(
        [
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)" },
          { clipPath: "polygon(25% 75%, 75% 75%, 75% 75%, 25% 75%)" },
        ],
        { duration: 1400, easing: "cubic-bezier(0.9, 0, 0.1, 1)", fill: "forwards" }
      );
    }, 120 + 1600 + 1000 + 650);

    const t5 = setTimeout(() => {
      setPhase("swipe");
      const el = overlayRef.current;
      if (!el) return;
      el.animate(
        [{ transform: "translateY(0%)" }, { transform: "translateY(100%)" }],
        { duration: 900, easing: "cubic-bezier(0.9, 0, 0.1, 1)", fill: "forwards" }
      );
    }, 120 + 1600 + 1000 + 1400 + 1100 + 1300);

    const t6 = setTimeout(
      () => setPhase("gone"),
      120 + 1600 + 1000 + 1400 + 1100 + 1300 + 950
    );

    return () => [t0, t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  if (phase === "gone") return null;

  const isSplit  = phase === "split" || phase === "hold";
  const isGather = phase === "gather";
  const isShrink = phase === "shrink" || phase === "wipe" || phase === "swipe";

  // Vertical lines
  const vLeft  = isShrink ? "50%" : "20%";
  const vRight = isShrink ? "50%" : isSplit || isGather ? "80%" : "20%";

  // Horizontal lines — top/bottom track gapTop/gapBottom
  // In shrink phase scaleX collapses them
  const hScale = isShrink ? 0 : 1;
  const vScale = isShrink ? 0 : 1;

  // Text clip — only reveal between the two h-lines
  const clipTop    = gapTop;
  const clipBottom = gapBottom;
  const textVisible = isSplit || isGather;

  return (
    <div ref={overlayRef} className={styles.root}>

      {/* Left vertical */}
      <div
        className={styles.vLine}
        style={{
          left: vLeft,
          transform: `translateX(-50%) scaleY(${vScale})`,
        }}
      />

      {/* Right vertical */}
      <div
        className={styles.vLine}
        style={{
          left: vRight,
          transform: `translateX(-50%) scaleY(${vScale})`,
        }}
      />

      {/* Top horizontal */}
      <div
      className={styles.hLine}
      style={{
        top: `${gapTop}px`,
        transform: `translateY(-50%) scaleX(${hScale})`,
        transition: ready ? undefined : "none",
      }}
    />

    <div
      className={styles.hLine}
      style={{
        top: `${gapBottom}px`,
        transform: `translateY(-50%) scaleX(${hScale})`,
        transition: ready ? undefined : "none",
      }}
    />

      {/* Text — clipped to the gap between h-lines */}
      <div
        className={styles.textWrap}
        style={{
          clipPath: `inset(${clipTop}px 0px calc(100% - ${clipBottom}px) 0px)`,
          opacity: textVisible ? 1 : 0,
        }}
      >
        <p className={styles.headline}>
          Find your <em>first</em> opportunity
        </p>
      </div>

    </div>
  );
}