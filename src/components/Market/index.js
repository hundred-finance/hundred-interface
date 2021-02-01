import React, { useEffect, useState, useContext } from "react";
import "./dashboard.css"
import ETHlogo from "../../assets/images/ETH-logo.png";
import { chainIdToName, ethDummyAddress } from "../../constants";
import {eX} from "../../helpers";
import { store } from "../../store";
import { useWeb3React } from "@web3-react/core";
import { MaxUint256 } from "@ethersproject/constants";
import GeneralDetails from "./GeneralDetails";
import SupplyMarkets from "./SupplyMarkets";
import BorrowMarkets from "./BorrowMarkets";
import EnterMarketDialog from "./MarketDialogs/enterMarketDialog";
import Snackbar from "../Snackbar/Snackbar";
import SupplyMarketDialog from "./MarketDialogs/supplyMarketDialog";
import BorrowMarketDialog from "./MarketDialogs/borrowMarketsDialog";
const Compound = require("@compound-finance/compound-js/dist/nodejs/index.js");
const compoundConstants = require("@compound-finance/compound-js/dist/nodejs/constants.js");
const BigNumber = require("bignumber.js");
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

function Dashboard() {
  const { state: globalState, dispatch } = useContext(store);
  const { account, library } = useWeb3React();
  // const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [supplyDialogOpen, setSupplyDialogOpen] = useState(false);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [enterMarketDialogOpen, setEnterMarketDialogOpen] = useState(false);
  const [otherSnackbarOpen, setOtherSnackbarOpen] = useState(false);
  const [otherSnackbarMessage , setOtherSnackbarMessage] = useState("");
  const [selectedMarketDetails, setSelectedMarketDetails] = useState({});
  const [allMarketDetails, setAllMarketDetails] = useState([]);
  const [generalDetails, setGeneralDetails] = useState([]);
  const blockTime = 13.5; // seconds
  const gasLimit = "250000";
  const gasLimitSupplyDai = "535024";
  const gasLimitSupplySnx = "450000";
  const gasLimitSupplySusd = "450000";
  const gasLimitWithdrawDai = "550000";
  const gasLimitWithdrawSnx = "550000";
  const gasLimitWithdrawSusd = "550000";
  const gasLimitWithdraw = "450000";
  const gasLimitEnable = "70000";
  const gasLimitEnableDai = "66537";
  const gasLimitBorrow = "702020";
  const gasLimitBorrowDai = "729897";
  const gasLimitRepayDai = "535024";
  const gasLimitRepaySusd = "400000";
  const gasLimitEnterMarket = "112020";

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    library,
    account /*, supplyDialogOpen, borrowDialogOpen, enterMarketDialogOpen*/,
  ]);

  const updateData = async () => {

    console.log("updateData start");

    const comptrollerAddress = process.env.REACT_APP_COMPTROLLER_ADDRESS;
    
    const allMarkets = await Compound.eth.read(
      comptrollerAddress,
      "function getAllMarkets() returns (address[])",
      [], // [optional] parameters
      {
        network: chainIdToName[parseInt(library?.provider?.chainId)],
        _compoundProvider: library,
      } // [optional] call options, provider, network, ethers.js "overrides"
    );

    if (account) {
      const enteredMarkets = await Compound.eth.read(
        comptrollerAddress,
        "function getAssetsIn(address) returns (address[])",
        [account], // [optional] parameters
        {
          network: chainIdToName[parseInt(library?.provider?.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      let totalSupplyBalance = new BigNumber(0);
      let totalBorrowBalance = new BigNumber(0);
      let allMarketsTotalSupplyBalance = new BigNumber(0);
      let allMarketsTotalBorrowBalance = new BigNumber(0);
      let totalBorrowLimit = new BigNumber(0);
      let yearSupplyInterest = new BigNumber(0);
      let yearBorrowInterest = new BigNumber(0);
      let yearSupplyPctRewards = new BigNumber(0);
      let yearBorrowPctRewards = new BigNumber(0);
      let totalLiquidity = new BigNumber(0);
      const pctPrice = await getPctPrice();

      async function getMarketDetails(pTokenAddress) {
        const underlyingAddress = await getUnderlyingTokenAddress(
          pTokenAddress
        );
        const symbol = await getTokenSymbol(underlyingAddress);
        console.log(symbol, underlyingAddress);
        const logoSource =
          symbol === "ETH"
            ? ETHlogo
            : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${underlyingAddress}/logo.png`;
        const decimals = await getDecimals(underlyingAddress);
        const underlyingPrice = await getUnderlyingPrice(
          pTokenAddress,
          decimals
        );
        const supplyAndBorrowBalance = await getSupplyAndBorrowBalance(
          pTokenAddress,
          decimals,
          underlyingPrice,
          account
        );
        totalSupplyBalance = totalSupplyBalance.plus(
          supplyAndBorrowBalance?.supplyBalance
        );
        totalBorrowBalance = totalBorrowBalance.plus(
          supplyAndBorrowBalance?.borrowBalance
        );

        const marketTotalSupply = (
          await getMarketTotalSupplyInTokenUnit(pTokenAddress, decimals)
        )?.times(underlyingPrice);

        const marketTotalBorrowInTokenUnit = await getMarketTotalBorrowInTokenUnit(
          pTokenAddress,
          decimals
        );

        const marketTotalBorrow = marketTotalBorrowInTokenUnit?.times(
          underlyingPrice
        );

        if (marketTotalSupply?.isGreaterThan(0)) {
          allMarketsTotalSupplyBalance = allMarketsTotalSupplyBalance.plus(
            marketTotalSupply
          );
        }

        if (marketTotalBorrow?.isGreaterThan(0)) {
          allMarketsTotalBorrowBalance = allMarketsTotalBorrowBalance.plus(
            marketTotalBorrow
          );
        }

        const isEnterMarket = enteredMarkets.includes(pTokenAddress);

        const collateralFactor = await getCollateralFactor(
          comptrollerAddress,
          pTokenAddress
        );
        totalBorrowLimit = totalBorrowLimit.plus(
          isEnterMarket
            ? supplyAndBorrowBalance?.supplyBalance.times(collateralFactor)
            : 0
        );

        const supplyApy = await getSupplyApy(pTokenAddress);
        const borrowApy = await getBorrowApy(pTokenAddress);
        yearSupplyInterest = yearSupplyInterest.plus(
          supplyAndBorrowBalance?.supplyBalance.times(supplyApy).div(100)
        );
        yearBorrowInterest = yearBorrowInterest.plus(
          supplyAndBorrowBalance?.borrowBalance.times(borrowApy).div(100)
        );

        const underlyingAmount = await getUnderlyingAmount(
          pTokenAddress,
          decimals
        );

        const liquidity = +underlyingAmount * +underlyingPrice;

        if (liquidity > 0) {
          totalLiquidity = totalLiquidity.plus(liquidity);
        }

        return {
          pTokenAddress,
          underlyingAddress,
          symbol,
          logoSource,
          supplyApy,
          borrowApy,
          underlyingAllowance: await getAllowance(
            underlyingAddress,
            decimals,
            account,
            pTokenAddress
          ),
          walletBalance: await getBalanceOf(
            underlyingAddress,
            decimals,
            account
          ),
          supplyBalanceInTokenUnit:
            supplyAndBorrowBalance?.supplyBalanceInTokenUnit,
          supplyBalance: supplyAndBorrowBalance?.supplyBalance,
          marketTotalSupply: (
            await getMarketTotalSupplyInTokenUnit(pTokenAddress, decimals)
          )?.times(underlyingPrice),
          borrowBalanceInTokenUnit:
            supplyAndBorrowBalance?.borrowBalanceInTokenUnit,
          borrowBalance: supplyAndBorrowBalance?.borrowBalance,
          marketTotalBorrowInTokenUnit,
          marketTotalBorrow: marketTotalBorrowInTokenUnit?.times(
            underlyingPrice
          ),
          isEnterMarket,
          underlyingAmount,
          underlyingPrice,
          liquidity: +underlyingAmount * +underlyingPrice,
          collateralFactor,
          pctSpeed: await getPctSpeed(pTokenAddress),
          decimals,
        };
      }
      const details = await Promise.all(
        allMarkets.map(async (pTokenAddress) => {
          try {
            return await getMarketDetails(pTokenAddress);
          }
          catch (ex) {
            console.log(`Error getting ${pTokenAddress}: ${ex.message}`);
            console.log(ex.error);
            return {}
          }
        })
      );

      setGeneralDetails({
        comptrollerAddress,
        totalSupplyBalance,
        totalBorrowBalance,
        allMarketsTotalSupplyBalance,
        allMarketsTotalBorrowBalance,
        totalBorrowLimit,
        totalBorrowLimitUsedPercent: totalBorrowBalance
          .div(totalBorrowLimit)
          .times(100),
        yearSupplyInterest,
        yearBorrowInterest,
        netApy: yearSupplyInterest
          .minus(yearBorrowInterest)
          .div(totalSupplyBalance),
        totalSupplyPctApy: yearSupplyPctRewards?.div(totalSupplyBalance),
        totalBorrowPctApy: yearBorrowPctRewards?.div(totalBorrowBalance),
        pctPrice,
        totalLiquidity,
      });

      setAllMarketDetails(details);
    }
    await updateGasPrice();
  };

  const getPctPrice = async () => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=percent&vs_currencies=usd"
      // "https://api.coingecko.com/api/v3/simple/price?ids=compound-governance-token&vs_currencies=usd"
    );
    const data = await response.json();
    return new BigNumber(data?.percent?.usd);
    // return new BigNumber(data["compound-governance-token"]?.usd);
  };

  const getUnderlyingTokenAddress = async (pTokenAddress) => {
    if (pTokenAddress === "0x45F157b3d3d7C415a0e40012D64465e3a0402C64") {
      //Hardcoded CEther address as it doesn't have the `underlying` function
      return ethDummyAddress
    }
    return await Compound.eth.read(
      pTokenAddress,
      "function underlying() returns (address)",
      [], // [optional] parameters
      {
        network: chainIdToName[parseInt(library?.provider?.chainId)],
        _compoundProvider: library,
      } // [optional] call options, provider, network, ethers.js "overrides"
    );
  };

  const getTokenSymbol = async (address) => {
    const saiAddress = Compound.util.getAddress(
      Compound.SAI,
      chainIdToName[parseInt(library?.provider?.chainId)]
    );
    let symbol;
    if (address.toLowerCase() === saiAddress.toLowerCase()) {
      symbol = "SAI";
    } else if (address === ethDummyAddress) {
      symbol = "ETH";
    } else if (address === "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") {
      symbol = "MKR";
    } else {
      console.log("address", address);
      symbol = await Compound.eth.read(
        address,
        "function symbol() returns (string)",
        [], // [optional] parameters
        {
          network: chainIdToName[parseInt(library?.provider?.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );
    }
    console.log("symbol", symbol);
    return symbol;
  };

  const getSupplyApy = async (address) => {
    if (library) {
      const mantissa = 1e18; // mantissa is the same even the underlying asset has different decimals
      const blocksPerDay = (24 * 60 * 60) / blockTime;
      const daysPerYear = 365;

      let supplyRatePerBlock;
      try {
        supplyRatePerBlock = await Compound.eth.read(
          address,
          "function supplyRatePerBlock() returns (uint256)",
          [], // [optional] parameters
          {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library,
          } // [optional] call options, provider, network, ethers.js "overrides"
        );
      } catch (e) {
        console.log(address, e.message, e.error.error);
        supplyRatePerBlock = new BigNumber(0);
      }

      const supplyApy = new BigNumber(
        Math.pow(
          (supplyRatePerBlock.toNumber() / mantissa) * blocksPerDay + 1,
          daysPerYear - 1
        ) - 1
      );
      return supplyApy;
    }
  };

  const getBorrowApy = async (address) => {
    if (library) {
      const mantissa = 1e18; // mantissa is the same even the underlying asset has different decimals
      const blocksPerDay = (24 * 60 * 60) / blockTime;
      const daysPerYear = 365;

      let borrowRatePerBlock;
      try {
        borrowRatePerBlock = await Compound.eth.read(
          address,
          "function borrowRatePerBlock() returns (uint256)",
          [], // [optional] parameters
          {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library,
          } // [optional] call options, provider, network, ethers.js "overrides"
        );
      } catch (e) {
        borrowRatePerBlock = new BigNumber(0);
      }

      const borrowApy = new BigNumber(
        Math.pow(
          (borrowRatePerBlock.toNumber() / mantissa) * blocksPerDay + 1,
          daysPerYear - 1
        ) - 1
      );
      return borrowApy;
    }
  };

  const getDecimals = async (tokenAddress) => {
    if (library) {
      let decimals;
      if (tokenAddress === ethDummyAddress) {
        decimals = 18;
      } else {
        decimals = await Compound.eth.read(
          tokenAddress,
          "function decimals() returns (uint8)",
          [], // [optional] parameters
          {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library,
          } // [optional] call options, provider, network, ethers.js "overrides"
        );
      }

      return decimals;
    }
  };

  const getBalanceOf = async (tokenAddress, decimals, walletAddress) => {
    if (library) {
      let balance;
      if (tokenAddress === ethDummyAddress) {
        balance = await library.getBalance(walletAddress);
      } else {
        balance = await Compound.eth.read(
          tokenAddress,
          "function balanceOf(address) returns (uint)",
          [walletAddress], // [optional] parameters
          {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library,
          } // [optional] call options, provider, network, ethers.js "overrides"
        );
      }

      return eX(balance.toString(), -1 * decimals);
    }
  };

  const getAllowance = async (
    tokenAddress,
    decimals,
    walletAddress,
    pTokenAddress
  ) => {
    if (library) {
      let allowance;
      if (tokenAddress === ethDummyAddress) {
        allowance = MaxUint256;
      } else {
        allowance = await Compound.eth.read(
          tokenAddress,
          "function allowance(address, address) returns (uint)",
          [walletAddress, pTokenAddress], // [optional] parameters
          {
            network: chainIdToName[parseInt(library.provider.chainId)],
            _compoundProvider: library,
          } // [optional] call options, provider, network, ethers.js "overrides"
        );
      }

      return eX(allowance.toString(), -1 * decimals);
    }
  };

  const getSupplyAndBorrowBalance = async (
    tokenAddress,
    decimals,
    underlyingPrice,
    walletAddress
  ) => {
    if (library) {
      const accountSnapshot = await Compound.eth.read(
        tokenAddress,
        "function getAccountSnapshot(address) returns (uint, uint, uint, uint)",
        [walletAddress], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      const supplyBalanceInTokenUnit = eX(
        accountSnapshot[1].mul(accountSnapshot[3]).toString(),
        -1 * decimals - 18
      );
      const supplyBalanceInUsd = supplyBalanceInTokenUnit.times(
        underlyingPrice
      );
      const borrowBalanceInTokenUnit = eX(
        accountSnapshot[2].toString(),
        -1 * decimals
      );
      const borrowBalanceInUsd = borrowBalanceInTokenUnit.times(
        underlyingPrice
      );

      return {
        supplyBalanceInTokenUnit,
        supplyBalance: supplyBalanceInUsd,
        borrowBalanceInTokenUnit,
        borrowBalance: borrowBalanceInUsd,
      };
    }
  };

  const getCollateralFactor = async (comptrollerAddress, tokenAddress) => {
    if (library) {
      const market = await Compound.eth.read(
        comptrollerAddress,
        "function markets(address) returns (bool, uint, bool)",
        [tokenAddress], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );
      return eX(market[1].toString(), -18);
    }
  };

  const getUnderlyingAmount = async (tokenAddress, decimals) => {
    if (library) {
      const underlyingAmount = await Compound.eth.read(
        tokenAddress,
        "function getCash() returns (uint)",
        [], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      return eX(underlyingAmount.toString(), -1 * decimals);
    }
  };

  const getUnderlyingPrice = async (tokenAddress, decimals) => {
    if (library) {
      // const priceFeedAddress = Compound.util.getAddress(
      //   Compound.PriceFeed,
      //   chainIdToName[parseInt(library?.provider?.chainId)]
      // );

      const priceFeedAddress = process.env.REACT_APP_ORACLE_ADDRESS;

      const underlyingPrice = await Compound.eth.read(
        priceFeedAddress,
        "function getUnderlyingPrice(address) returns (uint)",
        [tokenAddress], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      return eX(underlyingPrice.toString(), decimals - 36);
    }
  };

  const getMarketTotalSupplyInTokenUnit = async (tokenAddress, decimals) => {
    if (library) {
      const cTokenTotalSupply = await Compound.eth.read(
        tokenAddress,
        "function totalSupply() returns (uint)",
        [], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      const exchangeRateStored = await Compound.eth.read(
        tokenAddress,
        "function exchangeRateStored() returns (uint)",
        [], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      return eX(
        cTokenTotalSupply.mul(exchangeRateStored).toString(),
        -1 * decimals - 18
      );
    }
  };

  const getMarketTotalBorrowInTokenUnit = async (tokenAddress, decimals) => {
    if (library) {
      const totalBorrows = await Compound.eth.read(
        tokenAddress,
        "function totalBorrows() returns (uint)",
        [], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      return eX(totalBorrows.toString(), -1 * decimals);
    }
  };

  const getPctSpeed = async (tokenAddress) => {
    if (library) {
      const pctSpeed = await Compound.eth.read(
        process.env.REACT_APP_COMPTROLLER_ADDRESS,
        "function compSpeeds(address) returns (uint)",
        [tokenAddress], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      return eX(pctSpeed.toString(), -18);
    }
  };

  const handleEnable = async (
    underlyingAddress,
    pTokenAddress,
    symbol
  ) => {
    try {
      const tx = await Compound.eth.trx(
        underlyingAddress,
        "approve",
        [pTokenAddress, MaxUint256], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          provider: library.provider,
          gasLimit: symbol === "DAI" ? gasLimitEnableDai : gasLimitEnable,
          gasPrice: globalState.gasPrice.toString(),
          abi: compoundConstants.abi.cErc20,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );
      console.log("tx", JSON.stringify(tx));
      setOtherSnackbarMessage(`Transaction sent: ${tx.hash}`);
    } catch (e) {
      setOtherSnackbarMessage(`Error: ${JSON.stringify(e)}`);
    }

    setOtherSnackbarOpen(true);
  };

  const handleSupply = async (
    underlyingAddress,
    pTokenAddress,
    amount,
    decimals,
    symbol
  ) => {
    let parameters = [];
    let options = {
      network: chainIdToName[parseInt(library.provider.chainId)],
      provider: library.provider,
      gasLimit:
        symbol === "DAI"
          ? gasLimitSupplyDai
          : symbol === "SNX"
          ? gasLimitSupplySnx
          : symbol === "sUSD"
          ? gasLimitSupplySusd
          : gasLimit,
      gasPrice: globalState.gasPrice.toString(),
    };

    if (underlyingAddress === ethDummyAddress) {
      options.value = eX(amount, 18).toString();
      options.abi = compoundConstants.abi.cEther;
    } else {
      parameters.push(eX(amount, decimals).toString());
      options.abi = compoundConstants.abi.cErc20;
    }

    try {
      const tx = await Compound.eth.trx(
        pTokenAddress,
        "mint",
        parameters, // [optional] parameters
        options // [optional] call options, provider, network, ethers.js "overrides"
      );
      console.log("tx", JSON.stringify(tx));
      setOtherSnackbarMessage(`Transaction sent: ${tx.hash}`);
    } catch (e) {
      setOtherSnackbarMessage(`Error: ${JSON.stringify(e)}`);
    }

    setOtherSnackbarOpen(true);
  };

  const handleWithdraw = async (
    underlyingAddress,
    pTokenAddress,
    amount,
    decimals,
    symbol
  ) => {
    const options = {
      network: chainIdToName[parseInt(library.provider.chainId)],
      provider: library.provider,
      gasLimit:
        symbol === "DAI"
          ? gasLimitWithdrawDai
          : symbol === "SNX"
          ? gasLimitWithdrawSnx
          : symbol === "sUSD"
          ? gasLimitWithdrawSusd
          : gasLimitWithdraw,
      gasPrice: globalState.gasPrice.toString(),
    };

    if (underlyingAddress === ethDummyAddress) {
      options.abi = compoundConstants.abi.cEther;
    } else {
      options.abi = compoundConstants.abi.cErc20;
    }

    try {
      const tx = await Compound.eth.trx(
        pTokenAddress,
        "redeemUnderlying",
        [eX(amount, decimals).toString()], // [optional] parameters
        options // [optional] call options, provider, network, ethers.js "overrides"
      );
      console.log("tx", JSON.stringify(tx));
      setOtherSnackbarMessage(`Transaction sent: ${tx.hash}`);
    } catch (e) {
      setOtherSnackbarMessage(`Error: ${JSON.stringify(e)}`);
    }
    
    setOtherSnackbarOpen(true);
  };

  const handleBorrow = async (
    underlyingAddress,
    pTokenAddress,
    amount,
    decimals,
    symbol
  ) => {
    const options = {
      network: chainIdToName[parseInt(library.provider.chainId)],
      provider: library.provider,
      gasLimit: symbol === "DAI" ? gasLimitBorrowDai : gasLimitBorrow,
      gasPrice: globalState.gasPrice.toString(),
    };

    if (underlyingAddress === ethDummyAddress) {
      options.abi = compoundConstants.abi.cEther;
    } else {
      options.abi = compoundConstants.abi.cErc20;
    }

    try {
      const tx = await Compound.eth.trx(
        pTokenAddress,
        "borrow",
        [eX(amount, decimals).toString()], // [optional] parameters
        options // [optional] call options, provider, network, ethers.js "overrides"
      );
      console.log("tx", JSON.stringify(tx));
      setOtherSnackbarMessage(`Transaction sent: ${tx.hash}`);
    } catch (e) {
      setOtherSnackbarMessage(`Error: ${JSON.stringify(e)}`);
    }

    setOtherSnackbarOpen(true);
  };

  const handleRepay = async (
    walletAddress,
    underlyingAddress,
    pTokenAddress,
    amount,
    isFullRepay,
    decimals,
    symbol
  ) => {
    const parameters = [];
    const options = {
      network: chainIdToName[parseInt(library.provider.chainId)],
      provider: library.provider,
      gasLimit:
        symbol === "DAI"
          ? gasLimitRepayDai
          : symbol === "sUSD"
          ? gasLimitRepaySusd
          : gasLimit,
      gasPrice: globalState.gasPrice.toString(),
    };

    try {
      let tx;
      if (underlyingAddress === ethDummyAddress) {
        parameters.push(walletAddress);
        parameters.push(pTokenAddress);
        options.value = eX(amount, 18).toString();
        tx = await Compound.eth.trx(
          process.env.REACT_APP_MAXIMILLION_ADDRESS,
          {
            constant: false,
            inputs: [
              { internalType: "address", name: "borrower", type: "address" },
              { internalType: "address", name: "cEther_", type: "address" },
            ],
            name: "repayBehalfExplicit",
            outputs: [],
            payable: true,
            stateMutability: "payable",
            type: "function",
          },
          [walletAddress, pTokenAddress], // [optional] parameters
          options // [optional] call options, provider, network, ethers.js "overrides"
        );
      } else {
        if (isFullRepay) {
          parameters.push(
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          ); //-1 (i.e. 2256 - 1)
        } else {
          parameters.push(eX(amount, decimals).toString());
        }
        options.abi = compoundConstants.abi.cErc20;
        tx = await Compound.eth.trx(
          pTokenAddress,
          "repayBorrow",
          parameters, // [optional] parameters
          options // [optional] call options, provider, network, ethers.js "overrides"
        );
      }

      console.log("tx", JSON.stringify(tx));
      setOtherSnackbarMessage(`Transaction sent: ${tx.hash}`);
    } catch (e) {
      setOtherSnackbarMessage(`Error: ${JSON.stringify(e)}`);
    }

    setOtherSnackbarOpen(true);
  };

  const handleEnterMarket = async (
    pTokenAddress, symbol
  ) => {
    try {
      const tx = await Compound.eth.trx(
        generalDetails.comptrollerAddress,
        "enterMarkets",
        [[pTokenAddress]], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          provider: library.provider,
          gasLimitEnterMarket,
          gasPrice: globalState.gasPrice.toString(),
          abi: compoundConstants.abi.Comptroller,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );
      console.log("tx", JSON.stringify(tx));
      setOtherSnackbarMessage(`Transaction sent: ${tx.hash}`);

      var marketIndex = allMarketDetails.findIndex(x => x.symbol === symbol)
      allMarketDetails[marketIndex].isEnterMarket = true

      setAllMarketDetails(allMarketDetails)

    } catch (e) {
      setOtherSnackbarMessage(`Error: ${JSON.stringify(e)}`);
    }
    setSupplyDialogOpen(false)
    setOtherSnackbarOpen(true)
  };

  const handleExitMarket = async (
    pTokenAddress, symbol
  ) => {
    try {
      const tx = await Compound.eth.trx(
        generalDetails.comptrollerAddress,
        "exitMarket",
        [pTokenAddress], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          provider: library.provider,
          gasLimitEnterMarket,
          gasPrice: globalState.gasPrice.toString(),
          abi: compoundConstants.abi.Comptroller,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );
      console.log("tx", JSON.stringify(tx));
      setOtherSnackbarMessage(`Transaction sent: ${tx.hash}`);

      var marketIndex = allMarketDetails.findIndex(x => x.symbol === symbol)
      allMarketDetails[marketIndex].isEnterMarket = false

      setAllMarketDetails(allMarketDetails)

    } catch (e) {
      setOtherSnackbarMessage(`Error: ${JSON.stringify(e)}`);
    }

    setSupplyDialogOpen(false)
    setOtherSnackbarOpen(true)    
  };

  const updateGasPrice = async () => {
    const response = await fetch(
      "https://ethgasstation.info/api/ethgasAPI.json"
    );
    const data = await response.json();
    dispatch({
      type: "UPDATE_GAS_PRICE",
      gasPrice: eX(data.fast, 8),
    });
    // setGasPrice(eX?(data.fast, 8));
  };

  const getMaxAmount = (symbol, walletBalance) => {
    if (symbol === "ETH") {
      return walletBalance.minus(eX(globalState.gasPrice.times(gasLimit), -18));
    } else {
      return walletBalance;
    }
  };

  const getMaxRepayAmount = (symbol, borrowBalanceInTokenUnit, borrowApy) => {
    const maxRepayFactor = new BigNumber(1).plus(borrowApy / 100); // e.g. Borrow APY = 2% => maxRepayFactor = 1.0002
    if (symbol === "ETH") {
      return borrowBalanceInTokenUnit.times(maxRepayFactor).decimalPlaces(18); // Setting it to a bit larger, this makes sure the user can repay 100%.
    } else {
      return borrowBalanceInTokenUnit.times(maxRepayFactor).decimalPlaces(18); // The same as ETH for now. The transaction will use -1 anyway.
    }
  };


  const compareSymbol = (a, b) => {
    if (a.symbol < b.symbol) {
      return -1;
    }
    if (a.symbol > b.symbol) {
      return 1;
    }
    return 0;
  }

  const enterMarketDialog = (details) =>{
      setSelectedMarketDetails(details)
      setEnterMarketDialogOpen(true);
  }

  const closeEnterMarketDialog =() => {
    setEnterMarketDialogOpen(false)
  }

  const openSupplyMarketDialog = (details) => {
    setSelectedMarketDetails(details)
    setSupplyDialogOpen(true);
  }

  const closeSupplyMarketDialog = () => {
    setSupplyDialogOpen(false)
  }

  const openBorrowMarketDialog = (details) => {
    setSelectedMarketDetails(details)
    setBorrowDialogOpen(true)
  }

  const closeBorrowMarketDialog = () => {
    setBorrowDialogOpen(false)
  }

  return (
    <div className="dashboard">
        <GeneralDetails generalDetails={generalDetails}/>
        <div className="dashboard-content">
          <SupplyMarkets generalDetails={generalDetails} allMarketDetails={allMarketDetails} compareSymbol={compareSymbol} 
            enterMarketDialog={enterMarketDialog} supplyMarketDialog = {openSupplyMarketDialog}/>
          <BorrowMarkets generalDetails={generalDetails} allMarketDetails={allMarketDetails} compareSymbol={compareSymbol}
            borrowMarketDialog={openBorrowMarketDialog}/>
        </div>
        <div className="dialogs">
          <EnterMarketDialog open={enterMarketDialogOpen} selectedMarketDetails={selectedMarketDetails} 
            closeMarketDialog={closeEnterMarketDialog} generalDetails={generalDetails} handleExitMarket={handleExitMarket} handleEnterMarket={handleEnterMarket}/>
          <SupplyMarketDialog open={supplyDialogOpen} selectedMarketDetails={selectedMarketDetails} generalDetails={generalDetails}
            closeSupplyMarketDialog={closeSupplyMarketDialog} getMaxAmount={getMaxAmount} handleSupply={handleSupply} handleEnable={handleEnable}
            handleWithdraw={handleWithdraw}/>
          <BorrowMarketDialog open={borrowDialogOpen} selectedMarketDetails={selectedMarketDetails} generalDetails={generalDetails}
            closeBorrowMarketDialog={closeBorrowMarketDialog} handleBorrow={handleBorrow} getMaxAmount={getMaxAmount} getMaxRepayAmount={getMaxRepayAmount}
            handleRepay={handleRepay} handleEnable={handleEnable}/>
        </div>
        <Snackbar open={otherSnackbarOpen} close={setOtherSnackbarOpen} message={otherSnackbarMessage} timeout="3000"/>
    </div>
  );
}

export default Dashboard;
