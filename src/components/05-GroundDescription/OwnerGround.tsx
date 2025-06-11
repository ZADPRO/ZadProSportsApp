import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Calendar } from "primereact/calendar";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { decrypt } from "../../Helper";
import Logo from "../../assets/images/unavailable.png";

type StreakDate = { date: string };

const OwnerGround = () => {
  const [showModal, setShowModal] = useState(false);

  const [dates, setDates] = useState<[Date | null, Date | null] | null>(null);
  const [isDateRangeSelected, setIsDateRangeSelected] = useState(false);

  const history = useHistory();

  const [streakDates, setStreakDates] = useState<StreakDate[]>([]);

  // Helper: parse "dd-MM-yyyy" string to Date object (midnight)
  const parseDateString = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("-");
    return new Date(+year, +month - 1, +day, 0, 0, 0, 0);
  };

  // Convert streakDates to Date objects once (memoized)
  const streakDateObjects = useMemo(() => {
    return streakDates.map(({ date }) => parseDateString(date));
  }, [streakDates]);

  const dayObjToDate = (dayObj: {
    day: number;
    month: number;
    year: number;
  }) => {
    return new Date(dayObj.year, dayObj.month, dayObj.day);
  };

  const isStreakDate = (dayObj: {
    day: number;
    month: number;
    year: number;
  }) => {
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

    for (let d = new Date(s.getTime()); d <= e; d.setDate(d.getDate() + 1)) {
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

  const isSelectedDate = (dayObj: {
    day: number;
    month: number;
    year: number;
  }) => {
    if (!dates || !dates[0]) return false;
    const current = dayObjToDate(dayObj);
    // If both dates are selected (range)
    if (dates[1]) {
      const start = dates[0];
      const end = dates[1];
      return current >= start && current <= end;
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
            isSelected ? "selected-green" : isStreak ? "strike-date" : ""
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
      alert(
        "You cannot select a range that includes an unavailable (striked) date."
      );
      setDates(null);
      setIsDateRangeSelected(false);
      return;
    }

    const sortedDates = [start, end].sort(
      (a, b) => a!.getTime() - b!.getTime()
    ) as [Date, Date];
    setDates(sortedDates);
    setIsDateRangeSelected(true);
  };

  const handleClear = () => {
    setDates(null);
    setIsDateRangeSelected(false);
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getAllDatesInRange = (start: Date, end: Date): string[] => {
    const dates: string[] = [];
    let current = new Date(start.getTime());
    current.setHours(0, 0, 0, 0);
    end = new Date(end.getTime());
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
      dates.push(formatDate(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // useEffect(() => {
  //     StatusBar.setOverlaysWebView({ overlay: false });
  //     StatusBar.setStyle({ style: Style.Dark });
  //     StatusBar.setBackgroundColor({ color: "#0377de" });

  //     return () => {
  //         StatusBar.setOverlaysWebView({ overlay: true });
  //     };
  // }, []);

  const [loading, setLoading] = useState(false);

  const [description, setDescription]: any = useState([]);
  const [image, setImage]: any = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const groundId = urlParams.get("groundId");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/groundRoutes/getGround`,
        {
          refGroundId: groundId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log(data);

      localStorage.setItem("token", "Bearer " + data.token);

      if (data.success) {
        setDescription(data.result);
        console.log('setDescription(data.result[0])--->', data.result)

        setImage(data.imgResult[0]);
      }

      setLoading(false);
    } catch (e: any) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = (event: any) => {
    fetchData();
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        {/* <div className="text-[#fff] bg-[#0377de] flex justify-between items-center px-[1.5rem] h-[8vh] text-[1.3rem]">
                    <div><IoIosArrowBack className="text-[1.5rem]" onClick={() => { history.goBack() }} /></div>
                    <div className="text-[1rem] font-[poppins] font-[600] text-[#fff] ml-[-1.2rem]">Description</div>
                    <div></div>
                </div> */}
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Description</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher
          style={{ background: "#fff" }}
          slot="fixed"
          onIonRefresh={handleRefresh}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {loading && !description.IframeLink ? (
          <>
            <div className="w-[100%] py-[2rem] flex justify-center items-center">
              <i
                className="pi pi-spin pi-spinner"
                style={{ fontSize: "2rem", color: "#0377de" }}
              ></i>
            </div>
          </>
        ) : (
          <div className="bg-[#fff] w-[100%] overflow-auto  pb-[4rem]">
            {/* <IonModal
              isOpen={showModal}
              onDidDismiss={() => setShowModal(false)}
              initialBreakpoint={0.6}
              breakpoints={[0.6]}
              handleBehavior="none"
            >
              <IonContent>
                <div className="w-[100%] h-[60%] bg-[#f9fff7]">
                  <div className="h-[85%]">
                    <iframe
                      src={description.IframeLink}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      // loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="w-[100%] flex justify-center items-center">
                    <IonButton
                      style={{ position: "fixed", bottom: "40%", zIndex: 9999 }}
                      onClick={() => setShowModal(false)}
                      className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[1rem]"
                    >
                      Close
                    </IonButton>
                  </div>
                </div>
              </IonContent>
            </IonModal>

            <IonModal
              isOpen={showDatePickerModal}
              onDidDismiss={() => {
                setShowDatePickerModal(false);
                handleClear();
              }}
              initialBreakpoint={0.6}
              breakpoints={[0.6]}
              handleBehavior="none"
            >
              <IonContent>
                <div className="w-[100%] h-[60%] bg-[#f6f6f6]">
                  <div
                    className="h-[15%] px-[0.5rem] w-[100%] flex justify-end items-center text-[#282828] text-[1.4rem]"
                    onClick={() => {
                      setShowDatePickerModal(false);
                      handleClear();
                    }}
                  >
                    <IoMdClose />
                  </div>
                  <div className="h-[70%] w-[100%] p-[2rem] flex justify-center items-center">
                    <Calendar
                      className="w-[100%] text-[poppins]"
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
                    style={{
                      position: "fixed",
                      bottom: "40%",
                      zIndex: 9999,
                      width: "100%",
                    }}
                  >
                    <IonButton
                      onClick={handleClear}
                      className="custom-ion-button text-[0.8rem] font-[poppins] w-[38%] h-[5vh] text-[#fff]"
                    >
                      Clear
                    </IonButton>
                    <IonButton
                      onClick={() => {
                        if (dates && dates[0]) {
                          let selectedDateStrings: string[] = [];
                          if (dates[1]) {
                            // Range selected: get all dates in between
                            selectedDateStrings = getAllDatesInRange(
                              dates[0],
                              dates[1]
                            );
                          } else {
                            // Only one date selected
                            selectedDateStrings = [formatDate(dates[0])];
                          }
                          localStorage.setItem(
                            "selectedDate",
                            JSON.stringify(selectedDateStrings)
                          );
                          localStorage.setItem(
                            "price",
                            description.refGroundPrice
                          );
                        }
                        setShowDatePickerModal(false);
                        history.push(
                          "/booking?groundId=" + description.refGroundId
                        );
                      }}
                      disabled={!dates || !dates[0]}
                      className="custom-ion-button font-[poppins] w-[58%] h-[5vh] text-[#fff] text-[0.8rem]"
                    >
                      Continue Booking
                    </IonButton>
                  </div>
                </div>
              </IonContent>
            </IonModal> */}
            {image.refGroundImage ? (
              <img
                style={{ width: "100%", height: "180px" }}
                className="object-cover"
                src={`data:${image.refGroundImage.contentType};base64,${image.refGroundImage.content}`}
                alt={image.refGroundName}
              />
            ) : (
              <img
                src={Logo}
                style={{ width: "100%", height: "180px" }}
                className="object-cover"
                alt="Logo"
              />
            )}

            <div className="px-[1rem]">
              <div className="text-[#3c3c3c] text-[1.3rem] font-[600] pt-[10px] pb-[4px] font-[poppins]">
                {description.refGroundName}
              </div>
              <div className="text-[#3c3c3c] text-[0.9rem] font-[600] pt-[1px] pb-[4px] font-[poppins]">
                Single Day - Rs. {description.refGroundPrice}
              </div>
              <div className="text-[#3c3c3c] text-[0.9rem] font-[600] pt-[1px] pb-[4px] font-[poppins]">
                Multiple Days - Rs. {description.refTournamentPrice}
              </div>
              <div className="text-[#3c3c3c] text-[0.8rem] font-[500] pb-[10px] font-[poppins]">
                {description.refDescription}
              </div>
              <div className="text-[#3c3c3c] text-[1rem] font-[600] pb-[0px] font-[poppins]">
                Address
              </div>
              <div className="text-[#3c3c3c] text-[0.8rem] font-[500] pb-[15px] font-[poppins]">
                {description.refGroundLocation}, {description.refGroundState},{" "}
                {description.refGroundPincode}{" "}
                <span
                  className="text-[#0377de] underline"
                  onClick={() => setShowModal(true)}
                >
                  View in Map
                </span>
              </div>
              <div className="text-[#242424] font-[poppins] text-[0.9rem] font-[600] rounded-[10px] p-[px]">
                Features
              </div>
              <div className="text-[#3c3c3c] mt-[0.6rem] text-[0.8rem] font-[500] pb-[15px] font-[poppins]">
                <div className="px-[1.5rem]">
                  {description.refFeaturesName &&
                    description.refFeaturesName.map((element: any) => (
                      <li>{element}</li>
                    ))}
                </div>
              </div>
              <div className="text-[#242424] font-[poppins] text-[0.9rem] font-[600] rounded-[10px] p-[3px]">
                Facility Available
              </div>
              <div className="text-[#3c3c3c] mt-[0.6rem] text-[0.8rem] font-[500] pb-[15px] font-[poppins]">
                <div className="px-[1.5rem]">
                  {description.refFacilitiesName &&
                    description.refFacilitiesName.map((element: any) => (
                      <li>{element}</li>
                    ))}
                </div>
              </div>
              <div className="text-[#242424] font-[poppins] text-[0.9rem] font-[600] rounded-[10px] p-[px]">
                User Guidelines
              </div>
              <div className="text-[#3c3c3c] mt-[0.6rem] text-[0.8rem] font-[500] pb-[15px] font-[poppins]">
                <div className="px-[1.5rem]">
                  {description.refUserGuidelinesName &&
                    description.refUserGuidelinesName.map((element: any) => (
                      <li>{element}</li>
                    ))}
                </div>
              </div>
              <div className="text-[#242424] font-[poppins] text-[0.9rem] font-[600] rounded-[10px] p-[px]">
                Additional Tips
              </div>
              <div className="text-[#3c3c3c] mt-[0.6rem] text-[0.8rem] font-[500] pb-[15px] font-[poppins]">
                <div className="px-[1.5rem]">
                  {description.refAdditionalTipsName &&
                    description.refAdditionalTipsName.map((element: any) => (
                      <li>{element}</li>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <IonButton
                style={{ position: "fixed", bottom: "0px" }}
                onClick={() => {}}
                className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[0.8rem] font-[poppins]"
              >
                Edit Now
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OwnerGround;
