import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonTitle,
  IonToggle,
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
import { useHistory, useLocation } from "react-router";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useRef, useState } from "react";
import { trash, calendar, pencil, add } from "ionicons/icons";

import { decrypt } from "../../Helper";
import axios from "axios";
import {
  addAddOnsAvailability,
  createNewGround,
  deleteAddon,
  fetchAdditionalTips,
  fetchGoundFacilities,
  fetchGroundFeatures,
  fetchSpecificGround,
  fetchSportCategories,
  fetchUserGuidelines,
  GroundResult,
  removerAddonAvailability,
  updateGround,
  uploadGroundImage,
} from "../ground/GroundUtlis";
import CreateAddOns from "./CreateAddOns";
import GroundSettings from "./GroundSettings";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";

import { Chip } from "primereact/chip";

interface GroundImage {
  content: string; // base64 image data
  contentType: string; // MIME type, e.g., "image/jpeg"
  filename: string; // original filename
}

export interface AddOnForm {
  name: string;
  isSubaddonsAvailable: boolean;
  price?: number | null;
  refSubAddOns?: any[];
}
interface AddOnItem {
  id: number;
  addOn: string;
  price: number;
  unAvailabilityDates: AddOnAvailability[];
  subAddOns: any[]; // You can define a more specific type if known
}
type AddOnAvailability = {
  addOnsAvailabilityId: number;
  unAvailabilityDate: string;
  [key: string]: any; // optional: if you have more properties
};
interface EditGroundSidebarProps {
  groundData: any;
}

type SelectedAddonDates = {
  refAddonId: number;
  dates: Date[];
};

interface GroundImage {
  content: string; // base64 image data
  contentType: string; // MIME type, e.g., "image/jpeg"
  filename: string; // original filename
}
export interface GroundAdd {
  refGroundName: string;
  isAddOnAvailable: boolean;
  refAddOns: AddOnForm[];
  refFeaturesId: string[];
  refUserGuidelinesId: string[];
  refFacilitiesId: string[];
  refAdditionalTipsId: string[];
  refSportsCategoryId: string[];
  refTournamentPrice: string;
  refGroundPrice: string;
  refGroundImage: string;
  refGroundLocation: string;
  refGroundPincode: string;
  refGroundState: string;
  refDescription: string;
  IframeLink: string;
  groundLocationLink: string;
  refStatus: boolean;
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

const EditGround = () => {
  const [groundDetails, setGroundDetails] = useState<GroundResult | null>(null);

  const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addOns, setAddOns] = useState<AddOnItem[]>([]);

  const groundData = useLocation().state;

  console.log("id", groundData);
  const [present] = useIonToast();

  const [newAddonSidebar, setNewAddonSidebar] = useState(false);
  const [editAddonSidebar, setEditAddonSidebar] = useState(false);

  const [editingAddon, setEditingAddon] = useState<string | null>(null); // or an AddOn object
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [groundImg, setGroundImg] = useState<GroundImage | null>(null);

  const [selectedAddonDates, setSelectedAddonDates] = useState<
    SelectedAddonDates[]
  >([]);

  const [form, setForm] = useState<AddOnForm>({
    name: "",
    isSubaddonsAvailable: false,
    price: null,
    refSubAddOns: [],
  });

