// import { getAccessToken, usePrivy } from "@privy-io/react-auth";
// import { useRouter } from "next/router";
// import { isTMA } from "@telegram-apps/sdk-react";
// import { isDesktop, isMobile } from '../utils/deviceType'
// import { useEffect, useState } from "react";
// import API from "../services/apiService";

// export default function HomePage() {
//   const router = useRouter();
//   const { ready, authenticated, user } = usePrivy();
//   const [inTelegram, setInTelegram] = useState(false);
//   const [isUserSaved, setIsUserSaved] = useState(false);

//   useEffect(() => {
//     const checkTelegramStatus = async () => {
//       const telegramStatus = await isTMA();
//       setInTelegram(telegramStatus);
//     };
//     checkTelegramStatus();
//   }, []);

//   const saveUserDetails = async () => {
//     try {
//       if (isUserSaved || !authenticated) return;

//       const accessToken = await getAccessToken();
//       const idToken = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("privy-id-token="))
//         ?.split("=")[1];

//         console.log('idToken', idToken)

//       if (!accessToken || !idToken || !user?.id) {
//         console.error("Missing tokens or UID for saving user data.");
//         return;
//       }

//       console.log("Saving user data in the background...",  JSON.stringify({ idToken, uid: user.id }));

//        await API.post("/user", { idToken, uid: user.id });
//       setIsUserSaved(true);
//       console.log("User data saved successfully.");
//     } catch (error) {
//       console.error("Error saving user details:", error);
//     }
//   };

//   useEffect(() => {
//     if (ready) {

//       saveUserDetails();

//       if (authenticated) {
//         console.log("Redirecting to /home...");
//         router.replace("/home");
//       } else {
//         console.log("Redirecting to /login...");
//         router.replace("/login");
//       }
//     }
//   }, [ready, authenticated]);

//   if (!ready) {
//     return (
//       <div className="loaderContainer">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   console.log("In Telegram:", inTelegram);
//   if (!inTelegram && isMobile() && isDesktop()) {
//     return (
//       <div className="ctaContainer">
//         <h1>Welcome to Memeonaire!</h1>
//         <p>The ultimate game for crypto and fun enthusiasts!</p>
//         <a
//           href="https://t.me/shivamdemo_bot"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="ctaButton"
//         >
//           Open in Telegram
//         </a>
//       </div>
//     );
//   }

//   return null;
// }


// import { useRouter } from "next/router";
// import { isTMA, retrieveRawInitData } from "@telegram-apps/sdk";
// import { useEffect, useState } from "react";
// import API from "../services/apiService";
// import { isDesktop, isMobile } from '../utils/deviceType';

// export default function HomePage() {
//   const router = useRouter();
//   const [inTelegram, setInTelegram] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [hasInitData, setHasInitData] = useState(false);


//  useEffect(() => {
//     // Check for Telegram environment (real or mock)
//     const checkTelegramStatus = async () => {
//       try {
//         const telegramStatus = await isTMA();
//         setInTelegram(telegramStatus);
//         // Try to get the raw init data
//         const raw = retrieveRawInitData();
//         setHasInitData(!!raw);
//       } catch (e) {
//         setHasInitData(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkTelegramStatus();
//   }, []);

//   useEffect(() => {
//     // Only attempt API calls if we have init data
//     if (inTelegram && hasInitData) {
//       const initDataRaw = retrieveRawInitData();
//       API.get("/user/me", {
//         headers: {
//           Authorization: `tma ${initDataRaw}`
//         }
//       })
//         .then((res) => {
//           if (res.data && res.data.id) {
//             router.replace("/home");
//           } else {
//             router.replace("/");
//           }
//         })
//         .catch(() => {
//           router.replace("/");
//         });
//     }
//   }, [inTelegram, hasInitData, router]);

//   if (loading) {
//     return (
//       <div className="loaderContainer">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   // If not in Telegram, show Open in Telegram button (mobile)
//   if (!inTelegram && isMobile() && isDesktop()) {
//     return (
//       <div className="ctaContainer">
//         <h1>Welcome to Memeonaire!</h1>
//         <p>The ultimate game for crypto and fun enthusiasts!</p>
//         <a
//           href="https://t.me/shivamdemo_bot"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="ctaButton"
//         >
//           Open in Telegram
//         </a>
//       </div>
//     );
//   }

//   if (!hasInitData) {
//     return (
//       <div style={{textAlign: "center", marginTop: 48}}>
//         <p>Could not detect Telegram Mini App context.<br/>
//         Please open this app in Telegram, or enable mock mode for development.</p>
//       </div>
//     );
//   }

//   // Optionally, you can show a loading spinner while fetching Telegram data
//   return null;
// }

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTelegramUser } from "../hooks/useTelegramUser";

export default function HomePage() {
  const { user, loading, inTelegram } = useTelegramUser();
  const router = useRouter();

  
  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );
  }

  console.log('user', user)
  if (!inTelegram) {
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

  // If no user, fallback to login or info
  return null;
}

