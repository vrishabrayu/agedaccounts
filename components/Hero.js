"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.css";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const container = useRef(null);
  const textRef = useRef(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = now.getHours() >= 12 ? "PM" : "AM";
      setTime(`${hours}:${minutes}${period}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      gsap.from(textRef.current.children, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
      });
    },
    { scope: container }
  );

  return (
    <section className={styles.hero} ref={container} id="hero-section">
      <div className={styles.content}>
        <h1 className={styles.title} ref={textRef}>
          <span className={styles.line}>FAST ACCOUNTS</span>
          <span className={styles.line}>
            <ArrowRight
              className={styles.arrow}
              size={64}
              strokeWidth={2.5}
            />
          </span>
          <span className={styles.line}>
            {time} — PREMIUM
          </span>
          <span className={styles.line}>
            SOCIAL ACCOUNTS
          </span>
          <span className={styles.line}>
            YOURS INSTANTLY
            <ArrowRight
              className={styles.arrowSmall}
              size={48}
              strokeWidth={2.5}
            />
          </span>
        </h1>
      </div>
      <div className={styles.scrollHint}>
        <span>DISCOVER OUR MARKETPLACE</span>
      </div>
    </section>
  );
}
