import { IonInput, IonItem, IonLabel, IonText } from "@ionic/react";

interface Address {
  groundAddress: string;
  refSportsCategoryId: number;
  refSportsCategoryName: string;
  refOwnerSportsMappingId: number;
}

interface AddressMapProps {
  selectedCategoryLength: number;
  addresses: Address[];
  isDefaultAddress: boolean;
  handleChange: (
    refSportsCategoryId: number,
    isDefaultAddress: boolean,
    address: string
  ) => void;
}

export default function AddressMap(props: AddressMapProps) {
  const { selectedCategoryLength, addresses, isDefaultAddress, handleChange } =
    props;
  if (selectedCategoryLength === 0) {
    return (
      <IonText className="text-[#000] text-center block mt-2">
        Please Select categories First
      </IonText>
    );
  }
  if (isDefaultAddress) {
    return (
      <IonItem
        style={{ "--background": "#fff", color: "#000" }}
        className="ion-margin-top"
      >
        <IonLabel position="stacked">Default Address</IonLabel>
        {[addresses[0]].map((item) => (
          <IonItem
            style={{ "--background": "#fff", color: "#000" }}
            className="ion-margin-top"
          >
            <IonInput
              placeholder="Default Address for all sports"
              required
              value={item.groundAddress}
              //    placeholder={`Address for ${category.refSportsCategoryName}`}
              onIonInput={(e) =>
                handleChange(
                  item.refSportsCategoryId,
                  isDefaultAddress,
                  e.target.value as string
                )
              }
            ></IonInput>
          </IonItem>
        ))}
      </IonItem>
    );
  }

  return (
    <div className="ion-padding-top w-full text-center">
      <IonLabel className="ion-margin-bottom text-[#000] text-center">
        Sports Category Addresses :
      </IonLabel>
      {addresses.map((item) => (
        <IonItem
          style={{
            "--background": "#fff",
            color: "#000",
            justifyContent: "center", // center the input contents
          }}
          key={item.refSportsCategoryId}
        >
          <IonLabel position="stacked" className="text-center w-full">
            {item.refSportsCategoryName}
          </IonLabel>
          <IonInput
            required
            value={item.groundAddress}
            placeholder={`Address for ${item.refSportsCategoryName}`}
            onIonInput={(e) =>
              handleChange(
                item.refSportsCategoryId,
                isDefaultAddress,
                e.target.value as string
              )
            }
          ></IonInput>
        </IonItem>
      ))}
    </div>
  );
}
