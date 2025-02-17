import React, { useEffect, useState } from "react";
import "./ProfileUpdate.css";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const apiIp=process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const walletAddress = localStorage.getItem("walletAddress");
  const [form, setForm] = useState({
    walletAddress: walletAddress,
    firstName: "",
    lastName: "",
    email: "",
  });


  const [isEmailEditable, setIsEmailEditable] = useState(true);
console.log('walletAddress From Profile===', walletAddress)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${apiIp}api/updateUser`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "wallet-address": walletAddress
        },
        body: JSON.stringify(form),
      });
      console.log(response);
      if (response.status === 200) {
        alert("Form data submitted successfully");
        navigate('/')
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`${apiIp}api/user`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "wallet-address": `${walletAddress}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log("User data:", result);

        setForm((prevForm) => ({
          ...prevForm,
          firstName: result.user.firstName || "",
          lastName: result.user.lastName || "",
          email: result.user.email || "",
        }));

        // If email is empty, allow editing. Otherwise, make it read-only.
        setIsEmailEditable(!result.user.email);
      } else {
        console.error("Failed to fetch user data");
      }
    };

    getData();
  }, []);

  return (
    <div className="profile-main-container">
      <span className="profile-title">Folks Finance</span>
      <div className="profile-container">
        <h4 className="update-profile-text">Update Profile</h4>
        <form className="form-container" onSubmit={formSubmit}>
          <div className="first-last-div">
            <div className="first-div">
              <p>First Name</p>
              <input
                placeholder="John"
                name="firstName"
                value={form.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="first-div">
              <p>Last Name</p>
              <input
                placeholder="Doe"
                name="lastName"
                value={form.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="email-div">
            <p>Email</p>
            <input
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              readOnly={!isEmailEditable} // Email is only editable if it was empty initially
            />
          </div>

          <button className="update-button" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
