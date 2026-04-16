import Link from "next/link";
import Image from "next/image";
import styles from "./landing-page.module.css";

export function LandingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.heroMedia} aria-hidden="true">
        <div className={styles.heroImage} />
        <div className={styles.heroOverlay} />
      </div>
      <div className={styles.bottomBand} aria-hidden="true" />

      <div className={styles.overlay}>
        <header className={styles.header}>
          <div className={styles.navPill}>
            <div className={styles.authHighlight} aria-hidden="true" />

            <div className={styles.logoRing} aria-hidden="true" />
            <div className={styles.logoInner} aria-hidden="true">
              <Image
                src="/logos/logo.png"
                alt="BayaniHub logo"
                width={116}
                height={116}
                className={styles.logoImage}
                priority
              />
            </div>

            <nav className={styles.nav} aria-label="Main navigation">
              <Link className={styles.navLink} href="/">
                Home
              </Link>
              <a className={styles.navLink} href="#about">
                About Us
              </a>
            </nav>

            <div className={styles.authNav}>
              <Link className={styles.authLink} href="/signup">
                Sign Up
              </Link>
              <Link className={styles.authLink} href="/login">
                Log In
              </Link>
            </div>
          </div>
        </header>

        <section className={styles.content}>
          <div className={styles.heroBlock}>
            <p className={styles.intro}>
              Welcome To <span className={styles.bayaniHubText}>BayaniHub</span>
            </p>

            <h1 className={styles.headline}>
              Right <span>People</span>. Right <span>Resources</span>. Right <span>Now</span>.
            </h1>

            <section className={styles.aboutAnchor} id="about">
              <p className={styles.support}>
                BayaniHub is a unified resource management engine designed to empower modern-day heroes. By managing both manpower and material aid in one place, we help disaster response teams forecast needs, avoid bottlenecks, and deploy aid efficiently.
              </p>
            </section>

            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/dashboard">
                View Reports
              </Link>
              <Link className={styles.secondaryAction} href="/signup">
                Report an Incident
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
