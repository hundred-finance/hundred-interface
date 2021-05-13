import { BigNumber, ethers, utils } from "ethers";
import { CTokenInfo } from "./Classes/cTokenClass";

export const eX = (bigNumber: BigNumber, decimals: number): string => {
  if(bigNumber && decimals){
    return utils.formatUnits(bigNumber, decimals)
  }
  return '0'
}

export const toDecimalPlaces = (bigNumber: ethers.BigNumber, decimals: number, places: number) : string => {
  if(!decimals)
      decimals = 0
    if (bigNumber){
      return decimalPlaces(ethers.utils.formatUnits(bigNumber, decimals), places)
    }
    else{
      const num = BigNumber.from("0")
      return num.toNumber().toFixed(places)
    }
}

export const decimalPlaces = (number: string, places: number) : string => {
  const temp = number.split(".")
  if (temp.length === 2){
    const decimalsTemp = Array.from(temp[1])
    if (decimalsTemp.length >= places)
      return temp[0] + "." + temp[1].substring(0, places)
    else{
      let zeroPlaces=""
      for (let i = 0; i < places - decimalsTemp.length; i++){
        zeroPlaces += "0"
      }
      return temp[0] + "." + temp[1] + zeroPlaces
    }
  }
  else{
    let zeroPlaces=""
      for (let i = 0; i < places; i++)
        zeroPlaces += "0"
      return temp[0] + "." +  zeroPlaces
  }
}

export const getShortenAddress = (address: string) : string => {
  const firstCharacters = address.substring(0, 6);
  const lastCharacters = address.substring(
    address.length - 4,
    address.length
  );
  return `${firstCharacters}...${lastCharacters}`;
};

export const convertToLargeNumberRepresentation = (value: BigNumber, decimals: number, dp?: number, symbol?: string) : string => {
  if (!value) {
    return "0";
  } else{
    const number : number = +decimalPlaces(eX(value, decimals), 8)
    if(number === 0)
      return number.toPrecision(dp ? dp : 3) + " "
    else if (number >= 1e5) {
      return `${symbol ? symbol : ""}${(number/1e6).toPrecision(dp ? dp : 4)}M`
    } else if (number >= 1e2) {
      return `${symbol ? symbol : ""}${(number/1e3).toPrecision(dp ? dp : 4)}K`
    } else {
      if(number > 0 && number < 0.01)
        return `<${symbol ? symbol : ""}0.01`
      return number.toPrecision(dp ? 2 : 4) + " "
    }
  } 
}

export const zeroStringIfNullish = (value: BigNumber, decimals: number, dp:number): string => {
 
  if (value && value.gt(BigNumber.from(0))) {
    return decimalPlaces(eX(value, decimals), dp)
  } else {
    return Number(0).toFixed(dp)
  }
}


export const compareSymbol = (a: CTokenInfo | null, b: CTokenInfo | null): number => {
  if (a && b){
    if (a.symbol < b.symbol) {
      return -1;
    }
    if (a.symbol > b.symbol) {
      return 1;
    }
  }  
  return 0;
}
