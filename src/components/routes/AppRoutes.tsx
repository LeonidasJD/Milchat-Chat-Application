import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AboutUs from "../pages/AboutUs/aboutUs";
import ChatRoom from "../pages/ChatRoom/chatRoom";
import Profile from "../pages/Profile/profile";
import Statistics from "../pages/Statistics/statistics";

const router = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <ChatRoom /> },
        { path: "profile", element: <Profile /> },
        { path: "about", element: <AboutUs /> },
        { path: "statistics", element: <Statistics /> },
      ],
    },
    { path: "/login", element: <Login /> },
  ]);
};
const AppRouter = () => <RouterProvider router={router()} />;
export default AppRouter;
