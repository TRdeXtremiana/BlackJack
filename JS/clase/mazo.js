class Mazo {
    constructor() {
        this.numCartas = 52;
        this.cartas = [];
    }

    barajar() {
        // Crear un nuevo mazo ordenado
        for (let valor = 1; valor <= 13; valor++) {
            for (let palo of Object.values(Palo)) {
                this.cartas.push(new Carta(valor, palo));
            }
        }

        // Barajar el mazo
        for (let i = this.cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]]; // Intercambiar cartas aleatoriamente
        }

        this.numCartas = this.cartas.length;
    }


    numeroCartas() {
        return this.cartas.length;
    }

    daCarta() {
        do {
            if (this.cartas.length > 0) {
                this.numCartas--;
                return this.cartas.pop(); // Devuelve y elimina la última carta del mazo
            } else {
                console.log("No hay más cartas en el mazo.");
                return null;
            }
        } while (this.cartas.length == 0);

    }
}
