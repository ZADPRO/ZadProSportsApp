import { IonPage, IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle } from "@ionic/react";
import { IoIosArrowBack } from "react-icons/io";
import { useHistory } from "react-router";

const AboutScreen = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
                    </IonButtons>
                    <IonTitle>About Us</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="bg-[#fff] w-[100%] overflow-auto px-[1.5rem] py-[0.5rem] text-[#000] font-[poppins] text-[0.95rem]">
                    <h2 className="text-[1.2rem] font-bold mb-[1rem] font-[poppins]">Who We Are</h2>

                    <p className="mb-[1rem] font-[poppins]">
                        We are a dedicated team committed to building high-quality solutions to help users manage and simplify their daily tasks.
                    </p>


                    <h3 className="text-[1rem] font-semibold mt-[1rem] font-[poppins]">What We Do</h3>
                    <p className="mb-[1rem] font-[poppins]">
                        We specialize in web and mobile development, creating tailored experiences for both personal and professional use.
                    </p>

                    <h3 className="text-[1rem] font-semibold mt-[1rem] font-[poppins]">Our Mission</h3>
                    <p className="mb-[1rem] font-[poppins]">
                        Our mission is to empower people through intuitive and innovative applications that provide value, security, and convenience.
                    </p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AboutScreen;