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
interface Facility {
  refFacilitiesId: number;
  refFacilitiesName: string;
}

const Facilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [newFacility, setNewFacility] = useState<string>("");
  const [editActivityId, setEditActivityId] = useState<number | null>(null);
  const [editActivityValue, setEditActivityValue] = useState("");

  const toast = useRef<Toast>(null);

  const fetchFacilities = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/v1/settingRoutes/listFacilities`, {
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
          console.log("data.success", data);
          setFacilities(data.result);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch facilities:", error);
      });
  };

  const addFacility = () => {
    if (!newFacility.trim()) return;

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/addFacilities`,
        {
          refFacilitiesName: [{ refFacilitiesName: newFacility }],
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
        console.log(data);
        if (data.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
            life: 3000,
          });
          fetchFacilities();
          setNewFacility("");
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
          detail: "Failed to add facility",
          life: 3000,
        });
        console.error("Add facility error:", error);
      });
  };

  // const handleEdit = (rowData: Facility) => {
  //   console.log("Edit clicked", rowData);
  //   // Implement edit logic or open modal
  // };

  const deleteFacilities = (refFacilitiesId: number) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/deleteFacilities`,
        { refFacilitiesId }, // ✅ this matches the payload structure
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
          fetchFacilities(); // Refresh list after delete
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // update

  const UpdateFacility = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/updateFacilities`,
        {
          refFacilitiesId: editActivityId, // Ensure correct ID is sent
          refFacilitiesName: editActivityValue, // Ensure correct field name
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
          setFacilities(
            facilities.map((activity) =>
              activity.refFacilitiesId === editActivityId
                ? { ...activity, refFacilitiesName: editActivityValue }
                : activity
            )
          );
          setEditActivityId(null);
          setEditActivityValue("");
          fetchFacilities();
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setEditActivityId(null);
      });
  };

  const actionTemplate = (rowData: Facility) => (
    <div className="flex gap-2">
      {/* {editActivityId === rowData.refFacilitiesId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={UpdateFacility}
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
        onClick={() => deleteFacilities(rowData.refFacilitiesId)}
      />
    </div>
  );
  const handleEditActivityClick = (rowData: Facility) => {
    setEditActivityId(rowData.refFacilitiesId);
    setEditActivityValue(rowData.refFacilitiesName);
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
          <IonTitle>Add Extra Facility </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="mt-[0.8rem] px-[1rem] w-[100%]">
          <label className="text-[#000]"> Facility Name:</label>
          <IonItem
            style={{ "--background": "#fff", color: "#000" }}
            lines="none"
            className="mb-6 w-full"
          >
            <InputText
              id="featureInputs"
              className="h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
              placeholder="Enter Facility Name"
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
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
            <Button label="Add" className="" onClick={addFacility} />
          </IonItem>

          <div className="w-[100%] mt-5" style={{ marginTop: "30px" }}>
            {/* Debug info */}

            <DataTable scrollable showGridlines stripedRows value={facilities}>
              <Column
                field="sno"
                header="S.No"
                body={(_, { rowIndex }) => rowIndex + 1}
              />
              <Column
                field="refFacilitiesName"
                header="Facility Name"
                body={(rowData) =>
                  editActivityId === rowData.refFacilitiesId ? (
                    <InputText
                      value={editActivityValue}
                      onChange={handleActivityInputChange}
                    />
                  ) : (
                    rowData.refFacilitiesName
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

export default Facilities;
