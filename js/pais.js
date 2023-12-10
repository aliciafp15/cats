class Pais {
   

    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
    }

    rellenarAtributos(gobierno, latitud, longitud, religion) {
        this.gobierno = gobierno;
        this.latitud = latitud;
        this.longitud = longitud;
        this.religion = religion;
    }

    getNombre() {
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    getInfoSecundaria() {
        return "<ul><li>" +"Población: "+ this.poblacion + "</li><li>" + this.gobierno +  "</li><li>" + this.religion +"</li></ul>";
    }

    escribeCoordenadas(){
        document.write(`<p>${this.latitud}  , ${this.longitud}</p>`);
    }

    // previsión del tiempo en la capital del país para los próximos 5 días.
    //b devuelva la información del tiempo en formato JSON y con unidades de medida del sistema métrico
    mirarTiempo() {
        const apiKey = '533fd228654cbc50777660297ddc9c40'; // 
        const url = `http://api.openweathermap.org/data/2.5/forecast?q=${this.capital}&units=metric&appid=${apiKey}`;
    
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                const filteredList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    
                const article = $('<article>').attr('data-name', 'meteo');
    
                filteredList.forEach(item => {
                    // Crear un bloque section para cada día
                    const daySection = $('<section>');
    
                    // Obtener los valores requeridos y asignar 0 si rain no está presente
                    const tempMax = item.main.temp_max || 0;
                    const tempMin = item.main.temp_min || 0;
                    const humidity = item.main.humidity || 0;
                    const rain = item.rain ? item.rain['3h'] : 0;
    
                    // Obtener la URL base para los iconos y agregar el nombre del icono
                    const iconUrlBase = 'http://openweathermap.org/img/wn/';
                    const iconUrl = `${iconUrlBase}${item.weather[0].icon}.png`;
    
                    // Agregar elementos al bloque del día
                    daySection.html(`
                        <p>Temp. Máxima: ${tempMax}°C</p>
                        <p>Temp. Mínima: ${tempMin}°C</p>
                        <p>Humedad: ${humidity}%</p>
                        <p>Lluvia: ${rain} mm</p>
                        <img src="${iconUrl}" alt="Icono del tiempo">
                    `);
    
                    article.append(daySection);
                });
    
                $('body').append(article);
                console.log(filteredList);
            },
            error: function(error) {
                console.error(error);
            }
        });
    }

}
