import { IonButton, IonContent, IonFooter, IonHeader, IonModal, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import logo from "../../assets/images/Logo.jpg";
import { InputText } from 'primereact/inputtext';
import { useEffect, useMemo, useRef, useState } from "react";
import { Password } from 'primereact/password';
import { useHistory } from "react-router";
import { TbUserCog } from "react-icons/tb";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

import Ground1 from "../../assets/images/Ground1.png"
import Ground11 from "../../assets/images/Ground11.png"
import Ground12 from "../../assets/images/Ground12.png"
import Ground13 from "../../assets/images/Ground13.png"
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { Calendar } from 'primereact/calendar';
import { IoIosArrowBack, IoMdClose } from "react-icons/io";

type StreakDate = { date: string };


const GroundDescription = () => {
    const usernameRef = useRef<HTMLInputElement>(null); // ✅ CORRECT TYPING

    const handleLogin = () => {
        const username = usernameRef.current?.value;
        console.log("Username:", username);
    }


    const history = useHistory();

    const [showModal, setShowModal] = useState(false);
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);
    const [dates, setDates] = useState<[Date | null, Date | null] | null>(null);
    const [isDateRangeSelected, setIsDateRangeSelected] = useState(false);

    // Your streak dates array (string format "dd-MM-yyyy")
    const streakDates: StreakDate[] = [
        { date: "24-05-2025" },
        { date: "28-05-2025" },
        // add more dates here
    ];

    // Helper: parse "dd-MM-yyyy" string to Date object (midnight)
    const parseDateString = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split("-");
        return new Date(+year, +month - 1, +day, 0, 0, 0, 0);
    };

    // Convert streakDates to Date objects once (memoized)
    const streakDateObjects = useMemo(() => {
        return streakDates.map(({ date }) => parseDateString(date));
    }, [streakDates]);

    const dayObjToDate = (dayObj: { day: number; month: number; year: number }) => {
        return new Date(dayObj.year, dayObj.month, dayObj.day);
    };

    const isStreakDate = (dayObj: { day: number; month: number; year: number }) => {
        const date = dayObjToDate(dayObj);
        return streakDateObjects.some(
            (d) =>
                d.getFullYear() === date.getFullYear() &&
                d.getMonth() === date.getMonth() &&
                d.getDate() === date.getDate()
        );
    };

    // Returns true if any date in [start, end] is a streak date
    const isRangeBlockedByStreak = (start: Date, end: Date) => {
        // Ensure start <= end
        const s = start.getTime() < end.getTime() ? start : end;
        const e = start.getTime() < end.getTime() ? end : start;

        for (
            let d = new Date(s.getTime());
            d <= e;
            d.setDate(d.getDate() + 1)
        ) {
            if (
                streakDateObjects.some(
                    (streak) =>
                        streak.getFullYear() === d.getFullYear() &&
                        streak.getMonth() === d.getMonth() &&
                        streak.getDate() === d.getDate()
                )
            ) {
                return true;
            }
        }
        return false;
    };


    const isSelectedDate = (dayObj: { day: number; month: number; year: number }) => {
        if (!dates || !dates[0]) return false;
        const current = dayObjToDate(dayObj);
        // If both dates are selected (range)
        if (dates[1]) {
            const start = dates[0];
            const end = dates[1];
            return (
                current >= start &&
                current <= end
            );
        }
        // If only start date is selected
        return (
            current.getFullYear() === dates[0].getFullYear() &&
            current.getMonth() === dates[0].getMonth() &&
            current.getDate() === dates[0].getDate()
        );
    };


    const dateTemplate = (dayObj: any) => {
        const isStreak = isStreakDate(dayObj);
        const isSelected = isSelectedDate(dayObj);

        return (
            <div className={`p-day`}>
                <span
                    className={
                        isSelected
                            ? "selected-green"
                            : isStreak
                                ? "strike-date"
                                : ""
                    }
                >
                    {dayObj.day}
                </span>
            </div>
        );
    };

    // Tomorrow calculation for minDate
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const handleDateChange = (e: any) => {
        const selectedDates = e.value;

        if (!selectedDates || selectedDates.length !== 2) {
            setDates(null);
            setIsDateRangeSelected(false);
            return;
        }

        const [start, end] = selectedDates;

        if (!start) {
            setDates(null);
            setIsDateRangeSelected(false);
            return;
        }

        if (!end) {
            setDates([start, null]);
            setIsDateRangeSelected(false);
            return;
        }

        // Block if any date in range is a streak date
        if (isRangeBlockedByStreak(start, end)) {
            alert("You cannot select a range that includes an unavailable (striked) date.");
            setDates(null);
            setIsDateRangeSelected(false);
            return;
        }

        const sortedDates = [start, end].sort((a, b) => a!.getTime() - b!.getTime()) as [Date, Date];
        setDates(sortedDates);
        setIsDateRangeSelected(true);
    };


    const handleClear = () => {
        setDates(null);
        setIsDateRangeSelected(false);
    };

    return (
        <IonPage>

            <IonModal
                isOpen={showModal}
                onDidDismiss={() => setShowModal(false)}
                initialBreakpoint={0.6}
                breakpoints={[0.6]}
                handleBehavior="none">
                <IonContent>
                    <div className="w-[100%] h-[60%] bg-[#f9fff7]">
                        <div className="h-[85%]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.684892936324!2d78.14989567370742!3d11.64578838856081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babef6bdbbc3f7d%3A0x404c804a4826efdf!2sZAdroit%20IT%20Solutions%20Private%20Limited!5e0!3m2!1sen!2sin!4v1748085938680!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="ZAdroit Location"
                            ></iframe>
                        </div>
                        <div className="w-[100%] flex justify-center items-center">
                            <IonButton
                                style={{ position: "fixed", bottom: "40%", zIndex: 9999 }}
                                onClick={() => setShowModal(false)} className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[1rem]">Close</IonButton>
                        </div>
                    </div>
                </IonContent>
            </IonModal>

            <IonModal
                isOpen={showDatePickerModal}
                onDidDismiss={() => { setShowDatePickerModal(false); handleClear() }}
                initialBreakpoint={0.6}
                breakpoints={[0.6]}
                handleBehavior="none"
            >
                <IonContent>
                    <div className="w-[100%] h-[60%] bg-[#f9fff7]">
                        <div className="h-[10%] px-[0.5rem] w-[100%] flex justify-end items-center text-[#282828] text-[1.4rem]" onClick={() => { setShowDatePickerModal(false); handleClear() }}
                        ><IoMdClose /></div>
                        <div className="h-[70%] w-[100%] flex justify-center items-center">
                            <Calendar
                                value={dates}
                                onChange={handleDateChange}
                                selectionMode="range"
                                inline
                                disabled={isDateRangeSelected}
                                minDate={tomorrow}
                                dateTemplate={dateTemplate}
                                disabledDates={streakDateObjects} // <-- disables streak dates!
                            />
                        </div>

                        <div
                            className="flex justify-between px-[1%]"
                            style={{ position: "fixed", bottom: "40%", zIndex: 9999, width: "100%" }}
                        >
                            <IonButton
                                onClick={handleClear}
                                className="custom-ion-button w-[38%] h-[5vh] text-[#fff] text-[1rem]"
                            >
                                Clear
                            </IonButton>
                            <IonButton
                                onClick={() => { setShowDatePickerModal(false); history.push("/booking") }}
                                disabled={!dates || !dates[0]}
                                className="custom-ion-button w-[58%] h-[5vh] text-[#fff] text-[1rem]"
                            >
                                Continue Booking
                            </IonButton>
                        </div>
                    </div>
                </IonContent>
            </IonModal>

            <IonHeader>
                <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] h-[8vh] text-[1.3rem]">
                    <div><IoIosArrowBack className="text-[1.5rem]" onClick={() => { history.goBack() }} /></div>
                    <div className="text-[1.2rem] font-[poppins] font-[500] text-[#fff] ml-[-1.2rem]">Description</div>
                    <div></div>
                </div>
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] h-[92vh] pb-[4rem] overflow-auto px-[1rem] py-[1rem]">
                    <Carousel
                        autoPlay
                        infiniteLoop
                        showThumbs={false}
                        showArrows={false}
                        showStatus={false}
                        stopOnHover={false}
                        interval={3000}
                        preventMovementUntilSwipeScrollTolerance
                        swipeScrollTolerance={50}
                    >
                        <div>
                            <img src={Ground1} className="rounded-[10px]" alt="Ground1" />
                        </div>
                        <div>
                            <img src={Ground11} className="rounded-[10px]" alt="Ground11" />
                        </div>
                        <div>
                            <img src={Ground12} className="rounded-[10px]" alt="Ground12" />
                        </div>
                        <div>
                            <img src={Ground13} className="rounded-[10px]" alt="Ground13" />
                        </div>
                    </Carousel>
                    <div className='text-[#3c3c3c] text-[1rem] font-[600] pt-[10px] pb-[4px] font-[poppins]'>Ground 1</div>
                    <div className='text-[#3c3c3c] text-[0.8rem] font-[500] pb-[15px] font-[poppins]'>38/37B, Logi Chetty Street Number 1, Logi Street, Gugai, Salem, Tamil Nadu 636006 <span className="text-[#0377de] underline" onClick={() => setShowModal(true)}>View in Map</span></div>
                    <div className="text-[#242424] font-[poppins] text-[0.9rem] font-[600] bg-[#a9d6ff] rounded-[10px] p-[6px]" style={{ border: "1.5px solid #0377de" }}>Facilities Available</div>
                    <div className='text-[#3c3c3c] mt-[0.6rem] text-[0.8rem] font-[500] pb-[15px] font-[poppins]'>
                        <div className="px-[1.5rem]">
                            <li>Parking</li>
                            <li>Washrooms</li>
                            <li>Changing rooms</li>
                            <li>Drinking water</li>
                        </div>
                    </div>
                    <div className="text-[#242424] font-[poppins] text-[0.9rem] font-[600] bg-[#a9d6ff] rounded-[10px] p-[6px]" style={{ border: "1.5px solid #0377de" }}>Ground Rules / Policies</div>
                    <div className='text-[#3c3c3c] mt-[0.6rem] text-[0.8rem] font-[500] pb-[15px] font-[poppins]'>
                        <div className="px-[1.5rem]">
                            <li>Cancellation policy</li>
                            <li>Entry rules (e.g., sports shoes only)</li>
                            <li>Max players per slot</li>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <IonButton
                        style={{ position: "fixed", bottom: "0px", }}
                        onClick={() => {
                            setShowDatePickerModal(true)
                        }} className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[1rem]">Book Now</IonButton>
                </div>


            </IonContent>
        </IonPage>
    );
};

export default GroundDescription;
