import '@telegram-apps/telegram-ui/dist/styles.css';
import React, { useEffect, useRef } from "react";
import { usePrivy, getAccessToken } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { setUser } from '../store/slice/userSlice';
import { useAppDispatch } from "../store/hooks";
import { Root } from '../core/Root';
import Image from 'next/image';
import Head from 'next/head';

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (ready && authenticated && !hasNavigated.current) {
      hasNavigated.current = true;

      const fetchUserDetails = async () => {
        try {
          const accessToken = await getAccessToken();
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            dispatch(
              setUser({
                accessToken,
                user: user!,
              })
            );
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          router.replace("/login");
        }
      };

      fetchUserDetails();
    }
  }, [ready, authenticated, router, dispatch, user]);

  if (!ready) {
    return (
      <div className="loaderContainer">
        <div className="loader">
          <Image src="/Logo.svg" alt="Loading Logo" width={100} height={100} />
        </div>
      </div>
    );
  }


  return (
    <>
      <html lang="en">
        <Head>
          <title>Folks</title>
          <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
          <meta name="description" content="Folks Finance" />
        </Head>
        <div className="app-container">
            <Root>
              {/* <Navbar /> */}
              {children}
            </Root>
        </div>
      </html>
    </>
  );
}
