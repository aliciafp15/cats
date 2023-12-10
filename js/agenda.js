class Agenda{


    constructor(){
        this.apiURL = 'http://ergast.com/api/f1/current'//info de las carreras de la temp en curso
        this.last_api_call = null; //momento temporal de la última petición a la API
        this.last_api_result = null; //última respuesta que ha dado la API a la consulta en cuestión (EN XML)
        this.intervalo = 10;
    }

    /** realizar la consulta de la información sobre las carreras de la presente temporada. 
     * Una vez obtenida la información de las carreras, el método debe recorrer dicha información y
        crear una estructura de elementos en el html que permita visualizar la información de cada una
        de las carreras de la temporada. Como mínimo se debe mostrar: 
        Nombre de la carrera
        • Nombre del circuito donde se celebra
        • Coordenadas del circuito
        • Fecha y hora de la carrera
    */
    verCarreras(){
        
         // Comprobar si ha pasado el intervalo de tiempo desde la última llamada
        const ahora = new Date();
        const self = this;// Almacenar la referencia a esta clase
         if ( this.last_api_call !== null && (ahora - this.last_api_call) / (1000 * 60) < this.intervalo) {
             return this.last_api_result;// No ha pasado el intervalo de tiempo, devolver la última respuesta almacenada
         }

         // Realizar la solicitud AJAX a la API en formato XML
        $.ajax({
            url: this.apiURL,
            method: 'GET',
            dataType: 'xml',
            success: function (data) {
                // Almacenar la última llamada a la API y la respuesta
                self.last_api_call = ahora; 
                self.last_api_result = data;
                //Presentación del archivo XML en modo texto
                //$("h5").text((new XMLSerializer()).serializeToString(data));
                console.log(data)

                const section = $('<section>');
               

                $(data).find('Race').each((index, race) => {  
                    var raceName = $(race).find('RaceName').text();
                    var circuitName = $(race).find('CircuitName').text();
                    var date = $(race).find('Date').first().text()//seleccionar solo fecha y hora donde se realiza la carrera
                    var time = $(race).find('Time').first().text();
                    var horaBonita = time.substring(0, 5);; // Formatear la hora a 'hh:mm'
                    //faltan las coordenadas del circuito
                    var location = $(race).find('Location').text();
                    var lat = $(race).find('Location').attr('lat'); // Selecciona la latitud
                    var long = $(race).find('Location').attr('long'); // Selecciona la longitud

                    const article = $('<article>');
                    article.html('<h3>' + raceName + "</h3><p>" + circuitName + "</p><p>(" + lat + ',' + long 
                        +  ")</p><p>" + date +   ", " + horaBonita + "</p>");
                    section.append(article);
                });
                $('main').append(section);
                
            },
            error: function (error) {
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    }

}