import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import logo from "../../assets/images/Logo.jpg"
import "./SplashScreen.css"

const Splashscreen: React.FC = () => {

    const history = useHistory();

    useEffect(() => {
        const timer = setTimeout(() => {
            history.replace("/login")
        }, 3000);

        return () => clearTimeout(timer); // Clean up the timeout
    }, [history]);

    return (
        <IonPage>
            <IonContent>
                <div className="bg-container">
                    <div className="logoImage ">
                        <img src={logo} alt="Medpredit Logo" className="logo" />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Splashscreen;