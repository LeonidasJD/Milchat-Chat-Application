import "./bottomBar.scss";
import { NavLink } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import { Typography } from "antd";

const BottomBar = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}
    >
      <Footer>
        <Typography.Paragraph className="paragraph">
          &copy; Powered By Milan 2024{" "}
          <NavLink to="https://github.com/LeonidasJD" target="_blank">
            github.com/LeonidasJD
          </NavLink>
        </Typography.Paragraph>
      </Footer>
    </div>
  );
};

export default BottomBar;
