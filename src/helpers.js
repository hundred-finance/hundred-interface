const BigNumber = require("bignumber.js");

// eX(2, 3) = 2e3 = 2000
// eX(2, -3) = 2e-3 = 0.002
export const eX = (value, x) => {
  return new BigNumber(`${value}e${x}`);
};

export const convertToLargeNumberRepresentation = (value, d) => {
  if (!value) {
    return "0";
  } else if (+value >= 1e5) {
    return `${eX(value.toString(), -6)}M`;
  } else if (+value >= 1e2) {
    return `${eX(value.toString(), -3)}K`;
  } else {
    return value.toString()+" ";
  }
};

// This function is not used, because it can be replaced by new BigNumber().decimalPlaces()
export const roundToDecimalPlaces = (value, n) => {
  const factor = Math.pow(10, n);
  return Math.round((+value + Number.EPSILON) * factor) / factor;
};

export const emptyStringIfNullish = (value) => {
  if (value && value !== "NaN") {
    return value;
  } else {
    return "";
  }
};

export const zeroStringIfNullish = (value, dp) => {
 
  if (value && !isNaN(value)) {
    return value;
  } else {
    return Number(0).toFixed(dp);
  }
};

export const getShortenAddress = (address) => {
  const firstCharacters = address.substring(0, 6);
  const lastCharacters = address.substring(
    address.length - 4,
    address.length
  );
  return `${firstCharacters}...${lastCharacters}`;
};

export const compareSymbol = (a, b) => {
  if (a.symbol < b.symbol) {
    return -1;
  }
  if (a.symbol > b.symbol) {
    return 1;
  }
  return 0;
}