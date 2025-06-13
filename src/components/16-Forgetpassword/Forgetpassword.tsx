import { IonButton, IonContent, IonPage } from "@ionic/react";
import logo from "../../assets/images/Logo.png";

import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Password } from "primereact/password";
import { useHistory, useLocation } from "react-router";
import { decrypt } from "../../Helper";
import axios from "axios";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
const Forgetpassword = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState<"user" | "owner">("user");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation<{ roleID?: number }>();
  const roleID = location.state?.roleID;

  console.log("roleID--", roleID);

  const handleSubmit = async () => {
    const payload = {
      emailId: data.username,
      roleID: roleID,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/userRoutes/forgotPassword`,
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
      console.log("decryptedData--->", decryptedData);

      if (decryptedData.success) {
        console.log("decryptedData", decryptedData);

        localStorage.setItem("token", "Bearer " + decryptedData.token);
        localStorage.setItem("name", decryptedData.name);
        // localStorage.setItem("roleID", roleID.toString());

        return true; // success
      } else {
        return false;
      }
    } catch (e) {
      console.log("Login error:", e);
      return false;
    }
  };

  // Example usage
  // useEffect(() => {
  //   if (roleID === 2) {
  //     console.log("User forget password");
  //   } else if (roleID === 4) {
  //     console.log("Owner forget password, try 4 then 3");
  //   }
  // }, [roleID]);

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

              <div className="mt-[2.5rem] px-[3rem]">
                <label
                  htmlFor="username"
                  className="text-[#000] font-[poppins]"
                >
                  Email
                </label>
                <InputText
                  id="username"
                  placeholder="Enter Email "
                  value={data.username}
                  onChange={(e: any) => {
                    setData((prevData) => ({
                      ...prevData,
                      ["username"]: e.target.value,
                    }));
                  }}
                  className="mt-[0.3rem] text-[#000] text-[1rem] w-full h-[3rem] px-3"
                  required
                />
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
                    "Submit"
                  )}
                </IonButton>
              </div>

              <div className="mt-[1rem] flex justify-center items-center text-[#ef4444]">
                Please check the mail *
              </div>
              <div className="mt-[2rem] flex justify-center items-center gap-[0.5rem]">
                <div
                  onClick={() => {
                    history.push("/login");
                  }}
                  className="text-[1rem] text-[#000] font-[poppins] underline"
                >
                  Back to Login Page ? Click Here
                </div>
              </div>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Forgetpassword;
