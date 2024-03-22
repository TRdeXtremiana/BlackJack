class Mano {
    constructor(num = 0) {
        this.numCartas = num;
        this.cartas = [];
    }


    descartaTodas = () => {
        this.numCartas = 0;
        this.cartas = [];
    }

    agregarCarta = (carta) => {
        this.cartas.push(carta);
    }

    numeroCartas = () => {
        return this.numCartas;
    }

    toString = () => {
        return "Número de Cartas en la mano: " + this.numCartas;
    }

}