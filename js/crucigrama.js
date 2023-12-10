class Crucigrama{

    //fácil
    cadena = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,"  +
            "20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16"
    ;
    numFil = 11;
    numCol = 9;
    init_time;// momento en el que se inicia el juego
    end_time; // momento en el que se termina el juego
    tablero = [];


    constructor(){
        this.tablero = Array.from({ length: this.numFil }, () => Array(this.numCol));//inicializa al tamaño correspondinte

        this.start();
        
    }

     /*Pone valores dentor del array bidimensional */
     start() {
        let contador = 0;
        const elementos = this.cadena.split(',');//array con el contenido de la cadena sin las comas
        
        for (let fila = 0; fila < this.numFil; fila++) {
            for (let col = 0; col < this.numCol; col++) {
                const caracter = elementos[contador];
    
                // Comprobar y asignar valores según las reglas
                switch (caracter) {
                    case '#':
                        this.tablero[fila][col] = -1;
                        break; 
                    case '.':
                        this.tablero[fila][col] = 0;
                        break; 
                    default:
                        const valor = parseInt(caracter);
                        this.tablero[fila][col] = isNaN(valor) ? caracter : valor;
                        break; 
                }
                contador++;
            }
        }
        console.log(this.tablero);
    }
    

    /* crear en el documento HTML, a través de jQuery, los párrafos que representarán las celdas del crucigrama.
    Luego  inicializa la variable init_time de la clase Crucigrama al valor de la fecha actual.*/ 
    paintMathword(){

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
                        p.setAttribute('data-state', 'clicked')
                    });
                } else {

                    if(valor === -1){
                        p.setAttribute('data-state', 'empty')
                    } else {
                        p.setAttribute('data-state', 'blocked');
                        // Asignar el valor al párrafo: operador o el valor del numero
                        p.textContent = valor;
                    }
                    
                }
                main.appendChild(p);
            }
        }

        //iniciliaza init_time
        this.init_time = new Date();

    }
}