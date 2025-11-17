import { useAuthContext } from "../contexts/AuthContext";

function Hero() {
  const { isAuthenticated } = useAuthContext();

  return <div>Hero</div>;
}

export default Hero;
