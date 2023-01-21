/*import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Login({ setValue }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const read = async () => {
    const value = await contract.methods.read().call({ from: accounts[0] });
    setValue(value);
  };

  const write = async () =>{

  }
  };

  return (
    <div className="login">

      <input type="text" placeholder="Utente" id="userName">
      </input>

      <text type="text" placeholder="Password" id="pwd">
      </text>

      <button onClick={write} className="input-btn">
        write(<input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />)
      </button>

    </div>
  );
}

export default ContractBtns;*/
