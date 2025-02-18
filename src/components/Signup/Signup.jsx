import React, { useState } from "react";
import "./Signup.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
// import { FaEyeLowVision } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";
import { RxEyeClosed } from "react-icons/rx";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="signup-container">
       <div className="gradient-container"></div>
      <img src={logo} className="signupImage" />
      <div className="signup-inner-container">
        <input placeholder="Enter Name" className="input1" />
        <input placeholder="Enter Email" className="input1" />
        <input placeholder="Enter wallet Address" className="input1" />
        <div className="input12">
          {" "}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
          />
          <span onClick={togglePasswordVisibility}>
            {showPassword ? (
              <FaEye color="#3669bb" size={20} />
            ) : (
              <RxEyeClosed color="#3669bb" size={20} />
            )}
          </span>
        </div>

        <div className="input12">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter Confirm Password"
          />
          <span onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? (
              <FaEye color="#3669bb" size={20}  />
            ) : (
             <RxEyeClosed color="#3669bb" size={20} />
            )}
          </span>
        </div>
      </div>
      <button className="signup-button">Sign Up</button>
      <p className="signedup-text">
        Already Signed up? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
