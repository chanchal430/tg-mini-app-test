import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { isTMA } from "@telegram-apps/sdk-react";
import { isDesktop, isMobile } from '../utils/deviceType'
import { useEffect, useState } from "react";
import API from "../services/apiService";

export default function HomePage() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const [inTelegram, setInTelegram] = useState(false);
  const [isUserSaved, setIsUserSaved] = useState(false);

  useEffect(() => {
    const checkTelegramStatus = async () => {
      const telegramStatus = await isTMA();
      setInTelegram(telegramStatus);
    };
    checkTelegramStatus();
  }, []);

  const saveUserDetails = async () => {
    try {
      if (isUserSaved || !authenticated) return;

      const accessToken = await getAccessToken();
      const idToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("privy-id-token="))
        ?.split("=")[1];

        console.log('idToken', idToken)

      if (!accessToken || !idToken || !user?.id) {
        console.error("Missing tokens or UID for saving user data.");
        return;
      }

      console.log("Saving user data in the background...",  JSON.stringify({ idToken, uid: user.id }));

       await API.post("/user", { idToken, uid: user.id });
      setIsUserSaved(true);
      console.log("User data saved successfully.");
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  useEffect(() => {
    if (ready) {

      saveUserDetails();

      if (authenticated) {
        console.log("Redirecting to /home...");
        router.replace("/home");
      } else {
        console.log("Redirecting to /login...");
        router.replace("/login");
      }
    }
  }, [ready, authenticated]);

  if (!ready) {
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );
  }

  console.log("In Telegram:", inTelegram);
  if (!inTelegram && isMobile() && isDesktop()) {
    return (
      <div className="ctaContainer">
        <h1>Welcome to Memeonaire!</h1>
        <p>The ultimate game for crypto and fun enthusiasts!</p>
        <a
          href="https://t.me/shivamdemo_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="ctaButton"
        >
          Open in Telegram
        </a>
      </div>
    );
  }

  return null;
}
