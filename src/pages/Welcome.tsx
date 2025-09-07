import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import foodDeliveryImg from "../assets/food-delivery.png";
import logo from "/src/assets/mb-logo-center.svg";
import styles from "/src/styles/Welcome.module.css";
import { PageHeadingLabel } from "../components";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.welcomePageContainer} container d-flex flex-column justify-content-between`}
    >
      <div
        className={`${styles.imgBlock} d-flex flex-column align-items-center`}
      >
        <img src={logo} alt="Moving Bazaar logo" />
        <img src={foodDeliveryImg} alt="Food delivery Image" />
      </div>
      <PageHeadingLabel
        heading="Your favorite stores, closer than ever!"
        highlightedWords={["Your favorite stores,"]}
        className={`${styles.welcomeText} text-center`}
      />
      <div className={`${styles.btnBlock} d-flex flex-column`}>
        <Button
          className={styles.btn}
          variant="contained"
          size="large"
          onClick={() => navigate("/login")} // Navigate to /login
        >
          Get Started
        </Button>
        <Button className={styles.btn} variant="outlined" size="large"  onClick={() => navigate("/register")}>
          Create account
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
