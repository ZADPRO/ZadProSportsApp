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
import { Carousel } from "react-responsive-carousel";

type StreakDate = { date: string };

const GroundDescription = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [dates, setDates] = useState<[Date | null, Date | null] | null>(null);
  const [isDateRangeSelected, setIsDateRangeSelected] = useState(false);
  const [image, setImage]: any = useState({});
  const history = useHistory();

  // Your streak dates array (string format "dd-MM-yyyy")
  // const [streakDates setStreakDates]: StreakDate[] = [
  //     { date: "24-05-2025" },
  //     { date: "28-05-2025" },
  //     // add more dates here
  // ];

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

  const fetchData = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const groundId = urlParams.get("groundId");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/userRoutes/getGrounds`,
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
        const updatedDates = data.groundUnavailableDate.map((element: any) => ({
          date: element.unAvailabilityDate,
        }));

        setStreakDates(updatedDates);

        setDescription(data.groundResult[0]);
      }

      const urlParams = new URLSearchParams(window.location.search);
      const booknowStatus = urlParams.get("booknowStatus");

      console.log(booknowStatus);
      if (booknowStatus === "false") {
        setShowDatePickerModal(false);
      } else if (booknowStatus === "true") {
        setShowDatePickerModal(true);
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
            <IonModal
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
            </IonModal>
            {description.refGroundImage ? (
              <img
                style={{ width: "100%", height: "180px" }}
                className="object-cover"
                src={`data:${description.refGroundImage.contentType};base64,${description.refGroundImage.content}`}
                alt={description.refGroundName}
              />
            ) : (
              <img
                src={Logo}
                style={{ width: "100%", height: "180px" }}
                className="object-cover"
                alt="Logo"
              />
            )}

            {/* <Carousel
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
                            <img src={`data:${description};base64,${description.refGroundImage.content}`} alt="Ground11" />
                        </div>
                    </Carousel> */}
            <div
              style={{
                background: "#ffffff",
                padding: "1rem",
                paddingBottom: "6rem",
              }}
            >
              {/* <div style={{ borderRadius: "6px", overflow: "hidden" }}>
                {image.refGroundImage ? (
                  <img
                    src={`data:${image.refGroundImage.contentType};base64,${image.refGroundImage.content}`}
                    alt={image.refGroundName}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={Logo}
                    alt="No Image"
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div> */}

              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#222",
                  marginTop: "1rem",
                }}
              >
                {description.refGroundName}
              </h2>
              <p style={{ fontSize: "14px", color: "#555" }}>
                Ground ID: {description.refGroundCustId}
              </p>

              <div
                style={{ marginTop: "0.5rem", fontSize: "14px", color: "#333" }}
              >
                <p>
                  <strong>Single Day:</strong> ₹{description.refGroundPrice}
                </p>
                <p>
                  <strong>Multiple Days:</strong> ₹
                  {description.refTournamentPrice}
                </p>
              </div>

              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "14px",
                  color: "#333",
                  lineHeight: "1.5",
                }}
              >
                {description.refDescription}
              </p>

              <div style={{ marginTop: "1rem" }}>
                <h3
                  style={{
                    fontWeight: "bold",
                    color: "#222",
                    fontSize: "15px",
                  }}
                >
                  Address
                </h3>
                <p style={{ fontSize: "14px", color: "#444" }}>
                  {description.refGroundLocation}, {description.refGroundState},{" "}
                  {description.refGroundPincode}{" "}
                  <span
                    style={{
                      color: "#4338ca",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    View in Map
                  </span>
                </p>
              </div>

              <div
                style={{ marginTop: "1rem", fontSize: "14px", color: "#333" }}
              >
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: description.refStatus ? "#22c55e" : "#cc5a5a",
                    }}
                  >
                    {description.refStatus ? "Active" : "Inactive"}
                  </span>
                </p>
                <p>
                  <strong>Add‑ons Available:</strong>{" "}
                  {description.isAddOnAvailable ? "Yes" : "No"}
                </p>
              </div>
              {description.addOns && description.addOns.length > 0 && (
                <div
                  style={{ marginTop: "1rem", fontSize: "14px", color: "#333" }}
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      color: "#222",
                      fontSize: "15px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Add‑ons
                  </h3>
                  {description.addOns.map((addOn: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "0.75rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        <strong>Add‑on:</strong> {addOn.addOn}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Price:</strong> ₹{addOn.price}
                      </p>

                      {addOn.subAddOns && addOn.subAddOns.length > 0 && (
                        <div
                          style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}
                        >
                          {addOn.subAddOns.map((sub: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: "0.5rem" }}>
                              <p style={{ margin: 0 }}>
                                <strong>Sub‑Add‑on:</strong> {sub.subAddOn}
                              </p>
                              {sub.price && (
                                <p style={{ margin: 0 }}>
                                  <strong>Price:</strong> ₹{sub.price}
                                </p>
                              )}
                              {sub.items && sub.items.length > 0 && (
                                <ul
                                  style={{
                                    paddingLeft: "1.2rem",
                                    marginTop: "0.3rem",
                                  }}
                                >
                                  {sub.items.map((item: any, i: number) => (
                                    <li key={i}>
                                      {item.item} – ₹{item.price}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Section title="Features" items={description.refFeaturesName} />
              <Section
                title="Facilities Available"
                items={description.refFacilitiesName}
              />
              <Section
                title="Sports Categories"
                items={description.refSportsCategoryName}
              />
              <Section
                title="User Guidelines"
                items={description.refUserGuidelinesName}
              />
              <Section
                title="Additional Tips"
                items={description.refAdditionalTipsName}
              />

              {/* <div
                style={{ marginTop: "1rem", fontSize: "12px", color: "#666" }}
              >
                <p>
                  Created:{" "}
                  {description.createdAt
                    ? new Date(description.createdAt).toLocaleString()
                    : "-"}
                </p>
                <p>
                  Updated:{" "}
                  {description.updatedAt
                    ? new Date(description.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div> */}

              {/* <IonButton
                expand="block"
                style={{
                  position: "fixed",
                  bottom: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "90%",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
                onClick={() =>
                  history.push("/editground", description.refGroundId)
                }
              >
                Edit Now
              </IonButton> */}
            </div>
            <div className="flex justify-center">
              <IonButton
                style={{ position: "fixed", bottom: "0px" }}
                onClick={() => {
                  setShowDatePickerModal(true);
                }}
                className="custom-ion-button w-[90%] h-[5vh] text-[#fff] text-[0.8rem] font-[poppins]"
              >
                Book Now
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
type SectionProps = {
  title: string;
  items?: string[];
};

const Section: React.FC<SectionProps> = ({ title, items }) => {
  if (!items || !items.length) return null;
  return (
    <div style={{ marginTop: "1rem" }}>
      <h3
        style={{
          fontWeight: "bold",
          color: "#222",
          fontSize: "15px",
          marginBottom: "0.3rem",
        }}
      >
        {title}
      </h3>
      <ul style={{ paddingLeft: "1rem", fontSize: "14px", color: "#333" }}>
        {items.map((it, idx) => (
          <li key={idx}>{it}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroundDescription;
