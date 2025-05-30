import { IonPage, IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle } from "@ionic/react";
import { IoIosArrowBack } from "react-icons/io";
import { useHistory } from "react-router";

const TermsScreen = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Terms & Conditions</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] overflow-auto px-[2rem] py-[0.5rem] text-[#000] font-[poppins] text-[0.95rem]">
                    <h2 className="text-[1.2rem] font-bold font-[poppins] mb-[1rem]">Introduction</h2>
                    <p className="font-[poppins] mb-[1rem]">
                        These Terms and Conditions govern your use of our application and services. By accessing or using the app, you agree to be bound by these terms.
                    </p>

                    <h3 className="font-[poppins] text-[1rem] font-semibold mt-[1rem]">User Responsibilities</h3>
                    <p className="font-[poppins] mb-[1rem]">
                        Users are expected to provide accurate information, respect intellectual property, and comply with all applicable laws and regulations.
                    </p>

                    <h3 className="font-[poppins] text-[1rem] font-semibold mt-[1rem]">Limitations of Liability</h3>
                    <p className="font-[poppins] mb-[1rem]">
                        We are not liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services.
                    </p>

                    <h3 className="font-[poppins] text-[1rem] font-semibold mt-[1rem]">Changes to Terms</h3>
                    <p className="font-[poppins] mb-[1rem]">
                        We reserve the right to modify these Terms & Conditions at any time. Continued use of the app constitutes your acceptance of the updated terms.
                    </p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default TermsScreen;