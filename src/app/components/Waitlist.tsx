"use client";
import { useState } from "react";
import { createClient } from "../lib/supabase";
import Reveal from "./Reveal";
import styles from "./Waitlist.module.css";

const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12", "University"];
const FIELDS = [
  "Computer Science", "Engineering", "Health & Medicine",
  "Business & Finance", "Design & Arts", "Law & Policy",
  "Sciences & Research", "Media & Journalism", "Other",
];
const COMMITMENT = [
  { value: "immediate", label: "Yes — immediately" },
  { value: "3months",   label: "Within 3 months"  },
  { value: "exploring", label: "Just exploring"    },
];

export default function Waitlist() {
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [grade,      setGrade]      = useState("");
  const [field,      setField]      = useState("");
  const [commitment, setCommitment] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !grade || !field || !commitment) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: dbError } = await supabase
        .from("waitlist")
        .insert({ name: name.trim(), email: email.trim(), grade, field, commitment });

      if (dbError) {
        console.error("Supabase error:", dbError);
        setError(`Error: ${dbError.message}`);
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Submit failed:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Something went wrong: ${message}`);
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className={styles.section}>
      <div className={styles.inner}>

        <Reveal delay={0}><p className={styles.eyebrow}>Limited early access</p></Reveal>
        <Reveal delay={80}><h2 className={styles.heading}>Be first in line.</h2></Reveal>
        <Reveal delay={160}>
          <p className={styles.sub}>
            We&apos;re launching soon. Join the waitlist and get access
            the moment FirstOpz goes live.
          </p>
        </Reveal>

        <Reveal delay={240} style={{ width: "100%" }}>
          {submitted ? (
            <div className={styles.successCard}>
              <div className={styles.cardShimmer} aria-hidden />
              <div className={styles.successIcon}>✓</div>
              <p className={styles.successTitle}>You&apos;re on the list.</p>
              <p className={styles.successSub}>We&apos;ll reach out the moment we launch.</p>
            </div>
          ) : (
            <div className={styles.formCard}>
              <div className={styles.cardShimmer} aria-hidden />

              <form onSubmit={handleSubmit} className={styles.form}>

                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className={styles.input}
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className={styles.input}
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Current grade</label>
                  <div className={styles.chipGroup}>
                    {GRADES.map(g => (
                      <button
                        key={g}
                        type="button"
                        onPointerDown={e => { e.preventDefault(); setGrade(g); }}
                        className={`${styles.chip} ${grade === g ? styles.chipActive : ""}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Intended field of interest</label>
                  <div className={styles.chipGroup}>
                    {FIELDS.map(f => (
                      <button
                        key={f}
                        type="button"
                        onPointerDown={e => { e.preventDefault(); setField(f); }}
                        className={`${styles.chip} ${field === f ? styles.chipActive : ""}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Ready to commit?</label>
                  <div className={styles.commitGroup}>
                    {COMMITMENT.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onPointerDown={e => { e.preventDefault(); setCommitment(c.value); }}
                        className={`${styles.commitBtn} ${commitment === c.value ? styles.commitActive : ""}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className={styles.errorMsg}>{error}</p>}

                <button type="submit" disabled={loading} className={styles.submit}>
                  {loading ? <span className={styles.spinner} /> : "Join the Waitlist"}
                </button>

                <p className={styles.fine}>Free forever · No spam · Cancel anytime</p>
              </form>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}