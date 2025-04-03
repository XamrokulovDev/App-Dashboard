import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface WithAuthProps {
  children: React.ReactNode;
}

const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/register");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default WithAuth;