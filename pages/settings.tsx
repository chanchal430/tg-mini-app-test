import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Volume2,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import styles from "@/styles/settings.module.css";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import BottomBar from "@/components/Bottombar";

const languages = [
  { name: "English", code: "en", flagUrl: "/flags/gb.png" },
  { name: "Hindi", code: "hi", flagUrl: "/flags/in.png" },
  { name: "Spanish", code: "es", flagUrl: "/flags/es.png" },
];

const SettingsPage = () => {
  const router = useRouter();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const goBack = () => {
    if (hapticFeedback.notificationOccurred.isAvailable()) {
      hapticFeedback.impactOccurred("heavy");
    }
    router.back();
  };

  return (
    <>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.backButton} onClick={goBack}>
            <ChevronLeft className={styles.backIcon} />
            <span>Back</span>
          </div>
          <h1 className={styles.title}>Settings</h1>
          <div className={styles.menu}>
            <MoreHorizontal className={styles.menuIcon} />
          </div>
        </div>

        {/* Language Selector */}
        <div
          className={styles.card}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className={styles.cardLeft}>
            <Image
              src={selectedLanguage.flagUrl}
              alt=""
              width={40}
              height={40}
              className={styles.flag}
            />
            <div>
              <p className={styles.cardTitle}>Language</p>
              <p className={styles.cardSubtitle}>{selectedLanguage.name}</p>
            </div>
          </div>
          <ChevronRight className={styles.arrow} />
        </div>

        {showDropdown && (
          <div className={styles.dropdown}>
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={styles.dropdownItem}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setShowDropdown(false);
                }}
              >
                <Image
                  src={lang.flagUrl}
                  alt=""
                  width={24}
                  height={24}
                  className={styles.smallFlag}
                />
                <span>{lang.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Sound Toggle */}
        <div className={styles.card}>
          <div className={styles.cardLeft}>
            <div className={styles.iconCircle}>
              <Volume2 className={styles.icon} />
            </div>
            <p className={styles.cardTitle}>Sound</p>
          </div>
          <div
            className={`${styles.switch} ${soundEnabled ? styles.on : ""}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            <div className={styles.thumb} />
          </div>
        </div>

        {/* Vibration Toggle */}
        <div className={styles.card}>
          <div className={styles.cardLeft}>
            <div className={styles.iconCircle}>
              <Smartphone className={styles.icon} />
            </div>
            <p className={styles.cardTitle}>Vibration</p>
          </div>
          <div
            className={`${styles.switch} ${vibrationEnabled ? styles.on : ""}`}
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
          >
            <div className={styles.thumb} />
          </div>
        </div>
      </div>
      <BottomBar />
    </>
  );
};

export default SettingsPage;
