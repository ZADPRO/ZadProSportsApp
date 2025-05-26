import { IonRouterOutlet, IonTabs } from "@ionic/react"
import { Route } from "react-router"
import Splashscreen from "../../components/00-SplashScreen/SplashScreen"
import LoginScreen from "../../components/01-LoginScreen/LoginScreen"
import SignupScreen from "../../components/02-SignupScreen/SignupScreen"
import HomeScreen from "../../components/03-HomeScreen/HomeScreen"
import GroundDescription from "../../components/05-GroundDescription/GroundDescription"
import ConfirmBooking from "../../components/06-ConfirmBooking/ConfirmBooking"
import SettingsScreen from "../../components/07-SettingsScreen/SettingsScreen"
import { useEffect } from "react"
import { StatusBar, Style } from "@capacitor/status-bar"
import ProfileScreen from "../../components/08-ProfileScreen/ProfileScreen"

const MainRoutes = () => {

    useEffect(() => {
        const configureStatusBar = async () => {
            await StatusBar.setOverlaysWebView({ overlay: false }); // <-- This prevents overlay
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: '#0377de' });
            await StatusBar.show();
        };

        configureStatusBar();
    }, []);

    return (
        <IonTabs>
            <IonRouterOutlet id="main">
                <Route exact path="/">
                    <Splashscreen />
                </Route>
                <Route exact path="/login">
                    <LoginScreen />
                </Route>
                <Route exact path="/signup">
                    <SignupScreen />
                </Route>
                <Route exact path="/home">
                    <HomeScreen />
                </Route>
                <Route exact path="/groundDescriptions">
                    <GroundDescription />
                </Route>
                <Route exact path="/booking">
                    <ConfirmBooking />
                </Route>
                <Route exact path="/settings">
                    <SettingsScreen />
                </Route>
                <Route exact path="/profile">
                    <ProfileScreen />
                </Route>
            </IonRouterOutlet>
        </IonTabs>
    )
}

export default MainRoutes