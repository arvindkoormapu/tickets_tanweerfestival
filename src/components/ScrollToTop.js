import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = (props) => {
  const location = useLocation();
  useEffect(() => {
    window.scroll({ behavior: "smooth", top: 0 });
  }, [location]);

  return <>{props.children}</>;
};

export default ScrollToTop;
