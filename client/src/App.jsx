import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import Grid from "./components/Demo/Grid";
import Navbar from "./components/Demo/Navbar";

function App() {
  return (
    <EthProvider>
      <div  id="App" >
        <Navbar/>
        <div className="container">
          <Grid />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
