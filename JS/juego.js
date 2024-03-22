document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startBtn");

    let mazo;
    let jugadoresApostando = 0;
    let contBotones = 0;
    let numJugadores;

    startBtn.addEventListener("click", function () {
        numJugadores = parseInt(prompt("¿Cuántos jugadores participarán?"));

        if (numJugadores >= 4 && numJugadores <= 7) {
            mazo = new Mazo();
            mazo.barajar(); // Barajar el mazo antes de empezar el juego
            // console.log(mazo);

            iniciarJuego(numJugadores, mazo);
        } else {
            alert("El número de jugadores debe ser entre 4 y 7.");
        }
    });

    function iniciarJuego(numJugadores, mazo) {
        // document.getElementById("message").classList.add("deshabilitar");
        document.getElementById("message").style.display = "none";
        var jugadoresHandsDiv = document.querySelector(".jugadores-hands");

        crearCrupier();
        for (let i = 1; i < numJugadores + 1; i++) {
            crearJugador(i, numJugadores);
        }
    }

    function crearJugador(i, numJugadores) {
        var playerContainerDiv = document.createElement("div"); // Crear un contenedor para el jugador
        playerContainerDiv.classList.add("player-container");

        var playerHandDiv = document.createElement("div");
        playerHandDiv.id = "player-hand-" + i;
        playerHandDiv.className = "hand";

        var playerNameHeading = document.createElement("h2");
        playerNameHeading.textContent = "Jugador " + i;

        var playerCardsDiv = document.createElement("div");
        playerCardsDiv.id = "player-cards-" + i;

        var puntosJugadorParagraph = document.createElement("p");
        puntosJugadorParagraph.className = "cantidades";
        puntosJugadorParagraph.textContent = "Puntuación: ";

        var puntosJugadorSpan = document.createElement("span");
        puntosJugadorSpan.id = "player-score-" + i;
        puntosJugadorSpan.textContent = "0";
        puntosJugadorParagraph.appendChild(puntosJugadorSpan);

        var apuestaButton = document.createElement("button");
        apuestaButton.id = "apuesta-" + i;
        apuestaButton.textContent = "Apostar";

        apuestaButton.addEventListener("click", function () {
            let apuestaJugador = parseInt(prompt("¿Cuánto apostará el jugador " + i + " ?"));

            if (apuestaJugador >= 1) {
                document.getElementById("apuesta-" + i).style.display = "none";

                var textoApuesta = document.createElement("p");
                textoApuesta.className = "cantidades";
                textoApuesta.textContent = "Cantidad apostada: ";

                var cantidadApuesta = document.createElement("span");
                cantidadApuesta.id = "cantidadApuesta" + i;
                cantidadApuesta.textContent = apuestaJugador;
                textoApuesta.appendChild(cantidadApuesta);

                var contenedorBotones = document.createElement("div");
                contenedorBotones.className = "contenedorBotones";

                var hitButton = document.createElement("button");
                hitButton.id = "hit-btn-" + i;
                hitButton.classList.add("deshabilitar");
                hitButton.textContent = "Pedir Carta";
                hitButton.addEventListener("click", function () {
                    pedirCarta(playerHandDiv.id);
                });

                var standButton = document.createElement("button");
                standButton.id = "stand-btn-" + i;
                standButton.classList.add("deshabilitar");
                standButton.textContent = "Plantarse";
                standButton.addEventListener("click", function () {
                    plantarse(i);
                });

                playerHandDiv.appendChild(textoApuesta);
                playerHandDiv.appendChild(contenedorBotones);

                contenedorBotones.appendChild(hitButton);
                contenedorBotones.appendChild(standButton);

                jugadoresApostando++;
                if (jugadoresApostando == numJugadores) {
                    for (let x = 1; x <= numJugadores; x++) {
                        let jugadorId = "player-hand-" + x;
                        cartasIniciales(jugadorId);

                        document.getElementById("hit-btn-" + x).classList.remove("deshabilitar");
                        document.getElementById("stand-btn-" + x).classList.remove("deshabilitar");
                    }
                    cartasIniciales("crupier");
                    calcularPuntuacion("crupier");
                }
            } else {
                alert("Apuesta no válida");
            }
        });

        playerHandDiv.appendChild(playerNameHeading);
        playerHandDiv.appendChild(puntosJugadorParagraph);

        playerHandDiv.appendChild(apuestaButton);
        playerHandDiv.appendChild(playerCardsDiv);

        playerContainerDiv.appendChild(playerHandDiv);
        document.body.appendChild(playerContainerDiv);
    }

    function cartasIniciales(jugadorId) {
        repartirCarta(jugadorId);
        repartirCarta(jugadorId);

        var saltoDeLinea = document.createElement("br");
        var jugadorHandDiv = document.getElementById(jugadorId);
        jugadorHandDiv.appendChild(saltoDeLinea);

        if (jugadorId == "crupier") {
            document.getElementById("dealer-score").textContent = calcularPuntuacion(jugadorId);
        } else {
            document.getElementById("player-score-" + jugadorId.split("-")[2]).textContent = calcularPuntuacion(jugadorId);
        }
    }

    function crearCrupier() {
        var dealerHandDiv = document.getElementById("dealer-hand");
        dealerHandDiv.className = "card-area";
        dealerHandDiv.id = "crupier";

        var dealerNameHeading = document.createElement("h2");
        dealerNameHeading.textContent = "Crupier";

        var dealerCardsDiv = document.createElement("div");
        dealerCardsDiv.id = "dealer-cards";

        var dealerScoreParagraph = document.createElement("p");
        dealerScoreParagraph.className = "cantidades";
        dealerScoreParagraph.textContent = "Puntuación: ";

        var dealerScoreSpan = document.createElement("span");
        dealerScoreSpan.id = "dealer-score";
        dealerScoreSpan.textContent = "0";
        dealerScoreParagraph.appendChild(dealerScoreSpan);

        dealerHandDiv.appendChild(dealerNameHeading);
        dealerHandDiv.appendChild(dealerScoreParagraph);
        dealerHandDiv.appendChild(dealerCardsDiv);

    }

    function turnoCrupier() {
        var dealerScore = calcularPuntuacion("crupier"); // Calcular la puntuación actual del crupier

        while (dealerScore < 17) {
            repartirCarta("crupier");
            dealerScore = calcularPuntuacion("crupier");
        }
        calcularPuntuacion("crupier");
        alert("El Crupier se planta");

        resultados();
    }

    function pedirCarta(jugadorId) {
        repartirCarta(jugadorId);
        calcularPuntuacion(jugadorId);
    }

    function repartirCarta(idMano) {
        let mano = document.getElementById(idMano);

        if (mazo.numCartas > 0) {
            let carta = mazo.daCarta(); // Coger una carta del mazo
            agregarCartaAMano(carta, mano);
        } else {
            console.log("No quedan cartas en el mazo.");
        }
    }

    function agregarCartaAMano(carta, mano) {
        let cartaHTML = document.createElement("div");
        cartaHTML.className = "card";
        cartaHTML.textContent = carta;

        mano.appendChild(cartaHTML);
    }

    function plantarse(jugadorId) {
        // alert("plantarse");
        contBotones += 1;
        // console.log(contBotones);

        document.getElementById("hit-btn-" + jugadorId).classList.add("deshabilitar");
        document.getElementById("stand-btn-" + jugadorId).classList.add("deshabilitar");

        if (contBotones === numJugadores) {
            document.dispatchEvent(new Event('turnoCrupier'));
            turnoCrupier();
        }
    }

    function calcularPuntuacion(jugadorId) {
        let mano = document.getElementById(jugadorId);
        let cartas = mano.querySelectorAll(".card");
        let puntuacion = 0;
        let ases = 0;

        cartas.forEach(function (carta) {
            let valor = carta.textContent.charAt(0);

            if (valor === '1') {
                valor = 10;
            }

            if (valor === 'A') {
                valor = "As";
            }

            if (valor === "J" || valor === "Q" || valor === "K") {
                puntuacion += 10;
            } else if (valor === "As") {
                puntuacion += 11;
                ases++;
            } else {
                let parsedValue = parseInt(valor);

                if (!isNaN(parsedValue)) {
                    puntuacion += parsedValue;
                } else {
                    return; // Salimos del forEach
                }
            }
        });

        // Cuando tenemos más de 21 puntos y ases
        while (puntuacion > 21 && ases > 0) {
            puntuacion -= 10;
            ases--;
        }

        if (jugadorId == "crupier") {
            document.getElementById("dealer-score").textContent = puntuacion;
        } else {
            document.getElementById("player-score-" + jugadorId.split("-")[2]).textContent = puntuacion;

            if (puntuacion > 21) {
                document.getElementById("hit-btn-" + jugadorId.split("-")[2]).classList.add("deshabilitar");
                document.getElementById("stand-btn-" + jugadorId.split("-")[2]).classList.add("deshabilitar");

                alert("El " + jugadorId + " se ha pasado por " + (puntuacion - 21) + " puntos");
                contBotones += 1;

                if (contBotones === numJugadores) {
                    document.dispatchEvent(new Event('turnoCrupier'));
                    turnoCrupier();
                }
            }
        }
        return puntuacion;
    }

    function resultados() {
        const crupierScore = parseInt(document.getElementById("dealer-score").textContent);

        const jugadores = document.querySelectorAll(".hand");
        const perdedores = [];
        let totalGanado = 0;

        jugadores.forEach(function (player) {
            const jugadorId = player.id.split("-")[2];
            const puntosJugador = parseInt(document.getElementById("player-score-" + jugadorId).textContent);
            const cantidadApuesta = parseInt(document.getElementById("cantidadApuesta" + jugadorId).textContent);

            if (puntosJugador > 21 || (puntosJugador < crupierScore && crupierScore <= 21)) {
                // El jugador ha perdido
                perdedores.push(jugadorId);
            } else if (puntosJugador > crupierScore || crupierScore > 21) {
                // El jugador ha ganado
                totalGanado += cantidadApuesta;
            }
        });

        if (totalGanado > 0) {
            const cantidadPorGanador = totalGanado / (jugadores.length - perdedores.length);

            jugadores.forEach(function (player) {
                const jugadorId = player.id.split("-")[2];
                if (!perdedores.includes(jugadorId)) {
                    const cantidadApuesta = parseInt(document.getElementById("cantidadApuesta" + jugadorId).textContent);
                    const ganancias = cantidadPorGanador * cantidadApuesta;
                    alert("El jugador " + jugadorId + " ha ganado $" + ganancias);

                }
            });
        }

        perdedores.forEach(function (perdedor) {
            const playerName = "Jugador " + perdedor;
            alert(playerName + ", has perdido");
        });

        document.getElementById("btnRestart").style.display = "block";
        document.getElementById("btnRestart").addEventListener("click", function () {
            window.location.reload();
        });
    }
});