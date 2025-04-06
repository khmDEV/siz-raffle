import React from 'react';
import logo from './img/logo.png';
import './styles/app.css';
import { RandomNumber } from './components/random-number';
import { Raffle, RaffleData } from './components/raffle';
import { RaffleManager, RaffleManagerProps } from './components/raffle-manager';
import { RaffleEditor } from './components/raffle-editor';


function App() {

  const [ruffles, setRuffles] = React.useState<RaffleData[] | undefined>(undefined);
  const [numbers, setNumbers] = React.useState<number[] | undefined>(undefined);
  const finnish = React.useCallback((raffles: RaffleData[], numbers: number[]) => {
    setRuffles(raffles);
    setNumbers(numbers);
  }, [setRuffles, setNumbers]);
  return (
    <div className="App">
      <div className="logo-container">
        <img src={logo} className="logo" alt="logo" />
      </div>
      <div>
        
        {ruffles && numbers ? <RaffleManager raffles={ruffles} numbers={numbers} />
        :<RaffleEditor finnish={finnish} ></RaffleEditor>}
      </div>
    </div>
  );
}

export default App;
