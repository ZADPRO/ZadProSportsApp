import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { IoIosArrowBack, IoIosArrowForward, IoIosLogOut, IoMdInformationCircleOutline } from "react-icons/io";
import Account from "../../assets/images/Account.png"
import { FiUser } from "react-icons/fi";
import { RiHistoryFill } from "react-icons/ri";
import { FaMedapps } from "react-icons/fa6";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SlDocs } from "react-icons/sl";
import { MdOutlinePrivacyTip } from "react-icons/md";
import axios from "axios";
import { decrypt } from "../../Helper";

const BookedScreen = () => {

    const history = useHistory();

    // useEffect(() => {
    //     StatusBar.setOverlaysWebView({ overlay: false });
    //     StatusBar.setStyle({ style: Style.Dark });
    //     StatusBar.setBackgroundColor({ color: "#0377de" });

    //     return () => {
    //         StatusBar.setOverlaysWebView({ overlay: true });
    //     };
    // }, []);


    useEffect(() => {

        setLoding(true)
        fetchData()
        setLoding(false)

    }, [])

    const [historyData, setHistoryData] = useState([]);


    const fetchData = async () => {


        try {

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/v1/userRoutes/userBookingHistory`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                }
            )

            const data = decrypt(
                response.data[1],
                response.data[0],
                import.meta.env.VITE_ENCRYPTION_KEY
            );

            localStorage.setItem("token", "Bearer " + data.token)

            if (data.success) {
                setHistoryData(data.result)
            }

            console.log(data)


        } catch (e) {
            console.log(e)
        }

    }

    function getDatesInRange(fromDate: any, toDate: any) {
        const result = [];
        const currentDate = new Date(fromDate);
        const endDate = new Date(toDate);

        while (currentDate <= endDate) {
            const formattedDate = currentDate
                .toLocaleDateString('en-GB') // DD/MM/YYYY
                .split('/')
                .join('-'); // Convert to DD-MM-YYYY
            result.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
    }


    function groupDatesByMonth(dates: any) {
        const groups: any = {};

        console.log(dates)

        if (dates) {
            dates.forEach((dateStr: any) => {
                // Parse DD-MM-YYYY
                const [day, month, year] = dateStr.split("-");
                const jsDate = new Date(`${year}-${month}-${day}`);
                const monthName = jsDate.toLocaleString('default', { month: 'short' }); // 'Jun'
                // Omit year if you don't want to show it
                if (!groups[monthName]) groups[monthName] = [];
                groups[monthName].push(day);
            });

            // Sort days within each group
            Object.keys(groups).forEach(key => {
                groups[key].sort((a: any, b: any) => a - b);
            });

            return groups;
        } else {
            return groups;
        }
    }


    const [loading, setLoding] = useState(false);

    function getInclusiveDayCount(fromDateStr: any, toDateStr: any) {
        const fromDate: any = new Date(fromDateStr);
        const toDate: any = new Date(toDateStr);

        // Get the time difference in milliseconds
        const diffTime = toDate - fromDate;

        // Convert milliseconds to days and add 1 to include both start and end dates
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        return diffDays;
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Booking History</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] overflow-auto px-[1rem] py-[1rem]">
                    {
                        loading ? (
                            <>
                                <div className="w-[100%] py-[2rem] flex justify-center items-center">
                                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: "#0377de" }}></i>
                                </div>
                            </>
                        ) : (
                            <IonAccordionGroup >
                                {
                                    historyData.length === 0 ? (
                                        <div className="text-[0.9rem] font-[poppins] text-[#333] text-center">No Booking Found</div>
                                    ) : (
                                        <>
                                            {
                                                historyData.map((item: any, index) => (
                                                    <IonAccordion key={index} value={`first${index}`}>
                                                        <IonItem slot="header">
                                                            <div className="w-[95%]">
                                                                <div className="flex justify-between">
                                                                    <div className="w-[80%] text-[0.9rem] font-[poppins] font-[500] text-ellipsis">{item.refGroundName}</div>
                                                                    <div className="w-[20%] text-[0.7rem] font-[poppins] font-[500]  flex justify-center items-center"><div className="p-[0.2rem] bg-[#ecfdf3] text-[#027a48] font-[600] rounded-[10px]">Booked</div></div>
                                                                </div>
                                                            </div>
                                                        </IonItem>
                                                        <div className="ion-padding" slot="content">
                                                            <div className="w-[100%]">

                                                                <div className="w-[100%] flex justify-between text-[0.8rem] font-[poppins]">
                                                                    <div>
                                                                        Booked Date ({getInclusiveDayCount(item.refBookingStartDate.split("-").reverse().join("-"), item.refBookingEndDate.split("-").reverse().join("-"))} x {parseInt(item.refBookingAmount) / getInclusiveDayCount(item.refBookingStartDate.split("-").reverse().join("-"), item.refBookingEndDate.split("-").reverse().join("-"))} = {item.refBookingAmount})
                                                                    </div>
                                                                    <div>
                                                                        {item.createdAt.split(" ")[0].split("-").reverse().join("-")}
                                                                    </div>
                                                                </div>
                                                                <div className={`mt-[10px] flex justify-between pb-[10px] text-[0.8rem] font-[poppins] ${item.AddOn.length > 0 ? "border-b-[1px]" : ""}`}>
                                                                    <div>
                                                                        {
                                                                            Object.entries(groupDatesByMonth(getDatesInRange(item.refBookingStartDate.split("-").reverse().join("-"), item.refBookingEndDate.split("-").reverse().join("-")))).map(([month, days]) => (
                                                                                <div key={month}>
                                                                                    {month} {(days as string[]).join(', ')}
                                                                                </div>
                                                                            ))
                                                                        }
                                                                        {/* May 30, 31
                                                    <br />
                                                    June 1, 2 */}
                                                                    </div>
                                                                    <div className="flex justify-center items-center">
                                                                        <div className="bg-[#ecfdf3] text-[#027a48] font-[600] rounded-[10px] px-[10px] text-[0.8rem]">Paid ₹ {item.retTotalAmount}</div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    item.AddOn.length > 0 && (<div className="mt-[10px] text-[0.9rem] font-[500]">
                                                                        Addons
                                                                    </div>)
                                                                }
                                                                {
                                                                    item.AddOn.map((element: any, ind: any) => (
                                                                        <div className={`w-[100%] py-[10px] border-b-[1px] flex justify-between text-[0.8rem] font-[poppins]`}>
                                                                            <div>
                                                                                {element.addon} ({element.selectedDates.length} x ₹ {element.refAddOnsPrice[0] || 0} = {element.selectedDates.length * element.refAddOnsPrice[0]})
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    Object.entries(groupDatesByMonth(element.selectedDates)).map(([month, days]) => (
                                                                                        <div key={month}>
                                                                                            {month} {(days as string[]).join(', ')}
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                                <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                                                                    <div>Net Amount</div>
                                                                    <div>₹ {parseInt(item.retTotalAmount || 0) - parseInt(item.refSGSTAmount || 0) - parseInt(item.refCGSTAmount || 0)}</div>
                                                                </div>
                                                                <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                                                                    <div>SGST (9%)</div>
                                                                    <div>₹ {parseInt(item.refSGSTAmount || 0)}</div>
                                                                </div>
                                                                <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                                                                    <div>CGST (9%)</div>
                                                                    <div>₹ {parseInt(item.refCGSTAmount || 0)}</div>
                                                                </div>
                                                                <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                                                                    <div>Total Paid Amount</div>
                                                                    <div>₹ {parseInt(item.retTotalAmount || 0)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </IonAccordion>
                                                ))
                                            }
                                        </>
                                    )
                                }
                            </IonAccordionGroup>
                        )
                    }
                </div>
            </IonContent>
        </IonPage>
    );
};

export default BookedScreen;
