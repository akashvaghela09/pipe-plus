import { useEffect } from 'react';
import './App.css';
import { Footer, Header, Sidepanel } from './components';
import { AllRoutes } from './routes';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getSession, isValid, updateOnboardingStatus, saveData } from './utils';
import { setAuthStatus, setUser } from './redux/auth/actions';
import { setDeviceType } from './redux/app/actions';
import { useLocation } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const { deviceType } = useSelector(state => state.app);

  const checkAuthStatus = async () => {

    const session = await getSession();

    if (!isValid(session)) {
      dispatch(setAuthStatus(false));
      console.log("User is not authenticated");
      return;
    }

    const user = await getUser();

    if (isValid(session) && isValid(user)) {
      const { aud, id, email, user_metadata } = user;

      if (!isValid(user_metadata.onboarded)) {
        console.log("Onboarding user");
        await updateOnboardingStatus(id, email);
      }

      if (aud === "authenticated") {
        dispatch(setAuthStatus(true));
        dispatch(setUser({ id: id, email: email }));
        saveData("user", { id: id, email: email });
        console.log("User authenticated");
      } else {
        dispatch(setAuthStatus(false));
        console.log("User is not authenticated");
      }
    } else {
      dispatch(setAuthStatus(false));
      console.log("User is not authenticated");
    }
  }

  const checkDeviceType = async () => {
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    if (isMobileDevice()) {
      dispatch(setDeviceType("mobile"));
      saveData("deviceType", "mobile");
    } else {
      saveData("deviceType", "desktop");
    }
  }

  const allowedRoutes = [
    "/",
    "/trending",
    "/subscriptions",
    "/subscriptions-list",
    "/channel-groups",
    "/library",
    "/watch",
    "/channel",
  ]

  function isPathAllowed(path) {
    if (allowedRoutes.includes(path)) return true;
    if (path.startsWith("/channel/")) return true;
    return false;
  }

  useEffect(() => {
    checkAuthStatus();
    checkDeviceType();
  }, []);

  return (
    <div className="App flex flex-col pb-16">
      <Header />
      <Sidepanel />
      <AllRoutes />

      {
        isPathAllowed(currentPath) === true && <Footer />
      }
    </div>
  );
}

export default App;
