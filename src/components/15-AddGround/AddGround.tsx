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

interface GroundImage {
  content: string; // base64 image data
  contentType: string; // MIME type, e.g., "image/jpeg"
  filename: string; // original filename
}

export interface AddOnForm {
  name: string;
  isSubaddonsAvailable: boolean;
  price?: number | null;
  refSubAddOns?: object[];
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

const Ownerprofile = () => {
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

  console.log(groundDetails);

  const handleCreateNewGround = async () => {
    const {
      refGroundName,
      refGroundPrice,
      refTournamentPrice,
      refGroundLocation,
      refGroundState,
      refGroundPincode,
      refDescription,
      IframeLink,
      groundLocationLink,
      refFeaturesId,
      refSportsCategoryId,
      refUserGuidelinesId,
      refFacilitiesId,
      refAdditionalTipsId,
    } = groundDetails;

    // Manual validation
    if (
      !refGroundName?.trim() ||
      !refGroundPrice?.trim() ||
      !refTournamentPrice?.trim() ||
      !refGroundLocation?.trim() ||
      !refGroundState?.trim() ||
      !refGroundPincode?.trim() ||
      !refDescription?.trim() ||
      !IframeLink?.trim() ||
      !groundLocationLink?.trim() ||
      !refFeaturesId?.length ||
      !refSportsCategoryId?.length ||
      !refUserGuidelinesId?.length ||
      !refFacilitiesId?.length ||
      !refAdditionalTipsId?.length ||
      !groundImg // Optional: Ensure image is uploaded
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await createNewGround(groundDetails);
      console.log("response", response);

      if (response.success) {
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const [selectedSegment, setSelectedSegment] = useState("addground");

  const handleSegmentChange = (e: CustomEvent) => {
    const value = e.detail.value;
    if (value) setSelectedSegment(value);
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
              {/* Submit Button */}
              <div className="mt-[1rem] px-[3rem] pb-[3rem]">
                <IonButton
                  type="submit" // changed from submit because we handle navigation on click
                  className="custom-ion-button w-full h-[2.5rem] text-[1rem]"
                  onClick={() => history.push("/addons")}
                  disabled={loading} // optionally disable while loading
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

export default Ownerprofile;
