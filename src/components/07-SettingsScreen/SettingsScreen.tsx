import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { IoIosArrowBack, IoIosArrowForward, IoIosLogOut, IoMdInformationCircleOutline } from "react-icons/io";
import Account from "../../assets/images/Account.png"
import { FiUser } from "react-icons/fi";
import { RiHistoryFill } from "react-icons/ri";
import { FaMedapps } from "react-icons/fa6";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SlDocs } from "react-icons/sl";
import { MdOutlinePrivacyTip } from "react-icons/md";

const SettingsScreen = () => {

    const [name, setName] = useState("User");

    const ionRouter = useIonRouter();

    const history = useHistory();

    // useEffect(() => {
    //     StatusBar.setOverlaysWebView({ overlay: false });
    //     StatusBar.setStyle({ style: Style.Dark });
    //     StatusBar.setBackgroundColor({ color: "#0377de" });

    //     return () => {
    //         StatusBar.setOverlaysWebView({ overlay: true });
    //     };
    // }, []);

    const location = useLocation();

    useEffect(() => {
        const newName = localStorage.getItem("name") || "User";
        setName(newName);
        console.log("Updated name on location change:", newName);

    }, [location]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
                {/* <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] h-[8vh] text-[1.3rem]">
                    <div><IoIosArrowBack className="text-[1.5rem]" onClick={() => { history.goBack() }} /></div>
                    <div className="text-[1rem] font-[poppins] font-[600] text-[#fff] ml-[-1.2rem]">Account</div>
                    <div></div>
                </div> */}
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] overflow-auto px-[1rem] py-[1rem]">
                    <div className="w-[100%] flex gap-[1rem] items-center bg-[#a9d6ff] rounded-[10px] p-[10px]" style={{ border: "1.5px solid #0377de" }}>
                        <div>
                            <div className="w-[5rem] h-[5rem] rounded-[50%] bg-[#f8d110] flex justify-center items-center" onClick={() => { history.push("/settings") }}> <img style={{ width: "4.5rem", height: "4.5rem" }} className="rounded-[50%]" src={Account} alt="account" /></div>
                        </div>
                        <div>
                            <div className="text-[1rem] font-[poppins] text-[#282828] font-[600]">Hello👋,</div>
                            <div className="text-[1rem] font-[poppins] text-[#282828] font-[600]">{name}!</div>
                        </div>
                    </div>

                    <div className="w-[100%] mt-[0.8rem] bg-[#f7f7f7] rounded-[10px] p-[10px]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                        <div className="text-[1rem] font-[poppins] text-[#282828] font-[600]">Account</div>
                        <div className="mt-[0.8rem] mb-[0.4rem] flex justify-between" onClick={() => { history.push("/profile") }}>
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><FiUser className="text-[1.5rem]" /></span>Profile</div>
                            <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div>
                        </div>
                        <div className="mt-[0.6rem] mb-[0.4rem] flex justify-between" onClick={() => {
                            history.push("/bookinghistory")
                        }}>
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><RiHistoryFill className="text-[1.5rem]" /></span>Booked History</div>
                            <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div>
                        </div>
                    </div>

                    <div className="w-[100%] mt-[0.8rem] bg-[#f7f7f7] rounded-[10px] p-[10px]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                        <div className="text-[1rem] font-[poppins] text-[#282828] font-[600]">Manage</div>
                        <div className="mt-[0.8rem] mb-[0.4rem] flex justify-between" onClick={() => {
                            history.push("/about")
                        }}>
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><IoMdInformationCircleOutline className="text-[1.5rem]" /></span>About Us</div>
                            <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div>
                        </div>
                        <div onClick={() => {
                            history.push("/privacy")
                        }} className="mt-[0.8rem] mb-[0.4rem] flex justify-between">
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><MdOutlinePrivacyTip className="text-[1.5rem]" /></span>Privacy Policy</div>
                            <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div>
                        </div>
                        <div onClick={() => {
                            history.push("/terms")
                        }} className="mt-[0.8rem] mb-[0.4rem] flex justify-between">
                            <div className="text-[0.9rem] font-[poppins] text-[#282828] font-[500] flex gap-[1rem]"><span><SlDocs className="text-[1.2rem]" /></span>Terms & Condition</div>
                            <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div>
                        </div>
                        <div className="mt-[0.6rem] mb-[0.4rem] flex justify-between">
                            <div onClick={() => {
                                localStorage.clear();
                                ionRouter.push('/', 'root', 'replace'); // Navigate and reset history stack
                            }} className="text-[0.9rem] font-[poppins] text-[#fff] bg-[#ff1111] pl-[0.5rem] pt-[0.5rem] pb-[0.2rem] w-[100%] font-[500] flex gap-[1rem] rounded-[10px]"><span><IoIosLogOut className="text-[1.5rem]" /></span>Logout</div>
                            {/* <div><IoIosArrowForward className="text-[#282828] text-[1.2rem]" /></div> */}
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SettingsScreen;
