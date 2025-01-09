import AppRouter from "./components/routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <AppRouter />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
