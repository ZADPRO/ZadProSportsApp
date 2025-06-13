import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
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

import { decrypt } from "../../Helper";
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
import CreateAddOns from "./CreateAddOns";
import GroundSettings from "./GroundSettings";
import CameraImage from "../../pages/CameraCapture/CameraImage";

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

interface GroundImage {
  content: string; // base64 image data
  contentType: string; // MIME type, e.g., "image/jpeg"
  filename: string; // original filename
}

interface AddOnForm {
  name: string;
  isSubaddonsAvailable: boolean;
  price?: number | null;
  refSubAddOns?: Subcategory[];
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

const AddGround: React.FC<CreateAddOnsProps> = ({ selectedAddon, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const [present] = useIonToast();

  const [success, setSuccess] = useState({
    status: false,
    message: "",
  });

  const history = useHistory();
  const location = useLocation();

  const [groundDetails, setGroundDetails] = useState<GroundAdd>({
    refGroundName: "",
    isAddOnAvailable: true,
    refAddOns: [],
    refFeaturesId: [],
    refUserGuidelinesId: [],
    refFacilitiesId: [],
    refAdditionalTipsId: [],
    refSportsCategoryId: [],
    refTournamentPrice: "",
    refGroundPrice: "",
    refGroundImage: "",
    refGroundLocation: "",
    refGroundPincode: "",
    refGroundState: "",
    refDescription: "",
    IframeLink: "",
    groundLocationLink: "",
    refStatus: true,
  });
  const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);

  const [groundImg, setGroundImg] = useState<GroundImage | null>(null);

  const [newAddonSidebar, setNewAddonSidebar] = useState(false);
  const [editingAddon, setEditingAddon] = useState<string | null>(null); // or an AddOn object
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // To open for new add-on
  const handleAddNew = () => {
    setEditingAddon(null);
    setEditingIndex(null);
    setIsEditing(false);
    setNewAddonSidebar(true);
  };

  // To edit existing
  const handleEditAddon = (addon: any, index: number) => {
    setEditingAddon(JSON.stringify(addon));
    setEditingIndex(index);
    setIsEditing(true);
    setNewAddonSidebar(true);
  };

  const handleRemoveAddon = (index: number) => {
    const updatedAddons = [...groundDetails.refAddOns];
    updatedAddons.splice(index, 1);
    setGroundDetails({ ...groundDetails, refAddOns: updatedAddons });
  };

  // const handleAddGround = async () => {
  //   const payload = {
  //     refGroundName: groundName,
  //     refGroundPrice: groundPrice,
  //     refGroundLocation: groundLocation,
  //     refGroundState: groundState,
  //     refGroundPincode: groundPincode,
  //     refDescription: groundDescription,
  //     refFeaturesIds: selectedFeatures,
  //     refSportsCategoryIds: selectedSportCategories,
  //   };

  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_API_URL}/groundRoutes/addGround`, payload, {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("JWTtoken"),
  //         "Content-Type": "Application/json",
  //       },
  //     });
  //     const data = decrypt(response.data[1], response.data[0], import.meta.env.VITE_ENCRYPTION_KEY);
  //     if (data.success) {
  //       console.log("Ground added successfully:", data);
  //       // Optionally reset the form or show a success message
  //     }
  //   } catch (error) {
  //     console.error("Error adding ground:", error);
  //   }
  // };

  const GroundFeatures = async () => {
    try {
      const result: any = await fetchGroundFeatures();
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
      const result: any = await fetchSportCategories();
      const options: any = result.map((item: any) => ({
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
      const result: any = await fetchUserGuidelines();
      const options: any = result.map((item: any) => ({
        label: item.refUserGuidelinesName,
        value: item.refUserGuidelinesId,
      }));
      setUserGuidelines(options);
    } catch (error) {}
  };

  const GroundFacilities = async () => {
    try {
      const result: any = await fetchGoundFacilities();
      const options: any = result.map((item: any) => ({
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
      const result: any = await fetchAdditionalTips();
      const options: any = result.map((item: any) => ({
        label: item.refAdditionalTipsName,
        value: item.refAdditionalTipsId,
      }));
      setAdditionalTips(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    GroundFeatures();
    GroundSportCategory();
    GroundUserGuideLines();
    GroundFacilities();
    GroundAdditionalTips();
  }, []);

  const handleInputChange = (field: keyof GroundResult, value: string) => {
    setGroundDetails((prev) => ({
      ...prev!,
      [field]: value,
    }));
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

  const [formDataImages, setFormdataImages] = useState<any>([]);

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
        console.log("data+", response);
        // setGroundImg(response.files[0]);
        // setGroundDetails((prev) => ({
        //   ...prev!,
        //   refGroundImage: response.filePath,
        // }));
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
    setGroundImg(response.filePath);
  };
  console.log("formdata------>", formDataImages);

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  console.log(groundDetails);

  // const handleCreateNewGround = async () => {
  //   await handleSubmit();
  //   const { isAddOnAvailable } = groundDetails;

  //   try {
  //     // If AddOn is available, validate the form
  //     if (isAddOnAvailable) {
  //       validateForm(); // <- Call your AddOn form validation function
  //     }

  //     // Log the groundDetails to check refAddOns
  //     console.log("Ground Details before API call:", groundDetails);

  //     // Proceed with ground creation
  //     const response = await createNewGround(groundDetails, form, groundImg);
  //     if (response.success) {
  //       presentToast("Ground created successfully", "success");
  //       history.push("/listground");
  //     } else {
  //       presentToast("Something went wrong", "danger");
  //     }
  //   } catch (error: any) {
  //     console.error("Error:", error.message || error);
  //     presentToast(
  //       error.message || "Server error while creating ground",
  //       "danger"
  //     );
  //   }
  // };

  const handleCreateNewGround = async () => {
    await handleSubmit();
    const { isAddOnAvailable } = groundDetails;

    try {
      if (isAddOnAvailable) {
        validateForm(); // Validate addon form if needed
      }

      console.log("Ground Details before API call:", groundDetails);

      const response = await createNewGround(groundDetails, form, groundImg);
      if (response.success) {
        presentToast("Ground created successfully", "success");

        setGroundDetails({
          refGroundName: "",
          isAddOnAvailable: true,
          refAddOns: [],
          refFeaturesId: [],
          refUserGuidelinesId: [],
          refFacilitiesId: [],
          refAdditionalTipsId: [],
          refSportsCategoryId: [],
          refTournamentPrice: "",
          refGroundPrice: "",
          refGroundImage: "",
          refGroundLocation: "",
          refGroundPincode: "",
          refGroundState: "",
          refDescription: "",
          IframeLink: "",
          groundLocationLink: "",
          refStatus: true,
        });

        // Redirect to list
        history.push("/listground");
      } else {
        presentToast("Something went wrong", "danger");
      }
    } catch (error: any) {
      console.error("Error:", error.message || error);
      presentToast(
        error.message || "Server error while creating ground",
        "danger"
      );
    }
  };

  // const handleCreateNewGround = async () => {
  //   const { isAddOnAvailable } = groundDetails;

  //   if (isAddOnAvailable) {
  //     // Navigate to AddOn page and pass the groundDetails state
  //     history.push("/addons", { groundDetails });
  //   } else {
  //     try {
  //       const response = await createNewGround(groundDetails);
  //       if (response.success) {
  //         presentToast("Ground created successfully", "success");
  //         history.push("/groundlist"); // or wherever you want to redirect
  //       } else {
  //         presentToast("Something went wrong", "danger");
  //       }
  //     } catch (error) {
  //       console.error("Error creating ground:", error);
  //       presentToast("Server error while creating ground", "danger");
  //     }
  //   }
  // };

  const presentToast = (msg: string, color: "success" | "danger") => {
    present({
      message: msg,
      duration: 2000,
      position: "bottom",
      color,
    });
  };

  const [selectedSegment, setSelectedSegment] = useState("addground");

  const handleSegmentChange = (e: CustomEvent) => {
    const value = e.detail.value;
    if (value) setSelectedSegment(value);
  };
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
      validateForm(); // Validate the form before proceeding
      const newAddon = { ...form }; // Create a new add-on object from the form state
      console.log("newAddon", newAddon);
      // Update groundDetails with the new add-on
      setGroundDetails((prev) => ({
        ...prev,
        refAddOns: [...prev.refAddOns, newAddon], // Add new add-on to the array
      }));

      // Optionally, you can call onSave here if needed
      // onSave(JSON.stringify(newAddon)); // Send it back as a string
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
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons> */}
          <IonTitle>Add Ground </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="bg-[#fff] w-[100%] overflow-auto px-[0rem] py-[0rem]">
          <div className="bg-[#fff] w-[100%] overflow-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateNewGround();
                // handleSubmit();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            >
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Ground Name :</label>
                {/* <InputText
                  id="groundName"
                  placeholder="Ground Name"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  value={groundDetails?.refGroundName || ""}
                  onChange={(e) =>
                    handleInputChange("refGroundName", e.target.value)
                  }
                  required
                /> */}

                <IonInput
                  id="groundName"
                  placeholder="Ground Name"
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  value={groundDetails?.refGroundName || ""}
                  onIonChange={(e) =>
                    handleInputChange("refGroundName", e.target.value as string)
                  }
                  required={true}
                ></IonInput>
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
                  value={groundDetails?.groundLocationLink || ""}
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
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
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
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
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
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
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
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
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
                  className="w-full h-[2.2rem] mt-[0.5rem] text-[#000] px-3"
                  display="chip"
                />
              </div>

           

              {/* Image container */}
              <div
                className="flex flex-col items-center gap-2 m-4 mt-3 p-2 rounded-xl shadow-inset"
                style={{
                  background: "lightgrey",
                }}
              >
                <div className="flex gap-2 justify-between items-start duration-300 rounded-lg">
                  {groundImg && (
                    <img
                      src={
                        groundImg?.filename &&
                        `data:${groundImg.contentType};base64,${groundImg.content}`
                      }
                      alt={groundImg?.filename || "Preview"}
                      className="object-cover w-64 h-64 rounded-lg border-2"
                    />
                  )}

                  <FileUpload
                    name="logo"
                    customUpload
                    className="mt-3"
                    uploadHandler={customMap}
                    accept="image/*"
                    maxFileSize={10000000}
                    emptyTemplate={
                      <p className="m-0">
                        Drag and drop your Map here to upload in Kb.
                      </p>
                    }
                  />
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
                          onIonChange={(e) =>
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
                      setForm({
                        ...form,
                        price: parseFloat(e.detail.value ?? ""),
                      })
                    }
                  />
                </IonItem>
              )}

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
                    "Next"
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

export default AddGround;
