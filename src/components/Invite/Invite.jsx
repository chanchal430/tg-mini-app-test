


import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import "./Invite.css";
import { IoCopyOutline } from "react-icons/io5";

const Invite = () => {
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [inviteLink, setInviteLink] = useState(
    "https://www.figma.com/design/mWmu9Rb8ALftqqQ6KaCrF3/Untitled?node-id=0-1&p=f&t=m9JS6gUXwP1kYIpa-0"
  ); // ✅ Show base link first
  const [isFetching, setIsFetching] = useState(false);
  const [referralId, setReferralId] = useState(""); // ✅ Store referral ID separately
  const apiIp = process.env.REACT_APP_API_URL;

  const fetchInviteId = async () => {
    const walletAddress = localStorage.getItem("walletAddress");
    try {
      setIsFetching(true);
      const response = await fetch(`${apiIp}api/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "wallet-address": walletAddress,
        },
      });

      const data = await response.json();
      console.log("Data from invite API:", data);

      if (data.success && data.referralId) { // ✅ Ensure referralId exists
        setReferralId(data.referralId); // ✅ Store referral ID
      } else {
        console.error("❌ Failed to get invite ID:", data.error);
      }
    } catch (error) {
      console.error("❌ Error fetching invite ID:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchContacts = async () => {
    if (!referralId) {
      await fetchInviteId(); // ✅ Fetch referral ID before sharing
    }

    const fullInviteLink = `${inviteLink}/${referralId}`;
    console.log("Final Invite Link:", fullInviteLink);

    try {
      if (!fullInviteLink || fullInviteLink.includes("Failed")) {
        alert("Invite link is not ready yet!");
        return;
      }

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
          const intentURL = `intent://send?phone=${phoneNumber}&text=${inviteMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end;`;

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
        if (!inviteLink || inviteLink.includes("Failed")) return;
    
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
            <span>
              {referralId
                ? `${inviteLink}/${referralId}`
                : inviteLink} {/* ✅ Show base link first */}
            </span>
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

      {/* ✅ Copy Success Modal */}
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
// import React, { useState, useEffect } from "react";
// import logo from "../../assets/images/logo.png";
// import "./Invite.css";
// import { IoCopyOutline } from "react-icons/io5";

// const Invite = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [contacts, setContacts] = useState([]);
//   const [inviteLink, setInviteLink] = useState("");
//   const [isFetching, setIsFetching] = useState(true);
//   const apiIp = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     fetchInviteId();
//   }, []);

//   const fetchInviteId = async () => {
//     const walletAddress = localStorage.getItem("walletAddress");
//     try {
//       setIsFetching(true);
//       const response = await fetch(`${apiIp}/api/invite`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "wallet-address": walletAddress,
//         },
//       });
  
//       const data = await response.json();
//       console.log("Data from invite API:", data);
  
//       if (data.success && data.referralId) { // ✅ Ensure referralId exists
//         const inviteUrl = `https://www.figma.com/design/mWmu9Rb8ALftqqQ6KaCrF3/Untitled?node-id=0-1&p=f&t=m9JS6gUXwP1kYIpa-0/${data.referralId}`;
//         console.log("InviteURL:", inviteUrl);
//         setInviteLink(inviteUrl); // ✅ Set correct invite link
//       } else {
//         console.error("❌ Failed to get invite ID:", data.error);
//         setInviteLink("Failed to generate link"); // ✅ Show error text only if ID is missing
//       }
//     } catch (error) {
//       console.error("❌ Error fetching invite ID:", error);
//       setInviteLink("Failed to generate link"); // ✅ Display failure message
//     } finally {
//       setIsFetching(false); // ✅ Hide "Generating link..."
//     }
//   };
  
//   const copyToClipboard = () => {
//     if (!inviteLink || inviteLink.includes("Failed")) return;

//     navigator.clipboard
//       .writeText(inviteLink)
//       .then(() => {
//         setShowModal(true);
//         setTimeout(() => setShowModal(false), 2000);
//       })
//       .catch((err) => {
//         console.error("❌ Failed to copy text: ", err);
//       });
//   };

//   const fetchContacts = async () => {
//     try {
//       if (!inviteLink || inviteLink.includes("Failed")) {
//         alert("Invite link is not ready yet!");
//         return;
//       }

//       if (typeof window.Telegram !== "undefined" && window.Telegram.WebApp) {
//         window.Telegram.WebApp.ready();
//         const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
//         let phoneNumber = "";

//         if (telegramUser && telegramUser.phone_number) {
//           phoneNumber = telegramUser.phone_number.replace(/\D/g, "");
//         }

//         const inviteMessage = encodeURIComponent(
//           `Hey! Join us using this invite link: ${inviteLink}`
//         );
//         const whatsappURL = `https://wa.me/${phoneNumber}?text=${inviteMessage}`;

//         if (phoneNumber) {
//           window.Telegram.WebApp.openLink(whatsappURL);
//         } else {
//           window.Telegram.WebApp.openLink(
//             `https://wa.me/?text=${inviteMessage}`
//           );
//         }
//       } else if ("contacts" in navigator && navigator.contacts?.select) {
//         const contactProps = ["name", "tel"];
//         const contactList = await navigator.contacts.select(contactProps, {
//           multiple: true,
//         });

//         const formattedContacts = contactList.map((contact) => ({
//           name: contact.name?.[0] || "Unknown",
//           phone: contact.tel?.[0] || "No Number",
//         }));

//         setContacts(formattedContacts);

//         if (formattedContacts.length > 0) {
//           const firstContact = formattedContacts[0];
//           const phoneNumber = firstContact.phone.replace(/\D/g, "");
//           const inviteMessage = encodeURIComponent(
//             `Hey! Join us using this invite link: ${inviteLink}`
//           );
//           const whatsappURL = `https://wa.me/${phoneNumber}?text=${inviteMessage}`;
//           const intentURL = `intent://send?phone=${phoneNumber}&text=${inviteMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end;`;

//           if (/Android/i.test(navigator.userAgent)) {
//             setTimeout(() => {
//               window.location.href = intentURL;
//             }, 500);
//           } else {
//             setTimeout(() => {
//               window.open(whatsappURL, "_blank");
//             }, 300);
//           }
//         } else {
//           alert("Selected contact has no phone number.");
//         }
//       } else {
//         alert("Contact API not supported on this device.");
//       }
//     } catch (error) {
//       console.error("Error fetching contacts", error);
//     }
//   };

//   return (
//     <div className="invite-container">
//       <span className="invite-title">Folks Finance</span>
//       <div className="invite-innner-container">
//         <img src={logo} alt="Logo" />
//         <div className="invite-link-main-div">
//           <h5>Invite Link</h5>
//           <div className="invite-link-div">
//             <span>{isFetching ? "https://www.figma.com/design/mWmu9Rb8ALftqqQ6KaCrF3/Untitled?node-id=0-1&p=f&t=m9JS6gUXwP1kYIpa-0" : inviteLink}</span>{" "}
//             {/* ✅ Show Generating text */}
//             <IoCopyOutline
//               size={20}
//               onClick={copyToClipboard}
//               style={{
//                 cursor:
//                   isFetching || inviteLink.includes("Failed")
//                     ? "not-allowed"
//                     : "pointer",
//                 opacity: isFetching || inviteLink.includes("Failed") ? 0.5 : 1,
//               }}
//             />
//           </div>
//         </div>
//         <button onClick={fetchContacts} className="invite-contact-btn">
//           Invite
//         </button>
//       </div>

//       {/* ✅ Copy Success Modal */}
//       {showModal && (
//         <div className="modal-background">
//           <div className="modal-content">
//             <p>✅ Link copied to clipboard!</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Invite;

