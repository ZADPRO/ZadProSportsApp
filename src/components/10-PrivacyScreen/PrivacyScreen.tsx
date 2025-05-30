import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router";
import { IoIosArrowBack } from "react-icons/io";

const PrivacyScreen = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Privacy Policy</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <div className="bg-[#fff] w-[100%] overflow-auto px-[2rem] py-[0.5rem] text-[#000] font-[poppins] text-[0.95rem]">
                    <h2 className="text-[1.2rem] font-bold mb-[1rem] font-[poppins]">Privacy Policy</h2>

                    <p className="mb-[1rem] font-[poppins]">
                        Your privacy is important to us. This privacy policy explains how we
                        collect, use, and protect your personal information when you use our
                        services.
                    </p>

                    <h3 className="text-[1rem] font-semibold mt-[1rem] font-[poppins]">Information Collection</h3>
                    <p className="mb-[1rem] font-[poppins]">
                        We collect information such as name, email, mobile number, and date
                        of birth to provide personalized services.
                    </p>

                    <h3 className="text-[1rem] font-semibold mt-[1rem] font-[poppins]">How We Use Information</h3>
                    <p className="mb-[1rem] font-[poppins]">
                        The information is used to maintain your profile, communicate with
                        you, and improve our services.
                    </p>

                    <h3 className="text-[1rem] font-semibold mt-[1rem] font-[poppins]">Security</h3>
                    <p className="mb-[1rem] font-[poppins]">
                        We implement industry-standard security measures to protect your
                        data from unauthorized access.
                    </p>

                    <h3 className="text-[1rem] font-semibold mt-[1rem] font-[poppins]">Changes to this Policy</h3>
                    <p className="mb-[1rem] font-[poppins]">
                        We may update this policy from time to time. We encourage you to
                        review it periodically.
                    </p>

                    <p className="mt-[2rem] font-[poppins]">
                        If you have any questions about this policy, please contact us.
                    </p>

                    {/* <div className="flex justify-center mt-[2rem] mb-[2rem]">
            <IonButton
              expand="block"
              onClick={() => history.goBack()}
              className="w-[90%] h-[5vh] text-[#fff] text-[1rem] font-[poppins]"
            >
              Back
            </IonButton>
          </div> */}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PrivacyScreen;