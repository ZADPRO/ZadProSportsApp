import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { decrypt } from "../../Helper";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Trash2, Check, X } from "lucide-react";
import { HiPencil } from "react-icons/hi";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import {
  IonLabel,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonText,
  IonTextarea,
} from "@ionic/react";

interface FeaturesResult {
  refFeaturesId: number;
  refFeaturesName: string;
}

const Features: React.FC = () => {
  const [getFeaturesResult, setGetFeaturesResult] = useState<FeaturesResult[]>(
    []
  );
  const [featureInputs, setFeatureInputs] = useState<string>("");
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

  const toast = useRef<Toast>(null);

  // const toast = useRef<Toast>(null);
  const listFeatures = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/v1/settingRoutes/listFeatures`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        localStorage.setItem("token", "Bearer " + data.token);
        if (data.success) {
          console.log(data);
          setGetFeaturesResult(data.result);
        }
      });
  };
  useEffect(() => {
    listFeatures();
  }, []);

  //   const handleAddInput = () => {
  //     setFeatureInputs([...featureInputs, ""]);
  //   };

  //   const handleRemoveInput = (index: number) => {
  //     const updatedInputs = [...featureInputs];
  //     updatedInputs.splice(index, 1);
  //     setFeatureInputs(updatedInputs);
  //   };

  //   const handleInputChange = (index: number, value: string) => {
  //     const updatedInputs = [...featureInputs];
  //     updatedInputs[index] = value;
  //     setFeatureInputs(updatedInputs);
  //   };

  //   const handleAddAllFeatures = () => {
  //     console.log("All Features:", featureInputs);
  //     // Optionally: loop and call `addSportApi` for each item.
  //     addSportApi();
  //   };

  const addSportApi = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/addFeatures`,
        { refFeaturesName: [{ refFeaturesName: featureInputs }] },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        console.log("data", data);
        localStorage.setItem("token", "Bearer " + data.token);
        if (data.success) {
          console.log(data);
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          listFeatures();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: data.error,
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch sport categories:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error,
          life: 3000,
        });
      });
  };

  const UpdateFeatures = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/updateFeatures`,
        {
          refFeaturesId: editActivityId, // Ensure correct ID is sent
          refFeaturesName: editActivityValue, // Ensure correct field name
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        localStorage.setItem("token", "Bearer " + data.token);
        if (data.success) {
          setGetFeaturesResult(
            getFeaturesResult.map((activity) =>
              activity.refFeaturesId === editActivityId
                ? { ...activity, refFeaturesName: editActivityValue }
                : activity
            )
          );
          setEditActivityId(null);
          setEditActivityValue("");
          listFeatures();
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setEditActivityId(null);
      });
  };

  const deleteFeatures = (refFeaturesId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/deleteFeatures`,
        { refFeaturesId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        localStorage.setItem("token", "Bearer " + data.token);
        if (data.success) {
          console.log("Deleted Successfully");
          listFeatures(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const actionTemplate = (rowData: FeaturesResult) => (
    <div className="flex gap-2">
      {/* {editActivityId === rowData.refFeaturesId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={UpdateFeatures}
        />
      ) : (
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          onClick={() => handleEditActivityClick(rowData)}
        />
      )} */}
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteFeatures(rowData.refFeaturesId)}
      />
    </div>
  );
  const handleEditActivityClick = (rowData: FeaturesResult) => {
    setEditActivityId(rowData.refFeaturesId);
    setEditActivityValue(rowData.refFeaturesName);
    // setGetFeaturesResult(prev=>([...prev]))
    console.log("rowData--->", rowData.refFeaturesId);
    console.log("rowData--->", rowData.refFeaturesName);
  };
  const handleActivityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditActivityValue(e.target.value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/groundsettings"
              mode="md"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Add Extra Features </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          <div className="mt-[0.8rem] px-[1rem] w-[100%]">
            <label className="text-[#000]"> Ground Features:</label>
            <IonItem
              style={{ "--background": "#fff", color: "#000" }}
              lines="none"
              className="mb-6 w-full"
            >
              <InputText
                id="featureInputs"
                className="h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                placeholder="Enter Feature Name"
                value={featureInputs}
                onChange={(e) => setFeatureInputs(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSportApi()}
              />
            </IonItem>
            <IonItem
              style={{
                "--background": "#fff",
                color: "#000",
                paddingTop: "1rem",
                with: "30%",
              }}
              lines="none"
              className="flex flex-row flex-end mb-6 "
            >
              <Button label="Add" className="" onClick={addSportApi} />
            </IonItem>
          </div>

          <div className="w-[100%] mt-5" style={{ marginTop: "30px" }}>
            {/* Debug info */}

            <DataTable
              // cellMemo={false}
              scrollable
              showGridlines
              stripedRows
              value={getFeaturesResult}
            >
              <Column
                field="sno"
                header="S.No"
                body={(_, { rowIndex }) => rowIndex + 1}
              />
              <Column
                field="refFeaturesName"
                header="Features Name"
                body={(rowData) =>
                  editActivityId === rowData.refFeaturesId ? (
                    <InputText
                      value={editActivityValue}
                      onChange={handleActivityInputChange}
                    />
                  ) : (
                    rowData.refFeaturesName
                  )
                }
              />

              <Column body={actionTemplate} header="Actions" />
            </DataTable>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Features;
