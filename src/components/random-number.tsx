import React from 'react';

import '../styles/random-number.css';

type RandomNumberProps = {
    start: React.RefObject<(() => void) | null>;
    end: (result: number) => void;
    numbers: number[];
    iteratorMax?: number;
    minTime?: number;
    maxTime?: number;
    result?: number;
};

export const RandomNumber: React.FC<RandomNumberProps> = (props) => {
    const { numbers, iteratorMax = 20, minTime = 100, maxTime=500, start, end, result } = props;
    const [started, setStarted] = React.useState<boolean>(false);
    const [randomNumber, setRandomNumber] = React.useState<number>(result??Math.floor(Math.random() * numbers.length));
    const [iterator, setIterator] = React.useState<number>(0);
    const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        start.current = () => {
            setStarted(true);
        }
    }, [setStarted, start]);

    const func = React.useCallback(() => {
        setRandomNumber(numbers[Math.floor(Math.random() * numbers.length)]);
        setIterator(prev => prev + 1);
    }, [iterator]);

    React.useEffect(() => {
        if (!started) {
            return;
        }
        if (iterator >= iteratorMax) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            end(randomNumber);
            return;
        } else {
            const expFunc = Math.exp(1-(1/(iterator / iteratorMax)));
            const time = (maxTime - minTime) * expFunc + minTime;
            setTimeoutId(setTimeout(func, time));
        }
    }, [iterator, iteratorMax, started]);


    return (
        <div className="random-number-container">
            <p className="random-number">{result? result : (started ? randomNumber : <></>)}</p>
        </div>
    );

}