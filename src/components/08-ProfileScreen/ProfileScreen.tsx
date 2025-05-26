import { IonButton, IonContent, IonHeader, IonPage } from "@ionic/react";
import { useRef } from "react";
import { useHistory } from "react-router";
import Ground1 from "../../assets/images/Ground1.png"
import Ground2 from "../../assets/images/Ground2.png"
import Ground3 from "../../assets/images/Ground3.png"
import Ground4 from "../../assets/images/Ground4.png"
import GroundCards from "../../pages/01-GroundCards/GroundCards";
import NextPageCards from "../../pages/01-GroundCards/NextPageCard";
import Account from "../../assets/images/Account.png"
import { IoIosArrowBack } from "react-icons/io";
import { InputText } from "primereact/inputtext";


const ProfileScreen = () => {

    const history = useHistory();

    const usernameRef = useRef<HTMLInputElement>(null); // ✅ CORRECT TYPING

    const handleLogin = () => {
        const username = usernameRef.current?.value;
        console.log("Username:", username);
    }

    return (
        <IonPage>
            <IonHeader>
                <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] h-[8vh] text-[1.3rem]">
                    <div><IoIosArrowBack className="text-[1.5rem]" onClick={() => { history.goBack() }} /></div>
                    <div className="text-[1.2rem] font-[poppins] font-[500] text-[#fff] ml-[-1.2rem]">Profile</div>
                    <div></div>
                </div>
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] h-[92vh] overflow-auto px-[0rem] py-[0rem]">
                    <div className="w-[100%]">
                        <div className="mt-[1rem] px-[2rem]">
                            <label htmlFor="username" className="text-[#000] font-[poppins]">First Name</label>
                            <InputText
                                id="username"
                                placeholder="Enter First Name"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[0.6rem] px-[2rem] w-[100%]">
                            <label htmlFor="username" className="text-[#000] font-[poppins]">Last Name</label>
                            <InputText
                                id="username"
                                placeholder="Enter Last Name"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[0.6rem] px-[2rem] w-[100%]">
                            <label htmlFor="username" className="text-[#000] font-[poppins]">Mobile Number</label>
                            <InputText
                                id="username"
                                placeholder="Enter Mobile Number"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                        <div className="mt-[0.6rem] px-[2rem] w-[100%]">
                            <label htmlFor="password" className="text-[#000]">Email</label>
                            <InputText
                                id="username"
                                placeholder="Enter Email"
                                ref={usernameRef}
                                className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <IonButton
                            style={{ position: "fixed", bottom: "0px", zIndex: 9999 }}
                            onClick={() => {
                            }} className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[1rem] font-[poppins]">Save Profile</IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ProfileScreen;
