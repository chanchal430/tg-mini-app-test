import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./Login.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonAddress } from "@tonconnect/ui-react";

const Login = () => {
  const navigate = useNavigate();
  const userFriendlyAddress = useTonAddress(); 

  
  useEffect(() => {
    if (userFriendlyAddress) {
      navigate("/home"); 
    }
  }, [userFriendlyAddress, navigate]);

  return (
    <div className="login-container">
      <div className="gradient-container"></div>
      <img src={logo} className="loginImage" alt="Logo" />
      <div className="login-inner-container">
        <h4 className="login-title">Folks Finance</h4>
        <p className="login-tagline">Connect, Complete Tasks & Earn Crypto Rewards Instantly!</p>
        {/* <TonConnectButton /> */}
      </div>
    </div>
  );
};

export default Login;



// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../../assets/images/logo.png";
// import "./Login.css";
// import { FcGoogle } from "react-icons/fc";
// import { MdFacebook } from "react-icons/md";
// import { VscTwitter } from "react-icons/vsc";
// import { FaEyeLowVision } from "react-icons/fa6";
// import { FaEye } from "react-icons/fa6";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };
//   return (
//     <div className="login-container">
//       <img src={logo} className="loginImage" />
//       <div className="login-inner-container">
//         <input placeholder="econev@gmail.com" className="input1" />
//         <div className="input12">
//           {" "}
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter Password"
//           />
//           <span onClick={togglePasswordVisibility}>
//             {showPassword ? (
//               <FaEye color="#fff" />
//             ) : (
//               <FaEyeLowVision color="#fff" />
//             )}
//           </span>
//         </div>
//         <div className="forgot-div">
//           <span className="login-span">
//             <label className="custom-checkbox">
//               <input type="checkbox" id="rememberMe" />
//               <span className="checkbox-mark"></span>
//               Remember Me
//             </label>
//           </span>
//           <p>Forgot Password ?</p>
//         </div>

//         <button className="login-button" onClick={() => navigate("/home")}>
//           Login
//         </button>
//       </div>
//       <div className="continue-with-div">
//         <hr />
//         <p>Or continue with</p>
//         <hr />
//       </div>
//       <div className="login-icons-container">
//         <FcGoogle size={30} className="icon-google" />
//         <MdFacebook size={30} color="#6B9CFF" className="icon-google" />
//         <VscTwitter size={30} color="#6B9CFF" className="icon-google" />
//       </div>
//       <p className="new-user-text">
//         New User? <Link to="/signup">Sign Up</Link>
//       </p>
//     </div>
//   );
// };

// export default Login;
