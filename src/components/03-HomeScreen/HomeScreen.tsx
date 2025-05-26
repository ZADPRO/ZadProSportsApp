import { IonContent, IonHeader, IonPage } from "@ionic/react";
import { useRef } from "react";
import { useHistory } from "react-router";
import Ground1 from "../../assets/images/Ground1.png"
import Ground2 from "../../assets/images/Ground2.png"
import Ground3 from "../../assets/images/Ground3.png"
import Ground4 from "../../assets/images/Ground4.png"
import GroundCards from "../../pages/01-GroundCards/GroundCards";
import NextPageCards from "../../pages/01-GroundCards/NextPageCard";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Account from "../../assets/images/Account.png"


const HomeScreen = () => {
    const usernameRef = useRef<HTMLInputElement>(null); // ✅ CORRECT TYPING

    const handleLogin = () => {
        const username = usernameRef.current?.value;
        console.log("Username:", username);
    }

    const history = useHistory();

    const groundDetails = [
        {
            name: "Ground 1",
            Address: "38/37B, Logi Chetty Street Number 1, Logi Street, Gugai, Salem, Tamil Nadu 636006",
            image: Ground1,
        },
        {
            name: "Ground 2",
            Address: "15, M.G. Road, Gandhi Nagar, Coimbatore, Tamil Nadu 641018",
            image: Ground2
        },
        {
            name: "Ground 3",
            Address: "24, Park Avenue, Egmore, Chennai, Tamil Nadu 600008",
            image: Ground3
        },
        {
            name: "Ground 4",
            Address: "12, Raja Street, Anna Nagar, Madurai, Tamil Nadu 625020",
            image: Ground4
        }
    ];


    return (
        <IonPage>
            <IonHeader>
                <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] h-[8vh] text-[1.3rem]">
                    <div><div className="text-[0.7em] font-[poppins]">Hello👋,</div><div className="text-[1rem] font-[poppins]">Gokul!</div></div>
                    <div className="w-[2.5rem] h-[2.5rem] rounded-[50%] bg-[#f8d110] flex justify-center items-center" onClick={() => { history.push("/settings") }}> <img style={{ width: "2.3rem", height: "2.3rem" }} className="rounded-[50%]" src={Account} alt="account" /></div>
                </div>
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] h-[92vh] overflow-auto px-[1rem] py-[1rem]">
                    <div className="w-[100%]">
                        <div className="flex justify-between">
                            <div className="text-[#242424] font-[poppins] text-[0.8rem] font-[600] bg-[#a9d6ff] rounded-[10px] p-[10px]" style={{ border: "1.5px solid #0377de" }}>Cricket Grounds</div>
                            {/* <div className="text-[#242424] font-[poppins] text-[0.9rem] flex gap-[0.5rem]">View All <span className="mt-[1px]"><FaArrowRightLong /></span></div> */}
                        </div>
                        <div className="w-full overflow-x-auto hide-scrollbar px-[3px] py-[1rem]">
                            <div className="flex flex-nowrap gap-[1rem]">
                                {
                                    groundDetails.map((element, idx) => (
                                        <GroundCards key={idx} name={element.name} address={element.Address} image={element.image} />
                                    ))
                                }
                                <NextPageCards url="allPages" />
                            </div>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default HomeScreen;
