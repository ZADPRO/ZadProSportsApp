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

interface UserGuideline {
  refUserGuidelinesName: string;
  refUserGuidelinesId: number;
}

const UserGuidelines: React.FC = () => {
  const [guidelinesList, setGuidelinesList] = useState<UserGuideline[]>([]);
  const [newGuideline, setNewGuideline] = useState<string>("");
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

  const toast = useRef<Toast>(null);

  const listGuidelinesApi = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/listUserGuidelines`,
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
          setGuidelinesList(data.result);
        }
      })
      .catch((error) => {
        console.error("Fetch guidelines error:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load guidelines",
          life: 3000,
        });
      });
  };

  const addGuidelineApi = () => {
    if (!newGuideline.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter a guideline",
        life: 3000,
      });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/addUserGuidelines`,
        {
          refUserGuidelinesName: [{ refUserGuidelinesName: newGuideline }],
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
          setNewGuideline("");
          listGuidelinesApi();
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
        console.error("Add guideline error:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to add guideline",
          life: 3000,
        });
      });
  };

  const deleteGuidelines = (refUserGuidelinesId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/deleteUserGuidelines`,
        { refUserGuidelinesId },
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
            summary: "Deleted",
            detail: data.message,
            life: 3000,
          });
          listGuidelinesApi();
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  const updateGuidelines = () => {
    if (!editActivityId || !editActivityValue.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter a valid guideline to update",
        life: 3000,
      });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/updateUserGuidelines`,
        {
          refUserGuidelinesId: editActivityId,
          refUserGuidelinesName: editActivityValue,
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
            summary: "Updated",
            detail: data.message,
            life: 3000,
          });
          setEditActivityId(null);
          setEditActivityValue("");
          listGuidelinesApi();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Update Failed",
            detail: data.error || "Unknown error",
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update guideline",
          life: 3000,
        });
      });
  };

  const handleEditActivityClick = (rowData: UserGuideline) => {
    setEditActivityId(rowData.refUserGuidelinesId);
    setEditActivityValue(rowData.refUserGuidelinesName);
  };

  const handleActivityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditActivityValue(e.target.value);
  };

  const actionTemplate = (rowData: UserGuideline) => (
    <div className="flex gap-2">
      {editActivityId === rowData.refUserGuidelinesId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={updateGuidelines}
        />
      ) : (
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          onClick={() => handleEditActivityClick(rowData)}
        />
      )}
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteGuidelines(rowData.refUserGuidelinesId)}
      />
    </div>
  );

  useEffect(() => {
    listGuidelinesApi();
  }, []);
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
        <div className="overallcontainer flex">
          <div className="mt-[0.8rem] px-[1rem] w-[100%]">
            <label className="text-[#000]"> User Guideline:</label>
            <div className="flex justify-between w-[100%] mb-6">
              <InputText
                id="featureInputs"
                className="h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                placeholder="Enter Feature Name"
                value={newGuideline}
                onChange={(e) => setNewGuideline(e.target.value)}
              />
              <Button label="Add" className="" onClick={addGuidelineApi} />
            </div>

            <div className="w-[90%] mt-5" style={{ marginTop: "30px" }}>
              {/* Debug info */}

              <DataTable
                // cellMemo={false}
                scrollable
                showGridlines
                stripedRows
                value={guidelinesList}
              >
                <Column
                  field="sno"
                  header="S.No"
                  body={(_, { rowIndex }) => rowIndex + 1}
                />
                <Column
                  field="refUserGuidelinesName"
                  header="Guidelines Name"
                  body={(rowData) =>
                    editActivityId === rowData.refUserGuidelinesId ? (
                      <InputText
                        value={editActivityValue}
                        onChange={handleActivityInputChange}
                      />
                    ) : (
                      rowData.refUserGuidelinesName
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

export default UserGuidelines;
