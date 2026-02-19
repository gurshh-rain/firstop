"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import styles from "../login/page.module.css";

export default function SignupPage() {
  const supabase = createClient();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [done,     setDone]     = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.card}>
          <div className={styles.cardShimmer} />
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Check your email</h2>
            <p className={styles.successSub}>
              We sent a confirmation link to{" "}
              <strong>{email}</strong>.
              Click it to activate your account.
            </p>
            <Link href="/login" className={styles.submitBtn}>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        <div className={styles.cardShimmer} />

        <div className={styles.header}>
          <Link href="/" className={styles.logo}>FirstOp</Link>
          <h1 className={styles.title}>Create an account</h1>
          <p className={styles.subtitle}>Start finding your first opportunity</p>
        </div>

        <button className={styles.oauthBtn} onClick={handleGoogle} type="button">
          <GoogleIcon />
          Continue with Google
        </button>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <span className={styles.dividerLine} />
        </div>

        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
              className={styles.input}
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
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? <span className={styles.spinner} /> : "Create account"}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.657 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}