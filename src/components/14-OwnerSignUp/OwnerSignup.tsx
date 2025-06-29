import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import {
  IonLabel,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonText,
  IonTextarea,
} from "@ionic/react";
import { alertController } from "@ionic/core";
import { useIonToast } from "@ionic/react";

import { Button } from "primereact/button";
import { IonToggle } from "@ionic/react";
import logo from "../../assets/images/Logo.png";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useHistory } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { decrypt } from "../../Helper";
import axios from "axios";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonItem, IonList, IonPopover } from "@ionic/react";
import { FileUpload } from "primereact/fileupload";
import { RadioButton } from "primereact/radiobutton";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useIonAlert } from "@ionic/react";

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
  isDefault: boolean;
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

interface SportCategory {
  refSportsCategoryId: number;
  refSportsCategoryName: string;
}

interface GroundSport {
  id: number;
  sportsName: string;
  groundAddress?: string;
}

import { MultiSelect } from "primereact/multiselect";
import CameraImage from "../../pages/CameraCapture/CameraImage";
const OwnerSignup = () => {
  const [groundImage, setGroundImage] = useState<string | undefined>();
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);
  const [pendingCameraFile, setPendingCameraFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showUploadError, setShowUploadError] = useState(false);
  const [errors, setErrors] = useState({
    refPANId: "",
    refGSTnumber: "",
    refIFSCcode: "",
    refAccountNumber: "",
  });
  const [present] = useIonToast();

  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
  const [presentAlert] = useIonAlert();

  const [document1, setDocument1] = useState("");
  const [document2, setDocument2] = useState("");
  const history = useHistory();

  const [value, setValue] = useState<string>();

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
    isDefault: true,
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
  const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false);

  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const [success, setSuccess] = useState({
    status: false,
    message: "",
  });

  const clearError = () => {
    setError({
      status: false,
      message: "",
    });
  };

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //     StatusBar.setOverlaysWebView({ overlay: false });
  //     StatusBar.setStyle({ style: Style.Dark });
  //     StatusBar.setBackgroundColor({ color: "#0377de" });

  //     return () => {
  //         StatusBar.setOverlaysWebView({ overlay: true });
  //     };
  // }, []);

  //
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value", e.target.value);
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Allow only digits and max 10 characters
    if (name === "refMobileId") {
      const cleaned = value.replace(/\D/g, ""); // remove non-digit characters
      if (cleaned.length > 10) return; // restrict to 10 digits
      setInputs((prevState) => ({
        ...prevState,
        [name]: cleaned,
      }));
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const AddOwner = async () => {
    try {
      const isDefaultAddress = addressOption === "default";

      let payload: any = {
        refOwnerFname: inputs.refOwnerFname,
        refOwnerLname: inputs.refOwnerLname,
        refEmailId: inputs.refEmailId,
        refMobileId: inputs.refMobileId,
        refCustPassword: inputs.refCustPassword,
        refAadharId: inputs.refAadharId,
        refPANId: inputs.refPANId,
        refGSTnumber: inputs.refGSTnumber,
        isDefaultAddress: isDefaultAddress,
        isOwnGround: isGroundOwner,
        refGroundImage: groundImage,
        refGroundDescription: inputs.refGroundDescription,
        refBankName: inputs.refBankName,
        refBankBranch: inputs.refBankBranch,
        refAcHolderName: inputs.refAcHolderName,
        refAccountNumber: inputs.refAccountNumber,
        refIFSCcode: inputs.refIFSCcode,
        refDocument1Path: document1,
        refDocument2Path: document2,
      };

      if (isDefaultAddress) {
        payload.groundAddress = inputs.groundAddress;
      }

      const refGroundSports: any[] = selectedCategoryType.map((category) => {
        const sportId = category.refSportsCategoryId;
        const groundSport: any = { id: sportId };

        if (!isDefaultAddress) {
          groundSport.groundAddress = categoryAddresses[sportId] || "";
        }

        return groundSport;
      });

      payload.refGroundSports = refGroundSports;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/ownerRoutes/addOwners`,
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

      console.log("data---------->Owner", data);

      await presentAlert({
        header: "Info",
        message: data.message || "Something went wrong.",
        buttons: ["OK"],
      });

      if (data.success || data.message === "Email Already exists") {
        history.push("/login");
      }
    } catch (e) {
      console.log("Error adding Owner:", e);
      await presentAlert({
        header: "Error",
        message: "Something went wrong while adding owner.",
        buttons: ["OK"],
      });
    }
  };
  const showErrorAlert = async (message: string) => {
    const alert = await alertController.create({
      header: "Upload Error",
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  };

  const profile = async (event: any) => {
    console.table("event", event);
    const file = event.files[0];
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);
    if (!file) {
      showErrorAlert("* Please upload an image (max size: 1000 KB)");
      return;
    }

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
        setIsUploaded(true);
        setShowSuccessToast(true);
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

    showErrorAlert("Upload failed. Please try again.");
  };

  const handleCategoryChange = (e: any) => {
    const newCategories = e.value;
    console.log("Selected categories changed:", newCategories);

    if (newCategories.length < selectedCategoryType.length) {
    }

    setSelectedCategoryType(newCategories);

    const freshAddresses: Record<number, string> = {};

    newCategories.forEach((category: SportCategory) => {
      // Initialize each category with empty string - no carryover from previous state
      freshAddresses[category.refSportsCategoryId] = "";
    });

    setCategoryAddresses(freshAddresses);
  };

  //list sports

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
        console.log("listSportApi called");
        localStorage.setItem("token", "Bearer " + data.token);
        if (data.success) {
          console.log(data);
          setSportsType(data.result);
        }
      })
      .catch((error) => {
        console.error("Error fetching sports categories:", error);
      });
  };

  const handleCategoryAddressChange = (categoryId: number, address: string) => {
    console.log(`Updating address for category ${categoryId}:`, address);

    setCategoryAddresses((prev) => ({ ...prev, [categoryId]: address }));
    // setCategoryAddresses((prevAddresses) => {
    //       const newAddresses: Record<number, string> = {};

    //       Object.keys(prevAddresses).forEach((key) => {
    //     const numKey = parseInt(key);
    //     newAddresses[numKey] = prevAddresses[numKey];
    //   });

    //   newAddresses[categoryId] = address;

    //   console.log("Updated addresses state:", newAddresses);
    //   return newAddresses;
    // });
  };

  useEffect(() => {
    listSportApi();
  }, []);

  const onFileSelect = (e: any) => {
    present({
      message: "Please upload after choosing the document.",
      duration: 2000,
      position: "bottom",
      color: "warning",
    });
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
    console.log("Upload Successful:", response);
    setDocument1(response.filePath);
    present({
      message: "Uploaded successfully!",
      duration: 2000,
      position: "bottom",
      color: "success",
    });
  };

  const handlepassportUploadFailure1 = (error: any) => {
    console.error("Upload Failed:", error);
    present({
      message: "Upload error occurred!",
      duration: 2000,
      position: "bottom",
      color: "danger",
    });
    // Add your failure handling logic here
  };

  const UploaderDoc2 = async (event: any) => {
    console.table("event", event);

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
    setDocument2(response.filePath);
    present({
      message: "Uploaded successfully!",
      duration: 2000,
      position: "bottom",
      color: "success",
    });
  };

  const handlepassportUploadFailure2 = (error: any) => {
    console.error("Upload Failed:", error);
    present({
      message: "Upload error occurred!",
      duration: 2000,
      position: "bottom",
      color: "danger",
    });
    // Add your failure handling logic here
  };

  //update

  const UpdateOwner = async () => {
    try {
      // Set isDefaultAddress based on addressOption
      const isDefaultAddress = addressOption === "default";

      let payload: any = {
        refOwnerFname: inputs.refOwnerFname,
        refOwnerLname: inputs.refOwnerLname,
        refEmailId: inputs.refEmailId,
        refMobileId: inputs.refMobileId,
        refCustPassword: inputs.refCustPassword,
        refAadharId: inputs.refAadharId,
        refPANId: inputs.refPANId,
        refGSTnumber: inputs.refGSTnumber,
        isDefaultAddress: isDefaultAddress,
        isOwnGround: isGroundOwner,
        refGroundImage: groundImage,
        refGroundDescription: inputs.refGroundDescription,
        refBankName: inputs.refBankName,
        refBankBranch: inputs.refBankBranch,
        refAcHolderName: inputs.refAcHolderName,
        refAccountNumber: inputs.refAccountNumber,
        refIFSCcode: inputs.refIFSCcode,
        refDocument1Path: document1,
        refDocument2Path: document2,
      };

      // Set common ground address if default
      if (isDefaultAddress) {
        payload.groundAddress = inputs.groundAddress;
      }

      // Generate ground sports array
      const refGroundSports: any[] = selectedCategoryType.map((category) => {
        const sportId = category.refSportsCategoryId;

        const groundSport: any = {
          id: sportId,
        };

        if (!isDefaultAddress) {
          groundSport.groundAddress = categoryAddresses[sportId] || "";
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

      console.log("data---------->Owner", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
      }
    } catch (e) {
      console.log("Error adding Owner:", e);
    }
  };
  const handleInput1 = (e: any) => {
    const { name, value } = e.target;

    if (name === "refPANId") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const panValue = value.toUpperCase();
      setErrors((prev) => ({
        ...prev,
        [name]:
          panValue && !panRegex.test(panValue) ? "Invalid PAN format" : "",
      }));
      setInputs((prev) => ({ ...prev, [name]: panValue }));
    } else if (name === "refGSTnumber") {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      const gstValue = value.toUpperCase();
      setErrors((prev) => ({
        ...prev,
        [name]:
          gstValue && !gstRegex.test(gstValue) ? "Invalid GST format" : "",
      }));
      setInputs((prev) => ({ ...prev, [name]: gstValue }));
    } else if (name === "refIFSCcode") {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      const ifscValue = value.toUpperCase();
      setErrors((prev) => ({
        ...prev,
        [name]:
          ifscValue && !ifscRegex.test(ifscValue) ? "Invalid IFSC code" : "",
      }));
      setInputs((prev) => ({ ...prev, [name]: ifscValue }));
    } else if (name === "refAccountNumber") {
      const accRegex = /^[0-9]{9,18}$/;
      setErrors((prev) => ({
        ...prev,
        [name]: value && !accRegex.test(value) ? "Invalid Account Number" : "",
      }));
      setInputs((prev) => ({ ...prev, [name]: value }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Owner Register Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="bg-[#fff] w-[100%] overflow-auto">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              AddOwner();
            }}
          >
            <div className="cardDesign font-[poppins]">
              <div className="w-[100%] flex justify-center items-center mt-[20px]">
                <img
                  src={logo}
                  style={{ width: "70%" }}
                  alt="Sports Logo"
                  className="logo"
                />
              </div>

              <div className="text-[1.5rem] font-[600] text-center mt-[0rem]">
                Register Account
              </div>

              {/* First Name */}
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">First Name</label>
                <InputText
                  name="refOwnerFname"
                  value={inputs.refOwnerFname}
                  onChange={handleInput}
                  placeholder="Enter First Name"
                  className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                  required
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
                />
              </div>

              {/* Mobile */}
              <div className="mt-[0.8rem] px-[1rem]">
                <label className="text-[#000]">Mobile Number</label>
                <InputText
                  name="refMobileId"
                  value={inputs.refMobileId}
                  onChange={handleInputs}
                  placeholder="Enter Mobile Number"
                  className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                  maxLength={10} // limit input to 10 digits
                  required
                  keyfilter="int" // only allow numeric input if you're using PrimeReact
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
                />
              </div>
            </div>
            {/* Aadhar */}
            <div className="mt-[1.5rem] px-[1rem]">
              <label className="text-[#000]">Aadhar Card Number</label>
              <InputText
                name="refAadharId"
                value={inputs.refAadharId}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and limit to 12 digits
                  if (/^\d{0,12}$/.test(value)) {
                    handleInput(e);
                  }
                }}
                keyfilter="int" // optional PrimeReact built-in filter
                maxLength={12}
                placeholder="Aadhar Card Number"
                className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                required
              />
            </div>

            {/* PAn */}
            <div className="mt-[0.8rem] px-[1rem]">
              <label className="text-[#000]">Pan Card Number</label>
              <InputText
                name="refPANId"
                value={inputs.refPANId}
                onChange={handleInput1}
                placeholder="Pan Card Number"
                className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                required
              />
              {errors.refPANId && (
                <p className="text-[#e24c4c] text-sm mt-1">{errors.refPANId}</p>
              )}
            </div>

            {/* GST */}
            <div className="mt-[0.8rem] px-[1rem]">
              <label className="text-[#000]">GST Number</label>
              <InputText
                name="refGSTnumber"
                value={inputs.refGSTnumber}
                onChange={handleInput1}
                placeholder="GST Number"
                className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                required
              />
              {errors.refGSTnumber && (
                <p className="text-[#e24c4c] text-sm mt-1">
                  {errors.refGSTnumber}
                </p>
              )}
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
              />
            </div>
            <div className="mt-[0.8rem] px-[1rem]">
              <label className="text-[#000]">Account Holder Name</label>
              <InputText
                name="refAcHolderName"
                value={inputs.refAcHolderName}
                onChange={handleInput}
                placeholder="Enter Account Holder Name"
                className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                required
              />
            </div>
            <div className="mt-[0.8rem] px-[1rem]">
              <label className="text-[#000]">IFSC Code</label>
              <InputText
                name="refIFSCcode"
                value={inputs.refIFSCcode}
                onChange={handleInput1}
                placeholder="Enter IFSC Code"
                className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                required
              />
              {errors.refIFSCcode && (
                <p className="text-[#e24c4c] text-sm mt-1">
                  {errors.refIFSCcode}
                </p>
              )}
            </div>
            <div className="mt-[0.8rem] px-[1rem]">
              <label className="text-[#000]">Account No</label>
              <InputText
                name="refAccountNumber"
                value={inputs.refAccountNumber}
                onChange={handleInput1}
                placeholder="Enter Account No"
                className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                required
              />
              {errors.refAccountNumber && (
                <p className="text-[#e24c4c] text-sm mt-1">
                  {errors.refAccountNumber}
                </p>
              )}
            </div>

            <div className="mt-[0.8rem] px-[1rem]">
              <label className="text-[#000]">Branch</label>
              <InputText
                name="refBankBranch"
                value={inputs.refBankBranch}
                onChange={handleInput}
                placeholder="Enter Branch"
                className="w-full h-[2.2rem] mt-[0.2rem] text-[#000] px-3"
                required
              />
            </div>
            <div className="mt-[2rem] px-[1rem] flex flex-row justify-around items-center w-[100%]">
              <label className="text-[#000]">Own Ground :</label>
              <div className="flex items-center gap-[20px]">
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

            {/* First Name */}
            <div className="mt-[0.8rem] px-[1rem]">
              <label className="text-[#000]">Ground Description</label>
              <InputText
                name="refGroundDescription"
                value={inputs.refGroundDescription}
                onChange={handleInput}
                placeholder="Enter Ground Description"
                className="w-full h-[2.2rem] mt-[1rem] text-[#000] px-3"
                required
              />
            </div>

            <div>
              <div className="ion-margin-top ion-padding-start">
                <IonText color="primary" className="ion-padding-top">
                  Take a Photo from Camera or choose from Gallery
                </IonText>
              </div>

              <IonItem
                lines="none"
                style={{
                  "--background": "#fff",
                  color: "#000",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                }}
                className="ion-margin-top ion-padding-horizontal"
              >
                <div>
                  <span>
                    <Button
                      icon="pi pi-camera"
                      className="buttonIconGroupStart"
                      onClick={async () => {
                        try {
                          const image = await Camera.getPhoto({
                            quality: 90,
                            allowEditing: false,
                            resultType: CameraResultType.Uri,
                            source: CameraSource.Camera,
                          });

                          if (image.webPath) {
                            const blob = await fetch(image.webPath).then((r) =>
                              r.blob()
                            );
                            const file = new File(
                              [blob],
                              "captured_image.jpg",
                              { type: blob.type }
                            );

                            setPendingCameraFile(file);
                            setShowConfirmUpload(true); // Show confirmation popup
                          }
                        } catch (error) {
                          console.error("Camera error:", error);
                        }
                      }}
                    />
                  </span>
                  <span> Take Photo</span>
                </div>
              </IonItem>

              <IonItem
                lines="none"
                style={{ "--background": "#fff", color: "#000" }}
                className="ion-margin-top ion-padding-start"
              >
                <IonLabel className="ion-text-wrap">
                  Upload Ground Image
                </IonLabel>
              </IonItem>

              {/* Alert for confirmation */}
              <IonAlert
                isOpen={showConfirmUpload}
                onDidDismiss={() => setShowConfirmUpload(false)}
                header="Upload Confirmation"
                message="Do you want to upload this photo?"
                buttons={[
                  {
                    text: "Cancel",
                    role: "cancel",
                    handler: () => {
                      setPendingCameraFile(null);
                    },
                  },
                  {
                    text: "Upload",
                    handler: () => {
                      if (pendingCameraFile) {
                        const event = { files: [pendingCameraFile] };
                        profile(event);
                      }
                      setPendingCameraFile(null);
                    },
                  },
                ]}
              />
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
                  <p className="m-0">
                    {" "}
                    * Please upload an image (max size: 1000 KB)
                  </p>
                }
              />
              {!isUploaded && (
                <IonText color="danger" className="ion-padding-top">
                  * Please upload the image to continue
                </IonText>
              )}
              {!isUploaded && (
                <IonText color="danger" className="ion-padding-top">
                  * Please upload an image (max size: 1000 KB)
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
                onChange={handleCategoryChange}
                options={sportsType}
                optionLabel="refSportsCategoryName"
                display="chip"
                placeholder="Select sports categories"
                maxSelectedLabels={3}
                className="w-full"
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
                onChange={(e) => {
                  setAddressOption(e.value);
                  setIsDefaultAddress(true); // ✅ Set to true
                }}
                checked={addressOption === "default"}
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
                onChange={(e) => {
                  setAddressOption(e.value);
                  setIsDefaultAddress(false); // ✅ Set to false
                }}
                checked={addressOption === "category"}
              />
              <label htmlFor="category" style={{ marginLeft: "8px" }}>
                Different Address for Each Sport
              </label>
            </div>

            {/* Address Input */}
            {addressOption === "default" ? (
              <IonItem
                style={{ "--background": "#fff", color: "#000" }}
                className="ion-margin-top"
              >
                <IonLabel position="stacked">Default Address</IonLabel>
                <IonInput
                  placeholder="Default Address for all sports"
                  value={inputs.groundAddress || ""}
                  onIonChange={(e) =>
                    setInputs({
                      ...inputs,
                      groundAddress: e.detail.value || "",
                    })
                  }
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
                          categoryAddresses[category.refSportsCategoryId] ?? ""
                        }
                        onIonChange={(e) =>
                          handleCategoryAddressChange(
                            category.refSportsCategoryId,
                            e.detail.value || ""
                          )
                        }
                        required
                      />
                    </IonItem>
                  ))
                )}
              </div>
            )}

            <IonItem
              lines="none"
              style={{ "--background": "#fff", color: "#000" }}
              className="ion-margin-top ion-padding-start"
            >
              <IonLabel className="ion-text-wrap">
                Upload Original Document
              </IonLabel>
            </IonItem>

            {/* File Upload */}
            <div className="ion-padding">
              <FileUpload
                name="logo"
                customUpload
                uploadHandler={UploaderDoc1}
                accept="application/pdf"
                onSelect={onFileSelect}
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
              <IonToast
                isOpen={showSuccessToast}
                onDidDismiss={() => setShowSuccessToast(false)}
                message="Image uploaded successfully!"
                duration={2000}
                color="success"
              />
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

            {/* File Upload */}
            <div className="ion-padding">
              <FileUpload
                name="logo"
                customUpload
                uploadHandler={UploaderDoc2}
                onSelect={onFileSelect}
                accept="application/pdf"
                maxFileSize={10000000}
                emptyTemplate={
                  <p className="m-0">Drag and drop your pdf here.</p>
                }
              />
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
                ) : (
                  "Register"
                )}
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OwnerSignup;
