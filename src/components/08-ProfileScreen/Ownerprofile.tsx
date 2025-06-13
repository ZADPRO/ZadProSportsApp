import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
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
import { Browser } from "@capacitor/browser";

import { IonToggle } from "@ionic/react";
import logo from "../../assets/images/Logo.png";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useHistory } from "react-router";
import { useEffect, useRef, useState } from "react";

import { decrypt } from "../../Helper";
import axios from "axios";

import { IonItem, IonList, IonPopover } from "@ionic/react";
import { FileUpload } from "primereact/fileupload";
import { RadioButton } from "primereact/radiobutton";
import { IoIosArrowBack, IoMdCreate } from "react-icons/io";
import { MultiSelect } from "primereact/multiselect";
import AddressMap from "../AddressMap";

interface SportCategory {
  refSportsCategoryId: number;
  refSportsCategoryName: string;
}

interface OwnerInputState {
  refOwnerFname: string;
  refOwnerLname: string;
  refEmailId: string;
  refMobileId: string;
  refCustPassword: string;
  refAadharId: string;
  refPANId: string;
  refGSTnumber: string;
  isOwnGround: boolean;
  refGroundImage: string;
  refGroundDescription: string;
  refBankName: string;
  refBankBranch: string;
  refAcHolderName: string;
  refAccountNumber: string;
  refIFSCcode: string;
  refDocument1Path: string;
  refDocument2Path: string;
  groundAddress: string;
  refGroundSports: { id: number }[];
}
interface GroundImage {
  content: string; // base64 image data
  contentType: string; // MIME type, e.g., "image/jpeg"
  filename: string; // original filename
}

interface SportCategory {
  refSportsCategoryId: number;
  refSportsCategoryName: string;
}

interface Address {
  groundAddress: string;
  refSportsCategoryId: number;
  refSportsCategoryName: string;
  refOwnerSportsMappingId: number;
}

