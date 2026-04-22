"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

//const LINKS = [
  //{ label: "Search",  idx: "01", href: "#waitlist" },
  //{ label: "About",   idx: "02", href: "#waitlist"  },
  //{ label: "Profile", idx: "03", href: "#waitlist" },
//];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [open,     setOpen]     = useState(false);
  const prevY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > 100 && y > prevY.current + 6)  setHidden(true);
      if (y < prevY.current - 4)             setHidden(false);
      prevY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className={[
        styles.nav,
        scrolled ? styles.scrolled : "",
        hidden   ? styles.hidden   : "",
      ].filter(Boolean).join(" ")}>

        {/* Left — logo */}
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.logoText}>FirstOpz</span>
        </Link>

        {/* Center — indexed links (desktop) */}
        
        {/*<ul className={styles.links}>
          {LINKS.map(l => (
            <li key={l.idx}>
              <Link href={l.href} className={styles.link}>
                <span className={styles.linkIdx}>{l.idx}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        } 
        

        {/* Right — waitlist + menu toggle */}
        <div className={styles.right}>
          <a href="#waitlist" className={styles.waitlistBtn}>
            <span className={styles.waitlistDot} />
            Waitlist Live Now
          </a>

          {/* Menu toggle — two horizontal lines become X */}
          
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}>
        <div className={styles.overlayInner}>
          <nav className={styles.overlayLinks}>
            {/*{LINKS.map((l, i) => (
              <Link
                key={l.idx}
                href={l.href}
                className={styles.overlayLink}
                style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
                onClick={() => setOpen(false)}
              >
                <span className={styles.overlayIdx}>{l.idx}</span>
                {l.label}
              </Link>
            ))}*/}
          </nav>

          <div className={styles.overlayFooter}>
            <a
              href="#waitlist"
              className={styles.overlayWaitlist}
              onClick={() => setOpen(false)}
            >
              Join the Waitlist →
            </a>
            
          </div>
        </div>
      </div>
    </>
  );
}