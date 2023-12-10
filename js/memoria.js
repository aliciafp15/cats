class Memoria {
    constructor() {
        this.elements = [
            { element: "carta1_a", source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg" },
            { element: "carta1_b", source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg" },
            { element: "carta2_a", source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" },
            { element: "carta2_b", source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" },
            { element: "carta3_a", source: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg" },
            { element: "carta3_b", source: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg" },
            { element: "carta4_a", source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg" },
            { element: "carta4_b", source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg" },
            { element: "carta5_a", source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg" },
            { element: "carta5_b", source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg" },
            { element: "carta6_a", source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg" },
            { element: "carta6_b", source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg" },
        ];

        this.hasFlippedCard = false;//si ya hay una carta dada la vuelta
        this.lockBoard = false;//si el tablero se encuentra bloqueado a la interacción cdel usuario
        this.firstCard = null;// cuál es la primera carta a la que se ha dado la vuelta
        this.secondCard = null;//cuál es la segunda carta a la que se ha dado la vuelta

        this.shuffleElements()
        this.createElements();
        this.addEventListeners();

       
    }

    //baraja con el algoritmo Durstenfeld
    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }
    unflipCards(){
        this.lockBoard = true; // Bloquea el tablero

        setTimeout(() => {
            //voltea  las cartas que están bocaarriba
            this.firstCard.dataset.state = 'init';
            this.secondCard.dataset.state = 'init';

            this.resetBoard(); 
        }, 1000); // 
    }

    //reinicia el tablero
    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }
    // comprueba si las cartas volteadas son iguales
    //Si lo son--> disableCards;    si no--> unflipCards. (utilizando operador ternario)
    checkForMatch(){
        const isMatch = this.firstCard.dataset.element === this.secondCard.dataset.element;
        isMatch ? this.disableCards() : this.unflipCards();
    }

    //deshabilita las interacciones sobre las tarjetas de memoria que ya han sido emparejadas
    disableCards(){
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.resetBoard();
    }

    createElements(){
        const tablero = document.querySelector('section')
        for (const carta in this.elements) {
                const elementData = this.elements[carta];

                // Crear un nodo article por cada elemento
                const card = document.createElement('article');
                card.setAttribute('data-element', elementData.element);// valor igual al valor de la variable element extraída del JSON.

                // Encabezado de orden 3
                const h3 = document.createElement('h3');
                h3.textContent = 'Tarjeta de memoria';
                card.appendChild(h3);

                // Imagen de la tarjeta
                const img = document.createElement('img');
                img.src = elementData.source;
                img.alt = elementData.element;
                card.appendChild(img);
                //solamente se visualizará cuando la tarjeta sea clicada por el usuario y se dé la vuelta.
                 // Añadir la tarjeta al tablero de memoria
                tablero.appendChild(card);
                
        }
    }

    /* recorra todas las tarjetas creadas y provoque una llamada al método flipCard de la clase Memoria cuando se lance dicho evento.
    se debe invocar utilizando la característica bind de JavaScript de la siguiente manera: this.flipCard.bind(card, this)
    */ 
    addEventListeners(){
        const cards = document.querySelectorAll('article');
        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(card, this));
        });
    }

    /*Da la vuelta a las cartas cuando son pulsadas por le usuario*/
    flipCard(game) {
        if (this.dataset.state == 'revealed') return;
        if(game.lockBoard) return;
        if(game.firstCard != null){//Si la tarjeta pulsada por el usuario coincide con la tarjeta pulsada anteriormente como primer elemento de la pareja actual 
            var primeraCarta = game.firstCard.dataset.element
            var parejaPrimera = primeraCarta.split('_')[1];
            var segundaCarta = this.dataset.element;
            var segundaPareja = segundaCarta.split('_')[1];
            if(parejaPrimera === segundaPareja) return; //el método retorna yno hace nada más.
        }
        this.dataset.state ='flip';

        if(game.hasFlippedCard){//vigilar el clicar dos veces la misma carta
            game.secondCard=this;
            game.checkForMatch();
        } else{
            game.hasFlippedCard = true;
            game.firstCard = this;//el valor de la tarjeta actual
        }

    }

}
// // si el json está fuera de la clase, por lo que no será parte de la instancia de Memoria
//--estaba pensado para estar fuera del constrcutor, pero dentro de la clase. Porque es algo que no va a cambiar y se usa mucho
//--aun asi, me dijo que no está mal si lo tengo en el constructor.

