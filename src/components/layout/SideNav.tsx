import "./sideNav.scss";
import useLogin from "../pages/Login/useLogin.tsx";
import Button from "../common/button.tsx";
import { NavLink } from "react-router-dom";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import useMediaQuery from "../../hooks/useMediaQuery.ts";
import { useState } from "react";

const SideNav = () => {
  const { onSubmitLogout } = useLogin();
  const { isMobile } = useMediaQuery();
  const [isOpen, setIsOpen] = useState(false);

  const active = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active-link" : "";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && (
        <button className="menu-button" onClick={toggleMenu}>
          {isOpen ? <IoMdClose size={30} /> : <IoMdMenu size={30} />}
        </button>
      )}

      <motion.nav
        initial={{ x: isMobile ? "-100%" : 0 }}
        animate={{ x: isMobile && isOpen ? "0%" : isMobile ? "-100%" : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {isMobile && (
          <div>
            <button className="close-button" onClick={toggleMenu}>
              <IoMdClose color="white" size={30} />
            </button>
          </div>
        )}

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li onClick={toggleMenu}>
            <NavLink to="/" className={active}>
              Chat Room
            </NavLink>
          </li>
          <li onClick={toggleMenu}>
            <NavLink to="/profile" className={active}>
              Profile
            </NavLink>
          </li>
          <li onClick={toggleMenu}>
            <NavLink to="/about" className={active}>
              About Creator
            </NavLink>
          </li>
          <li onClick={toggleMenu}>
            <NavLink to="/statistics" className={active}>
              Statistics
            </NavLink>
          </li>
        </ul>
        <Button color="dark" text="Logout" onClick={() => onSubmitLogout()} />
      </motion.nav>
    </>
  );
};

export default SideNav;
