// Calculator.js

import React, { useState, useEffect, useMemo } from "react";
import copyIcon from "../../../assets/images/copy.png";
import TabularFormat from "../../shared/components/TabularFormat";
import PaymentDetails from "../../shared/components/PaymentDetails";
import SalesInput from "./SalesInput";
import NetworkSelect from "./NetworkSelect";
import "./Calculator.css";
import { mtnPrices, atPrices, vodaPrices } from "../../shared/utilities/Prices"; // Import prices from the shared file
import {
  gigFormatter,
  amounts,
  plainTextFormat,
} from "../../shared/utilities/formatters";

const serverDetails = {
  number: "0249116309",
  momoName: "Abdul Rahman Benyi",
};

const Calculator = ({ network }) => {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [tableContent, setTableContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(network);

  const handleNetworkChange = (network) => {
    setSelectedNetwork(network);
  };

  const prices = useMemo(() => {
    switch (selectedNetwork) {
      case "MTN":
        return mtnPrices;
      case "AirtelTigo":
        return atPrices;
      case "Vodafone":
        return vodaPrices;
      default:
        return {};
    }
  }, [selectedNetwork]);

  useEffect(() => {
    const values = inputValue.split("+").map((value) => value.trim());
    const packs = gigFormatter(values);
    const pricesArray = amounts(prices, values);
    setTableContent(<TabularFormat packages={packs} prices={pricesArray} />);
  }, [inputValue, prices]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    const validInputRegex = /^[0-9+\s]*$/;

    if (validInputRegex.test(inputValue)) {
      setInputValue(inputValue);
      setInputError("");
    } else {
      setInputError("Invalid input!");
    }
  };

  const handleInputBlur = () => {
    if (inputError) {
      setInputError("");
    }
  };

  const handleCopyToClipboard = () => {
    if (inputValue) {
      const values = inputValue.split("+").map((value) => value.trim());
      const packs = gigFormatter(values);
      const pricesArray = amounts(prices, values);
      const plainTextLines = plainTextFormat(
        packs,
        pricesArray,
        selectedNetwork
      );
      const plainText = plainTextLines.join("\n");

      navigator.clipboard
        .writeText(plainText)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        })
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  return (
    <div className="main-container">
      <div className="form">
        <div className="form-container">
          <NetworkSelect
            selectedNetwork={selectedNetwork}
            handleNetworkChange={handleNetworkChange}
          />
          <SalesInput
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            inputError={inputError}
            network={selectedNetwork}
          />
        </div>
        <div className="packs-container">
          {tableContent}
          {!isCopied && (
            <button className="copy" onClick={handleCopyToClipboard}>
              <img src={copyIcon} alt="copy icon" />
              <span>Copy</span>
            </button>
          )}
          {isCopied && <p className="copied">copied!</p>}
        </div>
      </div>
      <PaymentDetails serverDetails={serverDetails} />
    </div>
  );
};

export default Calculator;
