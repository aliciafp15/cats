<?php
class Restaurante
{
    private $server;
    private $user;
    private $pass;
    private $dbname;
    public $mensaje = "";

    public $menu = "";


    public function __construct()
    {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "restaurante";
    }


    function init()
    {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        if ($db->connect_errno) {
            $this->mensaje = "Error de conexión: " . $db->connect_error;
        } else {
            // Crear la base de datos si no existe
            $sql_create_db = "CREATE DATABASE IF NOT EXISTS " . $this->dbname;
            if ($db->query($sql_create_db) === TRUE) {
                $this->mensaje .= "Base de datos creada exitosamente.";
            } else {
                $this->mensaje .= "Error al crear la base de datos: " . $db->error;
            }

            // Seleccionar la base de datos
            mysqli_select_db($db, $this->dbname);

            // Leer el contenido del archivo creacion.sql
            $sqlFile = file_get_contents('creacion.sql');

            // Ejecutar el contenido del archivo SQL (creación de tablas)
            if ($db->multi_query($sqlFile)) {
                $this->mensaje .= "Tablas creadas exitosamente.";
            } else {
                $this->mensaje .= "Error al crear las tablas: " . $db->error;
            }
            // echo ($this->mensaje);

            // Cerrar la conexión
            $db->close();
        }
    }


    // importar csv
    public function importarCSV($archivo)
    {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $selectedTabla = "";
        ini_set("auto_detect_line_endings", true);
        if (($handle = fopen($archivo, 'r')) !== false) {
            // Leer los datos del archivo CSV e insertarlos en las tablas
            while (($fila = fgetcsv($handle, 2000, ",")) !== false) {
                // Verificar a qué tabla pertenece la fila
                $tabla = $fila[0];
                if ($tabla == 'categoria_id') {
                    $selectedTabla = "categorias_menu";
                } else if ($tabla == 'elemento_id') {
                    $selectedTabla = "elementos_menu";
                } else if ($tabla == 'elemento_orden_id') {
                    $selectedTabla = "elementos_orden";
                } else if ($tabla == 'orden_id') {
                    $selectedTabla = "ordenes";
                } else if ($tabla == 'restaurante_id') {
                    $selectedTabla = "restaurantes";
                } else {
                    switch ($selectedTabla) {
                        case "categorias_menu":
                            $stmt = $db->prepare('INSERT INTO categorias_menu (categoria_id,nombre_categoria) VALUES (?,?)');
                            $stmt->bind_param('ss', $fila[0], $fila[1]);
                            $stmt->execute();
                            // if ($stmt->error) {
                            //     echo "Error de MySQL: " . $stmt->error;
                            // }
                            $stmt->close();
                            break;
                        case "elementos_menu":
                            $stmt = $db->prepare('INSERT INTO elementos_menu (elemento_id,nombre_elemento, precio, categoria_id) VALUES (?, ?, ?,?)');
                            $stmt->bind_param('ssss', $fila[0], $fila[1], $fila[2], $fila[3]);
                            $stmt->execute();
                            // if ($stmt->error) {
                            //     echo "Error de MySQL: " . $stmt->error;
                            // }
                            // $stmt->close();
                            break;
                        case "elementos_orden":
                            $stmt = $db->prepare('INSERT INTO elementos_orden (elemento_orden_id,orden_id, elemento_id, cantidad, subtotal) VALUES (?, ?, ?, ?,?)');
                            $stmt->bind_param('sssss', $fila[0],  $fila[1],  $fila[2], $fila[3], $fila[4]);
                            $stmt->execute();
                            // if ($stmt->error) {
                            //     echo "Error de MySQL: " . $stmt->error;
                            //     var_dump($fila);
                            // }
                            $stmt->close();
                            break;
                        case "ordenes":
                            $stmt = $db->prepare('INSERT INTO ordenes (orden_id,restaurante_id, numero_mesa, fecha, importe_total) VALUES (?, ?, ?, ?,?)');
                            $stmt->bind_param('sssss', $fila[0], $fila[1], $fila[2], $fila[3], $fila[4]);
                            $stmt->execute();
                            // if ($stmt->error) {
                            //     echo "Error de MySQL: " . $stmt->error;
                            //     var_dump($fila);
                            // }
                            $stmt->close();
                            break;
                        case "restaurantes":
                            $stmt = $db->prepare('INSERT INTO restaurantes (restaurante_id,nombre, direccion, telefono) VALUES (?, ?, ?,?)');
                            $stmt->bind_param('ssss', $fila[0], $fila[1], $fila[2], $fila[3]);
                            $stmt->execute();
                            // if ($stmt->error) {
                            //     echo "Error de MySQL: " . $stmt->error;
                            // }
                            $stmt->close();
                            break;
                    }
                }
            }
            $db->close();
            // Cerrar el archivo CSV
            fclose($handle);
        } else {
            $this->mensaje .= "Error al abrir el archivo CSV";
        }
    }


