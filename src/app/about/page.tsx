import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>

        {/* ── HERO ─────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroGrid} aria-hidden />
          <div className={styles.heroInner}>
            <div className={styles.heroLabel}>About FirstOp</div>
            <h1 className={styles.heroHeadline}>
              <span className={styles.heroLine1}>We believe every</span>
              <span className={styles.heroLine2}>student deserves</span>
              <span className={styles.heroLine3}>a real shot.</span>
            </h1>
            <p className={styles.heroSub}>
              FirstOp was built out of frustration. Two students who couldn't
              find internships that were meant for them — so they built the
              platform they wished existed.
            </p>
          </div>

          {/* Large background word */}
          <div className={styles.watermark} aria-hidden>FIRSTOP</div>
        </section>

        {/* ── MISSION ──────────────────────────────────── */}
        <section className={styles.mission}>
          <div className={styles.container}>
            <div className={styles.missionGrid}>
              <div className={styles.missionLeft}>
                <span className={styles.sectionTag}>Our Mission</span>
                <h2 className={styles.missionHeadline}>
                  Closing the gap between ambition and opportunity.
                </h2>
              </div>
              <div className={styles.missionRight}>
                <p className={styles.missionPara}>
                  The internship market is broken for students. Most platforms
                  are built for college or high school students, list roles that require years of
                  experience, or simply don't vet their listings. Students waste hours
                  applying to dead ends.
                </p>
                <p className={styles.missionPara}>
                  FirstOp is different. Every listing on our platform is hand-verified
                  to be appropriate for students aged 15-24. We partner directly with
                  companies who want to invest in the next generation — not use
                  "intern" as a synonym for free labor.
                </p>
                <p className={styles.missionPara}>
                  We believe that where you start should never determine where you
                  end up. Your first opportunity should be earned by your drive, not
                  your connections.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── NUMBERS ──────────────────────────────────── */}
        <section className={styles.numbers}>
          <div className={styles.container}>
            <div className={styles.numbersGrid}>
              {[
                { num: "25+",  label: "Verified partner companies" },
                { num: "100+", label: "Students on the waitlist" },
                { num: "8",    label: "Industries covered" },
                { num: "Free", label: "Forever, for every student" },
              ].map(({ num, label }) => (
                <div key={label} className={styles.numberCard}>
                  <div className={styles.numberCardShimmer} />
                  <span className={styles.numberVal}>{num}</span>
                  <span className={styles.numberLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── TEAM ─────────────────────────────────────── */}
        <section className={styles.team}>
          <div className={styles.container}>
            <span className={styles.sectionTag} style={{ display: "block", textAlign: "center", marginBottom: 16 }}>The Team</span>
            <h2 className={styles.teamHeadline}>Two builders on a mission.</h2>
            <p className={styles.teamSub}>
              Small team, enormous ambition. We move fast and care deeply about
              every student who signs up.
            </p>

            <div className={styles.teamGrid}>
              {/* Aamir */}
              <div className={styles.memberCard}>
                <div className={styles.memberCardShimmer} />
                <div className={styles.memberAvatar}>
                  <span className={styles.memberInitials}>AA</span>
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>Aamir Ahmed</h3>
                  <span className={styles.memberRole}>Founder & CEO</span>
                  <p className={styles.memberBio}>
                    The person who refused to accept that high schoolers couldn't get
                    real experience. Aamir built FirstOp because he lived the problem.
                    He leads product vision, company direction, and partnerships.
                  </p>
                  <div className={styles.memberTags}>
                    <span className={styles.memberTag}>Product</span>
                    <span className={styles.memberTag}>Vision</span>
                    <span className={styles.memberTag}>Partnerships</span>
                  </div>
                </div>
              </div>

              {/* Gurshaan */}
              <div className={styles.memberCard}>
                <div className={styles.memberCardShimmer} />
                <div className={styles.memberAvatar} style={{ background: "rgba(23,124,255,0.12)", borderColor: "rgba(23,124,255,0.2)" }}>
                  <span className={styles.memberInitials} style={{ color: "rgba(23,124,255,0.9)" }}>GG</span>
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>Gurshaan Gill</h3>
                  <span className={styles.memberRole}>Technology, Graphic & Software Lead</span>
                  <p className={styles.memberBio}>
                    The builder behind everything you see and interact with. Gurshaan
                    leads all things technical and design — from the architecture of the
                    platform to the pixels on every page. If it looks good or works well,
                    that's Gurshaan.
                  </p>
                  <div className={styles.memberTags}>
                    <span className={styles.memberTag}>Engineering</span>
                    <span className={styles.memberTag}>Design</span>
                    <span className={styles.memberTag}>Software</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VALUES ───────────────────────────────────── */}
        <section className={styles.values}>
          <div className={styles.container}>
            <span className={styles.sectionTag} style={{ display: "block", textAlign: "center", marginBottom: 16 }}>What We Stand For</span>
            <h2 className={styles.valuesHeadline}>Principles we don't compromise on.</h2>

            <div className={styles.valuesGrid}>
              {[
                {
                  num: "01",
                  title: "Students first, always",
                  body: "Every decision we make starts with one question: is this good for the student? Not the company, not us — the student.",
                },
                {
                  num: "02",
                  title: "Radical transparency",
                  body: "We tell students exactly what a role involves, what they'll learn, and what they won't. No vague descriptions, no bait-and-switch.",
                },
                {
                  num: "03",
                  title: "Free, forever",
                  body: "We will never charge students to find opportunities. That would defeat the entire point of what we're building.",
                },
                {
                  num: "04",
                  title: "Quality over quantity",
                  body: "25 vetted, verified partners are worth more than 10,000 unverified listings. We'd rather have fewer, better options.",
                },
                {
                  num: "05",
                  title: "Merit over connections",
                  body: "Your first opportunity should be earned by your effort and curiosity — not who your parents know.",
                },
                {
                  num: "06",
                  title: "Build in public",
                  body: "We share our progress, our setbacks, and our roadmap openly. We hold ourselves accountable to the community we serve.",
                },
              ].map(({ num, title, body }) => (
                <div key={num} className={styles.valueCard}>
                  <span className={styles.valueNum}>{num}</span>
                  <h3 className={styles.valueTitle}>{title}</h3>
                  <p className={styles.valueBody}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className={styles.cta}>
          <div className={styles.ctaGrid} aria-hidden />
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaHeadline}>
              Your first opportunity<br />is closer than you think.
            </h2>
            <p className={styles.ctaSub}>
              Join the waitlist. We'll let you know the moment FirstOp goes live.
            </p>
            <a href="/#waitlist" className={styles.ctaBtn}>Join the Waitlist</a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}