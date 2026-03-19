"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [secret, setSecret] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const ledDanger = countdown !== null && countdown > 0;

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      fetch("/api/secret")
        .then((res) => res.json())
        .then((data) => {
          setSecret(data.secret ?? "SECRET INDISPONIBLE");
        })
        .catch(() => {
          setSecret("ERREUR DE LECTURE DU SECRET");
        })
        .finally(() => {
          setIsRunning(false);
        });
    }
  }, [countdown]);

  const handleLaunch = () => {
    if (isRunning) return;
    setSecret("");
    setIsRunning(true);
    setCountdown(5);
  };

  const isButtonDisabled = isRunning;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.panelFrame}>
          <header className={styles.panelTop}>
            <div className={styles.panelTitle}>NUCLEAR LAUNCH</div>
            <div className={styles.topStatus}>
              <div className={styles.ledRow}>
                <span
                  className={`${styles.led} ${
                    ledDanger ? styles.ledDanger : styles.ledOk
                  }`}
                />
                <span className={styles.ledText}>
                  {ledDanger ? "COUNTDOWN ACTIVE" : "STATUS: READY"}
                </span>
              </div>
              <div className={styles.scanNumber}>
                {countdown ?? "—"}{" "}
                <span className={styles.scanUnit}>SECONDS</span>
              </div>
            </div>
          </header>

          <div className={styles.panelBody}>
            <aside className={styles.rail} aria-hidden="true">
              <div className={styles.hazard} />
              <div className={styles.switchBlock}>
                <div className={styles.switchLabel}>AUTH</div>
                <div className={styles.toggleRow}>
                  <div
                    className={`${styles.toggle} ${
                      ledDanger ? styles.toggleDanger : styles.toggleOk
                    }`}
                  />
                  <div className={styles.toggleText}>
                    {ledDanger ? "ARMED" : "SAFE"}
                  </div>
                </div>
              </div>
            </aside>

            <section className={styles.console}>
              <div className={styles.consoleTitle}>LAUNCH CONSOLE</div>

              <div className={styles.statusPanel}>
                <div
                  className={`${styles.indicator} ${
                    ledDanger ? styles.indicatorDanger : ""
                  }`}
                >
                  STATUS: {ledDanger ? "ARMING" : "READY"}
                </div>
                <div className={styles.indicator}>COUNTDOWN: {countdown ?? "-"}</div>
              </div>

              <div className={styles.stage}>
                <button
                  className={`${styles.bigButton} ${
                    isButtonDisabled ? styles.bigButtonDisabled : ""
                  }`}
                  onClick={handleLaunch}
                  disabled={isButtonDisabled}
                >
                  LAUNCH
                </button>

                <div className={styles.countdown}>
                  {countdown !== null && countdown > 0 && countdown}
                  {countdown === 0 && "0"}
                </div>
              </div>

              <div className={styles.secretWrap}>
                <div className={styles.secretLabel}>MON_TEXT_SECRET</div>
                <div className={styles.secret}>{secret}</div>
              </div>

              <div className={styles.hint}>
                APPUIE SUR LE BOUTON ROUGE POUR LANCER LE COMPTE À REBOURS
              </div>
            </section>

            <aside className={styles.rail} aria-hidden="true">
              <div className={styles.interlocks}>
                <div className={styles.interlocksTitle}>INTERLOCKS</div>
                <div className={styles.lightsGrid}>
                  <div className={`${styles.light} ${styles.lightOn}`} />
                  <div className={`${styles.light} ${ledDanger ? styles.lightDanger : styles.lightOn}`} />
                  <div className={`${styles.light} ${styles.lightOn}`} />
                  <div className={`${styles.light} ${ledDanger ? styles.lightDanger : ""}`} />
                </div>
                <div className={styles.interlocksFooter}>
                  {ledDanger ? "LINKS CHAINÉS" : "LINKS OK"}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
