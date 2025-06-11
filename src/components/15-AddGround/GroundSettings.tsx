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

const GroundSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const [present] = useIonToast();

  const [success, setSuccess] = useState({
    status: false,
    message: "",
  });
  const [sportvisibleRight, setsportvisibleRight] = useState<boolean>(false);
  const [featuresvisibleRight, setFeaturesVisibleRight] =
    useState<boolean>(false);
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [facilitiesvisibleRight, setFacilitiesVisibleRight] =
    useState<boolean>(false);
  const [tipsvisibleRight, setTipsVisibleRight] = useState<boolean>(false);
  const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);

  const [newAddonSidebar, setNewAddonSidebar] = useState(false);
  const [editingAddon, setEditingAddon] = useState<string | null>(null); // or an AddOn object
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

const cardItems = [
  {
    title: "Sports Category",
    route: "/sportscategory",
    icon: "pi pi-tags", // placeholder icon
  },
  {
    title: "Features",
    route: "/features",
    icon: "pi pi-cog",
  },
  {
    title: "User Guidelines",
    route: "/userguildelines",
    icon: "pi pi-book",
  },
  {
    title: "Facilities",
    route: "/facilities",
    icon: "pi pi-building",
  },
];
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

  const history = useHistory();
  const location = useLocation();
  const handleSegmentChange = (e: CustomEvent) => {
    const value = e.detail.value;
    history.push(value); // navigate to /addground or /settings
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons> */}
          <IonTitle>Add Extra Features </IonTitle>
        </IonToolbar>
      </IonHeader>

    

      <IonContent>
        <div className="bg-white w-full overflow-auto p-0">
          <div className="bg-white w-full overflow-auto">
            <div className="overall">
              {/* First row of cards */}
              <div className="firstrow flex flex-wrap m-3 gap-6">
                {cardItems.map(({ title, route }) => (
                  <div
                    key={title}
                    className="flex-1 min-w-[280px] max-w-[350px] m-3"
                  >
                    <IonCard
                      style={{ "--background": "#fff", color: "#000" }}
                      className="shadow-lg rounded-lg bg-white"
                    >
                      <div className="p-4 font-bold text-lg text-black">
                        {title}
                      </div>
                      <div className="flex justify-end p-2">
                        <Button
                          icon="pi pi-arrow-right"
                          iconPos="right"
                          className="hover:bg-yellow-400 transition-colors"
                          onClick={() => history.push(route)}
                        />
                      </div>
                    </IonCard>
                  </div>
                ))}
              </div>

              {/* Second row */}
              <div className="secondrow flex m-3">
                <div className="flex-1 min-w-[280px] max-w-[350px] m-3">
                  <IonCard
                    style={{ "--background": "#fff", color: "#000" }}
                    className="shadow-lg rounded-lg"
                  >
                    <div className="p-4 font-bold text-lg text-black">
                      Additional Tips
                    </div>
                    <div className="flex justify-end p-2">
                      <Button
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        className="hover:bg-yellow-400 transition-colors"
                        onClick={() => history.push("/tips")}
                      />
                    </div>
                  </IonCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GroundSettings;