const Ownerprofile = () => {
  const [groundImage, setGroundImage] = useState<GroundImage | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedCategoryType, setSelectedCategoryType] = useState<
    SportCategory[]
  >([]);
  const [sportsType, setSportsType] = useState<SportCategory[]>([]);
  const [categoryAddresses, setCategoryAddresses] = useState<
    Record<number, string>
  >({});
  const [addressOption, setAddressOption] = useState<"default" | "category">(
    "default"
  );
  const [addressMap, setAddressMap] = useState<Address[]>([]);

  const [document1, setDocument1] = useState<GroundImage | null>(null);
  const [document2, setDocument2] = useState<GroundImage | null>(null);
  const history = useHistory();

  const toast = useRef(null);
  const [inputs, setInputs] = useState<OwnerInputState>({
    refOwnerFname: "",
    refOwnerLname: "",
    refEmailId: "",
    refMobileId: "",
    refCustPassword: "",
    refAadharId: "",
    refPANId: "",
    refGSTnumber: "",
    isOwnGround: true,
    refGroundImage: "",
    refGroundDescription: "",
    refBankName: "",
    refBankBranch: "",
    refAcHolderName: "",
    refAccountNumber: "",
    refIFSCcode: "",
    refDocument1Path: "",
    refDocument2Path: "",
    groundAddress: "",
    refGroundSports: [],
  });

  const [isGroundOwner, setIsGroundOwner] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);

  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const [success, setSuccess] = useState({
    status: false,
    message: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchData = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/v1/ownerRoutes/ownerHistoryWithStatus`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
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

    console.log(data);

    if (data.success) {
      const newdata = data.result[0];
      const selectedCategoryIds = newdata.ownersportsmappings.map(
        (mapping: any) => mapping.refSportsCategoryId
      );
      setInputs({
        refOwnerFname: newdata.refOwnerFname,
        refOwnerLname: newdata.refOwnerLname,
        refEmailId: newdata.refEmailId,
        refMobileId: newdata.refMobileId,
        refCustPassword: newdata.refCustPassword,
        refAadharId: newdata.refAadharId,
        refPANId: newdata.refPANId,
        refGSTnumber: newdata.refGSTnumber,
        isOwnGround: newdata.isOwnGround,
        refGroundImage: newdata.refGroundImage?.content || "",
        refGroundDescription: newdata.refGroundDescription,
        refBankName: newdata.refBankName,
        refBankBranch: newdata.refBankBranch,
        refAcHolderName: newdata.refAcHolderName,
        refAccountNumber: newdata.refAccountNumber,
        refIFSCcode: newdata.refIFSCcode,
        refDocument1Path: newdata.refDocument1Path,
        refDocument2Path: newdata.refDocument2Path,
        groundAddress: newdata.groundAddress,
        refGroundSports: newdata.ownersportsmappings,
      });
      setGroundImage(newdata.refGroundImage);
      setIsGroundOwner(Boolean(newdata.isOwnGround));
      setIsDefault(newdata.isDefaultAddress);
      setSelectedCategoryType(selectedCategoryIds);
      setDocument1(newdata.refDocument1Path);
      setDocument2(newdata.refDocument2Path);
      setAddressMap(newdata.ownersportsmappings);
    }
  };
  const listSportApi = () => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/v1/ownerRoutes/listSportsCategory`,
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
        console.log("listSportApi called");
        if (data.success) {
          console.log(data);
          setSportsType(data.result);
        }
      })
      .catch((error) => {
        console.error("Error fetching sports categories:", error);
      });
  };

  useEffect(() => {
    console.log({ selectedCategoryType });
  }, [selectedCategoryType]);

  useEffect(() => {
    setLoading(true);
    listSportApi();

    try {
      fetchData();
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }, []);

  const Document2 = async () => {
    await Browser.open({
      url: `data:application/pdf;base64,${document2!.content}`,
    });
  };
  const Document1 = async () => {
    await Browser.open({
      url: `data:application/pdf;base64,${document2!.content}`,
    });
  };

  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();
  const [isEditing, setIsEditing] = useState(false);

  const UpdateOwner = async () => {
    try {
      let payload: any = {
        refOwnerFname: inputs.refOwnerFname,
        refOwnerLname: inputs.refOwnerLname,
        refEmailId: inputs.refEmailId,
        refMobileId: inputs.refMobileId,
        refCustPassword: inputs.refCustPassword,
        refAadharId: inputs.refAadharId,
        refPANId: inputs.refPANId,
        refGSTnumber: inputs.refGSTnumber,
        isOwnGround: isGroundOwner,
        isDefaultAddress: isDefault,
        refGroundImage: groundImage,
        refGroundDescription: inputs.refGroundDescription,
        refBankName: inputs.refBankName,
        refBankBranch: inputs.refBankBranch,
        refAcHolderName: inputs.refAcHolderName,
        refAccountNumber: inputs.refAccountNumber,
        refIFSCcode: inputs.refIFSCcode,
        refDocument1Path: document1,
        refDocument2Path: document2,
        refGroundSports: selectedCategoryType,
      };

      // Set groundAddress only if 'default' is selected
      if (addressOption === "default") {
        payload.groundAddress = inputs.groundAddress;
      }

      // Build refGroundSports array based on address option
      const refGroundSports: any[] = selectedCategoryType.map((category) => {
        const groundSport: any = {
          id: category.refSportsCategoryId,
        };

        if (addressOption === "category") {
          groundSport.groundAddress =
            categoryAddresses[category.refSportsCategoryId] || "";
        }

        return groundSport;
      });

      payload.refGroundSports = refGroundSports;

      console.log("Payload to send:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/ownerRoutes/updateOwners`,
        payload,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
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
      //   localStorage.setItem("name");

      present({
        message: "Successfully Updated",
        duration: 2000,
        color: "success",
        position: "bottom",
      });

      // toast.current!.show({ severity: 'success', summary: 'Success', detail: 'Successfully Updated', life: 3000 });
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong while updating profile.");
    }
  };

  const profile = async (event: any) => {
    console.table("event", event);
    const file = event.files[0];
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    for (let pair of formData.entries()) {
      console.log("-------->______________", pair[0] + ":", pair[1]);
    }

    console.log("formData------------>", formData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/ownerRoutes/uploadGroundImage`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("token", data.token);
      console.log("data==============", data);

      if (data.success) {
        console.log("data+", data);
        handleUploadSuccessMap(data);
      }
    } catch (error) {
      handleUploadFailure(error);
    }
  };

  const handleUploadSuccessMap = (response: any) => {
    console.log("Upload Successful:", response);
    setGroundImage(response.filePath);
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
  };
  const UploaderDoc1 = async (event: any) => {
    console.table("event", event);

    // Create a FormData object

    // Loop through the selected files and append each one to the FormData
    for (let i = 0; i < event.files.length; i++) {
      const formData = new FormData();
      const file = event.files[i];
      formData.append("PdfFile", file);

      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/v1/ownerRoutes/uploadownerDocuments1`,

          formData,

          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        if (data.success) {
          localStorage.setItem("token", "Bearer " + data.token);
          handlepassportUploadSuccess1(data);
        } else {
          handlepassportUploadFailure1(data);
        }
      } catch (error) {
        handlepassportUploadFailure1(error);
      }
    }
  };
  const handlepassportUploadSuccess1 = (response: any) => {
    // let temp = [...document1]; // Create a new array to avoid mutation
    // temp.push(response.filePath); // Add the new file path
    // console.log("Upload Successful:", response);
    setDocument1(response.filePath); // Update the state with the new array
  };

  const handlepassportUploadFailure1 = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  const UploaderDoc2 = async (event: any) => {
    console.table("event", event);

    // Create a FormData object

    // Loop through the selected files and append each one to the FormData
    for (let i = 0; i < event.files.length; i++) {
      const formData = new FormData();
      const file = event.files[i];
      formData.append("PdfFile", file);

      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/v1/ownerRoutes/uploadownerDocuments2`,

          formData,

          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        if (data.success) {
          localStorage.setItem("token", "Bearer " + data.token);
          handlepassportUploadSuccess2(data);
        } else {
          handlepassportUploadFailure2(data);
        }
      } catch (error) {
        handlepassportUploadFailure2(error);
      }
    }
  };
  const handlepassportUploadSuccess2 = (response: any) => {
    // let temp = [...document1]; // Create a new array to avoid mutation
    // temp.push(response.filePath); // Add the new file path
    // console.log("Upload Successful:", response);
    setDocument1(response.filePath); // Update the state with the new array
  };

  const handlepassportUploadFailure2 = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  const handleCategoryChange = (e: any) => {
    const newCategories = e.value;
    console.log("Selected categories changed:", newCategories);

    if (newCategories.length < selectedCategoryType.length) {
    }

    setSelectedCategoryType(newCategories);

    const freshAddresses: Record<number, string> = {};

    newCategories.forEach((category: SportCategory) => {
      freshAddresses[category.refSportsCategoryId] = "";
    });

    setCategoryAddresses(freshAddresses);
  };

  const handleCategoryAddressChange = (
    refSportsCategoryId: number,
    isDefaultAddress: boolean,
    address: string
  ) => {
    if (isDefaultAddress) {
      setAddressMap((prev) => {
        const newAddress = prev.map((item) => ({
          ...item,
          groundAddress: address,
        }));
        return newAddress;
      });
    } else {
      setAddressMap((prev) => {
        const newAddress = prev.map((item) => {
          if (item.refSportsCategoryId === refSportsCategoryId) {
            return {
              ...item,
              groundAddress: address,
            };
          }
          return item;
        });
        return newAddress;
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="end">
            {/* <IonButton onClick={() => setIsEditing(!isEditing)}>
              <IoMdCreate style={{ fontSize: "2rem", fontWeight: "bold" }} />
            </IonButton> */}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <Toast ref={toast} position="bottom-center" /> */}
        <div className="bg-[#fff] w-[100%] overflow-auto px-[0rem] py-[0rem]">
          {loading ? (
            <>
              <div className="w-[100%] py-[2rem] flex justify-center items-center">
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "2rem", color: "#0377de" }}
                ></i>
              </div>
            </>
          ) : (
            <div className="bg-[#fff] w-[100%] overflow-auto">
              <form
                onSubmit={(e: any) => {
                  e.preventDefault();
                  if (isEditing) {
                    UpdateOwner();
                    setIsEditing(false);
                  }
                }}
              >
                <div className="cardDesign font-[poppins] ">
                  {/* <div className="w-[100%] flex justify-center items-center mt-[20px]">
                    <img
                      src={logo}
                      style={{ width: "30%" }}
                      alt="Sports Logo"
                      className="logo"
                    />
                  </div>

                  <div className="text-[1.5rem] font-[600] text-center mt-[0rem]">
                    Register Account
                  </div> */}

                  {/* First Name */}
                  <div className="mt-[1rem] px-[1rem]">
                    <label className="text-[#000]">First Name</label>
                    <InputText
                      name="refOwnerFname"
                      value={inputs.refOwnerFname}
                      onChange={handleInput}
                      placeholder="Enter First Name"
                      className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                      required
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="mt-[0.8rem] px-[1rem]">
                    <label className="text-[#000]">Last Name</label>
                    <InputText
                      name="refOwnerLname"
                      value={inputs.refOwnerLname}
                      onChange={handleInput}
                      placeholder="Enter Last Name"
                      className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                      required
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Mobile */}
                  <div className="mt-[0.8rem] px-[1rem]">
                    <label className="text-[#000]">Mobile Number</label>
                    <InputText
                      name="refMobileId"
                      value={inputs.refMobileId}
                      onChange={handleInput}
                      placeholder="Enter Mobile Number"
                      className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                      required
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Email */}
                  <div className="mt-[0.8rem] px-[1rem]">
                    <label className="text-[#000]">Email</label>
                    <InputText
                      name="refEmailId"
                      type="email"
                      value={inputs.refEmailId}
                      onChange={handleInput}
                      placeholder="Enter Email"
                      className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                      required
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Password */}
                  <div className="mt-[0.8rem] px-[1rem]">
                    <label className="text-[#000]">Password</label>
                    <Password
                      name="refCustPassword"
                      value={inputs.refCustPassword}
                      onChange={handleInput}
                      toggleMask
                      feedback={false}
                      placeholder="Enter Password"
                      className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                      required
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                {/* Aadhar */}
                <div className="mt-[1.5rem] px-[1rem]">
                  <label className="text-[#000]">Aadhar Card Number</label>
                  <InputText
                    name="refAadharId"
                    value={inputs.refAadharId}
                    onChange={handleInput}
                    placeholder="Aadhar Card Number"
                    className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                    required
                    disabled={!isEditing}
                  />
                </div>
                {/* PAn */}
                <div className="mt-[0.8rem] px-[1rem]">
                  <label className="text-[#000]">Pan Card Number</label>
                  <InputText
                    name="refPANId"
                    value={inputs.refPANId}
                    onChange={handleInput}
                    placeholder="Pan Card Number"
                    className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="mt-[1rem] px-[1rem] ">
                  <label className="text-[#000] flex justify-center font-[600] mt-3">
                    Bank Details
                  </label>
                </div>

                {/* Last Name */}
                <div className="mt-[0.8rem] px-[1rem]">
                  <label className="text-[#000]">Bank Name</label>
                  <InputText
                    name="refBankName"
                    value={inputs.refBankName}
                    onChange={handleInput}
                    placeholder="Enter Bank Name"
                    className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="mt-[0.8rem] px-[1rem]">
                  <label className="text-[#000]">Account Holder Name</label>
                  <InputText
                    name="refAcHolderName"
                    value={inputs.refAcHolderName}
                    onChange={handleInput}
                    placeholder="Enter Bank Name"
                    className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="mt-[0.8rem] px-[1rem]">
                  <label className="text-[#000]">IFSC Code</label>
                  <InputText
                    name="refIFSCcode"
                    value={inputs.refIFSCcode}
                    onChange={handleInput}
                    placeholder="Enter Bank Name"
                    className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="mt-[0.8rem] px-[1rem]">
                  <label className="text-[#000]">Account No</label>
                  <InputText
                    name="refAccountNumber"
                    value={inputs.refAccountNumber}
                    onChange={handleInput}
                    placeholder="Enter Bank Name"
                    className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                    required
                    disabled={!isEditing}
                  />
                </div>

                <div className="mt-[0.8rem] px-[1rem]">
                  <label className="text-[#000]">Branch</label>
                  <InputText
                    name="refBankBranch"
                    value={inputs.refBankBranch}
                    onChange={handleInput}
                    placeholder="Enter Bank Name"
                    className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="mt-[2rem] px-[1rem] flex flex-row justify-around items-center w-[100%]">
                  <label className="text-[#000]">Own Ground :</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#000]">No</span>
                    <IonToggle
                      checked={isGroundOwner}
                      onIonChange={(e) => setIsGroundOwner(e.detail.checked)}
                      labelPlacement="stacked"
                      className="custom-toggle"
                      style={{
                        "--handle-background-checked": "#0377de",
                        "--track-background-checked": "#badeff",
                        "--handle-background": "gray",
                        "--track-background": "#ccc",
                        "--track-height": "16px",
                        "--track-width": "32px",
                        margin: "0",
                        padding: "0",
                        textAlign: "center",
                      }}
                    ></IonToggle>
                    <span className="text-sm text-[#000]">Yes</span>
                  </div>
                </div>

                <IonItem
                  lines="none"
                  style={{ "--background": "#fff", color: "#000" }}
                  className="ion-margin-top ion-padding-start"
                >
                  <IonLabel className="ion-text-wrap">
                    Upload Ground Image
                  </IonLabel>
                </IonItem>

                <div style={{ background: "#fff", paddingLeft: "5rem" }}>
                  {groundImage && (
                    <div className="mt-4">
                      <img
                        src={`data:${groundImage.contentType};base64,${groundImage.content}`}
                        alt={groundImage.filename || "Preview"}
                        className="w-[50%] h-auto object-cover rounded-lg border border-gray-300 shadow-sm "
                      />
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="ion-padding">
                  <FileUpload
                    name="logo"
                    customUpload
                    uploadHandler={profile}
                    accept="image/*"
                    maxFileSize={10000000}
                    emptyTemplate={
                      <p className="m-0">Drag and drop your image here.</p>
                    }
                  />
                  {!isUploaded && (
                    <IonText color="danger" className="ion-padding-top">
                      * Please upload the image to continue
                    </IonText>
                  )}
                </div>

                {/* Sports Category Label */}
                <IonItem
                  style={{ "--background": "#fff", color: "#000" }}
                  lines="none"
                  className="ion-padding-start"
                >
                  <IonLabel>Sports Category</IonLabel>
                </IonItem>

                {/* MultiSelect Dropdown */}
                <div className="ion-padding-start ion-padding-end ion-margin-top">
                  <MultiSelect
                    value={selectedCategoryType}
                    onChange={(e) => {
                      setSelectedCategoryType(e.value);
                      console.log("setSelectedEmployeeType-->", e.value);
                    }}
                    options={sportsType}
                    optionLabel="refSportsCategoryName"
                    optionValue="refSportsCategoryId"
                    display="chip"
                    required
                    placeholder="Select Actegory Type"
                    maxSelectedLabels={1}
                    className="w-full md:w-20rem"
                  />
                </div>

                {/* Address Option Selection */}
                <IonItem
                  style={{ "--background": "#fff", color: "#000" }}
                  lines="none"
                  className="ion-margin-top"
                >
                  <IonLabel className="ion-text-wrap">
                    Address Configuration:
                  </IonLabel>
                </IonItem>
                <div
                  className="p-field-radiobutton"
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "8px",
                    paddingLeft: "20px",
                  }}
                >
                  <RadioButton
                    inputId="default"
                    name="addressOption"
                    value="default"
                    onChange={(e) => setIsGroundOwner(true)}
                    checked={isDefault === true}
                  />
                  <label htmlFor="default" style={{ marginLeft: "8px" }}>
                    Use Default Address for All Sports
                  </label>
                </div>

                <div
                  className="p-field-radiobutton"
                  style={{
                    background: "#fff",
                    color: "#000",
                    padding: "8px",
                    marginTop: "8px",
                    paddingLeft: "20px",
                  }}
                >
                  <RadioButton
                    inputId="category"
                    name="addressOption"
                    value="category"
                    onChange={(e) => setIsGroundOwner(false)}
                    checked={isDefault === false}
                  />
                  <label htmlFor="category" style={{ marginLeft: "8px" }}>
                    Different Address for Each Sport
                  </label>
                </div>

                {/* Address Input */}
                {/* {isDefault ? (
                  <IonItem
                    style={{ "--background": "#fff", color: "#000" }}
                    className="ion-margin-top"
                  >
                    <IonLabel position="stacked">Default Address</IonLabel>
                    <IonInput
                      placeholder="Default Address for all sports"
                      required
                    ></IonInput>
                  </IonItem>
                ) : (
                  <div className="ion-padding-top w-full text-center">
                    <IonLabel className="ion-margin-bottom text-[#000] text-center">
                      Sports Category Addresses :
                    </IonLabel>

                    {selectedCategoryType.length === 0 ? (
                      <IonText className="text-[#000] text-center block mt-2">
                        Please Select categories First
                      </IonText>
                    ) : (
                      selectedCategoryType.map((category) => (
                        <IonItem
                          style={{
                            "--background": "#fff",
                            color: "#000",
                            justifyContent: "center", // center the input contents
                          }}
                          key={category.refSportsCategoryId}
                        >
                          <IonLabel
                            position="stacked"
                            className="text-center w-full"
                          >
                            {category.refSportsCategoryName}
                          </IonLabel>
                          <IonInput
                            className="w-full text-center"
                            placeholder={`Address for ${category.refSportsCategoryName}`}
                            value={
                              categoryAddresses[category.refSportsCategoryId] ??
                              ""
                            }
                            onIonChange={(e) =>
                              handleCategoryAddressChange(
                                category.refSportsCategoryId,
                                e.detail.value ?? ""
                              )
                            }
                            required
                          />
                        </IonItem>
                      ))
                    )}
                  </div>
                )} */}

                <AddressMap
                  addresses={addressMap}
                  isDefaultAddress={isDefault}
                  selectedCategoryLength={selectedCategoryType.length}
                  handleChange={handleCategoryAddressChange}
                />

                <IonItem
                  lines="none"
                  style={{ "--background": "#fff", color: "#000" }}
                  className="ion-margin-top ion-padding-start"
                >
                  <IonLabel className="ion-text-wrap">
                    Upload Original Document
                  </IonLabel>
                </IonItem>
                {/* <div style={{ background: "#fff", paddingLeft: "5rem" }}>
                  {document1 && (
                    <div className="mt-4">
                      <img
                        src={`data:${document1.contentType};base64,${document1.content}`}
                        alt={document1.filename || "Preview"}
                        className="w-[50%] h-auto object-cover rounded-lg border border-gray-300 shadow-sm "
                      />
                    </div>
                  )}
                </div> */}
                <div className="flex justify-center items-center w-[100%]">
                  <IonButton
                    className="flex justify-center items-center w-[30%] "
                    onClick={Document1}
                  >
                    View PDF
                  </IonButton>
                </div>

                {/* File Upload */}
                <div className="ion-padding">
                  <FileUpload
                    name="logo"
                    customUpload
                    uploadHandler={UploaderDoc1}
                    accept="application/pdf"
                    maxFileSize={10000000}
                    emptyTemplate={
                      <p className="m-0">Drag and drop your image here.</p>
                    }
                  />
                  {!isUploaded && (
                    <IonText color="danger" className="ion-padding-top">
                      * Please upload the pdf to continue
                    </IonText>
                  )}
                </div>
                <IonItem
                  lines="none"
                  style={{ "--background": "#fff", color: "#000" }}
                  className="ion-margin-top ion-padding-start"
                >
                  <IonLabel className="ion-text-wrap">
                    Upload Original Document
                  </IonLabel>
                </IonItem>
                {/* {document2 && document2.contentType === "application/pdf" && (
                  <div className="mt-4">
                    <iframe
                      src={`data:application/pdf;base64,${document2.content}`}
                      title="PDF Preview"
                      width="100%"
                      height="300px"
                      style={{ border: "none" }}
                    ></iframe>
                  </div>
                )} */}
                <div className="flex justify-center items-center w-[100%]">
                  <IonButton
                    className="flex justify-center items-center w-[30%] "
                    onClick={Document2}
                  >
                    View PDF
                  </IonButton>
                </div>
                {/* File Upload */}
                <div className="ion-padding">
                  <FileUpload
                    name="logo"
                    customUpload
                    uploadHandler={UploaderDoc2}
                    accept="application/pdf"
                    maxFileSize={10000000}
                    emptyTemplate={
                      <p className="m-0">Drag and drop your pdf here.</p>
                    }
                  />
                  {!isUploaded && (
                    <IonText color="danger" className="ion-padding-top">
                      * Please upload the pdf to continue
                    </IonText>
                  )}
                </div>

                <div
                  className={`mt-[1rem] h-[1rem] px-[3rem] text-[${
                    error.status ? "red" : "green"
                  }] font-[poppins]`}
                >
                  {error.status ? error.message : ""}
                  {success.status ? success.message : ""}
                </div>

                {/* Submit Button */}
                <div className="mt-[1rem] px-[3rem] pb-[3rem]">
                  <IonButton
                    type="submit"
                    className="custom-ion-button w-full h-[2.5rem] text-[1rem]"
                  >
                    {loading ? (
                      <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: "1rem" }}
                      ></i>
                    ) : isEditing ? (
                      "Save"
                    ) : (
                      "Save"
                    )}
                  </IonButton>
                </div>
              </form>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Ownerprofile;
