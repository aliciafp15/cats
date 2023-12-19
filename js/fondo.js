class Fondo{
    constructor(pais, capital, latitud, longitud){
        this.pais = pais;
        this.capital = capital;
        this.latitud = latitud;
        this.longitud = longitud;

    }

    buscaFoto() {
        // Configura la URL de la API de Flickr
        const apiKey = '87cd7336be903190374dc6fef69b087f';
        const flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search";


        const conf = {
            // method: 'flickr.photos.search',
            "api_key": apiKey,
            // tags: 'nature',
            "lat": this.latitud, 
            "lon": this.longitud,
            "format": 'json',
            radius: 10,
            // text : 'Zimbabue',
            // per_page: 3,
            "nojsoncallback": "1"

        };


        $.getJSON(flickrAPI,conf)
        .done(function (data) {
            var foto = data["photos"]["photo"][0];
            var url = "https://live.staticflickr.com/" + foto["server"] + "/" + foto["id"]
                    + "_" + foto["secret"] + "_b.jpg";


            // // establecer la imaegn paar que ocupe toda la pantalla
            // $('body').css('background-image', url)
            // .css('background-size', 'cover');

            $("body").css("background", "no-repeat url(" + url + ")  center center fixed")
                    .css('background-size', 'cover');
            console.log('se cambió el fondo')
        })
        .fail(function (error) {
            console.error('Error en la solicitud AJAX:', error);
            console.error('Error en la solicitud AJAX:', error.responseText);

        });

    }

    

}