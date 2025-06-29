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
import { addCircleOutline } from "ionicons/icons";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
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

interface SportCategoryResult {
  refSportsCategoryId: number;
  refSportsCategoryName: string;
}

const SportCategory: React.FC = () => {
  const [getListSportCategory, setGetListSportCategory] = useState<
    SportCategoryResult[] | []
  >([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const toast = useRef<Toast>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const listSportApi = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/listSportCategory`,
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
          console.log("API Response data:", data);
          setGetListSportCategory(data.result);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch sport categories",
          life: 3000,
        });
      });
  };

  useEffect(() => {
    listSportApi();
  }, []);

  // Focus the input when editing starts
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      setTimeout(() => {
        editInputRef.current?.focus();
        editInputRef.current?.select();
      }, 100);
    }
  }, [editingId]);

  const [addSportCategory, setAddSportCategory] = useState<string>("");

  const addSportApi = () => {
    if (!addSportCategory.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter a sport category name",
        life: 3000,
      });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/addSportCategory`,
        {
          refSportsCategoryName: addSportCategory.trim(),
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
          setAddSportCategory("");
          listSportApi();
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
        console.error("Failed to add sport category:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to add sport category",
          life: 3000,
        });
      });
  };

  const deleteSport = (rowData: SportCategoryResult) => {
    console.log("Deleting sport:", rowData);

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/deleteSportCategory`,
        { refSportsCategoryId: rowData.refSportsCategoryId },
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
            detail: "Sport category deleted successfully",
            life: 3000,
          });
          listSportApi();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Delete failed",
            detail: data.error,
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete sport category",
          life: 3000,
        });
      });
  };

  // Start editing
  const startEdit = (rowData: SportCategoryResult) => {
    console.log("Starting edit for:", rowData);
    console.log("Setting editingId to:", rowData.refSportsCategoryId);
    setEditingId(rowData.refSportsCategoryId);
    setEditValue(rowData.refSportsCategoryName);
  };

  // Cancel editing
  const cancelEdit = () => {
    console.log("Canceling edit");
    setEditingId(null);
    setEditValue("");
  };

  // Save the updated sport category
  const saveEdit = () => {
    console.log("Saving edit - ID:", editingId, "Value:", editValue);

    if (!editValue.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Sport category name cannot be empty",
        life: 3000,
      });
      return;
    }

    if (editingId === null) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No item selected for editing",
        life: 3000,
      });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/v1/settingRoutes/updateSportCategory`,
        {
          refSportsCategoryId: editingId,
          refSportsCategoryName: editValue.trim(),
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
          setEditingId(null);
          setEditValue("");
          listSportApi();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Update failed",
            detail: data.error,
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error updating item:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update sport category",
          life: 3000,
        });
      });
  };

  // Render sport name with inline editing
  const renderSportName = (rowData: SportCategoryResult) => {
    console.log(
      "Rendering sport name for ID:",
      rowData.refSportsCategoryId,
      "Current editingId:",
      editingId,
      "Is editing?",
      editingId === rowData.refSportsCategoryId
    );

    if (editingId === rowData.refSportsCategoryId) {
      return (
        <div className="p-inputgroup" style={{ width: "100%" }}>
          <InputText
            ref={editInputRef}
            value={editValue}
            onChange={(e) => {
              console.log("Input changed:", e.target.value);
              setEditValue(e.target.value);
            }}
            onKeyDown={(e) => {
              console.log("Key pressed:", e.key);
              if (e.key === "Enter") {
                e.preventDefault();
                saveEdit();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                cancelEdit();
              }
            }}
            style={{ width: "100%" }}
            className="p-inputtext-sm"
          />
        </div>
      );
    }
    return (
      <span
        style={{ cursor: "pointer", color: "black" }}
        onClick={() => {
          console.log("Sport name clicked, starting edit");
          startEdit(rowData);
        }}
        title="Click to edit"
      >
        {rowData.refSportsCategoryName}
      </span>
    );
  };

  // Render action buttons
  const renderActions = (rowData: SportCategoryResult) => {
    console.log(
      "Rendering actions for ID:",
      rowData.refSportsCategoryId,
      "Current editingId:",
      editingId,
      "Is editing?",
      editingId === rowData.refSportsCategoryId
    );

    // if (editingId === rowData.refSportsCategoryId) {
    //   return (
    //     <div className="flex gap-2">
    //       <Button
    //         icon={<Check size={16} />}
    //         onClick={(e) => {
    //           e.preventDefault();
    //           e.stopPropagation();
    //           console.log("Save button clicked");
    //           saveEdit();
    //         }}
    //         className="p-button-success p-button-sm p-button-rounded"
    //         tooltip="Save"
    //         size="small"
    //       />
    //       <Button
    //         icon={<X size={16} />}
    //         onClick={(e) => {
    //           e.preventDefault();
    //           e.stopPropagation();
    //           console.log("Cancel button clicked");
    //           cancelEdit();
    //         }}
    //         className="p-button-secondary p-button-sm p-button-rounded"
    //         tooltip="Cancel"
    //         size="small"
    //       />
    //     </div>
    //   );
    // }

    return (
      <div className="flex gap-2">
        {/* <Button
          icon={<HiPencil size={16} />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Edit button clicked for:", rowData);
            console.log(
              "About to set editingId to:",
              rowData.refSportsCategoryId
            );
            startEdit(rowData);
          }}
          className="p-button-warning p-button-sm p-button-rounded"
          tooltip="Edit"
          size="small"
        /> */}
        <Button
          icon={<Trash2 size={16} />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Delete button clicked for:", rowData);
            deleteSport(rowData);
          }}
          className="p-button-danger p-button-sm p-button-rounded"
          tooltip="Delete"
          size="small"
        />
      </div>
    );
  };

  // Debug: Log current state
  console.log("Current state - editingId:", editingId, "editValue:", editValue);
  console.log("Data length:", getListSportCategory.length);
  const [loading, setLoading] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/groundsettings" mode="md" />
          </IonButtons>
          <IonTitle>Add Sports Category</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-[#f7f7f7] min-h-screen">
        <div className="max-w-3xl mx-auto mt-4 space-y-6">
          {/* Input Label & Field */}
          <div className="w-full max-w-2xl mx-auto">
            <IonLabel
              className="block text-[#000] font-semibold text-[15px]"
              style={{ paddingBottom: "10px" }}
            >
              Sport Name:
            </IonLabel>

            <div className="flex flex-col items-center gap-3 w-full"  style={{ gap: "10px" }}>
              <IonInput
              
                className="w-full h-[2.7rem] px-4 text-[#000] border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter Sport Name"
                value={addSportCategory}
                onIonChange={(e) => setAddSportCategory(e.detail.value!)}
                onKeyDown={(e) => e.key === "Enter" && addSportApi()}
              />

              <Button
                label="Add"
                className="p-button-primary p-button-sm min-w-[80px] mt-3"
                onClick={addSportApi}
              />
            </div>
          </div>

          {/* Sport List */}
          <div>
            {getListSportCategory?.length > 0 ? (
              getListSportCategory.map(
                (item: SportCategoryResult, index: number) => (
                  <IonCard
                    key={item.refSportsCategoryId}
                    className="w-full"
                    style={{
                      "--background": "#fff",
                      color: "#000",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <IonCardHeader>
                      <div className="flex justify-between items-center">
                        <IonCardTitle className="text-[#000] m-0">
                          Sport #{index + 1}
                        </IonCardTitle>
                        <Button
                          icon="pi pi-trash"
                          className="p-button-sm text-[#fff] p-button-text"
                          onClick={() => deleteSport(item)}
                        />
                      </div>
                      <IonCardSubtitle className="mt-2">
                        {item.refSportsCategoryName}
                      </IonCardSubtitle>
                    </IonCardHeader>
                  </IonCard>
                )
              )
            ) : (
              <IonText color="medium">No sports found.</IonText>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SportCategory;
