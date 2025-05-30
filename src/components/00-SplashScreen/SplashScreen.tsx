import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import logo from "../../assets/images/Logo.png"
import "./SplashScreen.css"

const Splashscreen: React.FC = () => {

    const history = useHistory();

    useEffect(() => {
        const timer = setTimeout(() => {

            if (localStorage.getItem("token")) {
                history.replace("/home")
            } else {
                history.replace("/login")
            }
        }, 3000);

        return () => clearTimeout(timer); // Clean up the timeout
    }, [history]);

    return (
        <IonPage>
            <IonContent>
                <div className="bg-container">
                    <div className="logoImage flex justify-center items-center">
                        <img style={{ width: "70%" }} src={logo} alt="Sports Logo" className="logo" />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Splashscreen;