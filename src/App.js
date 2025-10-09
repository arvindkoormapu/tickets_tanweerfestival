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
import Privacy from "./pages/Privacy";
import OrderDetails from "./pages/OrderDetails";
import useGtm from './utils/PageTracker';
import StoreMobileNumber from './pages/StoreMobileNumber'
import PurchaseFromTicket from './pages/PurchaseFromTicket'
import SearchTicket from './pages/SearchTicket'

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
    { path: "/privacy-policy", page: Privacy },
    { path: "/order-details", page: OrderDetails },
    { path: "/complete-profile", page: StoreMobileNumber },
    { path: "/addons", page: PurchaseFromTicket },
    { path: "/search", page: SearchTicket }
  ];

  // Load MPGS script early for faster checkout
  useEffect(() => {
    clarity.init("j4a22d7wbp");
    
    // Load MPGS script in background
    const loadMPGSScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src*="checkout.min.js"]')) {
        console.log('🔄 MPGS script already exists');
        return;
      }

      console.log('🚀 Preloading MPGS script in App.js...');
      
      const script = document.createElement('script');
      script.src = 'https://ap-gateway.mastercard.com/static/checkout/checkout.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ MPGS script preloaded successfully');
        // Check if window.Checkout is available
        if (window.Checkout && typeof window.Checkout.configure === 'function') {
          console.log('✅ window.Checkout is ready and available globally');
        }
      };
      
      script.onerror = () => {
        console.warn('⚠️ MPGS script preload failed, will retry when needed');
      };
      
      document.head.appendChild(script);
    };

    // Load script after a short delay to not block initial render
    setTimeout(loadMPGSScript, 1000);
  }, []);

  return (
    <Router>
       <PageTracker />
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

const PageTracker = () => {
  useGtm(); 
  return null;
};
