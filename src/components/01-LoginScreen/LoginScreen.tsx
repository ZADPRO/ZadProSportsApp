import { IonButton, IonContent, IonPage } from "@ionic/react";
import logo from "../../assets/images/Logo.png";
import "./LoginScreen.css";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Password } from "primereact/password";
import { useHistory, useLocation } from "react-router";
import { decrypt } from "../../Helper";
import axios from "axios";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
const LoginScreen = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const [selectedRole, setSelectedRole] = useState<"user" | "owner">("user");

  const handleSubmit = async () => {
    setLoading(true);

    const tryLogin = async (roleID: number) => {
      const payload = {
        login: data.username,
        password: data.password,
        roleID: roleID,
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/adminRoutes/login`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const decryptedData = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        if (decryptedData.success) {
          console.log("decryptedData", decryptedData);
          setSuccess({
            status: true,
            message: "Logged In Successfully!",
          });

          localStorage.setItem("token", "Bearer " + decryptedData.token);
          localStorage.setItem("name", decryptedData.name);
          localStorage.setItem("roleID", roleID.toString());

          setTimeout(() => {
            history.replace("/home");
            setLoading(false);
          }, 2000);

          return true; // success
        } else {
          return false;
        }
      } catch (e) {
        console.log("Login error:", e);
        return false;
      }
    };

    let loginSuccess = false;

    if (selectedRole === "user") {
      loginSuccess = await tryLogin(2);
    } else {
      // Try with both roleIDs: 4 (Owner) first, then 3 (New Owner)
      loginSuccess = await tryLogin(4);
      if (!loginSuccess) {
        loginSuccess = await tryLogin(3);
      }
    }

    if (!loginSuccess) {
      setError({
        status: true,
        message: "Invalid credentials or role",
      });
      setLoading(false);
    }
  };
  const history = useHistory();

  const clearError = () => {
    setError({
      status: false,
      message: "",
    });
  };

  const [success, setSuccess] = useState({
    status: false,
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const location = useLocation();

  return (
    <IonPage>
      <IonContent>
        <div className="bg-container">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="cardDesign font-[poppins]">
              <div className="w-[100%] flex justify-center items-center">
                <img
                  src={logo}
                  style={{ width: "60%" }}
                  alt="Sports Logo"
                  className="logo"
                />
              </div>
              <div className="mt-[1rem]">
                <div className="text-[1.5rem] font-[600] text-center text-[#000] font-[poppins]">
                  Welcome to ZAD Sports
                </div>
              </div>
              <div className="mt-[1rem] w-[100%] flex justify-center items-center ">
                {" "}
                <div className=" w-[50%]  flex justify-center items-center">
                  {" "}
                  <IonSegment
                    value={selectedRole}
                    onIonChange={(e) => {
                      if (
                        e.detail.value === "user" ||
                        e.detail.value === "owner"
                      ) {
                        setSelectedRole(e.detail.value);
                      }
                    }}
                  >
                    <IonSegmentButton value="user">
                      <IonLabel>User</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="owner">
                      <IonLabel>Owner</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </div>
              </div>
              <div className="mt-[2.5rem] px-[3rem]">
                <label
                  htmlFor="username"
                  className="text-[#000] font-[poppins]"
                >
                  Email
                </label>
                <InputText
                  id="username"
                  placeholder="Enter Email"
                  value={data.username}
                  onChange={(e: any) => {
                    clearError();
                    setData((prevData) => ({
                      ...prevData,
                      ["username"]: e.target.value,
                    }));
                  }}
                  className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                  required
                />
              </div>
              <div className="mt-[0.6rem] px-[3rem] w-[100%]">
                <label htmlFor="password" className="text-[#000]">
                  Password
                </label>
                <Password
                  style={{ width: "100%" }}
                  id="password"
                  placeholder="Enter Password"
                  value={data.password}
                  onChange={(e: any) => {
                    clearError();
                    setData((prevData) => ({
                      ...prevData,
                      ["password"]: e.target.value,
                    }));
                  }}
                  feedback={false}
                  toggleMask
                  className="mt-[0.3rem] text-[#000] text-[1rem] w-[100%] h-[3rem] px-3"
                  required
                />
              </div>
              <div
                className={`${
                  error.status ? "text-[red]" : "text-[green]"
                } h-[2rem] mt-[1rem] px-[3rem] w-[100%] font-[poppins]`}
              >
                {error.status ? error.message : ""}
                {success.status ? success.message : ""}
              </div>
              <div className="mt-[0.3rem] px-[3rem]">
                <IonButton
                  type="submit"
                  className="custom-ion-button font-[poppins] w-[100%] h-[2.5rem] text-[#fff] text-[1rem]"
                >
                  {loading ? (
                    <i
                      className="pi pi-spin pi-spinner"
                      style={{ fontSize: "1rem" }}
                    ></i>
                  ) : (
                    "Login"
                  )}
                </IonButton>
              </div>
              <div className="mt-[3rem] flex justify-center items-center gap-[0.5rem]">
                <div
                  onClick={() => {
                    if (selectedRole == "user") {
                      history.push("/signup");
                    } else {
                      history.push("/ownersignup");
                    }
                  }}
                  className="text-[1rem] text-[#000] font-[poppins] underline"
                >
                  Need an account ? Get Started Here
                </div>
              </div>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginScreen;
