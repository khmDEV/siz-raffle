import React from 'react';
import { RandomNumber } from './random-number';
import '../styles/raffle.css';


export type RaffleData = {
    name: string;
    prizes: string[];
};
export type RaffleProps = RaffleData &{
    numbers: number[];
    end: (result: number) => void;
    winner?: number;
};

export const Raffle: React.FC<RaffleProps> = (props) => {
    const { name, prizes, numbers, end, winner } = props;
    const [result, setResult] = React.useState<number | undefined>(winner);
    const start = React.useRef<(() => void) | null>(null);
    const [started, setStarted] = React.useState<boolean>(result? true : false);
    

    React.useEffect(() => {
        result && end(result)
    }, [result, end]);

    return (
        <div className="raffle-container">
            <h1 className="raffle-title">{name}</h1>
            <h2 className="raffle-subtitle">Premios</h2>
            <ul className="raffle-prizes">
                {prizes.map((prize, index) => (
                    <li key={index} className="raffle-prize">{prize}</li>
                ))}
            </ul>
            <button className="raffle-button" disabled={started}
                 onClick={() => {setStarted(true);start?.current?.()}}>Empieza el sorteo</button>
            <RandomNumber
                start={start}
                end={(result) => setResult(result)}
                numbers={numbers}
                result={winner??result}
            />
            {result !== undefined && (<h2 className="raffle-result">¡Enhorabuena!</h2>)}
        </div>
    );
};