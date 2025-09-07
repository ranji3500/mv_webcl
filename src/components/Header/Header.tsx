import logo from "/src/assets/logo-v1.svg";
import styles from "./Header.module.css";
import { useAuth } from "../../contexts/AuthContext";
import UserProfileMenu from "../UserProfileMenu";

const Header = () => {
  const { user } = useAuth();

  return (
    <div className={styles.headerBox}>
      <img src={logo} alt="Moving Bazaar Logo" />
      {user ? <UserProfileMenu userDetails={user} /> : null}
    </div>
  );
};

export default Header;
