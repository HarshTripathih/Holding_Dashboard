import { red } from '@material-ui/core/colors';
import './App.css';
import HoldingsTable from './HoldingsTable';

function App() {
  return (
    <div className="App">
        <h1 style={{"color":'grey'}}>Holding Table</h1>
        <HoldingsTable/>
    </div>
  );
}

export default App;
