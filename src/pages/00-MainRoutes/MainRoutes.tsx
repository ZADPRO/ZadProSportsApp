import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Redirect, Route, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

// Icons
import {
  home,
  homeOutline,
  settings,
  settingsOutline,
  location,
  locationOutline,
  add,
  addOutline,
} from "ionicons/icons";
import { football, footballOutline } from "ionicons/icons";

// Components
import Splashscreen from "../../components/00-SplashScreen/SplashScreen";
import LoginScreen from "../../components/01-LoginScreen/LoginScreen";
import SignupScreen from "../../components/02-SignupScreen/SignupScreen";
import HomeScreen from "../../components/03-HomeScreen/HomeScreen";
import GroundDescription from "../../components/05-GroundDescription/GroundDescription";
import ConfirmBooking from "../../components/06-ConfirmBooking/ConfirmBooking";
import SettingsScreen from "../../components/07-SettingsScreen/SettingsScreen";
import ProfileScreen from "../../components/08-ProfileScreen/ProfileScreen";
import OwnerSignup from "../../components/14-OwnerSignUp/OwnerSignup";
import Ownerprofile from "../../components/08-ProfileScreen/Ownerprofile";
import AddGround from "../../components/15-AddGround/AddGround";
import CreateAddOns from "../../components/15-AddGround/CreateAddOns";
import GroundSettings from "../../components/15-AddGround/GroundSettings";
import SportCategory from "../GroundSettings/SportCategory";
import Features from "../GroundSettings/Features";
import Facilities from "../GroundSettings/Facilities";
import AdditionalTips from "../GroundSettings/AdditionalTips";
import UserGuidelines from "../GroundSettings/UserGuidelines";
import AboutScreen from "../../components/09-AboutScreen/AboutScreen";
import PrivacyScreen from "../../components/10-PrivacyScreen/PrivacyScreen";
import TermsScreen from "../../components/11-TermsScreen/TermsScreen";
import BookedScreen from "../../components/12-BookedScreen/BookedScreen";
import SegmentTabs from "../../components/09-Segments/SegmentTabs ";
import ListGround from "../03-Listground/ListGround";
import OwnerGround from "../../components/05-GroundDescription/OwnerGround";
import EditGround from "../../components/15-AddGround/EditGround";
import Dashboard from "../04-Dashboard/Dashboard";
import Forgetpassword from "../../components/16-Forgetpassword/Forgetpassword";

