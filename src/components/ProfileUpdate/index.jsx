/** 3P Dependecies */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/** Styles */
import "./styles.module.css";

const ProfileUpdate = () => {
  const apiIp=process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const telegramUserId = localStorage.getItem("telegramUserId");
  const [form, setForm] = useState({

    firstName: "",
    lastName: "",
    email: "",
  });


  const [isEmailEditable, setIsEmailEditable] = useState(true);

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
      const response = await fetch(`${apiIp}/api/updateUser`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "telegram-id": telegramUserId
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
      const response = await fetch(`${apiIp}/api/user`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "telegram-id": `${telegramUserId}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log("User data:", result);

        setForm((prevForm) => ({
          ...prevForm,
          firstName: result.data.firstName || "",
          lastName: result.data.lastName || "",
          email: result.data.email || "",
        }));

        setIsEmailEditable(!result.data.email);
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
              readOnly={!isEmailEditable} 
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
