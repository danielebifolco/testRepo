import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import "./App.css";
import Grid from "./components/Demo/Grid";
import Welcome from "./components/Intro/Welcome";
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
