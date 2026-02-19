import Reveal from "./Reveal";
import styles from "./Features.module.css";

const FEATURES = [
  { title: "Curated for you",   desc: "Every listing is vetted for students. No misleading postings, with no degree and degree requirements." },
  { title: "Smart search",      desc: "Filter by industry, location, remote or in-person, duration, and pay." },
  { title: "Internships",        desc: "Single-summer internships to multi-semester internships, gain work experience in no time." },
  { title: "Your profile",      desc: "Showcase your skills and interests. Let the right opportunities come to you." },
];

const CATEGORIES = ["Technology","Design","Finance","Healthcare","Marketing","Engineering","Research","Media"];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.orb} aria-hidden />
      <div className={styles.inner}>

        <Reveal delay={0}><p className={styles.eyebrow}>Everything you need</p></Reveal>
        <Reveal delay={80}><h2 className={styles.heading}>Built differently.</h2></Reveal>
        <Reveal delay={160}><p className={styles.sub}>Most job platforms aren't built for students. FirstOp is.</p></Reveal>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90} style={{ display: "flex" }}>
              <div className={styles.card}>
                <div className={styles.cardShimmer} aria-hidden />
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0}>
          <div className={styles.catSection}>
            <p className={styles.catLabel}>Browse by field</p>
            <div className={styles.catGrid}>
              {CATEGORIES.map(c => (
                <a key={c} href="/#waitlist" className={styles.catPill}>{c}</a>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}