  const [formDataImages, setFormdataImages] = useState<any>([]);
  const [tokenErrorAlert, setTokenErrorAlert] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/your-protected-api");
      } catch (err: any) {
        if (
          err?.response?.data?.message === "Invalid or expired token" ||
          err?.message === "Invalid or expired token"
        ) {
          setTokenErrorAlert(true);
        }
      }
    };

    fetchData();
  }, []);

  // Fixed handleCreateOrUpdateAddon function
  const handleCreateOrUpdateAddon = async () => {
    if (!form.name.trim()) return;

    try {
      const newAddon: AddOnItem = {
        id:
          isEditing && editingIndex !== null
            ? addOns[editingIndex].id
            : Date.now(), // Keep existing ID when editing
        addOn: form.name,
        price: form.price || 0,
        unAvailabilityDates:
          isEditing && editingIndex !== null
            ? addOns[editingIndex].unAvailabilityDates
            : [],
        subAddOns: form.isSubaddonsAvailable ? form.refSubAddOns || [] : [],
      };

      if (isEditing && editingIndex !== null) {
        // Update existing addon
        const updatedAddOns = [...addOns];
        updatedAddOns[editingIndex] = newAddon;
        setAddOns(updatedAddOns);
      } else {
        // Add new addon
        setAddOns([...addOns, newAddon]);
      }

      // Reset form
      setForm({
        name: "",
        isSubaddonsAvailable: false,
        price: null,
        refSubAddOns: [],
      });

      // Close sidebars
      setNewAddonSidebar(false);
      setEditAddonSidebar(false);
      setIsEditing(false);
      setEditingAddon(null);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error creating/updating addon:", error);
    }
  };

  // Fixed handleEditAddon function to properly populate form
  const handleEditAddon = (addon: any, index: number) => {
    const res = addOns.find((item: any) => item.id === addon.id);
    if (res) {
      // Populate the form with existing addon data
      setForm({
        name: res.addOn,
        isSubaddonsAvailable: res.subAddOns && res.subAddOns.length > 0,
        price: res.price,
        refSubAddOns: res.subAddOns || [],
      });

      setEditingAddon(JSON.stringify(res));
      setEditingIndex(index);
      setIsEditing(true);
      setEditAddonSidebar(true);
    }
  };

  // Fixed handleAddNew function to reset form
  const handleAddNew = () => {
    setForm({
      name: "",
      isSubaddonsAvailable: false,
      price: null,
      refSubAddOns: [],
    });
    setEditingAddon(null);
    setEditingIndex(null);
    setIsEditing(false);
    setNewAddonSidebar(true);
  };

  const GroundFeatures = async () => {
    try {
      const result = await fetchGroundFeatures();
      const options: any = result.map((data: any) => ({
        label: data.refFeaturesName,
        value: data.refFeaturesId,
      }));
      setGroundFeatures(options);
    } catch (error) {
      console.error("Error fetching sport categories:", error);
    }
  };

  const GroundSportCategory = async () => {
    try {
      const result = await fetchSportCategories();
      const options: any = result.map((item) => ({
        label: item.refSportsCategoryName,
        value: item.refSportsCategoryId,
      }));

      setSportOptions(options);
    } catch (error) {
      console.error("Error fetching sport categories:", error);
    }
  };

  const GroundUserGuideLines = async () => {
    try {
      const result = await fetchUserGuidelines();
      const options: any = result.map((item) => ({
        label: item.refUserGuidelinesName,
        value: item.refUserGuidelinesId,
      }));
      setUserGuidelines(options);
    } catch (error) {}
  };

  const GroundFacilities = async () => {
    try {
      const result = await fetchGoundFacilities();
      const options: any = result.map((item) => ({
        label: item.refFacilitiesName,
        value: item.refFacilitiesId,
      }));
      setFacilities(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  const GroundAdditionalTips = async () => {
    try {
      const result = await fetchAdditionalTips();
      const options: any = result.map((item) => ({
        label: item.refAdditionalTipsName,
        value: item.refAdditionalTipsId,
      }));
      setAdditionalTips(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  const GroundDetails = async () => {
    try {
      const t = { refGroundId: groundData };
      const response = await fetchSpecificGround(t);
      console.log("result", response);

      setGroundDetails(response.result);
      setGroundImg(response.imgResult?.[0].refGroundImage || "");
      console.log("*******************", response.imgResult[0].refGroundImage);

      const rawAddOns = response.result?.addOns || [];
      const availabilityData = response.getAddons?.[0]?.arraydata || [];

      // Step 1: Create map of refAddOnsId → unavailability objects
      const unavailabilityMap = new Map<number, any[]>();

      availabilityData.forEach((entry: any) => {
        const id = entry.refAddOnsId;
        if (!unavailabilityMap.has(id)) {
          unavailabilityMap.set(id, []);
        }
        unavailabilityMap.get(id)?.push(entry); // push whole object
      });

      // Step 2: Build final addOns with matching unavailability
      const groupedAddOns = rawAddOns.reduce((acc: any, curr: any) => {
        const { id, addOn, price, subAddOns } = curr;

        if (!acc[id]) {
          acc[id] = {
            id,
            addOn,
            price,
            subAddOns: subAddOns || [],
            unAvailabilityDates: unavailabilityMap.get(id) || [],
          };
        }

        return acc;
      }, {});

      const groupedAddOnsArray = Object.values(groupedAddOns);
      setAddOns(groupedAddOnsArray as AddOnItem[]);
    } catch (error) {
      console.error("Error in GroundDetails:", error);
    }
  };

  console.log("groundData", groundData);
  useEffect(() => {
    GroundFeatures();
    GroundSportCategory();
    GroundUserGuideLines();
    GroundFacilities();
    GroundAdditionalTips();
    GroundDetails();
  }, []);

  const handeUpdateGround = async () => {
    try {
      if (groundDetails) {
        console.log("groundDetails", groundDetails);
        console.log("addons", addOns);

        const payload = {
          refGroundId: groundDetails.refGroundId,
          refGroundName: groundDetails.refGroundName,
          isAddOnAvailable: groundDetails.isAddOnAvailable,
          refFeaturesId: groundDetails.refFeaturesId,
          refUserGuidelinesId: groundDetails.refUserGuidelinesId,
          refFacilitiesId: groundDetails.refFacilitiesId,
          refAdditionalTipsId: groundDetails.refAdditionalTipsId,
          refSportsCategoryId: groundDetails.refSportsCategoryId,
          refTournamentPrice: groundDetails.refTournamentPrice,
          refGroundPrice: groundDetails.refGroundPrice,
          refGroundImage: groundDetails.refGroundImage,
          refGroundLocation: groundDetails.refGroundLocation,
          refGroundPincode: groundDetails.refGroundPincode,
          refGroundState: groundDetails.refGroundState,
          refDescription: groundDetails.refDescription,
          IframeLink: groundDetails.IframeLink,
          refStatus: groundDetails.refStatus,
          refAddOns: addOns.map((addon) => ({
            ...(addon.id && { refAddOnsId: addon.id }),
            name: addon.addOn,
            price: addon.price,
            isSubaddonsAvailable: !!addon.subAddOns?.length,
            refSubAddOns:
              addon.subAddOns?.map((sub) => ({
                ...(sub.id && { refSubAddOnsId: sub.id }),
                name: sub.subAddOn || sub.name, // <-- here
                price: sub.price,
                isItemsAvailable: !!sub.items?.length,
                refItems:
                  sub.items?.map((item: any) => ({
                    ...(item.id && { refItemsId: item.id }),
                    name: item.item, // <-- here
                    price: item.price,
                  })) || [],
              })) || [],
          })),
        };

        console.log("payload", payload);
        const response = await updateGround(payload);
        if (response.success) {
          present({
            message: "Updated successfully!",
            duration: 2000,
            position: "bottom",
            color: "success",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log(addOns);

  const handleInputChange = (field: keyof GroundResult, value: string) => {
    setGroundDetails((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleAddon = (field: keyof GroundResult, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleMultiSelectChange = (
    field: keyof GroundResult,
    value: number[]
  ) => {
    setGroundDetails((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleRemoveAddon = async (addon: any, indexToRemove: number) => {
    try {
      // If addon has an ID, call delete API
      if (addon?.id) {
        await handleDeleteAddOn(addon.id);
      }

      // Remove addon from the local state
      const updatedAddOns = addon?.id
        ? addOns.filter((a) => a.id !== addon.id)
        : [...addOns].filter((_, index) => index !== indexToRemove);

      setAddOns(updatedAddOns);
    } catch (error) {
      console.error("Failed to remove addon:", error);
    }
  };

  const handleDeleteAddOn = async (addonId: number) => {
    try {
      const response = await deleteAddon({ refAddOnsId: addonId });
      console.log("response", response);
    } catch (error) {
      console.error("Error deleting add-on:", error);
    }
  };

  const handleRemoveDate = async (addonAvailabilityId: number) => {
    const response = await removerAddonAvailability({
      addOnsAvailabilityId: addonAvailabilityId,
    });
    console.log("response", response);
    // if(response.success) {

    // }

    // setAddOns((prev) =>
    //   prev.map((addon, i) =>
    //     i === addonIndex
    //       ? {
    //           ...addon,
    //           data: addon.data.filter((_, j) => j !== dateIndex),
    //         }
    //       : addon
    //   )
    // );
  };

  const handleAddDates = async (refAddonId: number) => {
    const selected = selectedAddonDates.find(
      (item) => item.refAddonId === refAddonId
    );
    if (!selected || selected.dates.length === 0) return;

    try {
      const payloads = selected.dates.map((date) => ({
        unAvailabilityDate: date
          .toLocaleDateString("en-GB")
          .split("/")
          .join("-"),
        refAddOnsId: refAddonId,
        refGroundId: groundData,
      }));

      const responses = await Promise.all(
        payloads.map((payload) => addAddOnsAvailability(payload))
      );

      console.log("All responses:", responses);

      await GroundDetails(); // ensure GroundDetails handles latest data

      // Clear dates for that addon
      setSelectedAddonDates((prev) =>
        prev.map((item) =>
          item.refAddonId === refAddonId ? { ...item, dates: [] } : item
        )
      );
    } catch (error) {
      console.error("Failed to add availability:", error);
    }
  };

  const handleDateChange = (
    refAddonId: number,
    value: Date[] | null | undefined
  ) => {
    setSelectedAddonDates((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) => item.refAddonId === refAddonId);

      if (index > -1) {
        updated[index].dates = value ?? [];
      } else {
        updated.push({ refAddonId, dates: value ?? [] });
      }

      return updated;
    });
  };

  const customMap = async (event: any) => {
    console.table("event", event);
    const file = event.files[0]; // Assuming single file upload
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    // for (let pair of formData.entries()) {
    //   console.log("-------->______________", pair[0] + ":", pair[1]);
    // }

    console.log("formData------------>", formData);
    try {
      const response = await uploadGroundImage(formData);
      console.log("response", response);

      if (response.success) {
        setGroundImg(response.files[0]);
        setGroundDetails((prev) => ({
          ...prev!,
          refGroundImage: response.filePath,
        }));
        handleUploadSuccessMap(response);
      } else {
        console.log("data-", response);
        handleUploadFailure(response);
      }
    } catch (error) {
      handleUploadFailure(error);
    }
  };

  const handleUploadSuccessMap = (response: any) => {
    console.log("Upload Successful:", response);
    setFormdataImages(response.filePath);
  };
  console.log(formDataImages);

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  const parseDDMMYYYY = (dateStr: string): Date => {
    console.log(dateStr);
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  console.log(groundDetails);

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
      (_: any, i: any) => i !== nestedIndex
    );
    setForm({ ...form, refSubAddOns: updated });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/listground" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Ground Details </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="bg-[#fff] w-[100%] overflow-auto px-[0rem] py-[0rem]">
          <div className="bg-[#fff] w-[100%] overflow-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handeUpdateGround();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            >
              <div className="mt-[2rem] px-[1rem]">
                <label className="text-[#000]">Ground Name :</label>
                <InputText
                  id="groundName"
                  placeholder="Ground Name"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  value={groundDetails?.refGroundName || ""}
                  onChange={(e: any) =>
                    handleInputChange("refGroundName", e.target.value )
                  }
                  required={true}
                />
              </div>

              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Ground Per Day Price:</label>
                <InputText
                  id="groundprice"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  placeholder="Ground Price"
                  value={groundDetails?.refGroundPrice || ""}
                  onChange={(e) =>
                    handleInputChange("refGroundPrice", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Ground Tournment Price:</label>
                <InputText
                  id="refTournamentPrice"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  placeholder="Ground Price"
                  value={groundDetails?.refTournamentPrice || ""}
                  onChange={(e) =>
                    handleInputChange("refTournamentPrice", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Area:</label>
                <InputText
                  id="groundlocation"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  placeholder="Ground Location"
                  value={groundDetails?.refGroundLocation || ""}
                  onChange={(e) =>
                    handleInputChange("refGroundLocation", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">District:</label>
                <InputText
                  id="groundstate"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  placeholder="Ground State"
                  value={groundDetails?.refGroundState || ""}
                  onChange={(e) =>
                    handleInputChange("refGroundState", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Ground Pincode:</label>
                <InputText
                  id="groundpincode"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  placeholder="Ground Pincode"
                  value={groundDetails?.refGroundPincode || ""}
                  onChange={(e) =>
                    handleInputChange("refGroundPincode", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Ground Description:</label>
                <InputText
                  id="grounddesc"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  placeholder="Description"
                  value={groundDetails?.refDescription || ""}
                  onChange={(e) =>
                    handleInputChange("refDescription", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Location (Iframe Link):</label>
                <InputText
                  id="iFrameLink"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  placeholder="Location IFrame Link"
                  value={groundDetails?.IframeLink || ""}
                  onChange={(e) =>
                    handleInputChange("IframeLink", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Location (Code):</label>
                <InputText
                  id="iFrameLink"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  placeholder="Location GPS Code"
                  value={groundDetails?.IframeLink || ""}
                  onChange={(e) =>
                    handleInputChange("groundLocationLink", e.target.value)
                  }
                  required
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Ground Features:</label>
                <MultiSelect
                  value={groundDetails?.refFeaturesId || []}
                  onChange={(e) =>
                    handleMultiSelectChange("refFeaturesId", e.value)
                  }
                  options={groundFeatures}
                  optionLabel="label"
                  id="groundFeatures"
                  placeholder="Select Ground Features"
                  maxSelectedLabels={3}
                  className="w-full h-[3rem] mt-[0.5rem] text-[#000] px-3"
                  display="chip"
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Sport Category:</label>
                <MultiSelect
                  value={groundDetails?.refSportsCategoryId || []}
                  onChange={(e) =>
                    handleMultiSelectChange("refSportsCategoryId", e.value)
                  }
                  options={sportOptions}
                  optionLabel="label"
                  id="SportCategory"
                  placeholder="Sport Category"
                  maxSelectedLabels={3}
                  className="w-full h-[3rem] mt-[0.5rem] text-[#000] px-3"
                  display="chip"
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Guide Lines:</label>
                <MultiSelect
                  value={groundDetails?.refUserGuidelinesId || []}
                  onChange={(e) =>
                    handleMultiSelectChange("refUserGuidelinesId", e.value)
                  }
                  options={userGuidelines}
                  optionLabel="label"
                  id="userGuideLines"
                  placeholder="Select User Guide Lines"
                  maxSelectedLabels={3}
                  className="w-full h-[3rem] mt-[0.5rem] text-[#000] px-3"
                  display="chip"
                />
              </div>
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Facilities:</label>
                <MultiSelect
                  value={groundDetails?.refFacilitiesId || []}
                  onChange={(e) =>
                    handleMultiSelectChange("refFacilitiesId", e.value)
                  }
                  options={facilities}
                  optionLabel="label"
                  id="facilities"
                  placeholder="Enter Facilities"
                  maxSelectedLabels={3}
                  className="w-full h-[3rem] mt-[0.5rem] text-[#000] px-3"
                  display="chip"
                />
              </div>

              <div className="mt-[0.8rem] px-[1rem] mb-5">
                <label className="text-[#000]">Additional Tips:</label>
                <MultiSelect
                  value={groundDetails?.refAdditionalTipsId || []}
                  onChange={(e) =>
                    handleMultiSelectChange("refAdditionalTipsId", e.value)
                  }
                  options={additionalTips}
                  optionLabel="label"
                  id="additionalTips"
                  placeholder="Select Additional Tips"
                  maxSelectedLabels={3}
                  className="w-full h-[3rem] mt-[0.5rem] text-[#000] px-3"
                  display="chip"
                />
              </div>

              {/* Image container */}
              <div
                className="bg-[#f4f4f4] rounded-xl p-4 shadow-md flex flex-col m-5 items-center gap-4"
                style={{ marginTop: "1rem" }}
              >
                <div
                  className="w-full flex flex-col md:flex-row items-center justify-between gap-4"
                  style={{ marginTop: "1rem" }}
                >
                  {/* Preview Image */}
                  {groundImg && (
                    <img
                      src={
                        groundImg?.filename &&
                        `data:${groundImg.contentType};base64,${groundImg.content}`
                      }
                      alt={groundImg?.filename || "Preview"}
                      className="w-[50%] md:w-20 h-10 object-cover rounded-lg border border-gray-300 shadow-sm"
                    />
                  )}

                  {/* File Upload */}
                  <div className="w-full md:w-1/2">
                    <FileUpload
                      name="logo"
                      customUpload
                      uploadHandler={customMap}
                      accept="image/*"
                      maxFileSize={10000000}
                      className="w-full"
                      emptyTemplate={
                        <p className="m-0 text-center text-gray-500">
                          Drag and drop your Map here to upload.
                        </p>
                      }
                    />
                  </div>
                </div>
              </div>

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
                      setForm({ ...form, name: e.detail.value as string })
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
                      setForm({
                        ...form,
                        isSubaddonsAvailable: e.detail.checked,
                      })
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

                      <IonItem
                        style={{ "--background": "#fff", color: "#000" }}
                      >
                        <IonInput
                          value={sub.name}
                          placeholder="Subcategory Title"
                          onIonChange={(e: any) =>
                            handleSubcategoryChange(
                              index,
                              "name",
                              e.detail.value ?? ""
                            )
                          }
                        />
                      </IonItem>

                      <IonItem
                        style={{ "--background": "#fff", color: "#000" }}
                      >
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
                          className={`custom-toggle ${
                            sub.isItemsAvailable ? "toggle-checked" : ""
                          }`}
                        />
                      </IonItem>

                      {!sub.isItemsAvailable && (
                        <IonItem
                          style={{ "--background": "#fff", color: "#000" }}
                        >
                          <IonInput
                            type="number"
                            value={sub.price}
                            placeholder="Enter Price"
                            className="custom-placeholder-black"
                            onIonChange={(e: any) =>
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
                          {sub.refItems?.map((nested: any, nIndex: any) => (
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
                      setForm({
                        ...form,
                        price: parseFloat(e.detail.value ?? ""),
                      })
                    }
                  />
                </IonItem>
              )}

              <div></div>

              {/* Addon Container */}
              <div className="flex flex-col gap-4">
                {addOns.map((addon, addonIndex) => {
                  const selectedEntry = selectedAddonDates.find(
                    (entry) => entry.refAddonId === addon.id
                  );
                  console.log(addon);
                  // Convert unAvailabilityDate strings to Date objects
                  const disabledDates = addon.unAvailabilityDates
                    .map((entry) => {
                      const parsedDate = parseDDMMYYYY(
                        entry.unAvailabilityDate
                      );
                      return isNaN(parsedDate.getTime()) ? null : parsedDate;
                    })
                    .filter((date): date is Date => date !== null);

                  // return (
                  // <Panel key={addonIndex} header={addon.addOn} toggleable>
                  //   <div className="flex flex-col gap-2 mt-2 justify-between">
                  //     <div className="flex justify-between">
                  //       <Button
                  //         type="button"
                  //         className="p-0 mr-2"
                  //         label="Edit"
                  //         onClick={() => handleEditAddon(addon, addonIndex)}
                  //       />
                  //       <Button
                  //         type="button"
                  //         className="p-0"
                  //         severity="danger"
                  //         icon="pi pi-trash"
                  //         onClick={() => handleRemoveAddon(addon, addonIndex)}
                  //       />
                  //     </div>

                  //     <div className="flex gap-2 items-center">
                  //       <Calendar
                  //         value={selectedEntry?.dates || []}
                  //         onChange={(e) =>
                  //           handleDateChange(
                  //             addon.id,
                  //             e.value as Date[] | null
                  //           )
                  //         }
                  //         selectionMode="multiple"
                  //         placeholder="Enter Your Unavailable Dates"
                  //         disabledDates={disabledDates}
                  //         minDate={new Date()}
                  //         className="mb-2 w-full"
                  //       />

                  //       <Button
                  //         type="button"
                  //         label="Add"
                  //         icon="pi pi-plus"
                  //         onClick={() => handleAddDates(addon.id)}
                  //         className="mb-3"
                  //       />
                  //     </div>
                  //   </div>

                  //   <div className="flex flex-wrap gap-2">
                  //     {addon.unAvailabilityDates
                  //       .slice()
                  //       .sort(
                  //         (a, b) =>
                  //           parseDDMMYYYY(a.unAvailabilityDate).getTime() -
                  //           parseDDMMYYYY(b.unAvailabilityDate).getTime()
                  //       )
                  //       .map((entry, dateIndex) => (
                  //         <Chip
                  //           key={entry.addOnsAvailabilityId || dateIndex}
                  //           label={entry.unAvailabilityDate}
                  //           removable
                  //           onRemove={() => {
                  //             console.log(addon);
                  //             handleRemoveDate(entry.addOnsAvailabilityId);
                  //             return true;
                  //           }}
                  //         />
                  //       ))}
                  //   </div>
                  // </Panel>

                  // );
                  return (
                    <IonCard
                      style={{ "--background": "#fff", color: "#000" }}
                      key={addonIndex}
                      className="ion-margin-bottom"
                    >
                      <IonCardHeader>
                        <IonCardTitle style={{ color: "#000" }}>
                          {addon.addOn}
                        </IonCardTitle>
                      </IonCardHeader>

                      <IonCardContent>
                        {/* Action Buttons */}
                        <IonGrid>
                          <IonRow className="ion-justify-content-between ion-align-items-center">
                            <IonCol size="auto">
                              <IonButton
                                size="small"
                                onClick={() =>
                                  handleEditAddon(addon, addonIndex)
                                }
                              >
                                <IonIcon icon={pencil} slot="start" />
                                Edit
                              </IonButton>
                            </IonCol>
                            <IonCol size="auto">
                              <IonButton
                                size="small"
                                color="danger"
                                onClick={() =>
                                  handleRemoveAddon(addon, addonIndex)
                                }
                              >
                                <IonIcon icon={trash} slot="start" />
                                Delete
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>

                        {/* Calendar and Add Button */}
                        <IonGrid>
                          <IonRow className="ion-align-items-center">
                            <IonCol size="small">
                              <Calendar
                                value={selectedEntry?.dates || []}
                                onChange={(e) =>
                                  handleDateChange(
                                    addon.id,
                                    e.value as Date[] | null
                                  )
                                }
                                selectionMode="multiple"
                                placeholder="Enter Your Unavailable Dates"
                                disabledDates={disabledDates}
                                minDate={new Date()}
                                className="w-full"
                              />
                            </IonCol>
                            <IonCol size="5">
                              <IonButton
                                size="small"
                                expand="block"
                                onClick={() => handleAddDates(addon.id)}
                              >
                                <IonIcon icon={add} slot="start" />
                                Add
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>

                        {/* Chips for Added Dates */}
                        <div className="ion-margin-top">
                          {addon.unAvailabilityDates
                            .slice()
                            .sort(
                              (a, b) =>
                                parseDDMMYYYY(a.unAvailabilityDate).getTime() -
                                parseDDMMYYYY(b.unAvailabilityDate).getTime()
                            )
                            .map((entry, dateIndex) => (
                              // <IonChip
                              //   key={entry.addOnsAvailabilityId || dateIndex}
                              //   onClick={() => {}}
                              //   onDelete={() =>
                              //     handleRemoveDate(entry.addOnsAvailabilityId)
                              //   }
                              //   color="medium"
                              // >
                              //   {entry.unAvailabilityDate}
                              // </IonChip>
                              <IonChip
                                key={entry.addOnsAvailabilityId || dateIndex}
                                color="medium"
                              >
                                {entry.unAvailabilityDate}
                                <IonIcon
                                  icon={trash}
                                  className="ion-margin-start"
                                  onClick={() =>
                                    handleRemoveDate(entry.addOnsAvailabilityId)
                                  }
                                  slot="end"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "18px",
                                  }}
                                />
                              </IonChip>
                            ))}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="mt-[1rem] px-[3rem] pb-[3rem]">
                <IonButton
                  type="submit"
                  className="custom-ion-button w-full h-[2.5rem] text-[1rem]"
                  disabled={loading}
                >
                  {loading ? (
                    <i
                      className="pi pi-spin pi-spinner"
                      style={{ fontSize: "1rem" }}
                    ></i>
                  ) : (
                    "Update"
                  )}
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditGround;
