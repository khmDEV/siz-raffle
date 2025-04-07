import React from 'react';
import { Raffle, RaffleData, RaffleProps } from './raffle';
import '../styles/raffle-manager.css';

export type RaffleManagerProps = {
    raffles: RaffleData[];
    numbers: number[];
};

const RaffleWindow: React.FC<RaffleManagerProps> = (props) => {
    const { raffles, numbers } = props;
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [winners, setWinners] = React.useState<(number | undefined)[]>(raffles.map(() => undefined));
    const [actualNumbers, setActualNumbers] = React.useState<number[]>(numbers);

    React.useEffect(() => {
        setActualNumbers(numbers.filter((num) => !winners.includes(num)));
    }, [numbers, winners]);

    const raffleViews = React.useMemo(() => {
        return raffles.map((raffle, index) => {
            return (
                <Raffle
                    key={index}
                    {...raffle}
                    numbers={actualNumbers}
                    end={(result) => {
                        setWinners(prev => {
                            const newWinners = [...prev];
                            newWinners[index] = result;
                            return newWinners;
                        })
                    }}
                    winner={winners[index]}
                />
            );
        });
    }, [raffles, actualNumbers, winners]);

    return (
        <div className="raffle-window-container">
            {raffleViews[currentIndex]}
            <button
                className="raffle-button left"
                onClick={() => setCurrentIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
            >
                Anterior
            </button>
            <button
                className="raffle-button right"
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={currentIndex === raffles.length - 1}
            >
                Siguiente
            </button>
            <div className="raffle-container">
                <h1>Ganadores</h1>
                <ul className="winners-list">
                    {winners.map((winner, index) => (
                        <li key={index} className="winner-item">
                            <span className="raffle-name">{raffles[index].name}: </span>
                            <span className="winner-name">{winner !== undefined ? winner : 'Sin ganador'}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export const RaffleManager: React.FC<RaffleManagerProps> = (props) => {
    const { raffles } = props;
    const [started, setStarted] = React.useState<boolean>(false);

    return <>{started ? <RaffleWindow {...props} /> :
        <>
            <button className='start-button' onClick={() => {
                setStarted(true);
            }}>Comenzar sorteo</button>
        </>
    }</>;
}