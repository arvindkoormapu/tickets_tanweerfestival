import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Events from "./pages/Events";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Ticket from "./pages/Ticket";
import LoginRedirect from "./pages/Login-Redirect";
import TC from "./pages/TC";

export default function App() {
  const routes = [
    { path: "/", page: Events },
    { path: "/signin", page: SignIn },
    { path: "/signup", page: SignUp },
    { path: "/forgot-password", page: ForgotPassword },
    { path: "/reset-password", page: ResetPassword },
    { path: "/events", page: Events },
    { path: "/profile", page: Profile },
    { path: "/view-ticket/:purchase_number", page: Ticket },
    { path: "/login-redirect", page: LoginRedirect },
    { path: "/terms-conditions", page: TC },
  ];

  useEffect(() => {
    clarity.init("j4a22d7wbp");
  }, []);

  return (
    <Router>
      <ScrollToTop>
        <div className="flex-1 select-none max-w-[550px] m-auto 	">
          <Routes>
            {routes.map((route, idx) => (
              <Route key={idx} path={route.path} element={<route.page />} />
            ))}
          </Routes>
        </div>
      </ScrollToTop>
    </Router>
  );
}
