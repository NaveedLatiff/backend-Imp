import PublicRoute from "./assets/routes/publicRoute.jsx";
import Login from "./assets/pages/login";
import Home from "./assets/pages/home";
import VerifyEmail from "./assets/pages/verifyEmail";
import ResetPassword from "./assets/pages/resetPassword";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          }
        />

        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
