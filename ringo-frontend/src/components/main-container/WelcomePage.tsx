"use client";

import React from "react";
import styles from "./main-container.module.css"; // ✅ same module as MainContainer

export default function WelcomePage() {
  return (
    <div className={styles.welcomePage}>
      <div className={styles.brand}>
        <img src="/logo.png" alt="Logo" />
        <span className={styles.welcomeText}>
          Welcome to Ringo — Where Conversations Come to Life!
        </span>
      </div>
    </div>
  );
}
