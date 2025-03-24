import React from "react";
import { useState, useContext } from "react";
import { Button, Typography, IconButton, TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import { auth } from "../Firebase/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import Loginimage from "/src/assets/FWTLogo.jpg";
// import Loginimage from "/src/assets/loginPage.png";
// import Loginimage from "/src/assets/MainScreen.jpg";
import logo from "/src/assets/FWTLogo.png";
import Loginimage1 from "/src/assets/home_slider5-new.jpg";
import { GlobalContext } from "../Context/context";
import "./styles.css";
import Footer from "../Components/Footer/Footer";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("Please enter your Email and Password");
  const navigate = useNavigate();
  const { state, dispatch } = useContext(GlobalContext);

  const setEmailHandler = (email) => {
    dispatch({ type: "SET_EMAIL", payload: email });
  };

  // console.log("email : ",email);
  // console.log("password : ",password);

  const handleSubmit = (e) => {
    e.preventDefault();
    // navigate("/dashboard");

    // signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     // console.log("userCredential Email : ",userCredential.user.email);
    //     // console.log("userCredential UID : ",userCredential.user.uid);

    //     setEmailHandler(userCredential.user.email);
    //     if (userCredential) {
    //       navigate("/dashboard");
    //     } else {
    //       navigate("/");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     if (error.code === "auth/wrong-password") {
    //       setMessage("Please check your Password");
    //     } else if (error.code === "auth/user-not-found") {
    //       setMessage("Please register before logging in");
    //     } else if (error.code === "auth/network-request-failed") {
    //       setMessage("Please check your internet connection");
    //     } else if (error.code === "auth/invalid-email") {
    //       setMessage("The email is invalid");
    //     } else {
    //       setMessage("Please try again");
    //     }
    //   });

    navigate("/dashboard");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100vh",
        // backgroundImage: `url(${Loginimage1})`,
        // backgroundPosition: "bottom",
        // backgroundSize: "100% 110%",
        // backgroundRepeat: "no-repeat",
      }}>
      {/* logo */}
      <div>
        <img
          src={logo}
          height="350px"
          width="350px"
          style={{ objectFit: "contain", marginTop: "" }}
        />
      </div>

      {/* Vertical Line */}
      <div style={{ height: "80%", borderRight: "2px solid #007a37" }}></div>

      {/* Login Box */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "3%",
          borderRadius: "4%",
          //   border: "solid",
          //   borderColor: "black",
          borderWidth: "1%",
          backgroundColor: "#007a37",
          height: "400px",
          width: "400px",
        }}>
        <Typography
          variant="h6"
          color={"white"}
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "5%",
          }}
          // alignContent="center"
          textAlign={"center"}>
          SENSEOPS
        </Typography>

        <TextField
          variant="filled"
          fullWidth
          label="Email"
          //   placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <PersonIcon color="success" />
              </IconButton>
            ),
          }}
          margin="normal"
          style={{ backgroundColor: "white", borderRadius: "5px" }}
          color="success"
        />

        <TextField
          variant="filled"
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Password"
          //   placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleTogglePassword}>
                {showPassword ? (
                  <VisibilityOffIcon color="success" />
                ) : (
                  <VisibilityIcon color="success" />
                )}
              </IconButton>
            ),
          }}
          margin="normal"
          style={{ backgroundColor: "white", borderRadius: "5px" }}
          color="success"
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2% 0% 2%",
          }}>
          <Typography color={"white"} variant="body2" style={{ marginTop: "5%" }}>
            {message}
          </Typography>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{
              color: "white",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}>
            LOGIN
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Loginpage;
// background-color: #d3d3d3;
// background-image: linear-gradient(315deg, #d3d3d3 0%, #7bed9f 74%);
