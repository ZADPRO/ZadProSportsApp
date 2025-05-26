import { IonButton, IonContent, IonHeader, IonPage, IonToggle } from "@ionic/react";
import { useRef, useState } from "react";
import { useHistory } from "react-router";
import Ground1 from "../../assets/images/Ground1.png"
import Ground2 from "../../assets/images/Ground2.png"
import Ground3 from "../../assets/images/Ground3.png"
import Ground4 from "../../assets/images/Ground4.png"
import GroundCards from "../../pages/01-GroundCards/GroundCards";
import NextPageCards from "../../pages/01-GroundCards/NextPageCard";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";


const ConfirmBooking = () => {
    const usernameRef = useRef<HTMLInputElement>(null); // ✅ CORRECT TYPING

    const handleLogin = () => {
        const username = usernameRef.current?.value;
        console.log("Username:", username);
    }

    const [isStayToggled, setIsStayToggled] = useState(false);
    const [isFoodToggled, setIsFoodToggled] = useState(false);

    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] h-[8vh] text-[1.3rem]">
                    <div><IoIosArrowBack className="text-[1.5rem]" onClick={() => { history.goBack() }} /></div>
                    <div className="text-[1.2rem] font-[poppins] font-[500] text-[#fff] ml-[-1.2rem]">Confirm Booking</div>
                    <div></div>
                </div>
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] h-[92vh] overflow-auto px-[1rem] py-[1rem] pb-[4rem]">

                    <div className="w-[100%] bg-[#e7e7e7] p-[10px] rounded-[10px] ">
                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">Slot Booking</div>
                        <div className="my-[10px]">
                            <div className="overflow-x-auto rounded-lg shadow">
                                <table className="min-w-full border-collapse  font-poppins text-[#242424] font-semibold text-[0.8rem]">
                                    <thead>
                                        <tr className="bg-[#fafbfb] font-[poppins]" style={{ borderBottom: "1px solid #eaecf0" }}>
                                            <th className=" px-[10px] py-[10px] text-left">Date</th>
                                            <th className=" px-[10px] py-[10px] text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-[#fff] font-[poppins]" style={{ borderBottom: "1px solid #eaecf0" }}>
                                            <td className=" px-[10px] py-[10px]">24-05-2025</td>
                                            <td className=" px-[10px] py-[10px]"><div className="bg-[#ecfdf3] rounded-[5px]  text-center text-[green] text-[0.9rem] font-[500]">Available</div></td>
                                        </tr>
                                        <tr className="bg-[#fff] font-[poppins]" style={{ borderBottom: "1px solid #eaecf0" }}>
                                            <td className=" px-[10px] py-[10px]">25-05-2025</td>
                                            <td className=" px-[10px] py-[10px]"><div className="bg-[#ecfdf3] rounded-[5px]  text-center text-[green] text-[0.9rem] font-[500]">Available</div></td>
                                        </tr>
                                        <tr className="bg-[#fff] font-[poppins]" style={{ borderBottom: "1px solid #eaecf0" }}>
                                            <td className=" px-[10px] py-[10px]">26-05-2025</td>
                                            <td className=" px-[10px] py-[10px]"><div className="bg-[#ecfdf3] rounded-[5px]  text-center text-[green] text-[0.9rem] font-[500]">Available</div></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>

                    <div className="w-[100%] mt-[0.6rem] bg-[#e7e7e7] p-[10px] rounded-[10px] flex justify-between items-center">
                        <div className="text-[#242424] text-[0.9rem] font-[poppins] font-[600]">Add Stay</div>
                        <div>
                            <IonToggle
                                checked={isStayToggled}
                                onIonChange={(e) => setIsStayToggled(e.detail.checked)}
                                labelPlacement="stacked"
                                className="custom-toggle"
                                style={{
                                    '--handle-background-checked': '#0377de',
                                    '--track-background-checked': '#badeff',
                                    '--handle-background': 'gray',
                                    '--track-background': '#ccc',
                                    '--track-height': '16px',       // Smaller height
                                    '--track-width': '32px',        // Adjust width accordingly
                                    margin: '0',                    // Remove default margin
                                    padding: '0',                   // Remove padding if any
                                    textAlign: 'center',
                                }}
                            >
                            </IonToggle>
                        </div>
                    </div>

                    {
                        isStayToggled && (
                            <div className="w-[100%] bg-[#e7e7e7] mt-[0.6rem] p-[10px] rounded-[10px] ">
                                <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">Stay Availability</div>
                                <div className="my-[10px]">
                                    <div className="overflow-x-auto rounded-lg shadow">
                                        <table className="min-w-full border-collapse  font-poppins text-[#242424] font-semibold text-[0.8rem]">
                                            <thead>
                                                <tr className="bg-[#fafbfb] font-[poppins]" style={{ borderBottom: "1px solid #eaecf0" }}>
                                                    <th className=" px-[10px] py-[10px] text-left">Date</th>
                                                    <th className=" px-[10px] py-[10px] text-left">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-[#fff] font-[poppins]" style={{ borderBottom: "1px solid #eaecf0" }}>
                                                    <td className=" px-[10px] py-[10px]">24-05-2025</td>
                                                    <td className=" px-[10px] py-[10px]"><div className="bg-[#ecfdf3] rounded-[5px]  text-center text-[green] text-[0.9rem] font-[500]">Available</div></td>
                                                </tr>
                                                <tr className="bg-[#fff] font-[poppins]" style={{ borderBottom: "1px solid #eaecf0" }}>
                                                    <td className=" px-[10px] py-[10px]">25-05-2025</td>
                                                    <td className=" px-[10px] py-[10px]"><div className="bg-[#fff2ea] rounded-[5px]  text-center text-[red] text-[0.9rem] font-[500]">Unavailable</div></td>
                                                </tr>
                                                <tr className="bg-[#fff] font-[poppins]" style={{ borderBottom: "1px solid #eaecf0" }}>
                                                    <td className=" px-[10px] py-[10px]">26-05-2025</td>
                                                    <td className=" px-[10px] py-[10px]"><div className="bg-[#ecfdf3] rounded-[5px]  text-center text-[green] text-[0.9rem] font-[500]">Available</div></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <div className="w-[100%] bg-[#e7e7e7] p-[10px] mt-[20px] rounded-[10px] flex justify-between items-center">
                        <div className="text-[#242424] font-[poppins] font-[600] text-[0.9rem]">Add Food</div>
                        <div>
                            <IonToggle
                                checked={isFoodToggled}
                                onIonChange={(e) => setIsFoodToggled(e.detail.checked)}
                                labelPlacement="stacked"
                                className="custom-toggle"
                                style={{
                                    '--handle-background-checked': '#0377de',
                                    '--track-background-checked': '#badeff',
                                    '--handle-background': 'gray',
                                    '--track-background': '#ccc',
                                    '--track-height': '16px',       // Smaller height
                                    '--track-width': '32px',        // Adjust width accordingly
                                    margin: '0',                    // Remove default margin
                                    padding: '0',                   // Remove padding if any
                                    textAlign: 'center',
                                }}
                            >
                            </IonToggle>
                        </div>
                    </div>

                    {
                        isFoodToggled && (
                            <div className="w-[100%] bg-[#e7e7e7] mt-[0.6rem] p-[10px] rounded-[10px] ">
                                <div className="bg-[#ecfdf3] rounded-[5px] font-[poppins]  text-left text-[green] text-[0.8rem] font-[500] px-[10px] py-[5px]">Food is Available</div>
                            </div>
                        )
                    }

                    <div className="flex justify-center">
                        <IonButton
                            style={{ position: "fixed", bottom: "0px", zIndex: 9999 }}
                            onClick={() => {
                            }} className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[1rem] font-[poppins]">Pay &nbsp; ₹ 2000</IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ConfirmBooking;
