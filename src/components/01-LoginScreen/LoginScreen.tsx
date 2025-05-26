import { IonButton, IonContent, IonPage } from "@ionic/react";
import logo from "../../assets/images/Logo.jpg";
import "./LoginScreen.css";
import { InputText } from 'primereact/inputtext';
import { useRef } from "react";
import { Password } from 'primereact/password';
import { FaArrowRightLong } from "react-icons/fa6";
import { useHistory } from "react-router";

const LoginScreen = () => {
    const usernameRef = useRef<HTMLInputElement>(null); // ✅ CORRECT TYPING

    const handleLogin = () => {
        const username = usernameRef.current?.value;
        console.log("Username:", username);
    }

    const history = useHistory();

    return (
        <IonPage>
            <IonContent>
                <div className="bg-container">
                    <div className="cardDesign font-[poppins]">
                        <div className="w-[100%]">
                            <img src={logo} alt="Medpredit Logo" className="logo" />
                        </div>
                        <div className="mt-[1rem]">
                            <div className="text-[1.5rem] font-[600] text-center text-[#000] font-[poppins]">
                                Welcome to ZAD Sports
                            </div>
                        </div>
                        <div className="mt-[2.5rem] px-[3rem]">
                            <label htmlFor="username" className="text-[#000] font-[poppins]">Mobile Number</label>
                            <InputText
                                id="username"
                                placeholder="Enter Mobile Number"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[0.6rem] px-[3rem] w-[100%]">
                            <label htmlFor="password" className="text-[#000]">Password</label>
                            <Password
                                style={{ width: "100%" }}
                                id="password"
                                placeholder="Enter Password"
                                feedback={false}
                                toggleMask
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-[100%] h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[2rem] px-[3rem]">
                            <IonButton onClick={() => {
                                history.replace("/home");
                            }} className="custom-ion-button w-[100%] h-[2.5rem] text-[#fff] text-[1rem]">Submit</IonButton>
                        </div>
                        <div className="mt-[3rem] flex justify-center items-center gap-[0.5rem]">
                            <div onClick={() => {
                                history.push("/signup")
                            }} className="text-[1rem] text-[#000] font-[poppins] underline">Need an account ? Get Started Here</div>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LoginScreen;
