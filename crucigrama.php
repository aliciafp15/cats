<?php
class Record
{
  private $server;
  private $user;
  private $pass;
  private $dbname;
  public $mensaje = "";
  public $tiempo;
  public  $nombreP;
  public $apellidosP;
  public $nivel;

  private $clasificacion;

  public function __construct()
  {
    $this->server = "localhost";
    $this->user = "DBUSER2023";
    $this->pass = "DBPSWD2023";
    $this->dbname = "records";
  }


  function conectarBD()
  {
    $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

    if ($db->connect_errno) {
      $this->mensaje = "Error de conexión: " . $db->connect_error;
    } else {
      $consultaPreparada = $db->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?,?,?,?);"); //consulta de creación
      $consultaPreparada->bind_param('ssss', $this->nombreP, $this->apellidosP, $this->nivel, $this->tiempo);
      //ejecutar sentencia
      $consultaPreparada->execute();
      // mostrar mensaje
      if ($consultaPreparada->affected_rows > 0) {
        $this->mensaje = "<p>Tiempo registrado</p>";
      }
      $consultaPreparada->close();
      $db->close();
    }
  }



  function mostrarRanking()
  {
    $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

    if ($db->connect_errno) {
      echo "Error de conexión: " . $db->connect_error;
    } else {
      //preparar la consulta
      $consultaPreparada = $db->prepare("SELECT * FROM registro WHERE nivel LIKE ? ORDER BY tiempo ASC;");
      $consultaPreparada->bind_param('s', $this->nivel);
      $consultaPreparada->execute();

      $resultado = $consultaPreparada->get_result();
      if ($resultado->fetch_assoc() != NULL) {
        $resultado->data_seek(0); // se posiciona al inicio del resultado de la búsqueda
        $this->clasificacion .= "<ol>";
        while ($fila = $resultado->fetch_assoc()) {
          $this->clasificacion .= "<li>" . $fila['nombre'] . " " . $fila['apellidos'] . " ~ " . $fila['nivel'] . " ~ " .$fila["tiempo"]. "</li>";
        }
        $this->clasificacion .= "</ul>";
      } //si no hay elementos en la base de datos, es que no se ha guardado ninguna persona en el formulario, por lo que no se muestra
      $consultaPreparada->close();
      $db->close();
    }
  }
  function mostrarClasificacion()
  {
    if ($this->clasificacion != "") {
      echo $this->clasificacion;
    }
  }
}
$registro = new Record();
//asegura que la consulta se ejecute solo cuando se envíe el formulario
if (count($_POST) > 0) {
  $registro->nombreP = $_POST["nombre"];
  $registro->apellidosP = $_POST["apellidos"];
  $registro->nivel = $_POST["nivel"];
  $registro->tiempo = $_POST["tiempo"];
  //conectarse y mostrar el ranking
  $registro->conectarBD();
  $registro->mostrarRanking();
}
?>

<!DOCTYPE html>

<html lang="es">

<head>
  <!-- Datos que describen el documento -->
  <meta charset="UTF-8" />
  <title>Escritorio Virtual - Crucigrama</title>
  <meta name="author" content="Alicia Fernández Pushkina" />
  <meta name="description" content="Crucigrama hecho para la seccion de juegos" />
  <meta name="keywords" content="aquí cada documento debe tener la lista de las palabras clave del mismo separadas por comas" />
  <!-- Definir la ventana gráfica -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
  <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
  <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
  <link href="multimedia/imagenes/favicon.ico" rel="icon" />
  <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script> <!--jquery min-->
  <script src="js/crucigrama.js"></script>
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

  <!--menu de juegos-->
  <section>
    <h2>Juegos</h2>
    <nav>
      <a href="memoria.html" accesskey="e" tabindex="8">Memoria</a>
      <a href="sudoku.html" accesskey="d" tabindex="9">Sudoku</a>
      <a href="crucigrama.php" accesskey="c" tabindex="10">Crucigrama</a>
      <a href="api.html" accesskey="p" tabindex="11">Reproductor de música</a>
      <a href="php/restaurante.php" accesskey="r" tabindex="12">Restaurante</a>
    </nav>
  </section>

  <main>
    <h3>Crucigrama</h3>


  </main>

  <section data-type="botonera">
    <h3>Botonera</h3>
    <button onclick="crucigrama.introduceElement(1)">1</button>
    <button onclick="crucigrama.introduceElement(2)">2</button>
    <button onclick="crucigrama.introduceElement(3)">3</button>
    <button onclick="crucigrama.introduceElement(4)">4</button>
    <button onclick="crucigrama.introduceElement(5)">5</button>
    <button onclick="crucigrama.introduceElement(6)">6</button>
    <button onclick="crucigrama.introduceElement(7)">7</button>
    <button onclick="crucigrama.introduceElement(8)">8</button>
    <button onclick="crucigrama.introduceElement(9)">9</button>
    <button onclick="crucigrama.introduceElement('*')">*</button>
    <button onclick="crucigrama.introduceElement('+')">+</button>
    <button onclick="crucigrama.introduceElement('-')">-</button>
    <button onclick="crucigrama.introduceElement('/')">/</button>
  </section>
  <!-- codigo php para mostrar la clasificación -->
  <?php echo $registro->mensaje ?>
  <?php $registro->mostrarClasificacion() ?>

  <script>
    var crucigrama = new Crucigrama()
    crucigrama.paintMathword();

    document.addEventListener("keydown", (event) => {
      const isDigit = /[0-9]/.test(event.key);
      const isOperator = ['+', '-', '*', '/'].includes(event.key);
      const isFunctionKey = /^F[0-9]+$/.test(event.key); //excluir explícitamente las teclas de función

      if ((isDigit || isOperator) && !isFunctionKey) {
        //si no hay celda seleccionada
        const selectedCell = document.querySelector('p[data-state="clicked"]');
        if (!selectedCell) {
          alert("Tienes que seleccionar una celda");
        } else {
          crucigrama.introduceElement(event.key);
        }
      }

    });
  </script>
</body>


</html>