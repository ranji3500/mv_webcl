import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import logo from "/src/assets/logo-v1.svg";
import styles from "/src/styles/Login.module.css";
import { PageHeadingLabel } from "../components";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useLoader } from "../contexts/LoaderContext";
import { useAuth } from "../contexts/AuthContext";
import { LocalStorageKeys } from "../enums/common.enums";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [tempUserId, setTempUserId] = useState<string>("");

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  const handleSendOtp = async () => {
    setErrorMessage("");

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    if (phone.length < 8 || phone.length > 15) {
      setErrorMessage("Phone number must be 8 to 15 digits");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    showLoader();

    try {
      // 🔸 Call register API
      const res = await axios.post(`${API_BASE_URL}/send_otp`, {
        fullName: fullName,
        email: email,
        phone: phone,
        password: password
      });
      if (res.status === 'Success') {
        setOtpSent(true);
        setInputsDisabled(true);

      } else {
        setOtpSent(false);
        setInputsDisabled(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to send OTP / Register. Try again.");
    } finally {
      hideLoader();
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMessage("OTP is required");
      return;
    }

    try {

      const res = await axios.post(`${API_BASE_URL}/verify_otp`, {
        email: email,
        otp: otp,
        fullName: fullName,
        phone: phone,
        password: password

      });

      console.log(res);
      if (res.status === "Success") {
        navigate('/login')
      }
    } catch (err) {

      console.error(err);
      setErrorMessage("OTP verification failed. Try again.");
    } finally {

      // hideLoader();
    }
  };

  return (
    <div className={`${styles.loginContainer} container bg-white d-flex flex-column`}>
      <div className={styles.logoBox}>
        <img src={logo} alt="Moving Bazaar logo" />
      </div>

      <div className={`${styles.loginMainSection} d-flex flex-column`}>
        <div className={styles.loginTextBox}>
          <PageHeadingLabel
            heading="Create a New Account"
            highlightedWords={["New Account"]}
            className="text-left"
          />
          <p className="fs16 codGray600 lh-1-4">Enter your details to register</p>
        </div>

        <TextField
          fullWidth
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your name"
          variant="outlined"
          size="medium"
          disabled={inputsDisabled}
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          variant="outlined"
          size="medium"
          disabled={inputsDisabled}
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          label="Phone Number"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Enter phone number"
          variant="outlined"
          size="medium"
          disabled={inputsDisabled}
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          variant="outlined"
          size="medium"
          type={showPassword ? "text" : "password"}
          disabled={inputsDisabled}
          sx={{ mb: 1.5 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword}>
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          variant="outlined"
          size="medium"
          type={showPassword ? "text" : "password"}
          disabled={inputsDisabled}
          sx={{ mb: 1.5 }}
        />

        {/* OTP Input */}
        {otpSent && (
          <>
            <TextField
              fullWidth
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              variant="outlined"
              size="medium"
              sx={{ mb: 1.5 }}
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleVerifyOtp}
              sx={{ mt: 1.5 }}
            >
              Verify OTP
            </Button>
          </>
        )}

        {/* Send OTP Button */}
        {!otpSent && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSendOtp}
            sx={{ mt: 1.5 }}
          >
            Send OTP
          </Button>
        )}

        {/* Error */}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <p style={{ textAlign: "center", fontSize: "20px" }}>
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
