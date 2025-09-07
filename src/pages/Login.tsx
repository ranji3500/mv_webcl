import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, IconButton, InputAdornment } from "@mui/material";
import logo from "/src/assets/logo-v1.svg";
import styles from "/src/styles/Login.module.css";
import { PageHeadingLabel } from "../components";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useLoader } from "../contexts/LoaderContext";
import { useAuth } from "../contexts/AuthContext";
import { LocalStorageKeys } from "../enums/common.enums";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoginResponse {
  userId: number;
  userName: string;
  email: string;
  userType: string;
  profileImageRequestPath: string;
  accessToken: string;
}

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  const [errorMessage, setErrorMessage] = useState("");

  // Toggle Password Visibility
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  // Handle Login
  const handleLogin = async () => {
    showLoader();
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/employee/login_employee`,
        { email, password }
      );

      const {
        userId: loggedInUserId,
        userName,
        userType,
        accessToken,
      } = response.data as LoginResponse;

      if (loggedInUserId && accessToken) {
        localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, accessToken);

        setAuth(true, {
          userId: loggedInUserId,
          userName: userName,
          email,
          profileImageRequestPath: "",
          userType: userType,
        });
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Invalid credentials");
    } finally {
      hideLoader();
    }
  };

  return (
    <div
      className={`${styles.loginContainer} container bg-white d-flex flex-column`}
    >
      {/* Logo Section */}
      <div className={styles.logoBox}>
        <img src={logo} alt="Moving Bazaar logo" />
      </div>

      {/* Login Form Section */}
      <div className={`${styles.loginMainSection} d-flex flex-column`}>
        <div className={styles.loginTextBox}>
          <PageHeadingLabel
            heading="Sign in to your Account"
            highlightedWords={["Sign in"]}
            className="text-left"
          />
          <p className="fs16 codGray600 lh-1-4">
            Enter your email and password to log in to your account
          </p>
        </div>

        {/* Email Field */}
        <TextField
          fullWidth
          label="Email"
          placeholder="Enter your email"
          variant="outlined"
          size="medium"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Field */}
        <TextField
          fullWidth
          label="Password"
          placeholder="Enter password"
          variant="outlined"
          size="medium"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword}>
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error Message */}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        {/* Login Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      <p style={{textAlign:'center',fontSize:'20px'}}>
  Don’t have an account?{" "}
  <Link to="/register">Register here</Link>
</p>

      </div>
    </div>
  );
};

export default Login;
