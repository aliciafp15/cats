class Sudoku {

    cadena = "3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6";
    numFil = 9;
    numCol = 9;
    tablero = [];//array bidimensional sin inicializar

    constructor() {
        this.tablero = Array.from({ length: this.numFil }, () => Array(this.numCol));

        this.start();
    }

    /*Pone valores dentor del array bidimensional */
    start() {
        let contador = 0;

        for (let fila = 0; fila < this.numFil; fila++) {
            for (let col = 0; col < this.numCol; col++) {
                const caracter = this.cadena[contador];
                const valor = parseInt(caracter);

                // Comprobar si el caracter es numérico
                if (!isNaN(valor)) {
                    this.tablero[fila][col] = valor;
                } else {
                    this.tablero[fila][col] = 0;
                }

                contador++;
            }
        }

    }

    /*  Crea en el html los párrafos que representan las celdas del sudoku */
    createStructure() {
        // Variable para almacenar la celda actualmente clicada y asi evitar tener dos clicadas a la vez 
        let celdaClicada = null;

        const main = document.querySelector('main')
        //si selecciono una celda pero noe scribo nada, y selecciono otra, la primera a qué estado vuelve?
        for (let fila = 0; fila < this.numFil; fila++) {
            for (let col = 0; col < this.numCol; col++) {
                const valor = this.tablero[fila][col];

                const p = document.createElement('p');
                //le guardo la fila y columna para agilizra las futuras comprobaciones
                p.dataset.row = fila;
                p.dataset.column = col;
                if (valor === 0) { //no tendrá contenido --> se puede escribrir
                    p.addEventListener('click', () => {
                        if (celdaClicada) {
                            // Si ya hay una celda clicada, la vuelvo al estado inicial
                            celdaClicada.setAttribute('data-state', 'init');
                        }

                        // Almaceno la celda clicada actualmente
                        celdaClicada = p;
                        celdaClicada.setAttribute('data-state', 'clicked')
                    });
                } else {
                    p.setAttribute('data-state', 'blocked');
                    // Asignar el valor al párrafo
                    p.textContent = valor;
                }
                main.appendChild(p);
            }
        }

    }

    /*Pone dentro de cada párrafo el valor que corresponda*/
    paintSudoku() {
        this.createStructure();


    }

    /* Comprobar si el número pulsado es válido para la casilla */
    introduceNumber(numPulsado) {
        const celda = document.querySelectorAll('p[data-state="clicked"]');
        const fila = celda[0].dataset.row
        const columna = celda[0].dataset.column

        //tres comprobaciones
        if(this.hacerComprobaciones(numPulsado, fila, columna))return;


        //SI EL NÚMERO ES VÁLIDO:
        //escribir el numero
        celda[0].textContent = numPulsado
        //TAMBIEN EN EL ARRAY!
        this.tablero[fila][columna] = numPulsado

        //deshabilitar la opcion de clic quitando el manejador de eventos
        celda[0].onClick = null

        //data-state correcy
        celda[0].setAttribute('data-state', 'correct')

        //comprobar si terminó el sudoku: si tiene ceros -> es que hay huecos vacios y no acabó
        if(this.tablero.some(unaFila => unaFila.some(elemento => elemento === 0))  == false )
            alert('Terminaste el sudoku.');
    }

    hacerComprobaciones(numPulsado, fila, columna){
         // Comprueba si el número ya existe en la misma fila
         if(this.tablero[fila].includes(numPulsado)){
            alert('ya existe en la fila');
            return true;
        }
        // Comprobar si el número ya existe en la misma columna
        const columnaArray = this.tablero.map((fila) => fila[columna]);
        if (columnaArray.includes(numPulsado)) {
            alert('Ya existe en la columna.');
            return true;
        }


        // Comprobar si el número ya existe en la subcuadrícula
        const subcuadriculaFila = fila - (fila % 3);
        const subcuadriculaColumna = columna - (columna % 3);
        //recorre las 9 casillas d ela subcuadricula
        for (let i = subcuadriculaFila; i < subcuadriculaFila + 3; i++) {
            for (let j = subcuadriculaColumna; j < subcuadriculaColumna + 3; j++) {
                if (this.tablero[i][j] === numPulsado) {
                    alert('Ya existe en la subcuadrícula.');
                    return true;
                }
            }
        }
        return false
    }

}
