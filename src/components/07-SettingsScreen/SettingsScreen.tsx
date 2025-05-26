import { IonContent, IonHeader, IonPage } from "@ionic/react";
import { useRef } from "react";
import { useHistory } from "react-router";
import { IoIosArrowBack, IoIosArrowForward, IoIosLogOut } from "react-icons/io";
import Account from "../../assets/images/Account.png"
import { FiUser } from "react-icons/fi";
import { RiHistoryFill } from "react-icons/ri";
import { FaMedapps } from "react-icons/fa6";

const SettingsScreen = () => {
    const usernameRef = useRef<HTMLInputElement>(null); // ✅ CORRECT TYPING

    const handleLogin = () => {
        const username = usernameRef.current?.value;
        console.log("Username:", username);
    }

    const history = useHistory();


    return (
        <IonPage>
            <IonHeader>
                <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] h-[8vh] text-[1.3rem]">
                    <div><IoIosArrowBack className="text-[1.5rem]" onClick={() => { history.goBack() }} /></div>
                    <div className="text-[1.2rem] font-[poppins] font-[500] text-[#fff] ml-[-1.2rem]">Account</div>
                    <div></div>
                </div>
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] h-[92vh] overflow-auto px-[1rem] py-[1rem]">
                    <div className="w-[100%] flex gap-[1rem] items-center bg-[#a9d6ff] rounded-[10px] p-[10px]" style={{ border: "1.5px solid #0377de" }}>
                        <div>
                            <div className="w-[5rem] h-[5rem] rounded-[50%] bg-[#f8d110] flex justify-center items-center" onClick={() => { history.push("/settings") }}> <img style={{ width: "4.5rem", height: "4.5rem" }} className="rounded-[50%]" src={Account} alt="account" /></div>
                        </div>
                        <div>
                            <div className="text-[1rem] font-[poppins] text-[#282828] font-[600]">Hello👋,</div>
                            <div className="text-[1rem] font-[poppins] text-[#282828] font-[600]">Gokul Moorthy</div>
                        </div>
                    </div>

                    <div className="w-[100%] mt-[0.8rem] bg-[#f7f7f7] rounded-[10px] p-[10px]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                        <div className="text-[1rem] font-[poppins] text-[#282828] font-[600]">Account</div>
                        <div className="mt-[0.8rem] mb-[0.4rem] flex justify-between" onClick={() => { history.push("/profile") }}>
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><FiUser className="text-[1.5rem]" /></span>Profile</div>
                            <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div>
                        </div>
                        <div className="mt-[0.6rem] mb-[0.4rem] flex justify-between">
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><RiHistoryFill className="text-[1.5rem]" /></span>Booked History</div>
                            <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div>
                        </div>
                    </div>

                    <div className="w-[100%] mt-[0.8rem] bg-[#f7f7f7] rounded-[10px] p-[10px]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                        <div className="text-[1rem] font-[poppins] text-[#282828] font-[600]">Manage</div>
                        <div className="mt-[0.8rem] mb-[0.4rem] flex justify-between">
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><FaMedapps className="text-[1.5rem]" /></span>About Us</div>
                            <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div>
                        </div>
                        <div className="mt-[0.6rem] mb-[0.4rem] flex justify-between">
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><IoIosLogOut className="text-[1.5rem]" /></span>Logout</div>
                            {/* <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div> */}
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SettingsScreen;
