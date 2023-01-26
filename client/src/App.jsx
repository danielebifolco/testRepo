import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import "./App.css";
import Grid from "./components/Demo/Grid";

function App() {
  return (
    <EthProvider>
      <div  id="App" >
        <div className="container">
          <Intro />
          <hr />
          <Grid />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
