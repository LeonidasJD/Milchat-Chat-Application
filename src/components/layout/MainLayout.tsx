import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import BottomBar from "./BottomBar";
import "./mainLayout.scss";

const MainLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <SideNav />
      <main style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Outlet />
        <BottomBar />
      </main>
    </div>
  );
};

export default MainLayout;
