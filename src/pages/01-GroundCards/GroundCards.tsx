import { IonButton } from "@ionic/react";
import { useHistory } from "react-router";

interface GroundCardProps {
    name: string;
    address: string;
    image: any;
}

const GroundCards: React.FC<GroundCardProps> = ({ name, address, image }) => {

    const history = useHistory();

    return (
        <div className='min-w-[200px] bg-[#f7f7f7] rounded-[10px]' style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
            <div  >
                <img
                    onClick={() => { history.push("/groundDescriptions?booknowStatus=false") }}
                    src={image}
                    style={{ width: "100%", height: "120px" }}
                    className="rounded-tr-[10px] rounded-tl-[10px] object-cover"
                    alt={name}
                />
                <div className="flex justify-between items-center px-[0.5rem] gap-[0.5rem] pb-[0.1rem]">
                    <div onClick={() => { history.push("/groundDescriptions?booknowStatus=false") }} className='py-[0.1rem] w-[68%]'>
                        <div className='text-[#3c3c3c] text-[0.8rem] font-[600] font-[poppins]' style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                        <div className='text-[#3c3c3c] text-[0.7rem] font-[500] my-[0.1rem] font-[poppins]' style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{address}</div>
                    </div>
                    <IonButton
                        onClick={() => {
                            history.push("/groundDescriptions?booknowStatus=true")
                        }} className="custom-ion-button font-[poppins] w-[5rem] h-[0px] text-[#fff] text-[0.6rem] font-[500]">Book Now</IonButton>
                </div>
            </div>

        </div>
    );
}

export default GroundCards;