    // manejar el importat .csv aqui
    public function exportarCSV()
    {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        $csvFile = 'salida.csv';
        // Establecer encabezados para la descarga
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $csvFile . '"');
        // Abrir el archivo CSV para escritura
        $file = fopen('php://output', 'w');

        // Exportar datos de la tabla restaurantes
        fputcsv($file, array('restaurante_id', 'nombre', 'direccion', 'telefono'));
        $query_restaurantes = "SELECT * FROM restaurantes";
        $result_restaurantes = $db->query($query_restaurantes);
        if ($result_restaurantes->num_rows > 0) {
            // Datos
            while ($row = $result_restaurantes->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }

        // Exportar datos de la tabla categorias_menu
        fputcsv($file, array('categoria_id', 'nombre_categoria'));
        $query_categorias_menu = "SELECT * FROM categorias_menu";
        $result_categorias_menu = $db->query($query_categorias_menu);
        if ($result_categorias_menu->num_rows > 0) {
            // Datos
            while ($row = $result_categorias_menu->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }

        // Exportar datos de la tabla elementos_menu
        fputcsv($file, array('elemento_id', 'nombre_elemento', 'precio', 'categoria'));
        $query_elementos_menu = "SELECT * FROM elementos_menu";
        $result_elementos_menu = $db->query($query_elementos_menu);
        if ($result_elementos_menu->num_rows > 0) {

            while ($row = $result_elementos_menu->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
        // Exportar datos de la tabla ordenes
        fputcsv($file, array('orden_id', 'restaurante_id', 'numero_mesa', 'fecha', 'importe_total'));
        $query_ordenes = "SELECT * FROM ordenes";
        $result_ordenes = $db->query($query_ordenes);
        if ($result_ordenes->num_rows > 0) {

            // Datos
            while ($row = $result_ordenes->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
        // Exportar datos de la tabla elementos_orden
        fputcsv($file, array('elemento_orden_id', 'orden_id', 'elemento_id', 'cantidad', 'subtotal'));
        $query_elementos_orden = "SELECT * FROM elementos_orden";
        $result_elementos_orden = $db->query($query_elementos_orden);
        if ($result_elementos_orden->num_rows > 0) {
            // Datos
            while ($row = $result_elementos_orden->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }


        // Cerrar el archivo y la conexión a la base de datos
        fclose($file);
        $db->close();
        exit;
    }




    public function verMenus()
{
    $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

    // Consulta: elementos del menú por categoría
    $query = "SELECT c.nombre_categoria, e.nombre_elemento, e.precio
              FROM categorias_menu c
              JOIN elementos_menu e ON c.categoria_id = e.categoria_id
              ORDER BY c.nombre_categoria, e.nombre_elemento";

    $result = $db->query($query);
    $elementosMenuPorCategoria = "";

    if ($result->num_rows > 0) {
        $currentCategoria = "";
        $elementosMenuPorCategoria .= "<section data-element='menu'><h3>Menu</h3>";

        while ($row = $result->fetch_assoc()) {
            // Si cambiamos de categoría, imprimir el encabezado
            if ($currentCategoria != $row["nombre_categoria"]) {
                // Cerrar la lista anterior si no es la primera categoría
                if ($currentCategoria != "") {
                    $elementosMenuPorCategoria .= "</ul>";
                }
                $currentCategoria = $row["nombre_categoria"];
                $elementosMenuPorCategoria .= "<h4>{$currentCategoria}</h4><ul>";
            }

            // Imprimir cada elemento de la categoría
            $elementosMenuPorCategoria .= "<li>{$row["nombre_elemento"]} {$row["precio"]}€</li>";
        }

        // Cerrar la última lista
        $elementosMenuPorCategoria .= "</ul></section>";
    } else {
        $elementosMenuPorCategoria .= "<p>No hay elementos de menú disponibles.</p>";
    }

    $db->close();
    $this->menu = $elementosMenuPorCategoria;
    return $elementosMenuPorCategoria;
}

}
$restaurante = new Restaurante();
// el post para init
if (isset($_POST['init'])) {
    //crea la BD y las tablas, si existen las borra y vuelve a crear
    $restaurante->init();
}

// el post para importar el csv
if (isset($_POST['importarCSV'])) {
    // crear la bd
    // $restaurante->init();
    // leer csv y rellenar bd
    $restaurante->importarCSV($_FILES['importarCSV']['tmp_name']);
}

// manejar el exportar .csv aqui
// el post para importar el csv
if (isset($_POST['exportarCSV'])) {
    // leer bd y rellenar csv
    $restaurante->exportarCSV();
}

//ver menus
if (isset($_POST['verMenus'])) {
    // leer bd y rellenar csv
    $restaurante->verMenus();
}
?>

<!DOCTYPE html>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Escritorio Virtual - Index</title>
    <meta name="author" content="Alicia Fernández Pushkina" />
    <meta name="description" content="documento inicial del Escritorio Virtual" />
    <meta name="keywords" content="aquí cada documento debe tener la lista de las palabras clave del mismo separadas por comas" />
    <!-- Definir la ventana gráfica -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/restaurante.css" />
    <link href="../multimedia/imagenes/favicon.ico" rel="icon" />
</head>

<body>
    <header>
        <!-- Datos con el contenidos que aparece en el navegador -->
        <h1>Escritorio Virtual</h1>

        <nav>
            <a accesskey="i" href="../index.html" tabindex="1">Index</a>
            <a accesskey="s" href="../sobremi.html" tabindex="2">Sobre mí</a>
            <a accesskey="n" href="../noticias.html" tabindex="3">Noticias</a>
            <a accesskey="a" href="../agenda.html" tabindex="4">Agenda</a>
            <a accesskey="m" href="../metereologia.html" tabindex="5">Metereología</a>
            <a accesskey="v" href="../viajes.php" tabindex="6">Viajes</a>
            <a accesskey="j" href="../juegos.html" tabindex="7">Juegos</a>
        </nav>
    </header>

    <!--menu de juegos-->
    <section>
        <h2>Juegos</h2>
        <nav>
            <a href="../memoria.html" accesskey="e" tabindex="8">Memoria</a>
            <a href="../sudoku.html" accesskey="d" tabindex="9">Sudoku</a>
            <a href="../crucigrama.php" accesskey="c" tabindex="10">Crucigrama</a>
            <a href="../api.html" accesskey="p" tabindex="11">Reproductor de música</a>
            <a href="restaurante.php" accesskey="r" tabindex="12">Restaurante</a>
        </nav>
    </section>
    <main>
        <h3>Restaurante</h3>

        <form action="#" method="post">
            <label for="init">Crear BD o resetear</label>
            <input id="init" type="submit" name="init" value="Aceptar"></input>
        </form>

        <form action="#" method="post" enctype="multipart/form-data">
            <label for="importarCSV">Importar datos</label>
            <input id="importarCSV" name="importarCSV" type="file" accept=".csv" />
            <input type="submit" name="importarCSV" value="Importar">
        </form>

        <form action="#" method="post">
            <label for="exportarCSV">Exportar datos</label>
            <input id="exportarCSV" type="submit" name="exportarCSV" value="Exportar"></input>
        </form>

        <form action="#" method="post">
            <label for="verMenus">Ver menus</label>
            <input id="verMenus" type="submit" name="verMenus" value="Buscar"></input>
        </form>

        <?php
        echo ($restaurante->menu);

        ?>



    </main>



</body>

</html>