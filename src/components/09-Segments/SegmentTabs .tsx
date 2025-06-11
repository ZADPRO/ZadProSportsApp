import React, { useState } from "react";
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from "@ionic/react";

import AddGround from "../15-AddGround/AddGround"; // your actual component
import AddOns from "../15-AddGround/CreateAddOns"; // your actual component
import AddExtras from "../15-AddGround/GroundSettings"; // your actual component

const SegmentTabs = () => {
  const [selectedSegment, setSelectedSegment] = useState("addground");

  const handleSegmentChange = (e: CustomEvent) => {
    const value = e.detail.value;
    if (value) setSelectedSegment(value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          {/* <IonTitle>Add Extra Features </IonTitle> */}
          <div className="flex flex-row mt-4 justify-center w-full items-center">
            <IonSegment
              className="flex flex-row m-[3%]"
              color="primary"
              value={selectedSegment}
              onIonChange={handleSegmentChange}
            >
              <IonSegmentButton value="addground">
                <IonLabel>Ground</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="addons">
                <IonLabel>AddOn's</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="groundsettings">
                <IonLabel>Extras</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {selectedSegment === "addground" && <AddGround />}
        {selectedSegment === "addons" && <AddOns />}
        {selectedSegment === "groundsettings" && <AddExtras />}
      </IonContent>
    </IonPage>
  );
};

export default SegmentTabs;
