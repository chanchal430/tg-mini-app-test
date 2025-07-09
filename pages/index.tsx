// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useTelegramUser } from "../hooks/useTelegramUser";

// export default function HomePage() {
//   const { user, loading, inTelegram } = useTelegramUser();
//   const router = useRouter();

//   console.log("Index:", { loading, user, inTelegram });

//   useEffect(() => {
//     if (!loading && user) {
//       router.replace("/home");
//     }
//   }, [loading, user, router]);

//   if (loading) {
//     return (
//       <div className="loaderContainer">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   console.log("user", user);
//   if (!inTelegram) {
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

//   // If no user, fallback to login or info
//   // return null;

//   // Fallback if user is null but in Telegram
//   return (
//     <div style={{ textAlign: "center", padding: "2rem" }}>
//       <h2>Session not detected. Please open in Telegram.</h2>
//     </div>
//   );
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

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Session not detected. Please open in Telegram.</h2>
    </div>
  );
}

// ✅ This makes sure Vercel renders this page dynamically and not statically
export async function getServerSideProps() {
  return { props: {} };
}
