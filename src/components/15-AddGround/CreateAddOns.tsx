import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

import { useHistory, useLocation } from "react-router";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useRef, useState } from "react";
import { decrypt } from "../../Helper";
import { Card } from "primereact/card";
import React from "react";
// import SettingsSideBar from "./SettingsSideBar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import axios from "axios";
import {
  createNewGround,
  fetchAdditionalTips,
  fetchGoundFacilities,
  fetchGroundFeatures,
  fetchSportCategories,
  fetchUserGuidelines,
  GroundResult,
  uploadGroundImage,
} from "../ground/GroundUtlis";
import SportCategory from "../../pages/GroundSettings/SportCategory";
import { ToggleButton } from "primereact/togglebutton";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";

interface CreateAddOnsProps {
  selectedAddon: string | null; // Or full AddOnForm if needed
  onSave: (addon: string) => void;
}

interface NestedSubcategory {
  name: string;
  price: number | null;
}

interface Subcategory {
  name: string;
  price?: number | null;
  isItemsAvailable: boolean;
  refItems?: NestedSubcategory[];
}

interface AddOnForm {
  name: string;
  isSubaddonsAvailable: boolean;
  price?: number | null;
  refSubAddOns?: Subcategory[];
}

const CreateAddOns: React.FC<CreateAddOnsProps> = ({
  selectedAddon,
  onSave,
}) => {
  const [form, setForm] = useState<AddOnForm>({
    name: "",
    isSubaddonsAvailable: false,
    price: null,
    refSubAddOns: [],
  });

  useEffect(() => {
    if (selectedAddon) {
      console.log(selectedAddon);
      setForm(JSON.parse(selectedAddon));
    }
  }, [selectedAddon]);

  const validateForm = () => {
    if (!form.name) {
      throw new Error("Add-On Title and Price are required.");
    }
    if (!form.isSubaddonsAvailable && form.price === null) {
      console.log("form.price", form.price);
      console.log("form.isSubaddonsAvailable", form.isSubaddonsAvailable);
      throw new Error("Add-On Price is required.");
    }
    if (form.isSubaddonsAvailable) {
      if (!form.refSubAddOns || form.refSubAddOns.length === 0) {
        throw new Error("Enter atleast one subcategory and price.");
      }
      for (const sub of form.refSubAddOns || []) {
        if (!sub.name) {
          throw new Error("Subcategory Title is required.");
        }
        if (!sub.isItemsAvailable && sub.price === null) {
          throw new Error(`Subcategory "${sub.name}" Price is required.`);
        }
        if (sub.isItemsAvailable) {
          for (const item of sub.refItems || []) {
            if (!item.name || item.price === null) {
              throw new Error("Item Name and Price are required.");
            }
          }
        } else if (sub.price === null) {
          throw new Error(
            "Subcategory Price is required when items are not available."
          );
        }
      }
    }
  };

  const handleSubmit = () => {
    try {
      validateForm();
      const addonString = JSON.stringify(form); // Convert object to string
      console.log(addonString);
      onSave(addonString); // Send it back as a string
    } catch (error: any) {
      console.error(error.message); // Display error message
    }
  };

  const handleSubcategoryChange = <K extends keyof Subcategory>(
    index: number,
    field: K,
    value: Subcategory[K]
  ) => {
    const updated = [...(form.refSubAddOns || [])];

    if (field === "isItemsAvailable") {
      updated[index][field] = value;
      if (value && !updated[index].refItems) {
        updated[index].refItems = [{ name: "", price: null }];
      }
      if (!value) {
        delete updated[index].refItems;
      }
    } else {
      updated[index][field] = value;
    }

    setForm({ ...form, refSubAddOns: updated });
  };

  const handleNestedChange = (
    subIndex: number,
    nestedIndex: number,
    field: keyof NestedSubcategory,
    value: any
  ) => {
    const updated = [...(form.refSubAddOns || [])];
    const nested = updated[subIndex].refItems || [];
    nested[nestedIndex] = { ...nested[nestedIndex], [field]: value };
    updated[subIndex].refItems = nested;
    setForm({ ...form, refSubAddOns: updated });
  };

  const addSubcategory = () => {
    setForm({
      ...form,
      refSubAddOns: [
        ...(form.refSubAddOns || []),
        { name: "", isItemsAvailable: false, price: null, refItems: [] },
      ],
    });
  };

  const removeSubcategory = (index: number) => {
    const updated = [...(form.refSubAddOns || [])];
    updated.splice(index, 1);
    setForm({ ...form, refSubAddOns: updated });
  };

  const addNestedSub = (subIndex: number) => {
    const updated = [...(form.refSubAddOns || [])];
    const nested = updated[subIndex].refItems || [];
    nested.push({ name: "", price: null });
    updated[subIndex].refItems = nested;
    setForm({ ...form, refSubAddOns: updated });
  };

  const removeNestedSub = (subIndex: number, nestedIndex: number) => {
    const updated = [...(form.refSubAddOns || [])];
    updated[subIndex].refItems = updated[subIndex].refItems?.filter(
      (_, i) => i !== nestedIndex
    );
    setForm({ ...form, refSubAddOns: updated });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md" />
          </IonButtons> */}
          <IonTitle>Add On's</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding"
        style={{ "--background": "#fff", color: "#000" }}
      >
        <IonText
          color="primary"
          style={{ "--background": "#fff", color: "#000" }}
        >
          <h2 className="ion-text-center">Create Add-On</h2>
        </IonText>

        <IonList>
          <IonItem style={{ "--background": "#fff", color: "#000" }}>
            <IonLabel position="stacked">Add-On Title</IonLabel>
            <IonInput
              placeholder="Add On Title"
              value={form.name}
              onIonChange={(e) =>
                setForm({ ...form, name: e.detail.value ?? "" })
              }
            />
          </IonItem>

          <IonItem
            lines="none"
            style={{ "--background": "#fff", color: "#000" }}
          >
            <IonLabel>Has Subcategories?</IonLabel>
            <IonToggle
              checked={form.isSubaddonsAvailable}
              onIonChange={(e) =>
                setForm({ ...form, isSubaddonsAvailable: e.detail.checked })
              }
              className={`custom-toggle ${
                form.isSubaddonsAvailable ? "toggle-checked" : ""
              }`}
            />
          </IonItem>
        </IonList>

        {form.isSubaddonsAvailable ? (
          <>
            {form.refSubAddOns?.map((sub, index) => (
              <IonList
                key={index}
                className="ion-margin-bottom ion-padding"
                style={{ backgroundColor: "#fff", color: "#000;" }}
              >
                <IonText
                  color="medium"
                  style={{ "--background": "#fff", color: "#000;" }}
                >
                  <h3 style={{ backgroundColor: "#fff", color: "#000;" }}>
                    Subcategory {index + 1}
                  </h3>
                </IonText>

                <IonItem style={{ "--background": "#fff", color: "#000" }}>
                  <IonInput
                    value={sub.name}
                    placeholder="Subcategory Title"
                    onIonChange={(e) =>
                      handleSubcategoryChange(
                        index,
                        "name",
                        e.detail.value ?? ""
                      )
                    }
                  />
                </IonItem>

                <IonItem style={{ "--background": "#fff", color: "#000" }}>
                  <IonLabel>Has Items?</IonLabel>
                  <IonToggle
                    checked={sub.isItemsAvailable}
                    onIonChange={(e) =>
                      handleSubcategoryChange(
                        index,
                        "isItemsAvailable",
                        e.detail.checked
                      )
                    }
                  />
                </IonItem>

                {!sub.isItemsAvailable && (
                  <IonItem style={{ "--background": "#fff", color: "#000" }}>
                    <IonInput
                      type="number"
                      value={sub.price}
                      placeholder="Enter Price"
                      className="custom-placeholder-black"
                      onIonChange={(e) =>
                        handleSubcategoryChange(
                          index,
                          "price",
                          parseFloat(e.detail.value ?? "")
                        )
                      }
                    />
                  </IonItem>
                )}

                {sub.isItemsAvailable && (
                  <>
                    {sub.refItems?.map((nested, nIndex) => (
                      <IonItem
                        style={{ "--background": "#fff", color: "#000" }}
                        key={nIndex}
                      >
                        <IonInput
                          value={nested.name}
                          placeholder={`Item ${nIndex + 1}`}
                          onIonChange={(e) =>
                            handleNestedChange(
                              index,
                              nIndex,
                              "name",
                              e.detail.value
                            )
                          }
                        />
                        <IonInput
                          type="number"
                          value={nested.price}
                          placeholder="Price"
                          onIonChange={(e) =>
                            handleNestedChange(
                              index,
                              nIndex,
                              "price",
                              parseFloat(e.detail.value ?? "")
                            )
                          }
                        />
                        <IonButton
                          color="danger"
                          fill="clear"
                          onClick={() => removeNestedSub(index, nIndex)}
                        >
                          Delete
                        </IonButton>
                      </IonItem>
                    ))}
                    <IonButton onClick={() => addNestedSub(index)}>
                      Add Nested
                    </IonButton>
                  </>
                )}

                <IonButton
                  color="danger"
                  fill="clear"
                  onClick={() => removeSubcategory(index)}
                >
                  Remove Subcategory
                </IonButton>
              </IonList>
            ))}
            <IonButton expand="block" onClick={addSubcategory}>
              Add Subcategory
            </IonButton>
          </>
        ) : (
          <IonItem style={{ "--background": "#fff", color: "#000" }}>
            <IonLabel position="stacked">Price</IonLabel>
            <IonInput
              type="number"
              value={form.price}
              placeholder="Enter Price"
              onIonChange={(e) =>
                setForm({ ...form, price: parseFloat(e.detail.value ?? "") })
              }
            />
          </IonItem>
        )}

        <IonButton expand="block" color="primary" onClick={handleSubmit}>
          Save Add-On
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CreateAddOns;
