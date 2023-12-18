<?php
class Carrusel
{

  private $capital;
  private $pais;


  public function __construct($capital, $pais)
  {
    $this->capital = $capital;
    $this->pais = $pais;
  }


  function obtenerImagenes()
  {
      $apiKey = '87cd7336be903190374dc6fef69b087f';
      $flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
  
      $params = array(
          'api_key' => $apiKey,
          'tags' => $this->pais . ',' . $this->capital,
          'format' => 'json',
          'per_page' => 10,
          'nojsoncallback' => '1',
          'sort' => 'relevance',  // Ordenar por relevancia
      );
  
      $url = $flickrAPI . '&' . http_build_query($params);
      $respuesta = file_get_contents($url);
      $data = json_decode($respuesta, true);
  
      $carrusel = "<article data-element='carrusel'><h3>Carrusel de Zimbabue</h3>";
      foreach ($data["photos"]["photo"] as $foto) {
          $titulo = $foto["title"];
          $URLfoto = "https://live.staticflickr.com/" . $foto["server"] . "/" . $foto["id"] . "_" . $foto["secret"] . "_b.jpg";
          $img = "<img data-element='carruselImg' alt='" . $titulo . "' src='" . $URLfoto . "' />";
          $carrusel .= $img;
      }
      $carrusel .= "<button onclick='v.fotoSiguiente()' data-action='next'> > </button>
      <button data-action='prev' onclick='v.fotoAnterior()'> < </button></article>";
  
      return $carrusel;
  }
  

}

// $carrusel = new Carrusel($capital, $pais);
?>



<!DOCTYPE html>

<html lang="es">

<head>
  <!-- Datos que describen el documento -->
  <meta charset="UTF-8" />
  <title>Escritorio Virtual - Viajes</title>
  <meta name="author" content="Alicia Fernández Pushkina" />
  <meta name="description" content="aquí cada documento debe tener la  descripción del contenido concreto del mismo" />
  <meta name="keywords" content="aquí cada documento debe tener la lista de las palabras clave del mismo separadas por comas" />
  <!-- Definir la ventana gráfica -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
  <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
  <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
  <link rel="stylesheet" type="text/css" href="estilo/carrusel.css" />

  <link href="multimedia/imagenes/favicon.ico" rel="icon" />

  <!--inicio imports para el mapa dinamico-->
  <script src='https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js'></script>
  <link href='https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css' rel='stylesheet' />
  <!--fin imports para el mapa dinamico-->

  <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script> <!--jquery min-->
  <script src="js/viajes.js"></script>



</head>

<body>
  <header>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <h1>Escritorio Virtual</h1>

    <nav>
      <a accesskey="i" href="index.html" tabindex="1">Index</a>
      <a accesskey="s" href="sobremi.html" tabindex="2">Sobre mí</a>
      <a accesskey="n" href="noticias.html" tabindex="3">Noticias</a>
      <a accesskey="a" href="agenda.html" tabindex="4">Agenda</a>
      <a accesskey="m" href="metereologia.html" tabindex="5">Metereología</a>
      <a accesskey="v" href="viajes.php" tabindex="6">Viajes</a>
      <a accesskey="j" href="juegos.html" tabindex="7">Juegos</a>
    </nav>
  </header>
  <!--<main>-->


  <main>
    <h2>Viajes</h2>
    <!-- meter el carrusel -->
    <?php
    $carrusel = new Carrusel('Harare', 'Zimbabue'); //Zimbabwe 
    echo $carrusel->obtenerImagenes(); ?>

    <section id="map">
      <!-- mapa dinamico -->
    </section>


    <section>
      <h3>Carga de archivos</h3>
      <p>Carga rutasEsquema.xml para ver su contenido: </p>
      <input type="file" accept=".xml" onchange=v.procesarXml(this.files)>
    </section>

    <section>
      <p>Carga archivos KML para representar planimetría en el mapa dinámico</p>
      <input type="file" accept=".kml" onchange=v.procesarPlanimetria(this.files) multiple>

      <section id="mapPlanimetria">
        <!-- mapa dinamico para la planimetria -->
      </section>

    </section>


    <section>
      <p>Carga archivos SVG para representar altimetría en el documento</p>
      <input type="file" accept=".svg" onchange=v.procesarAltimetria(this.files) multiple>
    </section>

  </main>

  <script>
    var v = new Viajes();
  </script>
</body>

</html>