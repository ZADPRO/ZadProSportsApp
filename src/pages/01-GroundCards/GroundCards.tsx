import { useHistory } from "react-router";

interface GroundCardProps {
    name: string;
    address: string;
    image: any;
}

const GroundCards: React.FC<GroundCardProps> = ({ name, address, image }) => {

    const history = useHistory();

    return (
        <div onClick={() => { history.push("/groundDescriptions") }} className='min-w-[200px] bg-[#f7f7f7] rounded-[10px]' style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
            <img
                src={image}
                style={{ width: "200px", height: "150px" }}
                className="rounded-tr-[10px] rounded-tl-[10px] object-cover"
                alt={name}
            />
            <div className='px-[1rem] py-[0.5rem]'>
                <div className='text-[#3c3c3c] text-[0.9rem] font-[600] font-[poppins]' style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                <div className='text-[#3c3c3c] text-[0.8rem] font-[500] my-[0.2rem] font-[poppins]' style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{address}</div>
            </div>
        </div>
    );
}

export default GroundCards;