const MainRoutes = () => {
  const location = useLocation();
  const [showTabBar, setShowTabBar] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: "#0377de" });

      return () => {
        StatusBar.setOverlaysWebView({ overlay: true });
      };
    }
  }, []);

  useEffect(() => {
    const roleID = parseInt(localStorage.getItem("roleID") || "0", 10);
    const allowedPathsFor3 = ["/home", "/settings"];
    const allowedPathsFor2 = ["/home", "/settings"];
    const allowedPathsFor4 = ["/home", "/settings", "/listground", "/segment"];

    if (roleID === 3 && allowedPathsFor3.includes(location.pathname)) {
      setShowTabBar(true);
    } else if (roleID === 4 && allowedPathsFor4.includes(location.pathname)) {
      setShowTabBar(true);
    } else if (roleID === 2 && allowedPathsFor2.includes(location.pathname)) {
      setShowTabBar(true);
    } else {
      setShowTabBar(false);
    }
  }, [location.pathname]);

  const getActiveClass = (path: string) => {
    return location.pathname === path ? "tab-selected" : "";
  };

  const getIcon = (path: string, filled: string, outline: string) => {
    return location.pathname === path ? filled : outline;
  };

  return (
    <IonTabs>
      <IonRouterOutlet id="main">
        <Route exact path="/">
          <Splashscreen />
        </Route>
        <Route exact path="/splash">
          <Splashscreen />
        </Route>
        <Route exact path="/login">
          <LoginScreen />
        </Route>
        <Route exact path="/signup">
          <SignupScreen />
        </Route>
        <Route exact path="/ownersignup">
          <OwnerSignup />
        </Route>
        <Route
          exact
          path="/home"
          render={() =>
            localStorage.getItem("token") ? (
              <HomeScreen />
            ) : (
              <Redirect to="/login" />
            )
          }
        />

        <Route exact path="/groundDescriptions">
          <GroundDescription />
        </Route>
        <Route exact path="/ownerground">
          <OwnerGround />
        </Route>
        <Route exact path="/booking">
          <ConfirmBooking />
        </Route>
        <Route exact path="/settings">
          <SettingsScreen />
        </Route>
        <Route exact path="/listground">
          <ListGround />
        </Route>
        <Route exact path="/profile">
          <ProfileScreen />
        </Route>
        <Route exact path="/ownerprofile">
          <Ownerprofile />
        </Route>
        <Route exact path="/segment">
          <SegmentTabs />
        </Route>
        {/* <Route exact path="/addground">
          <AddGround />
        </Route> */}
        <Route exact path="/editground">
          <EditGround />
        </Route>
        <Route exact path="/dashbord">
          <Dashboard />
        </Route>
        {/* <Route exact path="/addons">
            <CreateAddOns />
          </Route> */}
        <Route exact path="/groundsettings">
          <GroundSettings />
        </Route>
        <Route exact path="/forgetpassword">
          <Forgetpassword />
        </Route>
        <Route exact path="/sportscategory">
          <SportCategory />
        </Route>
        <Route exact path="/features">
          <Features />
        </Route>
        <Route exact path="/facilities">
          <Facilities />
        </Route>
        <Route exact path="/tips">
          <AdditionalTips />
        </Route>
        <Route exact path="/userguildelines">
          <UserGuidelines />
        </Route>
        <Route exact path="/about">
          <AboutScreen />
        </Route>
        <Route exact path="/privacy">
          <PrivacyScreen />
        </Route>
        <Route exact path="/terms">
          <TermsScreen />
        </Route>
        <Route exact path="/bookinghistory">
          <BookedScreen />
        </Route>
        {/* <Redirect exact from="/" to="/splash" /> */}
      </IonRouterOutlet>

      {/* Only show tab bar if roleID === 3 and path is /home or /settings */}
      {showTabBar && (
        <IonTabBar slot="bottom">
          {/* Common: Home tab */}
          <IonTabButton
            tab="home"
            href="/home"
            className={getActiveClass("/home")}
            style={{
              backgroundColor:
                location.pathname === "/home" ? "#0478df" : "#ffffff",
              color: location.pathname === "/home" ? "white" : "#0478df",
            }}
          >
            <IonIcon
              icon={getIcon("/home", home, homeOutline)}
              style={{
                color: location.pathname === "/home" ? "white" : "#0478df",
              }}
            />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          {/* RoleID 4: Ground tab */}
          {parseInt(localStorage.getItem("roleID") || "0", 10) === 4 && (
            <IonTabButton
              tab="listground"
              href="/listground"
              className={getActiveClass("/listground")}
              style={{
                backgroundColor:
                  location.pathname === "/listground" ? "#0478df" : "#ffffff",
                color:
                  location.pathname === "/listground" ? "white" : "#0478df",
              }}
            >
              <IonIcon
                icon={getIcon("/listground", football, footballOutline)}
                style={{
                  color:
                    location.pathname === "/listground" ? "white" : "#0478df",
                }}
              />
              <IonLabel>Ground</IonLabel>
            </IonTabButton>
          )}

          {/* RoleID 4: Segment tab */}
          {parseInt(localStorage.getItem("roleID") || "0", 10) === 4 && (
            <IonTabButton
              tab="segment"
              href="/segment"
              className={getActiveClass("/segment")}
              style={{
                backgroundColor:
                  location.pathname === "/segment" ? "#0478df" : "#ffffff",
                color: location.pathname === "/segment" ? "white" : "#0478df",
              }}
            >
              <IonIcon
                icon={getIcon("/segment", add, addOutline)}
                style={{
                  color: location.pathname === "/segment" ? "white" : "#0478df",
                }}
              />
              <IonLabel>Add</IonLabel>
            </IonTabButton>
          )}

          {/* Common: Settings tab */}
          <IonTabButton
            tab="settings"
            href="/settings"
            className={getActiveClass("/settings")}
            style={{
              backgroundColor:
                location.pathname === "/settings" ? "#0478df" : "#ffffff",
              color: location.pathname === "/settings" ? "white" : "#0478df",
            }}
          >
            <IonIcon
              icon={getIcon("/settings", settings, settingsOutline)}
              style={{
                color: location.pathname === "/settings" ? "white" : "#0478df",
              }}
            />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      )}
    </IonTabs>
  );
};

export default MainRoutes;
