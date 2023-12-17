class Viajes {

    // Define un atributo para almacenar el mapa de rutas
    mapPlanimetria = null;

    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo = posicion.coords.heading;
        this.velocidad = posicion.coords.speed;
        // this.getMapaEstaticoGoogle();
        // this.initMap();
        this.getMapaEstaticoMapBox();
        this.getMapaDinamicoMapBox();
    }

    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
        }
    }


    getMapaEstaticoMapBox() {
        var apiKey = "?access_token=sk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbHE3c3U5bjkwdmdqMmtwN21qcDJqZzVxIn0.QgswFtaNfyAPAEsopDU1HQ"
        var url = "https://api.mapbox.com/styles/v1/mapbox/light-v11/static/"
        var centro = this.longitud + ',' + this.latitud + ','
        var zoom = "14"
        var tam = "/500x300"

        // Agregar el marcador a las coordenadas de tu posición
        var marcador = "pin-s-l+000(" + this.longitud + "," + this.latitud + ")/";

        // this.imagenMapa = url + centro + zoom + tam + apiKey;
        this.imagenMapa = url + marcador + centro + zoom + tam + apiKey;//con chincheta
        $("main>section").first().append("<img src='" + this.imagenMapa + "' alt='mapa estático mapbox' />");
    }

    getMapaDinamicoMapBox() {

        var lng = parseFloat(this.longitud);
        var lat = parseFloat(this.latitud)
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbGdzMnZweWowZWEyM2NvYWZkODMxZXpoIn0.ghWod73o3jm9F1lPOhfsjw';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [lng, lat], // starting position [lng, lat]
            zoom: 9, // starting zoom

        });
        // no necesito añadir el mapa al DOM si ya tengo el contenedor

        // añadir marcador de posicion
        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);
    }

    procesarXml(files) {
        const file = files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const contenidoXml = e.target.result;
                const contenidoHtml = this.parsearXmlAHtml(contenidoXml);
                $("main>article").append(contenidoHtml);
            };

            reader.readAsText(file);
        }

    }

    parsearXmlAHtml(contenidoXml) {
        const xmlDoc = $.parseXML(contenidoXml);
        const $xml = $(xmlDoc);

        let html = "";

        $xml.find("ruta").each((index, ruta) => {
            const nombreRuta = $(ruta).attr("nombreRuta");
            html += `<h3>${nombreRuta}</h3>`;

            const datos = $(ruta).find("datos");
            const tipoRuta = datos.find("tipoRuta").text();
            const transporte = datos.find("transporte").text();
            const duracion = datos.find("duracion").text();
            const agencia = datos.find("agencia").text();
            const descripcion = datos.find("descripcion").text();
            const publico = datos.find("publico").text();
            const lugarInicio = datos.find("lugarInicio").text();
            const direccionInicio = datos.find("direccionInicio").text();
            const latitudInicio = datos.find("coordenadas > latitud").text();
            const longitudInicio = datos.find("coordenadas > longitud").text();
            const altitud = datos.find("coordenadas > altitud").text();
            const referencias = datos.find("referencias").text();
            const recomendacion = datos.find("recomendacion").text();




            html += `
            <p>Tipo de Ruta: ${tipoRuta}</p>
            <p>Transporte: ${transporte}</p>
            <p>Duración: ${duracion}</p>
            <p>Agencia: ${agencia}</p>
            <p>Descripción: ${descripcion}</p>
            <p>Público: ${publico}</p>
            <p>Lugar de Inicio: ${lugarInicio}</p>
            <p>Dirección de Inicio: ${direccionInicio}</p>
            <p>Coordenadas de Inicio: (${latitudInicio}, ${longitudInicio})</p>
            <p>Altitud: ${altitud} m</p>
            <p>Referencias: ${this.enlacesClicables(referencias)}</p>
            <p>Recomendación: ${recomendacion}</p>
          `;

            $(ruta)
                .find("hito")
                .each((index, hito) => {
                    const nombreHito = $(hito).attr("nombreHito");
                    const descripcionHito = $(hito).find("descripcionHito").text();
                    const latitudHito = $(hito).find("coordenadasHito > latitud").text();
                    const longitudHito = $(hito).find("coordenadasHito > longitud").text();
                    const altitud = $(hito).find("coordenadasHito > altitud").text();
                    const distancia = $(hito).find("distancia").text();

                    const nombreFoto = $(hito).find("fotografias").text(); //nombreFoto.jpg
                    //procesar las fotografias y hacerlas adaptables:  movil(_p)/tablet(_m)/ordenador(g)
                    if (nombreFoto.trim() !== "") {//si hay fotos
                        var nombreTratado = nombreFoto.trim().split('.')[0];// me quedo solo con el nombre sin extension
                        var fotoHtml = `<picture>
                        <source srcset="multimedia/imagenes/rutas/${nombreTratado}_p.jpg" media="(max-width: 465px)" /> 
                        <source srcset="multimedia/imagenes/rutas/${nombreTratado}_m.jpg" media="(max-width: 799px)" />
                        <source srcset="multimedia/imagenes/rutas/${nombreTratado}_g.jpg" media="(min-width: 800px)" />
                        <img src="multimedia/imagenes/rutas/${nombreTratado}_g.jpg" alt="${nombreFoto}" />
                        </picture>`
                        
                    }
                    //

                    html += `
                <h4>${nombreHito}</h4>
                <p>${descripcionHito}</p>
                <p>Coordenadas del Hito: (${latitudHito}, ${longitudHito})</p>
                <p>Altitud: ${altitud} m</p>
                <p>Distancia dle hito anterior: ${distancia} m</p>
                <p>${fotoHtml}</p>
              `;
                });



        });

        return html;
    }


    enlacesClicables(referencias) {
        const enlaces = referencias.split(",");
        const listaEnlaces = enlaces.map((enlace) => `<li><a href="${enlace.trim()}" target="_blank">${enlace.trim()}</a></li>`);
        return `<ul>${listaEnlaces.join("")}</ul>`;
    }


    procesarPlanimetria(files) {

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const contenidoKML = e.target.result;
                const coordenadas = this.parsearKML(contenidoKML);

                if (coordenadas.length > 0) {
                    this.agregarRutaAlMapa(coordenadas, i);//i=idRUta
                } else {
                    console.error('El archivo KML no contiene coordenadas válidas.');
                }
            };

            reader.readAsText(file);
        }
    }

    parsearKML(contenidoKML) {
        const coordenadas = [];
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(contenidoKML, 'text/xml');

        const coordinatesNodes = xmlDoc.querySelectorAll('coordinates');

        coordinatesNodes.forEach((coordinatesNode) => {
            const coordinatesText = coordinatesNode.textContent.trim();
            const array = coordinatesText.split('\n').map((linea) => {
                const [lng, lat, alt] = linea.split(',').map(parseFloat);
                return [lng, lat, alt || 0];
            });
            coordenadas.push(...array);

        });



        return coordenadas;
    }

    agregarRutaAlMapa(coordenadas, rutaId) {
        //     //tengo que crear el nuevo mapa dinamico
        var lng = 31.0533700;//coordenadas de la capital de zimbabure, harare
        var lat = -17.8277200;
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbGdzMnZweWowZWEyM2NvYWZkODMxZXpoIn0.ghWod73o3jm9F1lPOhfsjw';

        // Crear el mapa si aún no está creado
        if (!this.mapPlanimetria) {
            this.mapPlanimetria = new mapboxgl.Map({
                container: 'mapPlanimetria',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: 5,
            });
        }

        // Esperar a que se cargue el estilo antes de agregar la capa
        this.mapPlanimetria.on('style.load', () => {
            const sourceId = `route-source-${rutaId}`;
            const layerId = `route-layer-${rutaId}`;

            // Verificar si la fuente ya existe en el mapa
            let source = this.mapPlanimetria.getSource(sourceId);

            if (!source) {
                // Agregar la fuente solo si no existe
                this.mapPlanimetria.addSource(sourceId, {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': coordenadas
                        }
                    }
                });
            } else {
                // Actualizar las coordenadas de la fuente existente
                source.setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordenadas
                    }
                });
            }

            // Verificar si la capa ya existe en el mapa
            let layer = this.mapPlanimetria.getLayer(layerId);

            if (!layer) {
                // Agregar la capa solo si no existe
                this.mapPlanimetria.addLayer({
                    'id': layerId,
                    'type': 'line',
                    'source': sourceId,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#FF0000',
                        'line-width': 8
                    }
                });
            }
        });
    }


    // representar la informacion de perfil1.svg, perfil2.svg y perfil3.svg en un mapa dinamico
    procesarAltimetria(files) {

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            var section = $("<section>").attr("data-element", "planimetria");
            reader.onload = (e) => {
                let xml = $.parseXML(reader.result);
                //version al svg para el validador
                let svg = $(xml).find("svg");
                svg.attr("version", "1.1");
                section.append(svg);
            };

            reader.readAsText(file);
        }
        $("main").append(section);
    }












}

