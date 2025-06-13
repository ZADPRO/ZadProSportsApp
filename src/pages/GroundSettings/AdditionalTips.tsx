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
interface Tip {
  refAdditionalTipsId: number;
  refAdditionalTipsName: string;
}
const AdditionalTips: React.FC = () => {
  const [tipsList, setTipsList] = useState<Tip[]>([]);
  const [tipInput, setTipInput] = useState<string>("");
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

  const toast = useRef<Toast>(null);

  const fetchTips = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/listAdditionalTips`,
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
          setTipsList(data.result);
        }
      });
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const addTip = () => {
    if (!tipInput) return;

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/addAdditionalTips`,
        {
          refAdditionalTipsName: [{ refAdditionalTipsName: tipInput }],
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
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          fetchTips();
          setTipInput("");
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
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to add tip",
          life: 3000,
        });
        console.error(error);
      });
  };

  // const handleEdit = (rowData: Tip) => {
  //   console.log("Edit clicked", rowData);
  //   // Implement edit logic here
  // };

  const deleteTips = (refAdditionalTipsId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/deleteAdditionalTips`,
        { refAdditionalTipsId },
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
          fetchTips(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  // update Tips
  const UpdateTips = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/updateAdditionalTips`,
        {
          refAdditionalTipsId: editActivityId, // Ensure correct ID is sent
          refAdditionalTipsName: editActivityValue, // Ensure correct field name
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
          setTipsList(
            tipsList.map((activity) =>
              activity.refAdditionalTipsId === editActivityId
                ? { ...activity, refAdditionalTipsName: editActivityValue }
                : activity
            )
          );
          setEditActivityId(null);
          setEditActivityValue("");
          fetchTips();
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setEditActivityId(null);
      });
  };

  const actionTemplate = (rowData: Tip) => (
    <div className="flex gap-2">
      {/* {editActivityId === rowData.refAdditionalTipsId ? (
        // <Button
        //   label="Update"
        //   icon="pi pi-check"
        //   className="p-button-success p-button-sm"
        //   onClick={UpdateTips}
        <></>
        // />
      ) : (
        // <Button
        //   icon="pi pi-pencil"
        //   className="p-button-warning p-button-sm"
        //   onClick={() => handleEditActivityClick(rowData)}
        // />
        <></>
      )} */}
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteTips(rowData.refAdditionalTipsId)}
      />
    </div>
  );
  const handleEditActivityClick = (rowData: Tip) => {
    setEditActivityId(rowData.refAdditionalTipsId);
    setEditActivityValue(rowData.refAdditionalTipsName);
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
          <IonTitle>Additional Tips </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          <div className="mt-[0.8rem] px-[1rem] w-[100%]">
            <label className="text-[#000]"> Tip Name:</label>
            <IonItem
              style={{ "--background": "#fff", color: "#000" }}
              lines="none"
              className="mb-6 w-full"
            >
              <InputText
                id="featureInputs"
                className="h-[2.2rem] mt-[0.2rem] text-[#000] px-3 w-full border border-gray-300 rounded-md bg-white"
                placeholder="Enter Tip Name"
                value={tipInput}
                onChange={(e) => setTipInput(e.target.value)}
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
              <Button
                label="Add"
                className="p-button-primary p-button-sm min-w-[80px] mt-[0.2rem]"
                onClick={addTip}
              />
            </IonItem>

            <div className="w-[100%] mt-5" style={{ marginTop: "30px" }}>
              {/* Debug info */}

              <DataTable
                // cellMemo={false}
                scrollable
                showGridlines
                stripedRows
                value={tipsList}
              >
                <Column
                  field="sno"
                  header="S.No"
                  body={(_, { rowIndex }) => rowIndex + 1}
                />
                <Column
                  field="refAdditionalTipsName"
                  header="Features Name"
                  body={(rowData) =>
                    editActivityId === rowData.refAdditionalTipsId ? (
                      <InputText
                        value={editActivityValue}
                        onChange={handleActivityInputChange}
                      />
                    ) : (
                      rowData.refAdditionalTipsName
                    )
                  }
                />

                <Column body={actionTemplate} header="Actions" />
              </DataTable>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdditionalTips;
