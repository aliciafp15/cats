class Noticias {

    /** Comprueba si el navegador en uso está soportando el uso de la API file */
    constructor() {
        // Version 1.1 23/10/2021 
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            //El navegador soporta el API File
        }
        else document.write("<p>Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");

    }

    /** Lectura del fichero noticias.txt, linea a linea, y escribe en html */
    readInputFile(files) {
        //Solamente toma un archivo
        //var archivo = document.getElementById("archivoTexto").files[0];
        var archivo = files[0];
        console.log(archivo)
        //Solamente admite archivos de tipo texto
        var tipoTexto = /text.*/;


        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = (evento) => {
                this.escribirNoticias(lector.result);
                //añadir su propia noticia
                this.redactarNoticiasPropias();
            }


            lector.readAsText(archivo);
        }
        else {
            alert("Solo valen .txt")
        }
    }


    escribirNoticias(texto) {
        var noticias = texto.split("\n"); //divide las noticias

        var i = 0;
        for (i; i < noticias.length; i++) {//recorre una  una

            var noticia = noticias[i];
            var info = noticia.split("_");
            var titulo = info[0];
            var subtitulo = info[1];
            var contenido = info[2];
            var autor = info[3];

            // cada noticia es un Article
            var article = $("<article></article>");
            article.append("<h3>" + titulo + "</h3>");
            article.append("<h4>" + subtitulo + "</h4>");
            article.append("<p>" + contenido + "</p>");
            article.append("<p>" + autor + "</p>");

            // Si ya hay noticias lo añadimos despues
            if ($("main>article:last")[0])
                $("main>article:last").after(article)
            else // la primera
                $("main>input").after(article)
        }


    }
    redactarNoticiasPropias() {
        // Sección para la nueva noticia
        $("main").append("<section></section>");
    
        // Añadir elementos a la sección
        $("main>section:last")
            .append("<h3>Nueva noticia</h3>")
            .append("<p><label for='titulo'>Titulo:</label> <input type='text' id='titulo' placeholder='Inserte el titulo' required></p>")
            .append("<p><label for='subtitulo'>Subtitulo:</label> <input type='text' id='subtitulo' placeholder='Inserte el subtitulo' required></p>")
            .append("<p><label for='contenidoNoticia'>Contenido:</label> <textarea id='contenidoNoticia' name='contenidoNoticia' required></textarea></p>")
            .append("<p><label for='autor'>Autor:</label> <input type='text' id='autor' placeholder='Inserte el autor' required></p>")
            .append("<button type='button'>Añadir</button>")
            .find("button") // Busca el último botón dentro de la sección
            .on("click", () => this.incluirNuevaNoticiaHTML());
    }
    


    incluirNuevaNoticiaHTML() {
        // Obtener valores de los inputs
        var titulo = $("main>section:last>p:first input").val();
        var subtitulo = $("main>section:last>p:nth-of-type(2) input").val();
        var contenido = $("textarea").val();
        var autor = $("main>section:last>p:last input").val();

        // Validar campos
        if (!titulo || !subtitulo || !contenido || !autor) {
            alert("Todos los campos son obligatorios. Por favor, complete la información.");
            return;
        }

        // Crear y agregar la nueva noticia al HTML
        var noticiaArticle = $("<article></article>")
            .append("<h3>" + titulo + "</h3>")
            .append("<h4>" + subtitulo + "</h4>")
            .append("<p>" + contenido + "</p>")
            .append("<p>" + autor + "</p>");

        $("main>article:last").after(noticiaArticle)

    }



}