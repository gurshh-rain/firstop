import Reveal from "./Reveal";
import styles from "./Features.module.css";



const CATEGORIES = ["Technology","Design","Finance","Healthcare","Marketing","Engineering","Research","Media"];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.orb} aria-hidden />
      <div className={styles.inner}>

        <Reveal delay={0}><p className={styles.eyebrow}>Everything you need</p></Reveal>
        <Reveal delay={80}><h2 className={styles.heading}>Built differently.</h2></Reveal>
        <Reveal delay={160}><p className={styles.sub}>Most job platforms aren't built for students. FirstOp is.</p></Reveal>


        <Reveal delay={0}>
          <div className={styles.catSection}>
            <p className={styles.catLabel}>Fields we offfer & more.</p>
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