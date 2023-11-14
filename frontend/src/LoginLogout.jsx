
import React from "react";

/**
 * https://stackoverflow.com/questions/76001308/handle-user-inactivity-and-logout-in-react
 */

const INTERVAL_TIME = 1000 * 60 * 60;

const events = [
  "mousedown",
  "mousemove",
  "wheel",
  "keydown",
  "touchstart",
  "scroll"
];

const addListeners = (events, cb) => {
  events.forEach((event) =>
    window.addEventListener(event, cb, { passive: true })
  );

  return () => {
    events.forEach((event) =>
      window.removeEventListener(event, cb, { passive: true })
    );
  };
};

const useAuthStore = {
  getState: () => ({
    isLoggedIn: true
  })
};

const AuthenticationService = {
  refresh: (key, cb) => {
    setTimeout(cb, 3000, { data: "data" });
  }
};

const CookieService = {
  set: (key, value) => console.log("CookieService.set", { key, value }),
  remove: (key) => console.log("CookieService.remove", { key })
};

const useRefreshTokenInterval = (activeAccount, interval = INTERVAL_TIME) => {
  const intervalRef = React.useRef();
  const unlistenRef = React.useRef();
  const wasActiveRef = React.useRef(false);

  React.useEffect(() => {
    const refreshTokenInterval = (initial) => {
      if (!initial && !wasActiveRef.current) {
        console.log(
          "Inactive, clearing interval, not refreshing token",
          Date()
        );
        CookieService.remove(activeAccount);
        clearInterval(intervalRef.current);
        if (unlistenRef.current) {
          unlistenRef.current();
        }
        return;
      }
      try {
        const isLoggedIn = useAuthStore.getState().isLoggedIn;
        if (isLoggedIn) {
          console.log("Attempting token refresh", Date());
          AuthenticationService.refresh(null, (response) =>
            CookieService.set(activeAccount, response.data)
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        wasActiveRef.current = false;
      }
    };
    refreshTokenInterval(true);

    intervalRef.current = setInterval(refreshTokenInterval, interval);

    unlistenRef.current = addListeners(events, () => {
      console.log("activity");
      wasActiveRef.current = true;
    });

    return () => {
      clearInterval(intervalRef.current);
      if (unlistenRef.current) {
        unlistenRef.current();
      }
    };
  }, [activeAccount, interval]);
};

export default function LoginLogout() {
  useRefreshTokenInterval("account", 10000);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
