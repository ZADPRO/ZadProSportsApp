import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { useHistory } from "react-router";
import axios from "axios";
import { decrypt } from "../../Helper";
import { pdf, Font } from "@react-pdf/renderer";
import regular from "../../assets/fonts/Poppins-Regular.ttf";
import bold from "../../assets/fonts/Poppins-Bold.ttf";
import Ground from "../13-Pdf_Invoice/Ground";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";

import "./Ground.css";

Font.register({
  family: "Poppins",
  src: regular,
});
Font.register({
  family: "boldpoppins",
  src: bold,
});

const GroundStatus = () => {
  const history = useHistory();

  useEffect(() => {
    setLoding(true);
    fetchData();
    setLoding(false);
  }, []);

  const [historyData, setHistoryData] = useState([]);
  const [historyNew, setHistoryNew] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/groundRoutes/listGround`,
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
      console.log("data---------->before", data);
      if (data.success) {
        console.log("data---------->after", data);
        setHistoryData(data.result);
      }

      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const [loading, setLoding] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Ground History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="bg-[#fff] w-[100%] overflow-auto px-[1rem] py-[1rem]">
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
            <IonAccordionGroup>
              {historyData.length === 0 ? (
                <div className="text-[0.9rem] font-[poppins] text-[#333] text-center">
                  No Ground Found
                </div>
              ) : (
                <>
                  {historyData.map((ground: any, index: number) => (
                    <IonAccordion
                      className=""
                      key={index}
                      value={ground.refGroundId.toString()}
                    >
                      <IonItem slot="header" color="dark">
                        <IonLabel className="font-[poppins] text-[1rem]">
                          {ground.refGroundName} - {ground.refGroundLocation}
                        </IonLabel>
                        <IonLabel
                          slot="end"
                          className={`text-[0.85rem] font-[poppins] ${
                            ground.approveGround === "Approved"
                              ? "text-[#22c55e]"
                              : "text-[#e24c4c]"
                          }`}
                        >
                          {ground.approveGround}
                        </IonLabel>
                      </IonItem>
                      <div
                        className="text-[0.8rem] font-[poppins] text-[#333]"
                        slot="content"
                      >
                        <p>
                          <strong>Customer ID:</strong> {ground.refGroundCustId}
                        </p>
                        <p>
                          <strong>Description:</strong> {ground.refDescription}
                        </p>
                        <p>
                          <strong>Pincode:</strong> {ground.refGroundPincode}
                        </p>
                        <p>
                          <strong>State:</strong> {ground.refGroundState}
                        </p>
                        <p>
                          <strong>Ground Price:</strong> ₹
                          {ground.refGroundPrice}
                        </p>
                        <p>
                          <strong>Tournament Price:</strong> ₹
                          {ground.refTournamentPrice}
                        </p>
                      </div>
                    </IonAccordion>
                  ))}
                </>
              )}
            </IonAccordionGroup>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GroundStatus;
