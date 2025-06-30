// import '@telegram-apps/telegram-ui/dist/styles.css';
// import React, { useEffect, useRef } from "react";
// import { usePrivy, getAccessToken } from "@privy-io/react-auth";
// import { useRouter } from "next/router";
// import { setUser } from '../store/slice/userSlice';
// import { useAppDispatch } from "../store/hooks";
// import { Root } from '../core/Root';
// import Image from 'next/image';
// import Head from 'next/head';

// type Props = {
//   children?: React.ReactNode;
// };

// export default function Layout({ children }: Props) {
//   const { ready, authenticated, user } = usePrivy();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const hasNavigated = useRef(false);

//   useEffect(() => {
//     if (ready && authenticated && !hasNavigated.current) {
//       hasNavigated.current = true;

//       const fetchUserDetails = async () => {
//         try {
//           const accessToken = await getAccessToken();
//           if (accessToken) {
//             localStorage.setItem("accessToken", accessToken);
//             dispatch(
//               setUser({
//                 accessToken,
//                 user: user!,
//               })
//             );
//             router.push("/");
//           }
//         } catch (error) {
//           console.error("Error fetching user details:", error);
//           router.replace("/login");
//         }
//       };

//       fetchUserDetails();
//     }
//   }, [ready, authenticated, router, dispatch, user]);

//   if (!ready) {
//     return (
//       <div className="loaderContainer">
//         <div className="loader">
//           <Image src="/Logo.svg" alt="Loading Logo" width={100} height={100} />
//         </div>
//       </div>
//     );
//   }


//   return (
//     <>
//       <html lang="en">
//         <Head>
//           <title>Folks</title>
//           <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
//           <meta name="description" content="Folks Finance" />
//         </Head>
//         <div className="app-container">
//             <Root>
//               {children}
//             </Root>
//         </div>
//       </html>
//     </>
//   );
// }


// import '@telegram-apps/telegram-ui/dist/styles.css';
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { setUser } from '@/store/slice/userSlice';
// import { useAppDispatch } from "../store/hooks";
// import { Root } from '../core/Root';
// import Head from 'next/head';
// import { retrieveRawInitData } from "@telegram-apps/sdk";

// // You can read your mock flag from the environment:
// const useTGMOCK = process.env.NEXT_PUBLIC_MOCK_TG === "true";

// type Props = {
//   children?: React.ReactNode;
// };

// export default function Layout({ children }: Props) {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Don't fetch user if in mock mode (assume handled in Root.tsx/useTelegramMock)
//     if (useTGMOCK) {
//       setLoading(false);
//       return;
//     }

//     // Try to get Telegram Mini App user
//     const initDataRaw = retrieveRawInitData();

//     if (initDataRaw) {
//       fetch('/api/user/me', {
//         method: "GET",
//         headers: {
//           Authorization: `tma ${initDataRaw}`
//         }
//       })
//         .then(async (res) => {
//           if (res.ok) {
//             const data = await res.json();
//             dispatch(setUser({
//               user: data,
//               accessToken: ''
//             }));
//           } else {
//             router.replace("/");
//           }
//         })
//         .catch(() => router.replace("/"))
//         .finally(() => setLoading(false));
//     } else {
//       // No Telegram context? Fallback to login.
//       router.replace("/login");
//       setLoading(false);
//     }
//   }, [router, dispatch]);

//   if (loading) {
//     return (
//       <div className="loaderContainer">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Head>
//         <title>Folks</title>
//         <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
//         <meta name="description" content="Folks Finance" />
//       </Head>
//       <div className="app-container">
//         <Root>
//           {children}
//         </Root>
//       </div>
//     </>
//   );
// }

import '@telegram-apps/telegram-ui/dist/styles.css';
import React from "react";
import { Root } from '../core/Root';
import Head from 'next/head';
import { useTelegramUser } from "../hooks/useTelegramUser";

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { loading, user, inTelegram, error } = useTelegramUser();

  if (loading) {
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );
  }
  if (!inTelegram) {
    return (
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <p>
          Could not detect Telegram Mini App context.<br />
          Please open this app in Telegram, or enable mock mode for development.
        </p>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <p>
          {error ? error : "Loading user..."}
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Folks</title>
        <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
        <meta name="description" content="Folks Finance" />
      </Head>
      <div className="app-container">
        <Root>
          {children}
        </Root>
      </div>
    </>
  );
}

