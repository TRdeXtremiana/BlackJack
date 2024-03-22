const Palo = {
    CORAZONES: "♥🔴",
    DIAMANTES: "♦🔴",
    TREBOLES: "♣⚫",
    PICAS: "♠⚫"
};

class Carta {
    constructor(valor, palo) {
        if (Carta.existeCarta(valor, palo)) {
            throw new Error(`Ya existe una carta con el valor ${valor} de ${palo}`);
        }
        this._valor = valor;
        this._palo = palo;
        Carta.cartasCreadas.push({ valor, palo });
    }

    static cartasCreadas = [];
    static existeCarta(valor, palo) {
        return Carta.cartasCreadas.some(carta => carta._valor === valor && carta._palo === palo);
    }

    getPalo() {
        return this._palo;
    }

    getValor() {
        return this._valor;
    }

    toString() {
        const nombreCarta = [
            "As", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
        ];

        return nombreCarta[this._valor - 1] + this._palo;

    }

}

