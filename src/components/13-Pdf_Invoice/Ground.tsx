import React from "react";
import {
  Document,
  Page,
  PDFViewer,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import logo from "../../assets/images/Logo.png";

interface GroundProps {
  username: string;
  invoiceno: string;
  billno: string;
  groundname: string;
  address: string;
  email: string;
  mobile: string;
  date: string;
  fromdate: string;
  todate: string;
  stayperson: string;
  staydays: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  grounddays: string;
  groundprice: string;
  groundtotalprice: string;
  stayprice: string;
  staytotalprice: string;
  foodprice: string;
  foodtotalprice: string;
  netprice: string;
  totalprice: string;
  breakfastItems: string;
  lunchItems: string;
  dinnerItems: string;
  foodays: string;
  itemprice: string;
  subprice: string;
}

const Ground: React.FC<GroundProps> = ({
  username,
  invoiceno,
  groundname,
  billno,
  address,
  email,
  mobile,
  date,
  fromdate,
  todate,
  stayperson,
  staydays,
  breakfast,
  subprice,
  lunch,
  itemprice,
  dinner,
  foodays,
  grounddays,
  groundprice,
  groundtotalprice,
  stayprice,
  staytotalprice,
  foodprice,
  foodtotalprice,
  netprice,
  totalprice,
  breakfastItems,
  lunchItems,
  dinnerItems,
}) => {
  // Calculate tax amounts (9% each for SGST and CGST)
  const netAmount = parseFloat(netprice) || 0;
  const sgstAmount = (netAmount * 0.09).toFixed(2);
  const cgstAmount = (netAmount * 0.09).toFixed(2);

  const breakfastArray = breakfastItems
    ? breakfastItems
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];
  const lunchArray = lunchItems
    ? lunchItems
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];
  const dinnerArray = dinnerItems
    ? dinnerItems
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  // Parse subprice array for individual meal prices when no items are specified
  const subpriceArray = subprice
    ? subprice.split(",").map((price) => parseFloat(price.trim()) || 0)
    : [];

  return (
    <Document>
      <Page size="A4">
        <View
          style={{
            width: "100%",
            height: "100%",
            padding: "40px",
            fontFamily: "Poppins",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "3%",
            }}
          >
            {
              <Image
                src={logo}
                style={{
                  width: "20%",
                  marginLeft: 15,
                  marginTop: 10,
                }}
              />
            }
            <Text
              style={{
                fontSize: 12,
              }}
            >
              {billno}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  fontFamily: "boldpoppins",
                }}
              >
                {groundname}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                }}
              >
                {address}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                width: "50%",
                alignItems: "center",
                fontSize: 40,
              }}
            >
              <Text>invoice</Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginTop: 20,
              marginBottom: "5%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "60%",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                  fontFamily: "boldpoppins",
                }}
              >
                {username}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                }}
              >
                {email}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                }}
              >
                {mobile}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                }}
              >
                {invoiceno}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 18,
                }}
              >
                Date : {date}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "5%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                paddingLeft: 18,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "boldpoppins",
                  marginBottom: 6,
                }}
              >
                Details :
              </Text>
              <Text style={{ fontSize: 12, marginBottom: 6 }}>
                From Date : {fromdate}
              </Text>
              <Text style={{ fontSize: 12, marginBottom: 6 }}>
                To Date : {todate}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "boldpoppins",
                  marginBottom: 10,
                  marginTop: 10,
                }}
              >
                Extra's : Stay & Food
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginBottom: 6,
                  fontFamily: "boldpoppins",
                }}
              >
                Stay Details:
              </Text>
              <Text style={{ fontSize: 12, marginBottom: 10 }}>
                • {stayperson} Person & {staydays} Days
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginBottom: 6,
                  fontFamily: "boldpoppins",
                }}
              >
                Food Details:
              </Text>

              {/* Breakfast Section */}
              {parseFloat(breakfast) > 0 && (
                <>
                  <Text
                    style={{ fontSize: 12, marginBottom: 4, paddingLeft: 3 }}
                  >
                    • Breakfast:{" "}
                    {(parseFloat(breakfast) / parseInt(foodays)).toFixed(2)} x{" "}
                    {foodays} = {breakfast}
                  </Text>
                  {breakfastArray.length > 0 ? (
                    <Text
                      style={{ fontSize: 12, marginBottom: 4, paddingLeft: 15 }}
                    >
                      Items: {breakfastArray.join(", ")}
                    </Text>
                  ) : (
                    <Text
                      style={{ fontSize: 12, marginBottom: 4, paddingLeft: 15 }}
                    >
                      Standard Breakfast Package
                    </Text>
                  )}
                </>
              )}

              {/* Lunch Section */}
              {parseFloat(lunch) > 0 && (
                <>
                  <Text
                    style={{ fontSize: 12, marginBottom: 4, paddingLeft: 3 }}
                  >
                    • Lunch:{" "}
                    {(parseFloat(lunch) / parseInt(foodays)).toFixed(2)} x{" "}
                    {foodays} = {lunch}
                  </Text>
                  {lunchArray.length > 0 ? (
                    <Text
                      style={{ fontSize: 12, marginBottom: 4, paddingLeft: 15 }}
                    >
                      Items: {lunchArray.join(", ")}
                    </Text>
                  ) : (
                    <Text
                      style={{ fontSize: 12, marginBottom: 4, paddingLeft: 15 }}
                    >
                      Standard Lunch Package
                    </Text>
                  )}
                </>
              )}

              {/* Dinner Section */}
              {parseFloat(dinner) > 0 && (
                <>
                  <Text
                    style={{ fontSize: 12, marginBottom: 4, paddingLeft: 3 }}
                  >
                    • Dinner:{" "}
                    {(parseFloat(dinner) / parseInt(foodays)).toFixed(2)} x{" "}
                    {foodays} = {dinner}
                  </Text>
                  {dinnerArray.length > 0 ? (
                    <Text
                      style={{ fontSize: 12, marginBottom: 4, paddingLeft: 15 }}
                    >
                      Items: {dinnerArray.join(", ")}
                    </Text>
                  ) : (
                    <Text
                      style={{ fontSize: 12, marginBottom: 4, paddingLeft: 15 }}
                    >
                      Standard Dinner Package
                    </Text>
                  )}
                </>
              )}
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "boldpoppins",
                    marginBottom: "3%",
                  }}
                >
                  DESCRIPTION
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "boldpoppins",
                    marginBottom: "3%",
                  }}
                >
                  DAYS
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "boldpoppins",
                    marginBottom: "3%",
                  }}
                >
                  QTY
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "boldpoppins",
                    marginBottom: "3%",
                  }}
                >
                  PRICE
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "boldpoppins",
                    marginBottom: "3%",
                  }}
                >
                  TOTAL
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  marginBottom: 20,
                  borderBottomColor: "#000",
                  width: "100%",
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  slot booking
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  {grounddays}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  1
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  {groundprice}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  {groundtotalprice}
                </Text>
              </View>
              <View
                style={{
                  marginBottom: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  width: "100%",
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  stay booking
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  {staydays}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  {stayperson}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  {stayprice}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: "3%",
                  }}
                >
                  {staytotalprice}
                </Text>
              </View>
              <View
                style={{
                  marginBottom: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  width: "100%",
                }}
              />

              {/* Food Package Rows - Only Standard Packages */}
              {parseFloat(breakfast) > 0 && (
                <>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      Breakfast Details
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {foodays}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {stayperson}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {(parseFloat(breakfast) / parseInt(foodays)).toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {breakfast}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: "#000",
                      width: "100%",
                    }}
                  />
                </>
              )}

              {parseFloat(lunch) > 0 && (
                <>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      Lunch Details
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {foodays}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {stayperson}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {(parseFloat(lunch) / parseInt(foodays)).toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {lunch}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: "#000",
                      width: "100%",
                    }}
                  />
                </>
              )}

              {parseFloat(dinner) > 0 && (
                <>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      Dinner Details
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {foodays}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {stayperson}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {(parseFloat(dinner) / parseInt(foodays)).toFixed(2)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: "3%",
                      }}
                    >
                      {dinner}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginBottom: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: "#000",
                      width: "100%",
                    }}
                  />
                </>
              )}

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "60%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: "3%",
                      marginRight: "3%",
                    }}
                  >
                    Net Amount
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: "3%",
                    }}
                  >
                    ₹{netprice}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "60%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: "3%",
                      marginRight: "3%",
                    }}
                  >
                    SGST(9%)
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: "3%",
                    }}
                  >
                    ₹{sgstAmount}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "60%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,

                      marginRight: "3%",
                      marginBottom: "3%",
                    }}
                  >
                    CGST(9%)
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: "3%",
                    }}
                  >
                    ₹{cgstAmount}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "60%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      marginRight: "3%",

                      marginBottom: "3%",
                    }}
                  >
                    Total Amount
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: "3%",
                    }}
                  >
                    ₹{totalprice}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Ground;