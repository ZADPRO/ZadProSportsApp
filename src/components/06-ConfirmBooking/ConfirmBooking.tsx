import { IonAlert, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonModal, IonPage, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { LuCalendar1 } from "react-icons/lu";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { Calendar } from "primereact/calendar";
import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import { decrypt } from "../../Helper";
import { TbRuler2Off } from "react-icons/tb";
import { RadioButton } from 'primereact/radiobutton';


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

                    // const newData: any = []

                    // data.addons.map((element: any) => {
                    //     console.log(element.refAddOnsId)
                    //     const val: any = []

                    //     data.result.map((date: any) => {
                    //         console.log(date.refAddOnsId + " " + date.unAvailabilityDate + " " + element.refAddOnsId)

                    //         if (date.refAddOnsId === element.refAddOnsId) {
                    //             val.push(date.unAvailabilityDate)
                    //         }
                    //     })


                    //     newData.push({
                    //         label: element.refAddOn,
                    //         id: element.refAddOnsId,
                    //         strickedDate: val,
                    //         price: element.refAddOnPrice
                    //         subcategori
                    //     });
                    // });

                    // setAmount(data.totalAmount)

                    const newData = [
                        {
                            label: "Food",
                            id: 1,
                            strickedDate: ["29-05-2025", "30-05-2025"],
                            price: null,
                            subcategory: true,
                            subcategoryData: [
                                {
                                    label: "Breakfast",
                                    price: null,
                                    subcategory: true,
                                    status: false,
                                    itemsData: null,
                                    subcategoryData: [
                                        {
                                            id: 1,
                                            label: "Idly",
                                            price: 30,
                                        },
                                        {
                                            id: 2,
                                            label: "Pongal",
                                            price: 50,
                                        }
                                    ]
                                },
                                {
                                    label: "Lunch",
                                    price: null,
                                    subcategory: true,
                                    subcategoryData: [
                                        {
                                            id: 4,
                                            label: "Veg Meal",
                                            price: 100,
                                        },
                                        {
                                            id: 5,
                                            label: "Non-Veg Meal",
                                            price: 100,
                                        }
                                    ]
                                },
                                {
                                    label: "Dinner",
                                    price: 89,
                                    subcategory: false,
                                    subcategoryData: []
                                }
                            ]
                        },
                        // {
                        //     label: "Food",
                        //     id: 2,
                        //     strickedDate: ["12-06-2025"]
                        // }
                    ];

                    // setAmount(data.totalAmount)


                    const val: any = newData.length > 0 ? newData.map((element: any) => {
                        // Exclude stricked dates from availableDate
                        const availableDate = bookingAvailableDate.filter((d: string) =>
                            !element.strickedDate.includes(d)
                        );
                        return {
                            ...element,
                            availableDate, // these are selectable
                            status: false, // toggle
                            selectedDates: availableDate, // user-selected dates for this add-on,
                            modelStatus: false,
                        };
                    }) : [];
                    setAddOnsData(val);

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

    // useEffect(() => {
    //     StatusBar.setOverlaysWebView({ overlay: false });
    //     StatusBar.setStyle({ style: Style.Dark });
    //     StatusBar.setBackgroundColor({ color: "#0377de" });

    //     return () => {
    //         StatusBar.setOverlaysWebView({ overlay: true });
    //     };
    // }, []);


    function groupDatesByMonth(dates: any) {
        const groups: any = {};

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
    }

    const [paymentLoading, setPaymentLoding] = useState(false)

    const handlePayment = async () => {
        try {


            const urlParams = new URLSearchParams(window.location.search);
            const groundId = urlParams.get('groundId');

            const bookingAvailableDate = JSON.parse(localStorage.getItem("selectedDate") || "[]");

            const addons: any = [];


            addOnsData.map((element: any) => {

                addons.push({
                    refAddOnsId: element.id,
                    refAddOn: element.label,
                    refPrice: element.price,
                    selectedDates: element.status ? element.selectedDates : []
                })


            })


            const totalAmount = (amount + addOnsData.reduce((total: number, element: any) => {
                return total + (element.status ? element.selectedDates.length * element.price : 0);
            }, 0)) + ((amount + addOnsData.reduce((total: number, element: any) => {
                return total + (element.status ? element.selectedDates.length * element.price : 0);
            }, 0)) * 0.09) + ((amount + addOnsData.reduce((total: number, element: any) => {
                return total + (element.status ? element.selectedDates.length * element.price : 0);
            }, 0)) * 0.09)


            const bookingAmount = amount;

            const sgst = ((amount + addOnsData.reduce((total: number, element: any) => {
                return total + (element.status ? element.selectedDates.length * element.price : 0);
            }, 0)) * 0.09)

            const cgst = ((amount + addOnsData.reduce((total: number, element: any) => {
                return total + (element.status ? element.selectedDates.length * element.price : 0);
            }, 0)) * 0.09)

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/userRoutes/userGroundBooking`,
                {
                    refGroundId: groundId,
                    isAddonNeeded: true,
                    refBookingTypeId: 1,
                    refBookingStartDate: bookingAvailableDate[0],
                    refBookingEndDate: bookingAvailableDate[bookingAvailableDate.length - 1],
                    additionalNotes: "",
                    refAddOns: addons,
                    refTotalAmount: totalAmount,
                    refBookingAmount: bookingAmount,
                    refSGSTAmount: sgst,
                    refCGSTAmount: cgst,
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

            localStorage.setItem("token", "Bearer " + data.token)

            if (data.success) {
                location.replace("/bookinghistory");
                setAddOnsData([]);

            }


        } catch (e) {
            console.log(e);
        }

        setPaymentLoding(false)

    }

    const [paymentAlert, setPaymentAlert] = useState(false);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Confirm Booking</IonTitle>
                </IonToolbar>
                {/* <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] h-[8vh] text-[1.3rem]">
                    <div><IoIosArrowBack className="text-[1.5rem]" onClick={() => { history.goBack() }} /></div>
                    <div className="text-[1rem] font-[poppins] font-[600] text-[#fff] ml-[-1.2rem]">Confirm Booking</div>
                    <div></div>
                </div> */}
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

                                <div className="w-[100%] bg-[#e7e7e7] p-[10px] rounded-[10px] ">
                                    <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600] flex justify-between items-baseline-last border-b-[1px] pb-[10px]"><div>Slot Booking ({JSON.parse(localStorage.getItem("selectedDate") || "[]").length} x {localStorage.getItem("price")} = ₹ {amount})</div> <div className="text-[1.4rem] flex justify-center items-center" onClick={() => setShowSlots(true)}><LuCalendar1 /></div></div>
                                    <div className="mt-[10px] mb-[3px]">
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
                                </div>

                                {
                                    addOnsData.map((element: any, index: any) => (
                                        <div key={index}>
                                            <div className="w-[100%] mt-[0.6rem] bg-[#e7e7e7] p-[10px] rounded-[10px] flex flex-col ">
                                                <div className={`flex justify-between items-baseline-last ${element.status && "border-b-[1px] pb-[10px] text-[#242424]"}`}>
                                                    <div className="text-[#242424] text-[0.9rem] font-[poppins] font-[600]">
                                                        {/* ({element.status && index === 0 ? `1 x ${foodRate}` : `1 x ${stayRate}`} = ₹ {index === 0 ? foodRate : stayRate}) */}
                                                        {element.label}  {
                                                            element.status && (
                                                                <>
                                                                    ({element.selectedDates.length} x {element.price} = ₹ {element.price * element.selectedDates.length})
                                                                </>
                                                            )
                                                        }
                                                    </div>

                                                    <div className="flex gap-[10px] text-[#242424]">
                                                        <div className="text-[1.4rem] flex justify-center items-center" onClick={() => {
                                                            const newAddOns = [...addOnsData];
                                                            element.modelStatus = !element.modelStatus;
                                                            setAddOnsData(newAddOns);

                                                        }}><LuCalendar1 /></div>
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
                                                        <div className="text-start w-[100%] text-[#242424] text-[0.8rem] font-[poppins] font-[500] border-b-[1px] pb-[10px]">
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
                                                                        element.subcategoryData.map((subAddons: any) => (
                                                                            <>
                                                                                <div className="border-b-[1px] border-[#000] ">
                                                                                    <div className="ml-[0.5rem] mt-[10px] font-[500]  border-[#000] pb-[10px] flex">
                                                                                        <div className="text-start w-[100%] text-[#242424] text-[0.9rem] font-[poppins] flex justify-between items-center">{subAddons.label}</div>
                                                                                        <div className="flex gap-[10px] text-[#242424]">
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
                                                                                                    <div key={index} className="ml-[1rem] mr-[2rem] mt-[10px] font-[500] border-[#000] pb-[10px] flex">
                                                                                                        <div className="text-start w-[100%] text-[#242424] text-[0.9rem] font-[poppins] flex justify-between items-center">
                                                                                                            {items.label}
                                                                                                        </div>
                                                                                                        <div className="flex gap-[10px] text-[#242424]">
                                                                                                            <input
                                                                                                                type="radio"
                                                                                                                name={`subcategory-${items.id}`}
                                                                                                                checked={subAddons.itemsData === items.id}
                                                                                                                onChange={() => {
                                                                                                                    const newAddOns = [...addOnsData];
                                                                                                                    subAddons.itemsData = items.id;
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

                                                    </div>
                                                )}

                                            </div>



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


                                            {/* {element.status && (
                                    <div className="w-[100%] bg-[#e7e7e7] mt-[0.6rem] p-[10px] rounded-[10px] ">
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
                                )} */}
                                        </div>
                                    ))
                                }

                                <div className="w-[100%] bg-[#e7e7e7] my-[20px] p-[10px] rounded-[10px] ">
                                    <div className="flex justify-between">
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            Net Amount
                                        </div>
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            ₹ {amount + addOnsData.reduce((total: number, element: any) => {
                                                return total + (element.status ? element.selectedDates.length * element.price : 0);
                                            }, 0)}

                                        </div>
                                    </div>
                                    <div className="flex justify-between my-[5px]">
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            SGST (9%)
                                        </div>
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            ₹ {(amount + addOnsData.reduce((total: number, element: any) => {
                                                return total + (element.status ? element.selectedDates.length * element.price : 0);
                                            }, 0)) * 0.09}

                                        </div>
                                    </div>
                                    <div className="flex justify-between mb-[5px]">
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            CGST (9%)
                                        </div>
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            ₹ {(amount + addOnsData.reduce((total: number, element: any) => {
                                                return total + (element.status ? element.selectedDates.length * element.price : 0);
                                            }, 0)) * 0.09}

                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            Total Payable Amount
                                        </div>
                                        <div className="text-[0.9rem] font-[poppins] text-[#242424] font-[600]">
                                            ₹ {(amount + addOnsData.reduce((total: number, element: any) => {
                                                return total + (element.status ? element.selectedDates.length * element.price : 0);
                                            }, 0)) + ((amount + addOnsData.reduce((total: number, element: any) => {
                                                return total + (element.status ? element.selectedDates.length * element.price : 0);
                                            }, 0)) * 0.09) + ((amount + addOnsData.reduce((total: number, element: any) => {
                                                return total + (element.status ? element.selectedDates.length * element.price : 0);
                                            }, 0)) * 0.09)}
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="w-[100%] mt-[0.6rem] bg-[#e7e7e7] p-[10px] rounded-[10px] flex justify-between items-center">
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
                    } */}

                                <div className="flex justify-center">
                                    <IonButton
                                        style={{ position: "fixed", bottom: "0px", zIndex: 9999 }}
                                        onClick={() => {
                                            if (!paymentLoading) {
                                                setPaymentAlert(true)
                                            }
                                        }} className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[0.8rem] font-[poppins]">  {paymentLoading ? (<i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>) : `Pay ₹  ${(amount + addOnsData.reduce((total: number, element: any) => {
                                            return total + (element.status ? element.selectedDates.length * element.price : 0);
                                        }, 0) + ((amount + addOnsData.reduce((total: number, element: any) => {
                                            return total + (element.status ? element.selectedDates.length * element.price : 0);
                                        }, 0)) * 0.09) + ((amount + addOnsData.reduce((total: number, element: any) => {
                                            return total + (element.status ? element.selectedDates.length * element.price : 0);
                                        }, 0)) * 0.09))
                                            }`}</IonButton>
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
