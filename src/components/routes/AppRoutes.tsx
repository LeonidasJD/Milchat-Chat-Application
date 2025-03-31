import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AboutUs from "../pages/AboutUs/aboutUs";
import ChatRoom from "../pages/ChatRoom/chatRoom";
import Profile from "../pages/Profile/profile";
import ProtectedRoute from "../protected-route/ProtectedRoute";

const router = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          element: <MainLayout />,
          children: [
            { index: true, element: <ChatRoom /> },
            { path: "profile", element: <Profile /> },
            { path: "about", element: <AboutUs /> },
          ],
        },
      ],
    },
    { path: "/login", element: <Login /> },
  ]);
};
const AppRouter = () => <RouterProvider router={router()} />;
export default AppRouter;
