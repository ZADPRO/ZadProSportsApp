import { IonButton, IonContent, IonHeader, IonPage, IonSkeletonText, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import Account from "../../assets/images/Account.png"
import { MdMyLocation } from "react-icons/md";
import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import { decrypt } from "../../Helper";
import { Skeleton } from 'primereact/skeleton';

const HomeScreen = () => {

    const [loading, setLoading] = useState(false)


    const history = useHistory();


    useEffect(() => {



        const fetchData = async () => {

            setLoading(true)

            try {

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/userRoutes/listGrounds`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },

                })

                const data = decrypt(
                    response.data[1],
                    response.data[0],
                    import.meta.env.VITE_ENCRYPTION_KEY
                );

                if (data.success) {
                    localStorage.setItem("token", "Bearer " + data.token)
                    setGroundDetails(data.result)
                }

                setLoading(false)
            } catch (e: any) {
                console.log(e)
                setLoading(false)
            }
        }

        fetchData();



    }, [])

    const [groundDetails, setGroundDetails] = useState([]);

    // useEffect(() => {
    //     StatusBar.setOverlaysWebView({ overlay: false });
    //     StatusBar.setStyle({ style: Style.Dark });
    //     StatusBar.setBackgroundColor({ color: "#0377de" });

    //     return () => {
    //         StatusBar.setOverlaysWebView({ overlay: true });
    //     };
    // }, []);

    const [name, setName] = useState("User");

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
                    <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] pb-[10px] pt-[10px] text-[1.3rem] rounded-br-[20px] rounded-bl-[20px]">
                        <div>
                            <div className="text-[0.8rem] font-[poppins]">Hello👋,</div>
                            <div className="text-[1rem] font-[600] font-[poppins]">{name}!</div>
                            <div className="text-[0.8rem] h-[1rem] font-[poppins] pt-[3px] flex items-center mt-[5px] gap-[0.2rem]"><span className="text-[0.8rem]"><MdMyLocation /></span><div>Salem</div></div>
                        </div>
                        <div className="w-[2.5rem] h-[2.5rem] rounded-[50%] bg-[#f8d110] flex justify-center items-center" onClick={() => { history.push("/settings") }}> <img style={{ width: "2.3rem", height: "2.3rem" }} className="rounded-[50%]" src={Account} alt="account" /></div>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {
                    loading ? (
                        <>
                            <div className="bg-[#fff] w-[100%] overflow-auto">
                                <div className="w-[100%]  px-[1rem] py-[1rem]">
                                    <div className="flex justify-start items-center gap-[10px]">

                                        <Skeleton className=" font-[poppins] w-[5rem] h-[1.5rem] text-[0.8rem] font-[600]  rounded-[10px] px-[1rem]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}></Skeleton>
                                        <Skeleton className=" font-[poppins] w-[5rem] h-[1.5rem] text-[0.8rem] font-[600]  rounded-[10px] px-[1rem]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}></Skeleton>
                                        <Skeleton className=" font-[poppins] w-[5rem] h-[1.5rem] text-[0.8rem] font-[600]  rounded-[10px] px-[1rem]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}></Skeleton>
                                        <Skeleton className=" font-[poppins] w-[5rem] h-[1.5rem] text-[0.8rem] font-[600]  rounded-[10px] px-[1rem]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}></Skeleton>
                                        {/* <div className=" font-[poppins] w-[5rem] h-[1.5rem] text-[0.8rem] font-[600] bg-[#f7f7f7] rounded-[10px] px-[1rem]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}></div>
                                        <div className=" font-[poppins] w-[5rem] h-[1.5rem] text-[0.8rem] font-[600] bg-[#f7f7f7] rounded-[10px] px-[1rem]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}></div>
                                        <div className=" font-[poppins] w-[5rem] h-[1.5rem] text-[0.8rem] font-[600] bg-[#f7f7f7] rounded-[10px] px-[1rem]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}></div> */}
                                    </div>
                                    <div className="w-full overflow-x-auto hide-scrollbar px-[3px] py-[1rem]">
                                        <div className="flex flex-col flex-nowrap gap-[1rem]">

                                            <Skeleton
                                                className="min-w-[200px] rounded-[10px]"
                                                height="140px"
                                                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                                            ></Skeleton>


                                            <Skeleton
                                                className="min-w-[200px] rounded-[10px]"
                                                height="140px"
                                                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                                            ></Skeleton>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-[#fff] w-[100%] overflow-auto">
                                {/* <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] pb-[15px] pt-[15px] text-[1.3rem] rounded-br-[20px] rounded-bl-[20px]">
                        <div>
                            <div className="text-[0.8rem] font-[poppins]">Hello👋,</div>
                            <div className="text-[1rem] font-[600] font-[poppins]">Gokul!</div>
                            <div className="text-[0.8rem] h-[1rem] font-[poppins] pt-[3px] flex items-center mt-[5px] gap-[0.2rem]"><span className="text-[0.8rem]"><MdMyLocation /></span><div>Salem</div></div>
                        </div>
                        <div className="w-[2.5rem] h-[2.5rem] rounded-[50%] bg-[#f8d110] flex justify-center items-center" onClick={() => { history.push("/settings") }}> <img style={{ width: "2.3rem", height: "2.3rem" }} className="rounded-[50%]" src={Account} alt="account" /></div>
                    </div> */}
                                <div className="w-[100%]  px-[1rem] py-[1rem]">
                                    <div className="flex justify-start items-center gap-[10px]">
                                        <div className="text-[#242424] font-[poppins] text-[0.8rem] font-[600] bg-[#a9d6ff] rounded-[10px] px-[1rem]" style={{ border: "1.5px solid #0377de" }}>Cricket</div>
                                        {/* <div className="text-[#242424] font-[poppins] text-[0.8rem] font-[600] bg-[#f7f7f7] rounded-[10px] px-[1rem]" style={{ border: "1.5px solid #373737" }}>Cricket</div> */}
                                        {/* <div className="text-[#242424] font-[poppins] text-[0.8rem] font-[600] bg-[#a9d6ff] rounded-[10px] p-[10px]" style={{ border: "1.5px solid #0377de" }}>Cricket Grounds</div>
                            <Dropdown value={selectedGame} onChange={(e) => setSelectedGame(e.value)} options={Games} optionLabel="name" optionValue="code" className="text-[#242424] font-[poppins] text-[0.2rem] font-[600] bg-[#a9d6ff] rounded-[10px]"
                                placeholder="Select Game" checkmark={true} highlightOnSelect={false} />
                            <div className="text-[#242424] font-[poppins] text-[1.1rem] font-[600] flex gap-[0.5rem]">Salem <span className="text-[1.3rem]"><MdLocationPin /></span></div> */}
                                    </div>
                                    <div className="w-full overflow-x-auto hide-scrollbar px-[3px] py-[1rem]">
                                        <div className="flex flex-col flex-nowrap gap-[1rem]">
                                            {
                                                groundDetails.map((element: any, id) => (
                                                    // <>
                                                    <div key={id} className='min-w-[200px] bg-[#f7f7f7] rounded-[10px]' style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                                        <div  >
                                                            <img
                                                                onClick={() => { history.push("/groundDescriptions?groundId=" + element.refGroundId + "&booknowStatus=false") }}
                                                                src={`data:${element.refGroundImage.contentType};base64,${element.refGroundImage.content}`}
                                                                style={{ width: "100%", height: "130px" }}
                                                                className="rounded-tr-[10px] rounded-tl-[10px] object-cover"
                                                                alt={element.refGroundId}
                                                            />
                                                            <div className="flex justify-between items-center px-[0.5rem] gap-[0.5rem] pb-[0.1rem]">
                                                                <div onClick={() => { history.push("/groundDescriptions?groundId=" + element.refGroundId + "&booknowStatus=false") }} className='py-[0.1rem] w-[68%]'>
                                                                    <div className='text-[#3c3c3c] text-[0.8rem] font-[600] font-[poppins]' style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{element.refGroundName}</div>
                                                                    <div className='text-[#3c3c3c] text-[0.7rem] font-[500] my-[0.1rem] font-[poppins]' style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{element.refGroundLocation}, {element.refGroundState}, {element.refGroundPincode}</div>
                                                                </div>
                                                                <IonButton
                                                                    onClick={() => {
                                                                        history.push("/groundDescriptions?groundId=" + element.refGroundId + "&booknowStatus=true")
                                                                    }} className="custom-ion-button font-[poppins] w-[5rem] h-[0px] text-[#fff] text-[0.6rem] font-[500]">Book Now</IonButton>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    // </>
                                                    // <GroundCards key={idx} name={element.name} address={element.Address} image={element.image} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }


            </IonContent>
        </IonPage>
    );
};

export default HomeScreen;
