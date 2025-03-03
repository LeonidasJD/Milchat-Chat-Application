import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  //currentUser jesu podaci koji se posalju u redux kada je korisnik logovan , ako ima podataka onda znaci da je korisnik logovan i pusta se u app
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
