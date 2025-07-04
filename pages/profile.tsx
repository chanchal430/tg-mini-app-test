// import React from "react";
// import Image from 'next/image';
// import { hapticFeedback } from "@telegram-apps/sdk-react";
// import { useRouter } from "next/router";

// /** Assets */
// import logo from "../public/logo.png"

// /** Styles */
// import styles from '@/styles/profile.module.css'
// import BottomBar from "@/components/Bottombar";

// const Settings = () => {

//     const router = useRouter();

//     const handleNavigation = (path: string) => {
//         if (hapticFeedback.notificationOccurred.isAvailable()) {
//             hapticFeedback.impactOccurred("heavy");
//         }
//         router.push(path);
//     };

//     return (
//         <>
//         <div className={styles.container}>
//             <div className={styles.profileSection}>
//                 <Image src={logo} alt="Avatar" className={styles.avatar} />
//                 <h2 className={styles.username}>Shiri 🐾</h2>
//                 <div className={styles.levelRow}>
//                     <span>3 lvl</span>
//                     <div className={styles.progressBar}>
//                         <div className={styles.progressFill}></div>
//                     </div>
//                     <span>4 lvl</span>
//                 </div>
//                 <p className={styles.points}>💰 842 / 70k</p>
//             </div>

//             <div className={styles.card}>

//                 <div onClick={() => handleNavigation("/wallet")} className={styles.cardItem}>
//                     <p className={styles.cardTitle}>Connect Wallet</p>
//                     <p className={styles.cardSubtitle}>Connect your TON wallet</p>
//                 </div>
//                 {/* <MdOutlineArrowForwardIos /> */}

//                 <div onClick={() => handleNavigation("/settings")} className={styles.cardItem}>
//                     <p className={styles.cardTitle}>Settings</p>
//                     <p className={styles.cardSubtitle}>Language, music, sounds and vibration</p>
//                 </div>
//             </div>
//         </div>
//         <BottomBar />
//         </>
//     );
// };

// export default Settings;

// pages/profile.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { useRouter } from "next/router";
import styles from "@/styles/profile.module.css";
import BottomBar from "@/components/Bottombar";
import { getMe } from "@/services/userService";
import { Settings as SettingsIcon, ChevronRight } from "lucide-react";

interface ProfileData {
  username: string;
  level: number;
  nextLevel: number;
  points: number;
  nextLevelPoints: number;
  avatar: string;
}

const Settings = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        setProfile(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handleNavigation = (path: string) => {
    if (hapticFeedback.notificationOccurred.isAvailable()) {
      hapticFeedback.impactOccurred("heavy");
    }
    router.push(path);
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <Image
            src={profile?.avatar || "/logo.png"}
            alt="Avatar"
            width={80}
            height={80}
            className={styles.avatar}
          />
          <h2 className={styles.username}>{profile?.username}</h2>
          <div className={styles.levelRow}>
            <span>{profile?.level} lvl</span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${Math.min(
                    100,
                    ((profile?.points || 0) / (profile?.nextLevelPoints || 1)) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <span>{profile?.nextLevel} lvl</span>
          </div>
          <p className={styles.points}>
            {/* 💰 {profile?.points} / {profile?.nextLevelPoints} */}
            Total Points {profile?.points}
          </p>
        </div>

        <div className={styles.card}>
          {/* <div onClick={() => handleNavigation("/wallet")} className={styles.cardItem}>
                        <p className={styles.cardTitle}>Connect Wallet</p>
                        <p className={styles.cardSubtitle}>Connect your TON wallet</p>
                    </div> */}
          <div
            onClick={() => handleNavigation("/settings")}
            className={styles.cardItem}
          >
            <div className={styles.cardLeft}>
              <div className={styles.iconWrapper}>
                {/* Use an icon here (optional: SVG, or a real one like <Settings />) */}
                <SettingsIcon className={styles.icon} />
              </div>
              <div>
                <p className={styles.cardTitle}>Settings</p>
                <p className={styles.cardSubtitle}>
                  Language, music, sounds and vibration
                </p>
              </div>
            </div>
            <ChevronRight className={styles.arrow} />
          </div>
        </div>
      </div>
      <BottomBar />
    </>
  );
};

export default Settings;
