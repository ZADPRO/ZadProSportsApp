import { IonAlert, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonModal, IonPage, IonPicker, IonPickerColumn, IonPickerColumnOption, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import { use, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { LuCalendar1 } from "react-icons/lu";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { Calendar } from "primereact/calendar";
import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import { decrypt } from "../../Helper";
import { TbRuler2Off } from "react-icons/tb";
import { RadioButton } from 'primereact/radiobutton';
import { FaPersonCirclePlus } from "react-icons/fa6";


const ConfirmBooking = () => {

    const [dates, setDates] = useState<Date[]>([]);

    const [showSlots, setShowSlots] = useState(false)

    useEffect(() => {
        const input = localStorage.getItem("selectedDate");

        if (input) {
            const inputDates = JSON.parse(input); // assuming it's stored as JSON array like '["25-05-2025", "26-05-2025"]'

            const parsedDates = inputDates.map((dateStr: string) => {
                const [day, month, year] = dateStr.split('-').map(Number);
                return new Date(year, month - 1, day);
            });

            setDates(parsedDates);
        }
    }, []);

    const history = useHistory();

    const [addOnsData, setAddOnsData] = useState([]);

    const [loading, setLoading] = useState(false)


    const [amount, setAmount] = useState(0);

    useEffect(() => {

        const bookingAvailableDate = JSON.parse(localStorage.getItem("selectedDate") || "[]");

        const fetchData = async () => {

            setLoading(true)

            const urlParams = new URLSearchParams(window.location.search);
            const groundId = urlParams.get('groundId');

            try {

                const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/userRoutes/getUnavailableAddons`,
                    {
                        fromDate: bookingAvailableDate[0],
                        toDate: bookingAvailableDate[bookingAvailableDate.length - 1],
                        refGroundId: groundId
                    },
                    {
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

                localStorage.setItem("token", "Bearer " + data.token)

                console.log(data)
                if (data.success) {

                    const newData: any = []

                    data.addons.map((element: any) => {
                        console.log(element.refAddOnsId)
                        const val: any = []

                        data.result.map((date: any) => {
                            console.log(date.refAddOnsId + " " + date.unAvailabilityDate + " " + element.refAddOnsId)

                            if (date.refAddOnsId === element.refAddOnsId) {
                                val.push(date.unAvailabilityDate)
                            }
                        })


                        const subCategoryData: any = [];


                        data.subAddOns.map((subcat: any) => {

                            if (subcat.refAddOnsId === element.refAddOnsId) {

                                console.log(subcat.refSubAddOnName)

                                const itemData: any = []

                                data.Items.map((item: any) => {
                                    if (subcat.subAddOnsId === item.subAddOnsId) {
                                        itemData.push({
                                            id: item.refItemsId,
                                            label: item.refItemsName,
                                            price: parseInt(item.refItemsPrice)
                                        })
                                    }
                                })


                                subCategoryData.push({
                                    id: subcat.subAddOnsId,
                                    label: subcat.refSubAddOnName,
                                    price: itemData.length > 0 ? null : parseInt(subcat.refSubAddOnPrice),
                                    subcategory: itemData.length > 0 ? true : false,
                                    status: false,
                                    itemsData: itemData.length > 0 ? data.Items[0].refItemsId : null,
                                    itemsPrice: itemData.length > 0 ? parseInt(data.Items[0].refItemsPrice) : null,
                                    itemsLabel: itemData.length > 0 ? data.Items[0].refItemsName : null,
                                    subcategoryData: itemData
                                })


                            }


                        })

                        newData.push({
                            label: element.refAddOn,
                            id: element.refAddOnsId,
                            strickedDate: val,
                            price: parseInt(element.refAddonPrice),
                            person: 1,
                            personStatus: false,
                            subcategory: data.subAddOns.some((val: any) => val.refAddOnsId === element.refAddOnsId),
                            subcategoryData: subCategoryData
                        });
                    });

                    // setAmount(1000)

                    // const newData = [
                    //     {
                    //         label: "Food",
                    //         id: 1,
                    //         strickedDate: ["29-05-2025", "30-05-2025"],
                    //         price: null,
                    //         person: 1,
                    //         personStatus: false,
                    //         subcategory: true,
                    //         subcategoryData: [
                    //             {
                    //                 label: "Breakfast",
                    //                 price: null,
                    //                 subcategory: true,
                    //                 status: false,
                    //                 itemsData: null,
                    //                 itemsPrice: null,
                    //                 subcategoryData: [
                    //                     {
                    //                         id: 1,
                    //                         label: "Idly",
                    //                         price: 30,
                    //                     },
                    //                     {
                    //                         id: 2,
                    //                         label: "Pongal",
                    //                         price: 50,
                    //                     }
                    //                 ]
                    //             },
                    //             {
                    //                 label: "Lunch",
                    //                 price: null,
                    //                 subcategory: true,
                    //                 status: false,
                    //                 itemsData: null,
                    //                 itemsPrice: null,
                    //                 subcategoryData: [
                    //                     {
                    //                         id: 4,
                    //                         label: "Veg Meal",
                    //                         price: 100,
                    //                     },
                    //                     {
                    //                         id: 5,
                    //                         label: "Non-Veg Meal",
                    //                         price: 100,
                    //                     }
                    //                 ]
                    //             },
                    //             {
                    //                 label: "Dinner",
                    //                 price: 89,
                    //                 subcategory: false,
                    //                 status: false,
                    //                 itemsData: null,
                    //                 itemsPrice: null,
                    //                 subcategoryData: []
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         label: "Stay",
                    //         id: 1,
                    //         strickedDate: ["29-05-2025", "30-05-2025"],
                    //         price: 1000,
                    //         subcategory: false,
                    //         person: 1,
                    //         personStatus: false,
                    //         subcategoryData: []
                    //     },
                    // ];

                    setAmount(data.totalgroundPrice)

                    const val: any = newData.length > 0 ? newData.map((element: any) => {
                        const availableDate = bookingAvailableDate.filter((d: string) =>
                            !element.strickedDate.includes(d)
                        );
                        return {
                            ...element,
                            availableDate,
                            status: false,
                            selectedDates: availableDate,
                            modelStatus: false,
                        };
                    }) : [];
                    setAddOnsData(val);

                    console.log(val)
                }
                setLoading(false)

            } catch (e: any) {
                console.log(e)
                setLoading(false)
            }
        }

        fetchData();

    }, []);

    const parseDateString = (dateStr: any) => {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDate = (date: any) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    function groupDatesByMonth(dates: any) {
        const groups: any = {};

        dates.forEach((dateStr: any) => {
            const [day, month, year] = dateStr.split("-");
            const jsDate = new Date(`${year}-${month}-${day}`);
            const monthName = jsDate.toLocaleString('default', { month: 'short' }); // 'Jun'

            if (!groups[monthName]) groups[monthName] = [];
            groups[monthName].push(day);
        });

        Object.keys(groups).forEach(key => {
            groups[key].sort((a: any, b: any) => a - b);
        });

        return groups;
    }

    const [paymentLoading, setPaymentLoding] = useState(false)

    const handlePayment = async () => {
        try {


            const urlParams = new URLSearchParams(window.location.search);
            const groundId = urlParams.get('groundId');

            const bookingAvailableDate = JSON.parse(localStorage.getItem("selectedDate") || "[]");


            console.log(addOnsData)


            const addOnsVal: any = [];


            addOnsData.map((element: any) => {
                const subAddOnsVal: any = [];
                element.subcategoryData.map((subcat: any) => {
                    if (subcat.status && subcat.subcategory) {
                        subAddOnsVal.push({
                            refSubaddonId: subcat.id,
                            refSubaddonLabel: subcat.label,
                            refSubaddonprice: subcat.price,
                            isItemsNeeded: subcat.status && subcat.itemsPrice ? true : false,
                            refItems: subcat.status && subcat.itemsPrice ? [{ refItemsId: subcat.itemsData }] : [],
                            refItemsLabel: subcat.status && subcat.itemsPrice ? [{ refItemsLabel: subcat.itemsLabel }] : [],
                            refItemsPrice: subcat.status && subcat.itemsPrice ? [{ refItemsPrice: subcat.itemsPrice }] : []
                        })
                    } else if (subcat.status && !subcat.subcategory) {
                        subAddOnsVal.push({
                            refSubaddonId: subcat.id,
                            isItemsNeeded: false,
                            refItems: [],
                            refSubaddonLabel: subcat.label,
                            refSubaddonprice: subcat.price,
                        })
                    }
                })

                if (element.status && subAddOnsVal.length > 0) {
                    addOnsVal.push({
                        refLabel: element.label,
                        refPrice: element.price,
                        refAddOnsId: element.id,
                        selectedDates: element.selectedDates,
                        refPersonCount: element.person,
                        isSubaddonNeeded: subAddOnsVal.length > 0 ? true : false,
                        refSubaddons: subAddOnsVal.length > 0 ? subAddOnsVal : []
                    })
                } else if (!element.subcategory && element.status) {
                    addOnsVal.push({
                        refLabel: element.label,
                        refPrice: element.price,
                        refAddOnsId: element.id,
                        selectedDates: element.selectedDates,
                        refPersonCount: element.person,
                        isSubaddonNeeded: subAddOnsVal.length > 0 ? true : false,
                        refSubaddons: subAddOnsVal.length > 0 ? subAddOnsVal : []
                    })
                }
            })



            console.log(addOnsVal)


            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/userRoutes/payConvertString`,
                {
                    refGroundId: groundId,
                    isAddonNeeded: addOnsVal.length > 0 ? true : false,
                    refBookingTypeId: 1,
                    refBookingStartDate: bookingAvailableDate[0],
                    refBookingEndDate: bookingAvailableDate[bookingAvailableDate.length - 1],
                    additionalNotes: "",
                    refAddOns: addOnsVal
                },
                {
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

            // localStorage.setItem("token", "Bearer " + data.token)

            if (data.success) {
                // location.replace("/bookinghistory");
                history.replace("/home")

                window.open(`${import.meta.env.VITE_PAYMENT_URL}?token=${data.token}`, '_blank');
            }

        } catch (e) {
            console.log(e);
        }

        setPaymentLoding(false)

    }

    const [paymentAlert, setPaymentAlert] = useState(false);

    const calculateTotalAmount = (data: any, val: number) => {
        let total = 0;
        total += amount;
        data.map((element: any) => {
            if (element.subcategory) {
                element.subcategoryData.map((subcat: any) => {
                    if (subcat.subcategory) {
                        if (subcat.status) {
                            total += subcat.itemsPrice * element.person * element.selectedDates.length;
                        }
                    } else {
                        if (subcat.status) {
                            total += subcat.price * element.person * element.selectedDates.length;
                        }
                    }
                })
            } else {
                if (element.status) {
                    total += element.price * element.person * element.selectedDates.length;
                }
            }
        })
        return (total * val).toFixed(2)

    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Confirm Booking</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {
                    loading ? (<>
                        <div className="w-[100%] py-[2rem] flex justify-center items-center">
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: "#0377de" }}></i>
                        </div>

                    </>) : (
                        <>
                            <IonAlert
                                isOpen={paymentAlert}
                                header="Are you sure you want to make a payment?"
                                buttons={[
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                        handler: () => {
                                            setPaymentAlert(false);
                                        },
                                    },
                                    {
                                        text: 'Pay',
                                        role: 'confirm',
                                        handler: () => {
                                            console.log('Alert confirmed');
                                            setPaymentAlert(false);
                                            setPaymentLoding(true);
                                            handlePayment();
                                        },
                                    },
                                ]}
                                onDidDismiss={({ detail }) => {
                                    console.log(`Dismissed with role: ${detail.role}`);
                                    setPaymentAlert(false); // ensure it closes on dismiss
                                }}
                            />

                            <IonModal
                                isOpen={showSlots}
                                onDidDismiss={() => { setShowSlots(false) }}
                                initialBreakpoint={0.56}
                                breakpoints={[0.56]}
                                handleBehavior="none"
                            >
                                <IonContent>
                                    <div className="w-[100%] h-[56%] bg-[#f6f6f6]">
                                        <div className="h-[100%] w-[100%] p-[0.8rem] flex flex-col justify-around items-center">
                                            <div className=" px-[2rem] w-[100%] flex justify-between items-center text-[#282828] text-[1.4rem]">
                                                <div className="text-[1rem] font-[600] font-[poppins]">Slot Booking</div>
                                                <div className="" onClick={() => { setShowSlots(false) }}
                                                ><IoMdClose /></div>
                                            </div>
                                            <Calendar
                                                className="w-[100%]"
                                                value={dates}
                                                // onChange={(e) => setDates(e.value)}
                                                selectionMode="multiple"
                                                dateFormat="dd-mm-yy"
                                                inline
                                            // disabled
                                            />
                                        </div>
                                    </div>
                                </IonContent>
                            </IonModal>

                            <div className="bg-[#fff] w-[100%] overflow-auto px-[1rem] py-[1rem] pb-[4rem]">

                                <div className="w-[100%] bg-[#e9f3fe] p-[10px] rounded-[10px] " style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                    <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600] flex justify-between items-baseline-last border-b-[1px] pb-[10px]">
                                        <div>Slot Booking</div>
                                        <div className="flex gap-[1rem]">
                                            {/* <div className="text-[1.4rem] flex justify-center items-center" onClick={() => setShowsPerson(true)}><FaPersonCirclePlus /></div> */}
                                            <div className="text-[1.4rem] flex justify-center items-center" onClick={() => setShowSlots(true)}><LuCalendar1 /></div>
                                        </div>
                                    </div>
                                    <div className="mt-[10px] mb-[3px] pb-[10px] border-b-[1px] border-[#000]">
                                        <div className="overflow-x-auto rounded-lg shadow flex flex-col justify-center items-center">
                                            <div className="text-start w-[100%] text-[#242424] text-[0.8rem] font-[poppins] font-[500]">{
                                                // JSON.parse(localStorage.getItem("selectedDate") || "[]").map((val: any, index: any) => (
                                                //     <>{index !== 0 && (",")} {formatDateFormate(val)}</>
                                                // ))

                                                Object.entries(groupDatesByMonth(JSON.parse(localStorage.getItem("selectedDate") || "[]"))).map(([month, days]) => (
                                                    <div key={month}>
                                                        {month} {(days as string[]).join(', ')}
                                                    </div>
                                                ))
                                            }</div>
                                        </div>
                                    </div>
                                    <div className="mt-[10px] text-[#242424] text-[0.8rem] font-[poppins] font-[600]">
                                        {JSON.parse(localStorage.getItem("selectedDate") || "[]").length} {JSON.parse(localStorage.getItem("selectedDate") || "[]").length > 1 ? "Days" : "Day"} x&nbsp;
                                        {amount / JSON.parse(localStorage.getItem("selectedDate") || "[]").length} Amount =&nbsp;
                                        ₹ {amount}
                                    </div>
                                </div>

                                {
                                    addOnsData.map((element: any, index: any) => (
                                        <div key={index}>
                                            <div className="w-[100%] mt-[0.8rem] bg-[#e9f3fe] p-[10px] rounded-[10px] flex flex-col" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                                <div className={`flex justify-between items-center ${element.status && "border-b-[1px] pb-[10px] text-[#242424]"}`}>
                                                    <div className="text-[#242424] text-[0.9rem] font-[poppins] font-[600]">
                                                        {element.label}
                                                        {
                                                            !element.subcategory && element.status && (
                                                                <>
                                                                    <br />
                                                                    (₹ {element.price} Per Person)
                                                                </>
                                                            )
                                                        }
                                                    </div>

                                                    <div className="flex gap-[10px] text-[#242424]">
                                                        {
                                                            element.status && (
                                                                <div className="flex gap-[10px]"> <div className="text-[1.4rem] flex justify-center items-center" onClick={() => {
                                                                    const newAddOns = [...addOnsData];
                                                                    element.personStatus = !element.personStatus;
                                                                    setAddOnsData(newAddOns);

                                                                }}>
                                                                    <FaPersonCirclePlus />
                                                                </div>
                                                                    <div className="text-[1.4rem] flex justify-center items-center" onClick={() => {
                                                                        const newAddOns = [...addOnsData];
                                                                        element.modelStatus = !element.modelStatus;
                                                                        setAddOnsData(newAddOns);

                                                                    }}>
                                                                        <LuCalendar1 />
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        <IonToggle
                                                            checked={element.status}
                                                            onIonChange={() => {
                                                                // Copy array, update status for this index
                                                                const newAddOns = [...addOnsData];
                                                                element.status = !element.status;
                                                                setAddOnsData(newAddOns);
                                                            }}
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


                                                {element.status && (
                                                    <div className="mt-[10px]">
                                                        <div className={`text-start w-[100%] text-[#242424] text-[0.8rem] font-[poppins] font-[500] border-b-[1px] pb-[10px]`}>
                                                            {element.selectedDates.length === 0 ? (
                                                                "No Dates Choosen"
                                                            ) : (
                                                                Object.entries(groupDatesByMonth(element.selectedDates)).map(([month, days]) => (
                                                                    <div key={month}>
                                                                        {month} {(days as string[]).join(', ')}
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>

                                                        {
                                                            element.subcategory && (
                                                                <>

                                                                    <div className="text-[#242424] pt-[10px] font-[poppins] font-[600]">SubCategories</div>
                                                                    {
                                                                        element.subcategoryData.map((subAddons: any, indexSub: any) => (
                                                                            <>
                                                                                <div className={`border-b-[1px] border-[#000]`}>
                                                                                    <div className="ml-[0.5rem] mt-[10px] font-[500]  border-[#000] pb-[10px] flex">
                                                                                        <div className="text-start w-[100%] text-[#242424] text-[0.9rem] font-[poppins] flex justify-between items-center">
                                                                                            {subAddons.label}
                                                                                            <br />
                                                                                            {!subAddons.subcategory && "( ₹ " + subAddons.price + " Per Person )"}</div>
                                                                                        <div className="flex gap-[10px] text-[#242424] items-center">
                                                                                            <IonToggle
                                                                                                checked={subAddons.status}
                                                                                                onIonChange={() => {
                                                                                                    // Copy array, update status for this index
                                                                                                    const newAddOns = [...addOnsData];
                                                                                                    subAddons.status = !subAddons.status;
                                                                                                    setAddOnsData(newAddOns);
                                                                                                }}
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
                                                                                        subAddons.status && (
                                                                                            <>
                                                                                                {subAddons.subcategoryData.map((items: any, index: any) => (
                                                                                                    <div key={index} className="ml-[1rem] mr-[2rem] font-[500] border-[#000] pb-[10px] flex">
                                                                                                        <div className="text-start w-[100%] text-[#242424] text-[0.9rem] font-[poppins] flex justify-between items-center">
                                                                                                            {items.label} <br /> ( ₹{items.price} Per Person )
                                                                                                        </div>
                                                                                                        <div className="flex gap-[10px] text-[#242424] items-center">
                                                                                                            <input
                                                                                                                type="radio"
                                                                                                                name={`subcategory-${items.id}`}
                                                                                                                checked={subAddons.itemsData === items.id}
                                                                                                                onChange={() => {
                                                                                                                    const newAddOns = [...addOnsData];
                                                                                                                    subAddons.itemsData = items.id;
                                                                                                                    subAddons.itemsPrice = items.price;
                                                                                                                    subAddons.itemsLabel = items.label;
                                                                                                                    setAddOnsData(newAddOns);
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))}

                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ))
                                                                    }
                                                                </>
                                                            )
                                                        }

                                                        <div className="mt-[10px] text-[#242424] text-[0.8rem] font-[poppins] font-[600]">
                                                            {
                                                                element.subcategory ? (
                                                                    <>
                                                                        {
                                                                            element.subcategoryData.map((subcat: any) => (
                                                                                <>
                                                                                    <div className="pt-[10px]">
                                                                                        {
                                                                                            subcat.label
                                                                                        }
                                                                                        {
                                                                                            subcat.subcategory ? (
                                                                                                <>
                                                                                                    <br />
                                                                                                    {
                                                                                                        subcat.status && subcat.itemsData ? (
                                                                                                            <>
                                                                                                                (
                                                                                                                {element.selectedDates.length} {element.selectedDates.length > 1 ? "Days" : "Days"} x&nbsp;
                                                                                                                {element.person} {element.person > 1 ? "People" : "Person"} x&nbsp;
                                                                                                                ₹ {subcat.itemsPrice} =&nbsp;
                                                                                                                ₹ {element.selectedDates.length * parseInt(element.person) * subcat.itemsPrice}
                                                                                                                )
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <>Not Seleted</>
                                                                                                        )
                                                                                                    }
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    {
                                                                                                        subcat.status ? (
                                                                                                            <>
                                                                                                                <br />
                                                                                                                (
                                                                                                                {element.selectedDates.length} {element.selectedDates.length > 1 ? "Days" : "Days"} x&nbsp;
                                                                                                                {element.person} {element.person > 1 ? "People" : "Person"} x&nbsp;
                                                                                                                ₹ {subcat.price} =&nbsp;
                                                                                                                ₹ {element.selectedDates.length * parseInt(element.person) * subcat.price}
                                                                                                                )
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <br />
                                                                                                                Not Selected
                                                                                                            </>
                                                                                                        )
                                                                                                    }
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </>
                                                                            ))
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {element.label}&nbsp;
                                                                        <br />
                                                                        (
                                                                        {element.selectedDates.length} {element.selectedDates.length > 1 ? "Days" : "Days"} x&nbsp;
                                                                        {element.person} {element.person > 1 ? "People" : "Person"} x&nbsp;
                                                                        ₹ {element.price} =&nbsp;
                                                                        {element.selectedDates.length * parseInt(element.person) * element.price}
                                                                        )
                                                                    </>
                                                                )
                                                            }
                                                        </div>

                                                    </div>
                                                )}

                                            </div>


                                            <IonModal
                                                isOpen={element.personStatus}
                                                onDidDismiss={() => {
                                                    const newAddOns = [...addOnsData];
                                                    element.personStatus = false;
                                                    setAddOnsData(newAddOns);
                                                }}
                                                initialBreakpoint={0.56}
                                                breakpoints={[0.56]}
                                                handleBehavior="none"
                                            >
                                                <IonContent>
                                                    <div className="w-[100%] h-[100%] bg-[#f6f6f6]">
                                                        <div className="h-[100%] w-[100%] p-[0.8rem] flex flex-col justify-around items-center">
                                                            <div className=" px-[2rem] w-[100%] h-[10%] flex justify-between items-center text-[#282828] text-[1.4rem]">
                                                                <div className="text-[1rem] font-[600] font-[poppins]">{element.label}</div>
                                                                <div className="" onClick={() => {
                                                                    const newAddOns = [...addOnsData];
                                                                    element.personStatus = false;
                                                                    setAddOnsData(newAddOns);
                                                                }}
                                                                ><IoMdClose /></div>
                                                            </div>
                                                            <div className="h-[80%] w-[100%]">
                                                                <IonPicker className="custom-picker">
                                                                    <IonPickerColumn className="custom-picker" value={element.person} onIonChange={(e: any) => {
                                                                        const newAddOns = [...addOnsData];
                                                                        element.person = e.target.value;
                                                                        setAddOnsData(newAddOns);
                                                                    }}>
                                                                        {Array.from({ length: 30 }, (_, i) => i + 1).map((a: number) => (
                                                                            <IonPickerColumnOption key={a} value={a}>
                                                                                {a} {a === 1 ? 'Person' : 'People'}
                                                                            </IonPickerColumnOption>
                                                                        ))}
                                                                    </IonPickerColumn>
                                                                </IonPicker>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </IonContent>
                                            </IonModal>


                                            <IonModal
                                                isOpen={element.modelStatus}
                                                onDidDismiss={() => {
                                                    const newAddOns = [...addOnsData];
                                                    element.modelStatus = false;
                                                    setAddOnsData(newAddOns);
                                                }}
                                                initialBreakpoint={0.56}
                                                breakpoints={[0.56]}
                                                handleBehavior="none"
                                            >
                                                <IonContent>
                                                    <div className="w-[100%] h-[56%] bg-[#f6f6f6]">
                                                        <div className="h-[100%] w-[100%] p-[0.8rem] flex flex-col justify-around items-center">
                                                            <div className=" px-[2rem] w-[100%] flex justify-between items-center text-[#282828] text-[1.4rem]">
                                                                <div className="text-[1rem] font-[600] font-[poppins]">{element.label} Booking</div>
                                                                <div className="" onClick={() => {
                                                                    const newAddOns = [...addOnsData];
                                                                    element.modelStatus = false;
                                                                    setAddOnsData(newAddOns);
                                                                }}
                                                                ><IoMdClose /></div>
                                                            </div>
                                                            <Calendar
                                                                className="w-[100%]"
                                                                value={element.selectedDates.map(parseDateString)}
                                                                onChange={e => {
                                                                    // Only allow selecting availableDate
                                                                    const selected = Array.isArray(e.value) ? e.value : [e.value];
                                                                    const selectedStr = selected.map(formatDate);
                                                                    const filtered = selectedStr.filter(d => element.availableDate.includes(d));
                                                                    const newAddOns = [...addOnsData];
                                                                    element.selectedDates = filtered;
                                                                    setAddOnsData(newAddOns);
                                                                }}
                                                                selectionMode="multiple"
                                                                inline
                                                                minDate={new Date()} // or earliest available
                                                                maxDate={new Date(2100, 11, 31)}
                                                                dateTemplate={dayObj => {
                                                                    const date = new Date(dayObj.year, dayObj.month, dayObj.day);
                                                                    const dateStr = formatDate(date);
                                                                    const isStricked = element.strickedDate.includes(dateStr);
                                                                    const isAvailable = element.availableDate.includes(dateStr);
                                                                    return (
                                                                        <div className={`p-day`}>
                                                                            <span
                                                                                className={
                                                                                    isStricked
                                                                                        ? "strike-date"
                                                                                        : isAvailable
                                                                                            ? ""
                                                                                            : "p-disabled"
                                                                                }
                                                                                style={{
                                                                                    textDecoration: isStricked ? "line-through" : "none",
                                                                                    color: isStricked ? "#b71c1c" : undefined,
                                                                                    opacity: isAvailable ? 1 : 0.3,
                                                                                    pointerEvents: isAvailable ? "auto" : "none"
                                                                                }}
                                                                            >
                                                                                {dayObj.day}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                }}
                                                                disabledDates={element.strickedDate.map(parseDateString)}
                                                            // Only allow availableDate
                                                            // PrimeReact doesn't have an allowDates prop, so we handle in onChange and dateTemplate
                                                            />
                                                        </div>
                                                    </div>
                                                </IonContent>
                                            </IonModal>
                                        </div>
                                    ))
                                }

                                <div className="w-[100%] bg-[#e9f3fe] my-[20px] p-[10px] rounded-[10px] ">
                                    <div className="flex justify-between">
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            Net Amount
                                        </div>
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            ₹&nbsp;{
                                                calculateTotalAmount(addOnsData, 1)
                                            }

                                        </div>
                                    </div>
                                    <div className="flex justify-between my-[5px]">
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            SGST (9%)
                                        </div>
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            ₹&nbsp;{
                                                calculateTotalAmount(addOnsData, 0.09)
                                            }

                                        </div>
                                    </div>
                                    <div className="flex justify-between mb-[5px]">
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            CGST (9%)
                                        </div>
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            ₹&nbsp;{
                                                calculateTotalAmount(addOnsData, 0.09)
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            Total Payable Amount
                                        </div>
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            ₹&nbsp;{
                                                (
                                                    (parseFloat(calculateTotalAmount(addOnsData, 1)) + parseFloat(calculateTotalAmount(addOnsData, 0.09)) + parseFloat(calculateTotalAmount(addOnsData, 0.09)))
                                                ).toFixed(2)
                                            }
                                        </div>
                                    </div>
                                </div>


                                <div className="flex justify-center">
                                    <IonButton
                                        style={{ position: "fixed", bottom: "0px", zIndex: 9999 }}
                                        onClick={() => {
                                            if (!paymentLoading) {
                                                setPaymentAlert(true)
                                            }
                                        }} className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[0.8rem] font-[poppins]">  {paymentLoading ? (<i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>) : `Pay ₹ ${(
                                            (parseFloat(calculateTotalAmount(addOnsData, 1)) + parseFloat(calculateTotalAmount(addOnsData, 0.09)) + parseFloat(calculateTotalAmount(addOnsData, 0.09)))
                                        ).toFixed(2)
                                            }
                                            `}</IonButton>
                                </div>
                            </div>
                        </>
                    )
                }
            </IonContent>
        </IonPage>
    );
};

export default ConfirmBooking;
