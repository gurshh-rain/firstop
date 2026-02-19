"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import styles from "./Waitlist.module.css";
import Link from 'next/link';


export default function Waitlist() {

  return (
    <section id="waitlist" className={styles.section}>
      <div className={styles.orb1} aria-hidden />
      <div className={styles.orb2} aria-hidden />

      <div className={styles.inner}>
        <Reveal delay={0}><p className={styles.eyebrow}>Limited early access</p></Reveal>
        <Reveal delay={80}><h2 className={styles.heading}>Be first in line.</h2></Reveal>
        <Reveal delay={80}><Link className={styles.form} href="https://docs.google.com/forms/d/e/1FAIpQLSf2TAq8z_nFg-iKdqkhNc3_xp_ClbUuHbpvRoNHVek-irz4_A/viewform">Google Form</Link></Reveal>
        <Reveal delay={160}>
          <p className={styles.sub}>
            We're launching soon. Join the waitlist and get access
            the moment FirstOp goes live.
          </p>
        </Reveal>
      </div>
    </section>
  );
}