import React from "react";
import { useRouter } from "next/router";
import styles from './navbar.module.css';
import { hapticFeedback } from "@telegram-apps/sdk-react";
import Image from "next/image";

const BottomBar: React.FC = () => {

    const router = useRouter();

    const handleNavigation = (path: string) => {
        if (hapticFeedback.notificationOccurred.isAvailable()) {
            hapticFeedback.impactOccurred("heavy");
        }
        router.push(path);
    };

    return (
        <div className={styles.bottomNavigation}>
            <div className={styles.bottomNavItem} onClick={() => handleNavigation("/")}>
                <Image src={'/Home.svg'} alt="Home" width={20} height={20} />
                <p>Home</p>
            </div>
            <div className={styles.bottomNavItem} onClick={() => handleNavigation("/task")}>
                <Image src={'/History.svg'} alt="Task" width={20} height={20} />
                <p>Task</p>
            </div>
            <div className={styles.bottomNavItem} onClick={() => handleNavigation("/profile")}>
                <Image src={'/Wallet-Navbar.svg'} alt="Wallet" width={20} height={20} />
                <p>Wallet</p>
            </div>
        </div>
    )
}

export default BottomBar