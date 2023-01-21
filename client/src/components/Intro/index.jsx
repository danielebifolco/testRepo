import Welcome from "./Welcome";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Intro() {
  const { state: { contract, accounts, web3 } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const role = async () => {web3.utils.sha3("ADMIN");};
  const owner = async () => {contract.method.hasRole(role,accounts[0]).then(console.log);};
  return (
    <>
      <Welcome />
    </>
  );
}

export default Intro;
