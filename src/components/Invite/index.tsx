/** 3P Dependecies */
import React, { useState, useEffect } from "react";
import { IoCopyOutline } from "react-icons/io5";

/** Assets */
import logo from "../../assets/images/logo.png";

/** Styles */
import styles from "./styles.module.css";

import { shareMessage, shareURL, useSignal } from "@telegram-apps/sdk-react";
import { initData } from "@telegram-apps/sdk-react";

import { getInviteId } from "../../services/appService";
import { fetchReferralId } from "../../store/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";


const Invite = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { referralId, isLoading: isFetching } = useSelector((state: RootState) => state.app);

  const [showModal, setShowModal] = useState(false);
  const [inviteLink] = useState("https://tg-mini-app-nine-ruddy.vercel.app");

  const telegramUser = useSignal(initData.user);

  useEffect(() => {
    if (telegramUser?.id) {
      dispatch(fetchReferralId(telegramUser.id.toString()));
    }
  }, [telegramUser?.id, dispatch]);

  const handleShareTelegram = () => {
    if (!referralId) {
      alert("Invite link is not ready yet! Please try again later.");
      return;
    }

    const fullInviteLink = `${inviteLink}/${referralId}`;

    shareURL(fullInviteLink, "Hey! Join us using this invite link:");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(`${inviteLink}/${referralId}`)
      .then(() => {
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      })
      .catch((err) => {
        console.error("❌ Failed to copy text: ", err);
      });
  };

  return (
    <div className={styles["invite-container"]}>
      <span className={styles["invite-title"]}>Folks Finance</span>
      <div className={styles["invite-innner-container"]}>
        <img src={logo} alt="Logo" />
        <div className={styles["invite-link-main-div"]}>
          <h5>Invite Link</h5>
          <div className={styles["invite-link-div"]}>
            <span>{inviteLink}/{referralId || "..."}</span>
            {/* <IoCopyOutline
              size={20}
              onClick={copyToClipboard}
              style={{
                cursor: isFetching ? "not-allowed" : "pointer",
                opacity: isFetching ? 0.5 : 1,
              }}
            /> */}
          </div>
        </div>
        <button onClick={handleShareTelegram} className={styles["invite-contact-btn"]}>
          Share via Telegram
        </button>
      </div>

      {showModal && (
        <div className={styles["modal-background"]}>
          <div className={styles["modal-content"]}>
            <p>✅ Link copied to clipboard!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invite;


