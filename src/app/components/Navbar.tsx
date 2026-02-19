"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const LINKS = [
  { label: "Search",  href: "#waitlist" },
  { label: "Co-ops",  href: "#waitlist" },
  
  { label: "About",   href: "#waitlist" },
  { label: "Profile", href: "#waitlist" },
];

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [open,    setOpen]    = useState(false);
  const [hidden,  setHidden]  = useState(false);
  const prevY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 120 && y > prevY.current + 8)  setHidden(true);
      if (y < prevY.current - 4)             setHidden(false);
      setScrollY(y);
      prevY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrolled = scrollY > 40;

  return (
    <nav
      className={[
        styles.nav,
        scrolled ? styles.scrolled : "",
        hidden   ? styles.hidden   : "",
      ].filter(Boolean).join(" ")}
    >
      <div className={styles.pill}>
        <Link href="/" className={styles.logo}>FirstOp</Link>

        <ul className={styles.links}>
          {LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={styles.link}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link href="/#waitlist" className={styles.loginBtn}>Sign in</Link>
          <a href="#waitlist" className={styles.ctaBtn}>Join Waitlist</a>
        </div>

        <button className={styles.hamburger} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span className={`${styles.bar} ${open ? styles.bar1Open : ""}`} />
          <span className={`${styles.bar} ${open ? styles.bar2Open : ""}`} />
          <span className={`${styles.bar} ${open ? styles.bar3Open : ""}`} />
        </button>
      </div>

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        {LINKS.map(l => (
          <Link key={l.href} href={l.href} className={styles.drawerLink} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <a href="#waitlist" className={styles.drawerCta} onClick={() => setOpen(false)}>Join Waitlist</a>
      </div>
    </nav>
  );
}