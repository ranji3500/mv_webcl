import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./PageHeaderBar.module.css";

interface PageHeaderBarProps {
  label?: string;
}

const PageHeaderBar: React.FC<PageHeaderBarProps> = ({ label = "" }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <div className={styles.barContentBox}>
          <IconButton
            edge="start"
            color="inherit"
            size="large"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon fontSize="large" />
          </IconButton>
          <h6 className={styles.label}>{label}</h6>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeaderBar;
