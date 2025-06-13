import React, { useEffect, useState } from "react";
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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonNav,
} from "@ionic/react";
import { sendOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import { Button } from "primereact/button";
import {
  fetchAdditionalTips,
  fetchGoundFacilities,
  fetchGroundFeatures,
  fetchSportCategories,
  fetchUserGuidelines,
} from "../ground/GroundUtlis";

import sport from "../../assets/Groundsettings/sports.jpg";
import features from "../../assets/Groundsettings/features.jpg";
import facility from "../../assets/Groundsettings/facility.jpg";
import guild from "../../assets/Groundsettings/userGuild.png";
import tips from "../../assets/Groundsettings/tips.jpg";

const GroundSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ status: false, message: "" });
  const [present] = useIonToast();
  const [success, setSuccess] = useState({ status: false, message: "" });

  const [groundFeatures, setGroundFeatures] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [userGuidelines, setUserGuidelines] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [additionalTips, setAdditionalTips] = useState([]);

  const history = useHistory();
  const location = useLocation();

  const cardItems = [
    {
      title: "Sports Category",
      route: "/sportscategory",
      image: sport,
    },
    {
      title: "Features",
      route: "/features",
      image: features,
    },
    {
      title: "User Guidelines",
      route: "/userguildelines",
      image: guild,
    },
    {
      title: "Facilities",
      route: "/facilities",
      image: facility,
    },
    {
      title: "Additional Tips",
      route: "/tips",
      image: tips,
    },
  ];

  const GroundFeatures = async () => {
    try {
      const result: any = await fetchGroundFeatures();
      const options = result.map((data: any) => ({
        label: data.refFeaturesName,
        value: data.refFeaturesId,
      }));
      setGroundFeatures(options);
    } catch (error) {
      console.error("Error fetching ground features:", error);
    }
  };

  const GroundSportCategory = async () => {
    try {
      const result: any = await fetchSportCategories();
      const options = result.map((item: any) => ({
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
      const options = result.map((item: any) => ({
        label: item.refUserGuidelinesName,
        value: item.refUserGuidelinesId,
      }));
      setUserGuidelines(options);
    } catch (error) {}
  };

  const GroundFacilities = async () => {
    try {
      const result: any = await fetchGoundFacilities();
      const options = result.map((item: any) => ({
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
      const options = result.map((item: any) => ({
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonButtons slot="start">
            <IonBackButton defaultHref="segment"></IonBackButton>
          </IonButtons> */}
          <IonTitle>Add Extra Features</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="bg-white w-full overflow-auto p-0">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-4 p-4">
              {cardItems.map(({ title, route, image }) => (
                <div
                  key={title}
                  className="cursor-pointer"
                  onClick={() => history.push(route)}
                >
                  <IonCard className="shadow-lg rounded-lg overflow-hidden">
                    <img alt={`Card image for ${title}`} src={image} />
                    <IonCardHeader
                      style={{ "--background": "#fff", color: "#000" }}
                    >
                      <div className="flex items-center justify-between">
                        <IonCardTitle
                          style={{ color: "#0377de", fontSize: "16px" }}
                        >
                          {title}
                        </IonCardTitle>
                    
                      </div>
                    </IonCardHeader>
                  </IonCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GroundSettings;
