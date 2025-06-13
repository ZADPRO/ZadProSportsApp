import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import Ground1 from "../../assets/images/Ground1.png";
import Ground2 from "../../assets/images/Ground2.png";
import Ground3 from "../../assets/images/Ground3.png";
import Ground4 from "../../assets/images/Ground4.png";
import GroundCards from "../../pages/01-GroundCards/GroundCards";
import NextPageCards from "../../pages/01-GroundCards/NextPageCard";
import Account from "../../assets/images/Account.png";
import { IoIosArrowBack } from "react-icons/io";
import { InputText } from "primereact/inputtext";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { decrypt } from "../../Helper";
import { Toast } from "primereact/toast";

const ProfileScreen = () => {
  // const toast = useRef<Toast>(null);
  const [present] = useIonToast();

  // useEffect(() => {
  //     StatusBar.setOverlaysWebView({ overlay: false });
  //     StatusBar.setStyle({ style: Style.Dark });
  //     StatusBar.setBackgroundColor({ color: "#0377de" });

  //     return () => {
  //         StatusBar.setOverlaysWebView({ overlay: true });
  //     };
  // }, []);

  const [dob, setDob]: any = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  function formatDateString(dateStr: any) {
    const [day, month, year] = dateStr.split("-");
    const dateObj = new Date(year, month - 1, day);
    return dateObj;
  }

  const fetchData = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/v1/userRoutes/listProfileData`,
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

    localStorage.setItem("token", "Bearer " + data.token);

    console.log(data);

    if (data.success) {
      const newdata = data.result[0];

      setFirstName(newdata.refUserFname);
      setLastName(newdata.refUserLname);
      setDob(formatDateString(newdata.refDoB));
      setMobile(newdata.refMobileNumber);
      setEmail(newdata.refEmail);
    }
  };

  useEffect(() => {
    setLoading(true);

    try {
      fetchData();
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }, []);

  const [loading, setLoading] = useState(true);

  const formatDate = (date: any): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSaveProfile = async () => {
    const formattedDob = dob ? formatDate(dob) : null;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/userRoutes/updateProfileData`,
        {
          refFName: firstName,
          refLName: lastName,
          refDOB: formattedDob,
          refUserEmail: email,
          refMoblile: mobile,
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

      localStorage.setItem("token", "Bearer " + data.token);
      localStorage.setItem("name", firstName);

      present({
        message: "Successfully Updated",
        duration: 2000,
        color: "success",
        position: "bottom",
      });

      // toast.current!.show({ severity: 'success', summary: 'Success', detail: 'Successfully Updated', life: 3000 });
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong while updating profile.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <Toast ref={toast} position="bottom-center" /> */}
        <div className="bg-[#fff] w-[100%] overflow-auto px-[0rem] py-[0rem]">
          {loading ? (
            <>
              <div className="w-[100%] py-[2rem] flex justify-center items-center">
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "2rem", color: "#0377de" }}
                ></i>
              </div>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
              className="px-[1rem] pt-[1rem]"
            >
              {/* First Name */}
              <div className="mt-[1rem] px-[1rem]">
                <label
                  htmlFor="firstName"
                  className="text-[#000] text-[0.9rem] font-[poppins]"
                >
                  First Name
                </label>
                <InputText
                  type="firstName"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-[0.3rem]  font-[poppins] text-[#000] text-[0.9rem] w-full h-[2.5rem] px-3"
                />
              </div>

              {/* Last Name */}
              <div className="mt-[0.9rem] px-[1rem]">
                <label
                  htmlFor="lastName"
                  className="text-[#000] text-[0.9rem] font-[poppins]"
                >
                  Last Name
                </label>
                <InputText
                  id="lastName"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-[0.3rem]  font-[poppins] text-[#000] text-[0.9rem] w-full h-[2.5rem] px-3"
                />
              </div>

              {/* Date of Birth */}
              <div className="mt-[0.9rem] px-[1rem]">
                <label className="text-[#000] text-[0.9rem] font-[poppins]">
                  Date of Birth
                </label>
                <Calendar
                  value={dob}
                  onChange={(e: any) => {
                    setDob(e.value); // e.value is a Date object
                  }}
                  dateFormat="dd-mm-yy"
                  showIcon
                  required
                  placeholder="Select Date of Birth"
                  className="w-full mt-[0.3rem] text-[#000] h-[2.5rem] text-[0.9rem] font-[poppins]"
                />
              </div>

              {/* Mobile */}
              <div className="mt-[0.9rem] px-[1rem]">
                <label
                  htmlFor="mobile"
                  className="text-[#000] text-[0.9rem] font-[poppins]"
                >
                  Mobile Number
                </label>
                <InputText
                  id="mobile"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="mt-[0.3rem] text-[#000] text-[0.9rem] w-full h-[2.5rem] px-3  font-[poppins]"
                />
              </div>

              {/* Email */}
              <div className="mt-[0.9rem] px-[1rem]">
                <label
                  htmlFor="email"
                  className="text-[#000] text-[0.9rem] font-[poppins]"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  placeholder="Enter your Email"
                  value={email}
                  readOnly={true}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-[0.3rem] text-[#000] text-[0.9rem] w-full h-[2.5rem] px-3  font-[poppins]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-[2rem] mb-[3rem]">
                <IonButton
                  style={{ position: "fixed", bottom: "0px" }}
                  type="submit"
                  className="custom-ion-button w-[90%] text-[#fff] text-[0.9rem] font-[poppins]"
                >
                  Save Profile
                </IonButton>
              </div>
            </form>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileScreen;
