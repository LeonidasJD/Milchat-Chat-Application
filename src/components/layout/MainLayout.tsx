import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import BottomBar from "./BottomBar";
import "./mainLayout.scss";

const MainLayout = () => {
  return (
    <div className="main-layout" style={{ display: "flex" }}>
      <SideNav />
      <main className="main-content">
        <Outlet />
        <BottomBar />
      </main>
    </div>
  );
};

export default MainLayout;
