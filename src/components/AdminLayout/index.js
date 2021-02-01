import React, { useEffect, useState, useContext} from "react";
import { Route, Link } from "react-router-dom";

import Aux from "../../hoc/_Aux";
import { store } from "../../store";

import { useEagerConnect, useInactiveListener } from "../../hooks";
import { useWeb3React } from "@web3-react/core";

import { chainIdToName } from "../../constants";
import { zeroStringIfNullish, eX } from "../../helpers";
import Navbar from "./Navigation/Navbar";
import Dashboard from "../Market";
import Tooltip from "../Tooltip/Tooltip";
import Snackbar from "../Snackbar/Snackbar";

const BigNumber = require("bignumber.js");
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const Compound = require("@compound-finance/compound-js/dist/nodejs/index.js");

function AdminLayout() {
  const { state: globalState } = useContext(store);
  const triedEager = useEagerConnect();
  const { account, library, activate, deactivate, active } = useWeb3React();
  const [pctEarned, setPctEarned] = useState("");
  const [pctBalance, setPctBalance] = useState("");
  const [otherSnackbarOpen, setOtherSnackbarOpen] = useState(false);
  const [otherSnackbarMessage, setOtherSnackbarMessage] = useState("");
  const gasLimitClaim = "1182020";

  useInactiveListener(!triedEager);

  useEffect(() => {
    (async () => {
      setPctEarned(await getPctEarned(account));
      setPctBalance(await getPctBalance(account));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, account]);

  const getPctBalance = async (walletAddress) => {
      console.log(library)
    if (library) {
      const balance = await Compound.eth.read(
        process.env.REACT_APP_PCT_ADDRESS,
        "function balanceOf(address) returns (uint)",
        [walletAddress], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      return eX(balance.toString(), -18).toString();
    }
  };

  const getPctEarned = async (walletAddress) => {
    if (library) {
      const compBalanceMetadata = await Compound.eth.read(
        process.env.REACT_APP_COMPOUND_LENS_ADDRESS,
        "function getCompBalanceMetadataExt(address, address, address) returns (uint, uint, address, uint)",
        [
          process.env.REACT_APP_PCT_ADDRESS,
          process.env.REACT_APP_COMPTROLLER_ADDRESS,
          walletAddress,
        ], // [optional] parameters
        {
          network: chainIdToName[parseInt(library.provider.chainId)],
          _compoundProvider: library,
        } // [optional] call options, provider, network, ethers.js "overrides"
      );

      return eX(compBalanceMetadata[3].toString(), -18).toString();
    }
  };

  const claimPct = async (walletAddress) => {
      console.log(walletAddress)
    console.log(
      "globalState.gasPrice.toString()",
      globalState.gasPrice.toString()
    );
    let parameters = [walletAddress];
    let options = {
      network: chainIdToName[parseInt(library.provider.chainId)],
      provider: library.provider,
      gasLimit: gasLimitClaim,
      gasPrice: globalState.gasPrice.toString(),
      // abi: compoundConstants.abi.Comptroller,
    };

    try {
      const tx = await Compound.eth.trx(
        process.env.REACT_APP_COMPTROLLER_ADDRESS,
        {
          constant: false,
          inputs: [
            { internalType: "address", name: "holder", type: "address" },
          ],
          name: "claimComp",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0xe9af0292",
        },
        parameters, // [optional] parameters
        options // [optional] call options, provider, network, ethers.js "overrides"
      );
      console.log("tx", JSON.stringify(tx));
      setOtherSnackbarMessage(`Transaction sent: ${tx.hash}`);
    } catch (e) {
      console.log("tx error:", e);
      setOtherSnackbarMessage("Error occurred!");
    }

    setOtherSnackbarOpen(true);
  };

  
  return (
      <Aux>
        <div className="nav">
          <Navbar claimPct={claimPct} activate={activate} deactivate={deactivate} account={account} active={active}/>
        </div>
        <div className="dash">
          <Dashboard/>
        </div>
          

            <Snackbar open={otherSnackbarOpen} close={setOtherSnackbarOpen} message={otherSnackbarMessage} timeout="3000"/>
      </Aux>
  );
}

export default AdminLayout;
