import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import "./Invite.css";
import { IoCopyOutline } from "react-icons/io5";

const Invite = () => {
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [inviteLink] = useState("https://tg-mini-app-nine-ruddy.vercel.app");
  const [isFetching, setIsFetching] = useState(false);
  const [referralId, setReferralId] = useState("");
  const apiIp = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchInviteId();
  }, []);

  const fetchInviteId = async () => {
    const telegramUserId = localStorage.getItem("telegramUserId");
    try {
      setIsFetching(true);
      const response = await fetch(`${apiIp}/api/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "telegram-id": telegramUserId,
        },
      });

      const data = await response.json();
      if (data.status && data.data) {
        setReferralId(data.data);
      } else {
        console.error("Failed to get invite ID:", data.error);
      }
    } catch (error) {
      console.error("Error fetching invite ID:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchContacts = async () => {
    if (!referralId) {
      alert("Invite link is not ready yet! Please try again later.");
      return;
    }

    const fullInviteLink = `${inviteLink}/${referralId}`;

    try {
      if (typeof window.Telegram !== "undefined" && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
        let phoneNumber = "";

        if (telegramUser && telegramUser.phone_number) {
          phoneNumber = telegramUser.phone_number.replace(/\D/g, "");
        }

        const inviteMessage = encodeURIComponent(
          `Hey! Join us using this invite link: ${fullInviteLink}`
        );
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${inviteMessage}`;

        if (phoneNumber) {
          window.Telegram.WebApp.openLink(whatsappURL);
        } else {
          window.Telegram.WebApp.openLink(
            `https://wa.me/?text=${inviteMessage}`
          );
        }
      } else if ("contacts" in navigator && navigator.contacts?.select) {
        const contactProps = ["name", "tel"];
        const contactList = await navigator.contacts.select(contactProps, {
          multiple: true,
        });

        const formattedContacts = contactList.map((contact) => ({
          name: contact.name?.[0] || "Unknown",
          phone: contact.tel?.[0] || "No Number",
        }));

        setContacts(formattedContacts);

        if (formattedContacts.length > 0) {
          const firstContact = formattedContacts[0];
          const phoneNumber = firstContact.phone.replace(/\D/g, "");
          const inviteMessage = encodeURIComponent(
            `Hey! Join us using this invite link: ${fullInviteLink}`
          );
          const whatsappURL = `https://wa.me/${phoneNumber}?text=${inviteMessage}`;
          const intentURL = `intent://send?phone=${phoneNumber}&text=${inviteMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end;;`;

          if (/Android/i.test(navigator.userAgent)) {
            setTimeout(() => {
              window.location.href = intentURL;
            }, 500);
          } else {
            setTimeout(() => {
              window.open(whatsappURL, "_blank");
            }, 300);
          }
        } else {
          alert("Selected contact has no phone number.");
        }
      } else {
        alert("Contact API not supported on this device.");
      }
    } catch (error) {
      console.error("Error fetching contacts", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(inviteLink) 
      .then(() => {
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      })
      .catch((err) => {
        console.error("❌ Failed to copy text: ", err);
      });
  };

  return (
    <div className="invite-container">
      <span className="invite-title">Folks Finance</span>
      <div className="invite-innner-container">
        <img src={logo} alt="Logo" />
        <div className="invite-link-main-div">
          <h5>Invite Link</h5>
          <div className="invite-link-div">
            <span>{inviteLink}</span>
            <IoCopyOutline
              size={20}
              onClick={copyToClipboard}
              style={{
                cursor: isFetching ? "not-allowed" : "pointer",
                opacity: isFetching ? 0.5 : 1,
              }}
            />
          </div>
        </div>
        <button onClick={fetchContacts} className="invite-contact-btn">
          Invite
        </button>
      </div>

      {showModal && (
        <div className="modal-background">
          <div className="modal-content">
            <p>✅ Link copied to clipboard!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invite;




