class Crucigrama {

    facil = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=," +
        "20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16"
        ;

    medio = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.," +
        "=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";

    dificil = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.," +
        "=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";

    numFil = 11;
    numCol = 9;
    init_time;// momento en el que se inicia el juego
    end_time; // momento en el que se termina el juego
    tablero = new Array();
    cadena = this.facil // cambiar nivel aqui


    constructor() {
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
    paintMathword() {
        //reiniciamos el crucigrama, comentado porque me borra el h3
       // $("main").empty();

        //si selecciono una celda pero noe scribo nada, y selecciono otra, la primera a qué estado vuelve?
        for (let fila = 0; fila < this.numFil; fila++) {
            for (let col = 0; col < this.numCol; col++) {
                const valor = this.tablero[fila][col];
                const nuevaCelda = $("<p></p>");
                nuevaCelda.attr("data-fila", fila);
                nuevaCelda.attr("data-col", col);


                if (valor === 0) { //no tendrá contenido --> se puede escribrir
                    $("main").append(nuevaCelda);
                    nuevaCelda.on("click", (event) => {
                        this.hacerClick(nuevaCelda, fila, col);

                    });


                } else {

                    if (valor === -1) {
                        $("main").append(nuevaCelda);
                        $("main>p:last").attr("data-state", "empty");
                    } else {
                        const aux = $("<p>" + valor + "</p>");

                        aux.attr("data-fila", fila);
                        aux.attr("data-col", col);
                        $("main").append(aux);
                        $("main>p:last").attr("data-state", "blocked");

                    }

                }
            }
        }

        //iniciliaza init_time
        this.init_time = new Date();

    }

    hacerClick(nuevaCelda, fila, col) {
        // Eliminar el estado "clicked" de todas las celdas
        $("main>p[data-state='clicked']").removeAttr("data-state");
       
        const currentState = nuevaCelda.attr("data-state");
        //vigila no clicar de nuevo una celda ya corregida
        if (currentState !== "correct") {
            nuevaCelda.attr("data-state", "clicked");
            nuevaCelda.attr("data-fila", fila);
            nuevaCelda.attr("data-col", col);
            console.log("Celda clicada:", fila, col);
        }
    }



    /* comprueba si se ha completado el crucigrama, buscando elementos del array del tablero que estén al valor cero; 
        si los encuentra, devuelve falso y en caso de no encontrarlos devuelve verdadero */
    check_win_condition() {
        for (let i = 0; i < this.numFil; i++) {
            for (let j = 0; j < this.numCol; j++) {
                if (this.tablero[i][j] === 0)
                    return false;
            }

        }
        return true;

    }

    /** cuenta con los valores de las variables init_time y end_time para obtener el tiempo total invertido en resolver el crucigrama 
     * y lo devuelve como una cadena de texto. 
     * formato de devolución de este método debe ser del tipo horas:minutos:segundos.*/
    calculate_date_difference() {
        var tiempo = this.end_time - this.init_time;

        var horas = Math.floor(tiempo / ((1000 * 60) * 60));
        tiempo = tiempo - (horas * ((1000 * 60) * 60));

        var minutos = Math.floor(tiempo / (1000 * 60));
        tiempo = tiempo - (minutos * (1000 * 60));

        var segundos = Math.floor(tiempo / 1000);

        var resultado = (horas / 10 >= 1.0 ? horas : "0" + horas) + ":" +
            (minutos / 10 >= 1.0 ? minutos : "0" + minutos) + ":" +
            (segundos / 10 >= 1.0 ? segundos : "0" + segundos);
        console.log(resultado);
    
        return resultado;

    }


    /** debe comprobar si el valor pulsado está permitido (es un número o un operador aritmético) y si
        es válido para la casilla que está seleccionada. */
    introduceElement(teclaPulsada) {


        var expression_row = true;
        var expression_col = true;
        var clicada = $('p[data-state="clicked"]');
        var posI = clicada[0].dataset.fila;
        var posJ = clicada[0].dataset.col;
        this.tablero[posI][posJ] = teclaPulsada;

        //comprobaciones
        var expression_row = this.checkHorizontal(posI, posJ);
        var expression_col = this.checkVertical(posI, posJ);


        // Mostramos el elemento en pantalla o no
        var posI = clicada[0].dataset.fila;
        var posJ = clicada[0].dataset.col;

        if (expression_row && expression_col) {
            clicada.text(teclaPulsada);// Mostramos el valor introducido
            clicada.attr("data-state", "correct");

        } else {
            this.tablero[posI][posJ] = 0;
            clicada.removeAttr("data-state"); // deja de estar seleccionada 
            alert("Elemento introducido no correcto");
        }



        //comprobar final del crucigrama
        if(this.check_win_condition()){
            //iniciar endtime
            this.end_time = new Date();

            //conocer el tiempo que tardó
            var tiempoFinal = this.calculate_date_difference();

            //avisar al usuario
            alert("El juego ha terminado!!. Duración: " + tiempoFinal)
        }


    }





    checkHorizontal(posI, posJ) {
        var expression_row = true;
        var first_number = 0;
        var second_number = 0;
        var expression = 0;
        var result = 0;

        posJ++;
        if (posJ < this.numCol) {
            if (this.tablero[posI][posJ] != -1) {
                do {
                    if (this.tablero[posI][posJ] === "=") {
                        first_number = this.tablero[posI][posJ - 3];
                        second_number = this.tablero[posI][posJ - 1];
                        expression = this.tablero[posI][posJ - 2];
                        result = this.tablero[posI][posJ + 1];
                        break;
                    }

                    posJ++;

                    if (posJ >= this.numCol)
                        break;

                } while (this.tablero[posI][posJ] != -1)
            }
        }

        if (first_number != 0 && second_number != 0 && expression != 0 && result != 0) {
            var expr = [first_number, expression, second_number];
            var resEval;
            try {
                resEval = eval(expr.join(''));
                if (resEval != result)
                    expression_row = false;
            } catch (error) {
                expression_row = false;
            }
        }

        return expression_row;
    }



    checkVertical(posI, posJ) {
        var expression_col = true;
        var first_number = 0;
        var second_number = 0;
        var expression = 0;
        var result = 0;

        posI++;
        if (posI < this.numCol) {
            if (this.tablero[posI][posJ] != -1) {
                do {
                    if (this.tablero[posI][posJ] === "=") {
                        first_number = this.tablero[posI - 3][posJ];
                        second_number = this.tablero[posI - 1][posJ];
                        expression = this.tablero[posI - 2][posJ];
                        result = this.tablero[posI + 1][posJ];
                        break;
                    }

                    posI++;

                    if (posI >= this.numFil)
                        break;

                } while (this.tablero[posI][posJ] != -1)
            }
        }

        if (first_number != 0 && second_number != 0 && expression != 0 && result != 0) {
            var expr = [first_number, expression, second_number];
            var resEval;
            try {
                resEval = eval(expr.join(''));
                if (resEval != result)
                    expression_col = false;
            } catch (error) {
                expression_col = false;
            }
        }

        return expression_col;
    }




}