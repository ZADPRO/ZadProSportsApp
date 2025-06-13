import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import Account from "../../assets/images/Account.png";
import { MdMyLocation } from "react-icons/md";
import axios from "axios";
import { decrypt } from "../../Helper";
import { Skeleton } from "primereact/skeleton";
import Logo from "../../assets/images/unavailable.png";
import user from "../../assets/images/user.jpg";
import { IoAdd } from "react-icons/io5";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState<any>(null); // Changed from array to single object
  const [name, setName] = useState("User");
  const [roleID, setRoleID] = useState<string | null>(null);

  const history = useHistory();
  const location = useLocation();

  const fetchGround = async () => {
    try {
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
      console.log("fetchGround", data);
      setOwner(data.result[0]); // Setting only the first owner
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    fetchGround();
  }, []);

  return (
    <IonContent>
      <div className="p-4">
        {loading ? (
          <Skeleton width="100%" height="200px" className="mb-3" />
        ) : owner ? (
          <div className="bg-white shadow-lg rounded-xl p-4 mb-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <img
                src={user}
                alt="owner"
                className="w-16 h-16 object-cover rounded-full border border-gray-300"
              />
              <div>
                <h2 className="text-lg font-semibold capitalize">
                  {owner.refOwnerFname} {owner.refOwnerLname}
                </h2>
                <p className="text-sm text-gray-600">{owner.refEmailId}</p>
                <p className="text-sm text-gray-600">{owner.refMobileId}</p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 text-sm text-gray-800">
              <p>
                <strong>Customer ID:</strong> {owner.refOwnerCustId}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium px-2 py-1 rounded ${
                    owner.refStatus === "Onboarded"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {owner.refStatus}
                </span>
              </p>
              <p>
                <strong>Own Ground:</strong> {owner.isOwnGround ? "Yes" : "No"}
              </p>

              {owner.ownersportsmappings.length > 0 && (
                <div className="mt-2">
                  <strong>Sports Categories:</strong>
                  <ul className="list-disc list-inside">
                    {owner.ownersportsmappings.map(
                      (sport: any, idx: number) => (
                        <li key={idx}>
                          {sport.refSportsCategoryName} - {sport.groundAddress}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No owner data found.</p>
        )}
      </div>
    </IonContent>
  );
};

export default Dashboard;
