
import { GrLinkNext } from "react-icons/gr";

interface NextPageCardsProps {
    url: string;
}

const NextPageCards: React.FC<NextPageCardsProps> = ({ url }) => {
    return (
        <div className='min-w-[100px] rounded-[10px] flex flex-col justify-center items-center'>
            <div className="text-[#fff] bg-[#4e4e4e] text-[1.5rem] px-[10px] pt-[10px] pb-[2px] rounded-[100%]"><GrLinkNext /></div>
            <div className="text-[#4e4e4e] mt-[10px] text-[1rem] font-[poppins]">View all</div>
        </div>
    );
}

export default NextPageCards;
