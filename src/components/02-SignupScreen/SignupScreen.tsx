import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import logo from "../../assets/images/Logo.png";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useHistory } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { decrypt } from "../../Helper";
import axios from "axios";
import { StatusBar, Style } from "@capacitor/status-bar";

const SignupScreen = () => {
  const [dob, setDob] = useState<Date | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<number>();

  const history = useHistory();

  const toast = useRef(null);

  const handleRegister = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setLoading(false);
      setError({
        status: true,
        message: "Confirm Password Not Match",
      });
      return;
    }

    const formattedDOB = dob?.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    const payload = {
      refFName: firstName,
      refLName: lastName,
      refDOB: formattedDOB,
      refUserEmail: email,
      refMoblile: mobile?.toString(),
      refPassword: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/adminRoutes/userSignUp`,
        payload,
        {
          headers: {
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

      if (data.success) {
        setSuccess({
          status: true,
          message: "Registered Successfully !",
        });

        setTimeout(() => {
          history.replace("/login");
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
        setError({
          status: true,
          message: data.message,
        });
      }
    } catch (e) {
      setLoading(false);
      setError({
        status: true,
        message: "Something Went Wrong, Try ",
      });
    }
  };

  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const [success, setSuccess] = useState({
    status: false,
    message: "",
  });

  const clearError = () => {
    setError({
      status: false,
      message: "",
    });
  };

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //     StatusBar.setOverlaysWebView({ overlay: false });
  //     StatusBar.setStyle({ style: Style.Dark });
  //     StatusBar.setBackgroundColor({ color: "#0377de" });

  //     return () => {
  //         StatusBar.setOverlaysWebView({ overlay: true });
  //     };
  // }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>User Register Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="bg-[#fff] w-[100%] overflow-auto">
          {/* <div className="text-[#242424] bg-[#fff] px-[2rem] py-[1rem] text-[1.3rem]">
                        <IoIosArrowBack
                            className="text-[1.5rem]"
                            onClick={() => history.goBack()}
                        />
                    </div> */}

          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <div className="cardDesign font-[poppins]">
              <div className="w-[100%] flex justify-center items-center mt-[20px]">
                <img
                  src={logo}
                  style={{ width: "70%" }}
                  alt="Sports Logo"
                  className="logo"
                />
              </div>

              <div className="text-[1.5rem] font-[600] text-center mt-[0rem]">
                Register Account
              </div>

              {/* First Name */}
              <div className="mt-[1.5rem] px-[3rem]">
                <label className="text-[#000]">First Name</label>
                <InputText
                  value={firstName}
                  onChange={(e) => {
                    clearError();
                    setFirstName(e.target.value);
                  }}
                  placeholder="Enter First Name"
                  className="w-full h-[3rem] mt-[0.3rem] text-[#000] px-3"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="mt-[0.6rem] px-[3rem]">
                <label className="text-[#000]">Last Name</label>
                <InputText
                  value={lastName}
                  onChange={(e) => {
                    clearError();
                    setLastName(e.target.value);
                  }}
                  placeholder="Enter Last Name"
                  className="w-full h-[3rem] mt-[0.3rem] px-3 text-[#000]"
                  required
                />
              </div>

              {/* DOB */}
              <div className="mt-[0.6rem] px-[3rem]">
                <label className="text-[#000]">Date of Birth</label>
                <Calendar
                  value={dob}
                  onChange={(e) => {
                    clearError();
                    setDob(e.value as Date);
                  }}
                  // showButtonBar
                  showIcon
                  className="w-full mt-[0.3rem] text-[#000]"
                  panelStyle={{ left: "50%" }}
                  placeholder="Select Date of Birth"
                  required
                  maxDate={new Date()}
                />
              </div>

              {/* Mobile */}
              <div className="mt-[0.6rem] px-[3rem]">
                <label className="text-[#000]">Mobile Number</label>
                <InputNumber
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    clearError();
                    setMobile(e.value || mobile);
                  }}
                  useGrouping={false}
                  maxFractionDigits={0}
                  placeholder="Enter Mobile Number"
                  className="w-full h-[3rem] mt-[0.3rem] px-3 text-[#000]"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              {/* Email */}
              <div className="mt-[0.6rem] px-[3rem]">
                <label className="text-[#000]">Email</label>
                <InputText
                  type="email"
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter Email"
                  className="w-full h-[3rem] mt-[0.3rem] px-3 text-[#000]"
                  required
                />
              </div>

              {/* Password */}
              <div className="mt-[0.6rem] px-[3rem]">
                <label className="text-[#000]">Password</label>
                <Password
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPassword(e.target.value);
                  }}
                  toggleMask
                  feedback={false}
                  placeholder="Enter Password"
                  className="w-full mt-[0.3rem] text-[#000]"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="mt-[0.6rem] px-[3rem]">
                <label className="text-[#000]">Confirm Password</label>
                <Password
                  value={confirmPassword}
                  onChange={(e) => {
                    console.log("sdfhbsdjf");
                    clearError();
                    setConfirmPassword(e.target.value);
                  }}
                  toggleMask
                  feedback={false}
                  placeholder="Confirm Password"
                  className="w-full mt-[0.3rem] text-[#000]"
                  required
                />
              </div>

              <div
                className={`mt-[1rem] h-[1rem] px-[3rem] text-[${
                  error.status ? "red" : "green"
                }] font-[poppins]`}
              >
                {error.status ? error.message : ""}
                {success.status ? success.message : ""}
              </div>

              {/* Submit Button */}
              <div className="mt-[1rem] px-[3rem] pb-[3rem]">
                <IonButton
                  type="submit"
                  className="custom-ion-button w-full h-[2.5rem] text-[1rem]"
                >
                  {loading ? (
                    <i
                      className="pi pi-spin pi-spinner"
                      style={{ fontSize: "1rem" }}
                    ></i>
                  ) : (
                    "Register"
                  )}
                </IonButton>
              </div>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignupScreen;
