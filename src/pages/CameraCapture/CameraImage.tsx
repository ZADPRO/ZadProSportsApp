import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ButtonGroup } from "primereact/buttongroup";

import { chevronBack } from "ionicons/icons";
import React, { useState } from "react";

import { Button } from "primereact/button";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useHistory } from "react-router";

const CameraImage: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>("reports");

  const [value, setValue] = useState<string>();

  const history = useHistory();

  return (
    <div>
      <Button
        icon="pi pi-camera"
        className={
          value === "camera"
            ? "p-button-primary buttonIconGroupStart"
            : "buttonIconGroupStart"
        }
        onClick={async () => {
          setValue("camera");

          try {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.Uri, // Can also use Base64 or DataUrl
              source: CameraSource.Camera,
            });

            console.log("Captured image URI:", image.webPath);
            // You can now display or upload the image using image.webPath
            // For example: showPreview(image.webPath);
          } catch (error) {
            console.error("Camera error:", error);
          }
        }}
      />
    </div>
  );
};

export default CameraImage;
