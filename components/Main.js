import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";

const Main = () => {
  const { isSignedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const routing = useRoute(isSignedIn);

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;
