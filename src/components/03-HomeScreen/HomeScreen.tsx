import { IonButton, IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import Account from "../../assets/images/Account.png"
import { MdMyLocation } from "react-icons/md";
import axios from "axios";
import { decrypt } from "../../Helper";
import { Skeleton } from 'primereact/skeleton';
import Logo from "../../assets/images/unavailable.png"

const HomeScreen = () => {

    const [loading, setLoading] = useState(false)

    const history = useHistory();

    const fetchData = async (id: any) => {

        setLoading(true)

        try {

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/userRoutes/listFilteredGrounds`, {
                refSportsCategoryId: id
            }, {
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

            console.log(data)

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


    const fetchGroundTypes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/userRoutes/listSportCategory`, {
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


            console.log(data)
            setGroundTypes(data.result)
            setSelectedDetails(data.result[0].refSportsCategoryId)
            setLoading(false)
            return data.result[0].refSportsCategoryId
        } catch (e) {
            setLoading(false)
            console.log(e)
            return 0
        }


    }


    useEffect(() => {
        const init = async () => {
            const id = await fetchGroundTypes();
            console.log("Selected ID:", id);
            fetchData(id);
        };
        init();
    }, []);

    const [groundDetails, setGroundDetails] = useState([]);

    const [selectedDetails, setSelectedDetails] = useState()

    const [name, setName] = useState("User");

    const location = useLocation();

    const [groundtypes, setGroundTypes]: any = useState([]);

    useEffect(() => {
        const newName = localStorage.getItem("name") || "User";
        setName(newName);
        console.log("Updated name on location change:", newName);
    }, [location]);


    const handleRefresh = (event: any) => {
        const init = async () => {
            const id = await fetchGroundTypes();
            console.log("Selected ID:", id);
            fetchData(id);
        };
        init();
        event.detail.complete();
    }

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
                <IonRefresher style={{ background: "#fff" }} slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent ></IonRefresherContent>
                </IonRefresher>
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
                                <div className="w-[100%]  px-[1rem] py-[1rem]">
                                    <div className="flex justify-start items-center gap-[10px] overflow-x-auto hide-scrollbar">
                                        {
                                            groundtypes.map((element: any) => (
                                                <div className={`text-[#242424] font-[poppins] text-[0.8rem] font-[600] bg-[${element.refSportsCategoryId === selectedDetails ? "#a9d6ff" : "#fff"}] rounded-[10px] px-[1rem]`} onClick={() => {
                                                    setSelectedDetails(element.refSportsCategoryId);

                                                    const init = async () => {
                                                        fetchData(element.refSportsCategoryId);
                                                    };
                                                    init();

                                                }} style={{ border: "1.5px solid #0377de" }}>{element.refSportsCategoryName}</div>
                                            ))
                                        }

                                    </div>
                                    <div className="w-full overflow-x-auto hide-scrollbar px-[3px] py-[1rem]">
                                        <div className="flex flex-col flex-nowrap gap-[1rem]">
                                            {
                                                groundDetails.map((element: any, id) => (
                                                    // <>
                                                    <div key={id} className='min-w-[200px] bg-[#f7f7f7] rounded-[10px]' style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                                        <div >
                                                            {
                                                                element.refGroundImage ? (
                                                                    <img
                                                                        onClick={() => { history.push("/groundDescriptions?groundId=" + element.refGroundId + "&booknowStatus=false") }}
                                                                        src={`data:${element.refGroundImage.contentType};base64,${element.refGroundImage.content}`}
                                                                        style={{ width: "100%", height: "130px" }}
                                                                        className="rounded-tr-[10px] rounded-tl-[10px] object-cover"
                                                                        alt={element.refGroundId}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        onClick={() => { history.push("/groundDescriptions?groundId=" + element.refGroundId + "&booknowStatus=false") }}
                                                                        src={Logo}
                                                                        style={{ width: "100%", height: "130px" }}
                                                                        className="rounded-tr-[10px] rounded-tl-[10px] object-cover"
                                                                        alt="Logo"
                                                                    />
                                                                )
                                                            }
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
