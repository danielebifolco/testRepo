import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import "./App.css";
import Grid from "./components/Demo/Grid";
import Welcome from "./components/Intro/Welcome";

function App() {
  return (
    <EthProvider>
      <div  id="App" >
        <div className="container">
          <Welcome />
       
          <Grid />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
