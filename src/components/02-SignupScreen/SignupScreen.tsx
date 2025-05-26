import { IonButton, IonContent, IonHeader, IonPage } from "@ionic/react";
import logo from "../../assets/images/Logo.jpg";
import { InputText } from 'primereact/inputtext';
import { useRef } from "react";
import { Password } from 'primereact/password';
import { useHistory } from "react-router";
import { FaArrowLeft, FaArrowLeftLong } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";

const SignupScreen = () => {
    const usernameRef = useRef<HTMLInputElement>(null); // ✅ CORRECT TYPING

    const handleLogin = () => {
        const username = usernameRef.current?.value;
        console.log("Username:", username);
    }

    const history = useHistory();

    return (
        <IonPage>
            {/* <IonHeader>
                <div className="text-[#000] bg-[#fff] h-[5vh] bg-[red] text-[1.3rem]">
                    <FaArrowLeft />
                </div>
            </IonHeader> */}
            <IonContent>
                <div className="bg-[#fff] w-[100%] h-[100vh] overflow-auto">
                    <div className="text-[#242424] bg-[#fff] px-[2rem] py-[1rem] text-[1.3rem]">
                        <div><IoIosArrowBack className="text-[1.5rem]" onClick={() => { history.goBack() }} /></div>
                    </div>
                    <div className="cardDesign font-[poppins]">
                        <div className="w-[100%]">
                            <img src={logo} alt="Medpredit Logo" className="logo" />
                        </div>
                        <div className="mt-[1rem]">
                            <div className="text-[1.5rem] font-[600] text-center text-[#000] font-[poppins]">
                                Register Account
                            </div>
                        </div>
                        <div className="mt-[2.5rem] px-[3rem]">
                            <label htmlFor="username" className="text-[#000] font-[poppins]">First Name</label>
                            <InputText
                                id="username"
                                placeholder="Enter First Name"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[0.6rem] px-[3rem] w-[100%]">
                            <label htmlFor="username" className="text-[#000] font-[poppins]">Last Name</label>
                            <InputText
                                id="username"
                                placeholder="Enter Last Name"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[0.6rem] px-[3rem] w-[100%]">
                            <label htmlFor="username" className="text-[#000] font-[poppins]">Mobile Number</label>
                            <InputText
                                id="username"
                                placeholder="Enter Mobile Number"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[0.6rem] px-[3rem] w-[100%]">
                            <label htmlFor="password" className="text-[#000]">Email</label>
                            <InputText
                                id="username"
                                placeholder="Enter Email"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[2rem] px-[3rem] pb-[3rem]">
                            <IonButton className="custom-ion-button w-[100%] h-[2.5rem] text-[#fff] text-[1rem]">Register</IonButton>
                        </div>
                    </div>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default SignupScreen;
