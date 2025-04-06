import React from "react";
import { RaffleData } from "./raffle";

import '../styles/raffle-editor.css';

const defaultRuffles = [{
    name: 'Pack 1',
    prizes: [
        'Cena en Mononoke Café valorada en 40€',
        'Lámina A3 "Acabemos con el negocio de la Vivienda"',
        'LP Firmado Manolo Kabezabolo "Punkatarsis"',
        'Libro "La democracia de los propietarios" de Pablo Carmona',
        'Libros Sindicato de Inquilinas y Sindicat de Llogateres "Poder Inquilino"',
        'Camiseta',
        'Libro VV.AA "Metropolice. Seguridad y policía en la ciudad neoliberal"',
        'Camiseta PAH Zaragoza "Todxs con la PAH"',
        'Libro Miguel Urbán "Trumpismos. Neoliberales y autoritarios"',
        'Libro Pol Andiñach "Todo el mundo puede ser Antifa"',
        'Libro Pastora González Vieites "La cárcel no castiga el delito. Castiga la pobreza y la rebeldía"'
    ]
},
{
    name: 'Pack 2',
    prizes: [
        'Taberna Pottoka 1 botella de sidra + 2 pinchos',
        'Tienda con Clase Juego ¿Quién sabe Marx? + Camiseta "Controla el espacio, Organiza la vida, Desaloja su miseria"',
        'Pack productos 198',
        'CD Firmado Manolo Kabezabolo "Punkatarsis"',
        'Libro "La democracia de los propietarios" de Pablo Carmona',
        'Lámina A3 "Acabemos con el negocio de la Vivienda"'
    ]
},
{
    name: 'Pack 3',
    prizes: [
        'Pack cervezas Mononoke Café',
        'Lámina A5 "Acabemos con el negocio de la Vivienda"',
        'Revista Arteka "Vivienda"',
        'Bufanda Sindicat d\'Habitatge Vallcarca',
        'Libro VV.AA "De los neocón a los neonazis. La derecha radical en el estado español"',
        'Libro Paul Rocher "Qué hace la policía y cómo vivir sin ella"'
    ]
}
] as RaffleData[];

const defaultNumbers = '51-97\n851-900';

type RaffleEditorProps = {
    finnish: (raffles: RaffleData[], numbers: number[]) => void;
}

const getInitialRaffles = () => {
    // usar un localstorage para guardar los raffles
    const raffles = localStorage.getItem('raffles');
    if (raffles) {
        try {
            return JSON.parse(raffles) as RaffleData[];
        } catch (e) {
            setInitialRaffles(defaultRuffles);
        }
    }
    return defaultRuffles;
}
const getInitialNumbers = () => {
    const numbers = localStorage.getItem('numbers');
    if (numbers) {
        try {
            return numbers;
        } catch (e) {
            setInitialNumbers(defaultNumbers);
        }
    }
    return defaultNumbers;
}

const setInitialRaffles = (raffles: RaffleData[]) => {
    localStorage.setItem('raffles', JSON.stringify(raffles));
}
const setInitialNumbers = (numbers: string) => {
    localStorage.setItem('numbers', numbers);
}

export const RaffleEditor: React.FC<RaffleEditorProps> = (props) => {
    const { finnish } = props;
    const initialRaffles = getInitialRaffles();
    const initialNumbers = getInitialNumbers();

    const raffleNames = initialRaffles.map(raffle => raffle.name);
    const [rafflesPrizes, setRafflesPrizes] = React.useState<string[]>(initialRaffles.map(raffle => raffle.prizes.join('\n')));
    const [numbersString, setNumbersString] = React.useState<string>(initialNumbers);

    React.useEffect(() => {
        setInitialNumbers(numbersString);
    }, [numbersString]);
    React.useEffect(() => {
        setInitialRaffles(rafflesPrizes.map((raffle, index) => {
            const prizes = rafflesPrizes[index].split('\n').map(prize => prize.trim()).filter(prize => prize !== '');
            return {
                name: raffleNames[index],
                prizes
            }
        }));
    }, [rafflesPrizes]);

    const handleFinnish = () => {
        const raffle = rafflesPrizes.map((raffle, index) => {
            const prizes = rafflesPrizes[index].split('\n').map(prize => prize.trim()).filter(prize => prize !== '');
            return {
                name: raffleNames[index],
                prizes
            }
        });

        const numbers = numbersString.split('\n')
            .map(num => {
                const [start, end] = num.trim().split('-').map(n => parseInt(n.trim()));
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            }).flat();
        finnish(raffle, numbers);
    }

    return (
        <div className="raffle-editor-container">
            <div className="raffle-editor-numbers">
                <br /><br />
                <h2>Números</h2>
                <textarea
                    onChange={(e) => { setNumbersString(e.target.value) }}
                    value={numbersString}
                    className="raffle-editor-textarea"
                />
            </div>
            <div className="raffle-editor-items">
                {rafflesPrizes.map((raffle, index) => (
                    <div key={index} className="raffle-editor-item">
                        <h2>{raffleNames[index]}</h2>
                        <textarea
                            value={rafflesPrizes[index]}
                            onChange={(e) => {
                                setRafflesPrizes(prev => {
                                    const newRafflesPrizes = [...prev];
                                    newRafflesPrizes[index] = e.target.value;
                                    return newRafflesPrizes;
                                });
                            }}
                            className="raffle-editor-textarea"
                        />
                    </div>
                ))}
            </div>
            <button onClick={handleFinnish} className="raffle-editor-button">Guardar</button>
            <br/>
            <button className="raffle-editor-button" onClick={() => {
                setInitialRaffles(defaultRuffles);
                setInitialNumbers(defaultNumbers);
                setRafflesPrizes(defaultRuffles.map(raffle => raffle.prizes.join('\n')));
                setNumbersString(defaultNumbers);
            }}>Reiniciar</button>
        </div>
    );
}