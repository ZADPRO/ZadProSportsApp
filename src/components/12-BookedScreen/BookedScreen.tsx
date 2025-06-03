
import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { useHistory } from "react-router";
import axios from "axios";
import { decrypt } from "../../Helper";
import {
  pdf,
  Font,
} from "@react-pdf/renderer";
import regular from "../../assets/fonts/Poppins-Regular.ttf";
import bold from "../../assets/fonts/Poppins-Bold.ttf";
import Ground from "../13-Pdf_Invoice/Ground";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";

Font.register({
  family: "Poppins",
  src: regular,
});
Font.register({
  family: "boldpoppins",
  src: bold,
});

const BookedScreen = () => {
  const history = useHistory();

  useEffect(() => {
    setLoding(true);
    fetchData();
    setLoding(false);
  }, []);

  const [historyData, setHistoryData] = useState([]);
  const [historyNew, setHistoryNew] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/userRoutes/userBookingHistory`,
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
      console.log("data---------->before", data);
      if (data.success) {
        console.log("data---------->after", data);
        setHistoryData(data.result);
      }

      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  function getDatesInRange(fromDate: any, toDate: any) {
    const result = [];
    const currentDate = new Date(fromDate);
    const endDate = new Date(toDate);

    while (currentDate <= endDate) {
      const formattedDate = currentDate
        .toLocaleDateString("en-GB") // DD/MM/YYYY
        .split("/")
        .join("-"); // Convert to DD-MM-YYYY
      result.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  function groupDatesByMonth(dates: any) {
    const groups: any = {};

    console.log(dates);

    if (dates) {
      dates.forEach((dateStr: any) => {
        if (typeof dateStr === "string" && dateStr.includes("-")) {
          const [day, month, year] = dateStr.split("-");
          const jsDate = new Date(`${year}-${month}-${day}`);
          const monthName = jsDate.toLocaleString("default", {
            month: "short",
          });
          if (!groups[monthName]) groups[monthName] = [];
          groups[monthName].push(day);
        }
      });

      Object.keys(groups).forEach((key) => {
        groups[key].sort((a: any, b: any) => a - b);
      });

      return groups;
    } else {
      return groups;
    }
  }

  const [loading, setLoding] = useState(false);

  function getInclusiveDayCount(fromDateStr: any, toDateStr: any) {
    const fromDate: any = new Date(fromDateStr);
    const toDate: any = new Date(toDateStr);

    // Get the time difference in milliseconds
    const diffTime = toDate - fromDate;

    // Convert milliseconds to days and add 1 to include both start and end dates
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  }

  // Helper function to calculate addon total price
  // Helper function to calculate addon total price
  const calculateAddonTotal = (addon: any) => {
    const days = addon.selectedDates?.length || 0;
    const price = addon.refPrice || 0;
    const personCount = addon.refPersonCount || 1;

    // For food addons, handle different scenarios
    if (addon.refLabel?.toLowerCase() === "food") {
      // If no subaddons or subaddons is false, use basic calculation
      if (!addon.refSubaddons || addon.refSubaddons.length === 0) {
        return days * price * personCount;
      }

      // If subaddons exist, calculate based on items
      let itemTotal = 0;
      let hasValidItems = false;

      addon.refSubaddons.forEach((subaddon: any) => {
        // Check if this subaddon has items
        if (subaddon.refItemsPrice && subaddon.refItemsPrice.length > 0) {
          hasValidItems = true;
          subaddon.refItemsPrice.forEach((itemPrice: any) => {
            const itemPriceValue = itemPrice.refItemsPrice || itemPrice || 0;
            itemTotal += itemPriceValue * days * personCount;
          });
        }
      });

      // If subaddons exist but no valid items found, use basic food price calculation
      if (!hasValidItems) {
        return days * price * personCount;
      }

      // Return item total (items already include person count and days)
      return itemTotal;
    }

    // For non-food addons (like Stay), use basic calculation
    return days * price * personCount;
  };

  const [downloadloading, setDownloadloading] = useState(false);

  const handleInvoiceDownload = async (item: any) => {

    setDownloadloading(true);

    const groundDays = getInclusiveDayCount(
      item?.refBookingStartDate?.split("-").reverse().join("-"),
      item?.refBookingEndDate?.split("-").reverse().join("-")
    );

    const totalAmount = parseFloat(item?.retTotalAmount || "0");
    const sgstAmount = parseFloat(item?.refSGSTAmount || "0");
    const cgstAmount = parseFloat(item?.refCGSTAmount || "0");
    const netAmount = totalAmount - sgstAmount - cgstAmount;

    const stayAddon = item?.payload?.refAddOns?.find(
      (addon: any) => addon.refLabel?.toLowerCase() === "stay"
    );
    const stayDays = stayAddon?.selectedDates?.length || 0;
    const stayPrice = stayAddon?.refPrice || 0;

    const foodAddon = item?.payload?.refAddOns?.find(
      (addon: any) => addon.refLabel?.toLowerCase() === "food"
    );
    const foodDays = foodAddon?.selectedDates?.length || 0;
    const foodPrice = foodAddon?.refPrice || 0;
    const refItemsPrices: number[] = [];
    const refSubaddonPrices: number[] = [];

    foodAddon?.refSubaddons?.forEach((subaddon: any) => {
      if (subaddon?.refItems?.length > 0) {
        const prices =
          subaddon?.refItemsPrice?.map((p: any) => p?.refItemsPrice || 0) || [];
        refItemsPrices.push(...prices);
      } else {
        refSubaddonPrices.push(subaddon?.refSubaddonprice || 0);
      }
    });

    // Food sub-addon calculations - Updated to handle both scenarios
    let breakfastTotal = 0;
    let lunchTotal = 0;
    let dinnerTotal = 0;
    let breakfastItems: string[] = [];
    let lunchItems: string[] = [];
    let dinnerItems: string[] = [];

    if (foodAddon?.refSubaddons) {
      foodAddon.refSubaddons.forEach((subaddon: any) => {
        const label = subaddon?.refSubaddonLabel?.toLowerCase();

        if (subaddon?.isItemsNeeded === false) {
          // Use refSubaddonprice directly when isItemsNeeded is false
          const subaddonPrice = parseFloat(subaddon?.refSubaddonprice || "0");
          const subTotal = subaddonPrice * foodDays;

          if (label?.includes("breakfast")) {
            breakfastTotal += subTotal;
            // No items to add since isItemsNeeded is false
          } else if (label?.includes("lunch")) {
            lunchTotal += subTotal;
            // No items to add since isItemsNeeded is false
          } else if (label?.includes("dinner")) {
            dinnerTotal += subTotal;
            // No items to add since isItemsNeeded is false
          }
        } else {
          // Original logic for when isItemsNeeded is true
          const itemNames =
            subaddon.refItemsLabel?.map(
              (labelObj: any) => labelObj.refItemsLabel
            ) || [];

          const prices =
            subaddon?.refItemsPrice?.map(
              (priceObj: any) => priceObj?.refItemsPrice || 0
            ) || [];

          const subTotal = prices.reduce(
            (sum: number, p: number) => sum + p * foodDays,
            0
          );

          if (label?.includes("breakfast")) {
            breakfastTotal += subTotal;
            breakfastItems.push(...itemNames);
          } else if (label?.includes("lunch")) {
            lunchTotal += subTotal;
            lunchItems.push(...itemNames);
          } else if (label?.includes("dinner")) {
            dinnerTotal += subTotal;
            dinnerItems.push(...itemNames);
          }
        }
      });
    }

    const invoiceNo =
      item?.invoiceNo || `INV-${item?.refUserBookingId || Date.now()}`;
    const billNo =
      item?.billNo || `BILL-${item?.refUserBookingId || Date.now()}`;

    const groundPricePerDay =
      parseFloat(item?.refBookingAmount || "0") / groundDays;

    console.log("Processed invoice data:", {
      refItemsPrices,
      refSubaddonPrices,
      groundDays,
      netAmount,
      stayDays,
      stayPrice,
      foodDays,
      foodPrice,
      invoiceNo,
      billNo,
      breakfastTotal,
      lunchTotal,
      dinnerTotal,
      breakfastItems,
      lunchItems,
      dinnerItems,
      groundPricePerDay,
    });

    const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (reader.result) {
            const base64data = reader.result.toString().split(",")[1]; // Extract actual Base64 content
            resolve(base64data);
          } else {
            reject(new Error("Failed to convert Blob to Base64"));
          }
        };
        reader.onerror = (error) => reject(error);
      });
    };

    const doc = (
      <Ground
        username={item?.refUserFname || "Guest User"}
        invoiceno={item.refUserBookingId + "0000"}
        billno={item.transactionId}
        groundname={item?.refGroundName || "N/A"}
        address={item?.refGroundLocation || "N/A"}
        email={item?.refEmail || "N/A"}
        mobile={item?.refMobileNumber || "N/A"}
        date={new Date().toISOString().slice(0, 10)}
        fromdate={item?.refBookingStartDate || ""}
        todate={item?.refBookingEndDate || ""}
        stayperson={
          item?.noOfPersons?.toString() ||
          stayAddon?.refPersonCount?.toString() ||
          "1"
        }
        staydays={stayDays.toString()}
        foodays={foodDays.toString()}
        breakfast={breakfastTotal.toString()}
        itemprice={refItemsPrices.toString()}
        subprice={refSubaddonPrices.toString()}
        lunch={lunchTotal.toString()}
        dinner={dinnerTotal.toString()}
        breakfastItems={breakfastItems.join(", ")}
        lunchItems={lunchItems.join(", ")}
        dinnerItems={dinnerItems.join(", ")}
        grounddays={groundDays.toString()}
        groundprice={groundPricePerDay.toFixed(2)}
        groundtotalprice={item?.refBookingAmount || "0"}
        stayprice={stayPrice.toString()}
        staytotalprice={calculateAddonTotal(stayAddon || {}).toString()}
        foodprice={foodPrice.toString()}
        foodtotalprice={calculateAddonTotal(foodAddon || {}).toString()}
        netprice={netAmount.toFixed(2)}
        totalprice={item?.retTotalAmount || "0"}
      />
    );



    try {
      // Generate PDF as Blob
      const pdfBlob = await pdf(doc).toBlob();

      // Convert Blob to Base64
      const base64data = await blobToBase64(pdfBlob);

      // Save PDF file
      await Filesystem.writeFile({
        path: `Invoice-${invoiceNo}.pdf`,
        data: base64data,
        directory: Directory.Documents
      });

      const fileUri = await Filesystem.getUri({
        path: `Invoice-${invoiceNo}.pdf`,
        directory: Directory.Documents,
      });

      // On Android/iOS, you might need to convert the URI to a path
      const filePath = fileUri.uri.replace('file://', ''); // Adjust if needed

      await FileOpener.open({
        filePath: filePath,
        contentType: 'application/pdf',
      });

      console.log("PDF saved successfully!");
    } catch (error) {
      console.error("Error generating or saving PDF:");
    }


    // try {
    //   const pdfBlob = await pdf(doc).toBlob();
    //   const url = URL.createObjectURL(pdfBlob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `Invoice-${invoiceNo}.pdf`;
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   URL.revokeObjectURL(url);
    // } catch (error) {
    //   console.error("Error generating or downloading PDF:", error);
    // }


    setDownloadloading(false)
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Booking History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="bg-[#fff] w-[100%] overflow-auto px-[1rem] py-[1rem]">
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
            <IonAccordionGroup>
              {historyData.length === 0 ? (
                <div className="text-[0.9rem] font-[poppins] text-[#333] text-center">
                  No Booking Found
                </div>
              ) : (
                <>
                  {historyData.map((item: any, index) => (
                    <IonAccordion key={index} value={`first${index}`}>
                      <IonItem slot="header">
                        <div className="w-[95%]">
                          <div className="flex justify-between">
                            <div className="w-[80%] text-[0.9rem] font-[poppins] font-[500] text-ellipsis">
                              {item.refGroundName}
                            </div>
                            <div className="w-[20%] text-[0.7rem] font-[poppins] font-[500]  flex justify-center items-center">
                              <div className="p-[0.2rem] bg-[#ecfdf3] text-[#027a48] font-[600] rounded-[10px]">
                                Booked
                              </div>
                            </div>
                          </div>
                        </div>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        <div className="w-[100%]">
                          <div className="w-[100%] flex justify-between text-[0.8rem] font-[poppins]">
                            <div>
                              Booked Date (
                              {getInclusiveDayCount(
                                item.refBookingStartDate
                                  .split("-")
                                  .reverse()
                                  .join("-"),
                                item.refBookingEndDate
                                  .split("-")
                                  .reverse()
                                  .join("-")
                              )}{" "}
                              x{" "}
                              {parseInt(item.refBookingAmount) /
                                getInclusiveDayCount(
                                  item.refBookingStartDate
                                    .split("-")
                                    .reverse()
                                    .join("-"),
                                  item.refBookingEndDate
                                    .split("-")
                                    .reverse()
                                    .join("-")
                                )}{" "}
                              = {item.refBookingAmount})
                            </div>
                            <div>
                              {item.createdAt
                                .split(" ")[0]
                                .split("-")
                                .reverse()
                                .join("-")}
                            </div>
                          </div>
                          <div
                            className={`mt-[10px] flex justify-between pb-[10px] text-[0.8rem] font-[poppins] ${(item.payload?.refAddOns || []).length > 0
                              ? "border-b-[1px]"
                              : ""
                              }`}
                          >
                            <div>
                              {Object.entries(
                                groupDatesByMonth(
                                  getDatesInRange(
                                    item.refBookingStartDate
                                      .split("-")
                                      .reverse()
                                      .join("-"),
                                    item.refBookingEndDate
                                      .split("-")
                                      .reverse()
                                      .join("-")
                                  )
                                )
                              ).map(([month, days]) => (
                                <div key={month}>
                                  {month} {(days as string[]).join(", ")}
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-center items-center">
                              <div className="bg-[#ecfdf3] text-[#027a48] font-[600] rounded-[10px] px-[10px] text-[0.8rem]">
                                Paid ₹{" "}
                                {parseFloat(item.retTotalAmount).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {/* Display Addons from payload */}
                          {item.payload?.refAddOns?.length > 0 && (
                            <div className="mt-[10px] text-[0.9rem] font-[500]">
                              Addons
                            </div>
                          )}

                          {item.payload?.refAddOns?.map(
                            (addon: any, addonIndex: number) => (
                              <div key={addonIndex} className="mb-[15px]">
                                <div className="w-[100%] py-[10px] border-b-[1px] flex justify-between text-[0.8rem] font-[poppins]">
                                  <div className="flex-1">
                                    <div className="font-[500] text-[0.85rem] mb-[5px]">
                                      {addon.refLabel}
                                      {!addon.refSubaddons?.some(
                                        (s: any) => s.isItemsNeeded
                                      ) && (
                                          <>
                                            {" "}
                                            ({addon.selectedDates?.length ||
                                              0}{" "}
                                            days × ₹{addon.refPrice || 0} ×{" "}
                                            {addon.refPersonCount || 1} person)
                                          </>
                                        )}
                                    </div>

                                    {/* Show all Subaddons */}
                                    <div className="ml-[10px] mt-[8px]">
                                      {addon.refSubaddons?.map(
                                        (subaddon: any, subIndex: number) => {
                                          const showItems =
                                            subaddon.isItemsNeeded;

                                          return (
                                            <div
                                              key={subIndex}
                                              className="mb-[8px]"
                                            >
                                              <div className="text-[0.75rem] font-[500] text-[#666] mb-[3px]">
                                                {subaddon.refSubaddonLabel}
                                                {subaddon.refSubaddonprice && (
                                                  <span>
                                                    {" "}
                                                    - ( ₹
                                                    {
                                                      subaddon.refSubaddonprice
                                                    }{" "}
                                                    ×{" "}
                                                    {addon.selectedDates
                                                      ?.length || 1}{" "}
                                                    days ×{" "}
                                                    {addon.refPersonCount || 1}{" "}
                                                    = ₹
                                                    {(subaddon.refSubaddonprice ||
                                                      0) *
                                                      (addon.selectedDates
                                                        ?.length || 1) *
                                                      (addon.refPersonCount ||
                                                        1)}
                                                    )
                                                  </span>
                                                )}
                                              </div>

                                              {/* Show Items if isItemsNeeded is true */}
                                              {showItems &&
                                                subaddon.refItemsLabel?.length >
                                                0 && (
                                                  <div className="ml-[15px]">
                                                    <div className="text-[0.7rem] text-[#888] mb-[2px]">
                                                      Items:
                                                    </div>
                                                    {subaddon.refItemsLabel.map(
                                                      (
                                                        itemLabel: any,
                                                        itemIndex: number
                                                      ) => (
                                                        <div
                                                          key={itemIndex}
                                                          className="text-[0.7rem] text-[#555] ml-[2px]"
                                                        >
                                                          •{" "}
                                                          {itemLabel.refItemsLabel ||
                                                            itemLabel}
                                                          {subaddon
                                                            .refItemsPrice?.[
                                                            itemIndex
                                                          ] && (
                                                              <span className="text-[#027a48] font-[500]">
                                                                {" "}
                                                                (₹
                                                                {subaddon
                                                                  .refItemsPrice[
                                                                  itemIndex
                                                                ].refItemsPrice ||
                                                                  subaddon
                                                                    .refItemsPrice[
                                                                  itemIndex
                                                                  ]}{" "}
                                                                ×{" "}
                                                                {addon
                                                                  .selectedDates
                                                                  ?.length ||
                                                                  1}{" "}
                                                                days ×{" "}
                                                                {addon.refPersonCount ||
                                                                  1}{" "}
                                                                = ₹
                                                                {(subaddon
                                                                  .refItemsPrice[
                                                                  itemIndex
                                                                ].refItemsPrice ||
                                                                  subaddon
                                                                    .refItemsPrice[
                                                                  itemIndex
                                                                  ]) *
                                                                  (addon
                                                                    .selectedDates
                                                                    ?.length ||
                                                                    1) *
                                                                  (addon.refPersonCount ||
                                                                    1)}
                                                                )
                                                              </span>
                                                            )}
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}

                                              {/* Fallback if items needed but not selected */}
                                              {showItems &&
                                                (!subaddon.refItemsLabel ||
                                                  subaddon.refItemsLabel
                                                    .length === 0) && (
                                                  <div className="ml-[15px] text-[0.7rem] text-[#999]">
                                                    No specific items selected
                                                  </div>
                                                )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>

                                    {/* Total line */}
                                    {/* <div className="mt-[8px] text-[0.75rem] font-[500] text-[#027a48]">
                                      Total: ₹{calculateAddonTotal(addon)}
                                    </div> */}
                                  </div>

                                  {/* Right side: Month-wise dates */}
                                  <div className="flex-shrink-0 ml-[10px]">
                                    {Object.entries(
                                      groupDatesByMonth(
                                        addon.selectedDates || []
                                      )
                                    ).map(([month, days]) => (
                                      <div
                                        key={month}
                                        className="text-[0.75rem] text-right"
                                      >
                                        {month} {(days as string[]).join(", ")}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          )}

                          {/* Pricing Summary */}
                          <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                            <div>Net Amount</div>
                            <div>
                              ₹{" "}
                              {(
                                parseFloat(item.retTotalAmount || 0) -
                                parseFloat(item.refSGSTAmount || 0) -
                                parseFloat(item.refCGSTAmount || 0)
                              ).toFixed(2)}
                            </div>
                          </div>
                          <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                            <div>SGST (9%)</div>
                            <div>
                              ₹ {parseFloat(item.refSGSTAmount || 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px]">
                            <div>CGST (9%)</div>
                            <div>
                              ₹ {parseFloat(item.refCGSTAmount || 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="flex justify-between text-[0.9rem] font-[500] mt-[10px] pt-[10px] border-t-[2px] border-[#027a48]">
                            <div className="font-[600]">Total Paid Amount</div>
                            <div className="font-[600] text-[#027a48]">
                              ₹{" "}
                              {parseFloat(item.retTotalAmount || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-[10px]">
                          <IonButtons
                            slot="end"
                            onClick={() => {
                              console.log(
                                "Generating invoice for item:",
                                item
                              );
                              handleInvoiceDownload(item);
                            }}
                            style={{
                              color: "black",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {
                              downloadloading ? (
                                <>
                                  <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                                </>
                              ) : (
                                "Download Invoice"
                              )
                            }
                          </IonButtons>
                        </div>
                      </div>
                    </IonAccordion>
                  ))}
                </>
              )}
            </IonAccordionGroup>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookedScreen;
