import Link from "next/link";
import Reveal from "./Reveal";
import styles from "./Footer.module.css";

const LINKS = [
  { label: "Search",  href: "/#waitlist" },
  { label: "Internships",  href: "/#waitlist" },
  { label: "About",   href: "/#waitlist" },
  { label: "Profile", href: "/#waitlist" },
  { label: "Privacy", href: "/#waitlist" },
  { label: "Terms",   href: "/#waitlist" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Reveal delay={0}>
          <div className={styles.top}>
            <span className={styles.logo}>FirstOp</span>
            <nav className={styles.links}>
              {LINKS.map(l => (
                <Link key={l.href} href={l.href} className={styles.link}>{l.label}</Link>
              ))}
            </nav>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className={styles.bottom}>
            <span>Copyright © {new Date().getFullYear()} FirstOp. All rights reserved.</span>
            <span>Made for students.</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}