import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { IoMdClose, IoMdTrash } from "react-icons/io";
import axios from "axios";
import { decrypt } from "../../Helper";
import Logo from "../../assets/images/unavailable.png";

type StreakDate = { date: string };

const OwnerGround = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription]: any = useState({});
  const [image, setImage]: any = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const history = useHistory();

  const fetchData = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const groundId = urlParams.get("groundId");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/groundRoutes/getGround`,
        { refGroundId: groundId },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      localStorage.setItem("token", "Bearer " + data.token);
      console.log("response--->", data);
      if (data.success) {
        setDescription(data.result);
        setImage(data.imgResult[0]);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const deleteData = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const groundId = urlParams.get("groundId");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/groundRoutes/deleteGround`,
        { refGroundId: groundId },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      localStorage.setItem("token", "Bearer " + data.token);
      console.log("response", data);
      if (data.success) {
        history.push("/listground");
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = (event: any) => {
    fetchData();
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{ background: "#ffffff", borderBottom: "1px solid #ccc" }}
        >
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md" />
          </IonButtons>
          <IonTitle style={{ color: "#000000", fontWeight: "bold" }}>
            Description
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => setShowDeleteAlert(true)}
              style={{ color: "red", fontSize: "20px" }}
            >
              <IoMdTrash />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading && !description.IframeLink ? (
          <div style={{ width: "100%", padding: "2rem", textAlign: "center" }}>
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "24px", color: "#0377de" }}
            />
          </div>
        ) : (
          <div
            style={{
              background: "#ffffff",
              padding: "1rem",
              paddingBottom: "6rem",
            }}
          >
            <div style={{ borderRadius: "6px", overflow: "hidden" }}>
              {image.refGroundImage ? (
                <img
                  src={`data:${image.refGroundImage.contentType};base64,${image.refGroundImage.content}`}
                  alt={image.refGroundName}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={Logo}
                  alt="No Image"
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
              )}
            </div>

            <h2
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#222",
                marginTop: "1rem",
              }}
            >
              {description.refGroundName}
            </h2>
            <p style={{ fontSize: "14px", color: "#555" }}>
              Ground ID: {description.refGroundCustId}
            </p>

            <div
              style={{ marginTop: "0.5rem", fontSize: "14px", color: "#333" }}
            >
              <p>
                <strong>Single Day:</strong> ₹{description.refGroundPrice}
              </p>
              <p>
                <strong>Multiple Days:</strong> ₹
                {description.refTournamentPrice}
              </p>
            </div>

            <p
              style={{
                marginTop: "1rem",
                fontSize: "14px",
                color: "#333",
                lineHeight: "1.5",
              }}
            >
              {description.refDescription}
            </p>

            <div style={{ marginTop: "1rem" }}>
              <h3
                style={{ fontWeight: "bold", color: "#222", fontSize: "15px" }}
              >
                Address
              </h3>
              <p style={{ fontSize: "14px", color: "#444" }}>
                {description.refGroundLocation}, {description.refGroundState},{" "}
                {description.refGroundPincode}{" "}
                <span
                  style={{
                    color: "#4338ca",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowModal(true)}
                >
                  View in Map
                </span>
              </p>
            </div>

            <div style={{ marginTop: "1rem", fontSize: "14px", color: "#333" }}>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: description.refStatus ? "#22c55e" : "#cc5a5a",
                  }}
                >
                  {description.refStatus ? "Active" : "Inactive"}
                </span>
              </p>
              <p>
                <strong>Add‑ons Available:</strong>{" "}
                {description.isAddOnAvailable ? "Yes" : "No"}
              </p>
            </div>
            {description.addOns && description.addOns.length > 0 && (
              <div
                style={{ marginTop: "1rem", fontSize: "14px", color: "#333" }}
              >
                <h3
                  style={{
                    fontWeight: "bold",
                    color: "#222",
                    fontSize: "15px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Add‑ons
                </h3>
                {description.addOns.map((addOn: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      padding: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      <strong>Add‑on:</strong> {addOn.addOn}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Price:</strong> ₹{addOn.price}
                    </p>

                    {addOn.subAddOns && addOn.subAddOns.length > 0 && (
                      <div style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
                        {addOn.subAddOns.map((sub: any, idx: number) => (
                          <div key={idx} style={{ marginBottom: "0.5rem" }}>
                            <p style={{ margin: 0 }}>
                              <strong>Sub‑Add‑on:</strong> {sub.subAddOn}
                            </p>
                            {sub.price && (
                              <p style={{ margin: 0 }}>
                                <strong>Price:</strong> ₹{sub.price}
                              </p>
                            )}
                            {sub.items && sub.items.length > 0 && (
                              <ul
                                style={{
                                  paddingLeft: "1.2rem",
                                  marginTop: "0.3rem",
                                }}
                              >
                                {sub.items.map((item: any, i: number) => (
                                  <li key={i}>
                                    {item.item} – ₹{item.price}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Section title="Features" items={description.refFeaturesName} />
            <Section
              title="Facilities Available"
              items={description.refFacilitiesName}
            />
            <Section
              title="Sports Categories"
              items={description.refSportsCategoryName}
            />
            <Section
              title="User Guidelines"
              items={description.refUserGuidelinesName}
            />
            <Section
              title="Additional Tips"
              items={description.refAdditionalTipsName}
            />

            <div style={{ marginTop: "1rem", fontSize: "12px", color: "#666" }}>
              <p>
                Created:{" "}
                {description.createdAt
                  ? new Date(description.createdAt).toLocaleString()
                  : "-"}
              </p>
              <p>
                Updated:{" "}
                {description.updatedAt
                  ? new Date(description.updatedAt).toLocaleString()
                  : "-"}
              </p>
            </div>

            {/* <IonButton
              expand="block"
              style={{
                position: "fixed",
                bottom: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                backgroundColor: "#3b82f6",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              onClick={() =>
                history.push("/editground", description.refGroundId)
              }
            >
              Edit Now
            </IonButton> */}
          </div>
        )}
      </IonContent>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
          }}
        >
          <div
            style={{
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f0f0f0",
              borderBottom: "1px solid #ccc",
            }}
          >
            <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#000" }}>
              Location
            </h2>
            <IoMdClose
              style={{ fontSize: "22px", cursor: "pointer", color: "#444" }}
              onClick={() => setShowModal(false)}
            />
          </div>
          <iframe
            src={description.IframeLink}
            style={{ flex: 1, width: "100%", border: "none" }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </IonModal>

      {/* Delete confirmation alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Confirm Delete"
        message="Are you sure you want to delete this ground?"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Delete",
            handler: deleteData,
          },
        ]}
      />
    </IonPage>
  );
};

type SectionProps = {
  title: string;
  items?: string[];
};

const Section: React.FC<SectionProps> = ({ title, items }) => {
  if (!items || !items.length) return null;
  return (
    <div style={{ marginTop: "1rem" }}>
      <h3
        style={{
          fontWeight: "bold",
          color: "#222",
          fontSize: "15px",
          marginBottom: "0.3rem",
        }}
      >
        {title}
      </h3>
      <ul style={{ paddingLeft: "1rem", fontSize: "14px", color: "#333" }}>
        {items.map((it, idx) => (
          <li key={idx}>{it}</li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerGround;
