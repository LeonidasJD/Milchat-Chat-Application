import "./sideNav.scss";
import useLogin from "../pages/Login/useLogin.tsx";
import Button from "../common/button.tsx";
import { NavLink } from "react-router-dom";

const SideNav = () => {
  const { onSubmitLogout } = useLogin();

  const active = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active-link" : "";

  return (
    <nav>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <NavLink to="/" className={active}>
            Chat Room
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={active}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={active}>
            About Creator
          </NavLink>
        </li>
        <li>
          <NavLink to="/statistics" className={active}>
            Statistics
          </NavLink>
        </li>
      </ul>
      <Button color="dark" text="Logout" onClick={() => onSubmitLogout()} />
    </nav>
  );
};

export default SideNav;
