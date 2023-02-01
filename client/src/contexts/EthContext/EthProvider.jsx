import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifact, artifactNFT) => {
      if (artifact && artifactNFT) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();      
        console.log("NETID: ", networkID);  
    
        let address, contract, owner, addressNFT, contractNFT;
        try {    
          const { abi } = artifact;
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
          console.log("1: ", address, contract, owner);  
          const role = await web3.utils.sha3("ADMIN");
          owner = await contract.methods.hasRole(role, accounts[0]).call({ from: accounts[0] });
          console.log("Owner1: ", owner);

        } catch (err) {
          console.error(err);
        }
        
        try {
          const { abi } = artifactNFT;
          addressNFT = artifactNFT.networks[networkID].address;
          console.log("Add: ", addressNFT);
          contractNFT = new web3.eth.Contract(abi, addressNFT);
          console.log("Contract: ", contractNFT);

          const ownerNFT = await contractNFT.methods.owner().call({ from: accounts[0] });
     
          console.log("Owner: ", ownerNFT);

        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract, owner, artifactNFT,addressNFT,contractNFT }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/TenderFactory.json"); 
        const artifactNFT = require("../../contracts/NFTColl.json"); 
        init(artifact, artifactNFT);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact, state.artifactNFT);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact, state.artifactNFT]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
