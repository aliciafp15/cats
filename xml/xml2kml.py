import xml.etree.ElementTree as ET

def convertir_xml_a_kml(archivo_xml):
    try:
        arbol = ET.parse(archivo_xml)
    except IOError:
        print('No se encuentra el archivo', archivo_xml)
        return
    except ET.ParseError:
        print("Error procesando el archivo XML =", archivo_xml)
        return

    raiz = arbol.getroot()

    # Encontrar y procesar cada ruta
    for i, ruta_element in enumerate(raiz.findall('.//{http://www.uniovi.es}ruta')):
        kml_file_name = f"ruta{i + 1}.kml"
        with open(kml_file_name, 'w') as kml_file:
            kml_file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            kml_file.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
            kml_file.write('<Document>\n')

            # Obtener nombre de la ruta
            nombre_ruta = ruta_element.attrib.get('nombreRuta')
            kml_file.write(f'<name>ruta{i+1}.LOG</name>\n')

            # Iniciar LineString
            kml_file.write('<Placemark>\n')
            kml_file.write('<LineString>\n')
            kml_file.write('<extrude>1</extrude>\n')
            kml_file.write('<tessellate>1</tessellate>\n')
            kml_file.write('<coordinates>\n')

            # Obtener coordenadas de datos
            latitud_datos = ruta_element.find('.//{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}latitud').text
            longitud_datos = ruta_element.find('.//{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}longitud').text
            altitud_datos = ruta_element.find('.//{http://www.uniovi.es}coordenadas/{http://www.uniovi.es}altitud').text

            # Escribir coordenadas de datos en el KML
            kml_file.write(f'{longitud_datos},{latitud_datos},{altitud_datos}\n')

            # Obtener coordenadas de hitos
            for hito_element in ruta_element.findall('.//{http://www.uniovi.es}hito'):
                latitud_hito = hito_element.find('.//{http://www.uniovi.es}coordenadasHito/{http://www.uniovi.es}latitud').text
                longitud_hito = hito_element.find('.//{http://www.uniovi.es}coordenadasHito/{http://www.uniovi.es}longitud').text
                altitud_hito = hito_element.find('.//{http://www.uniovi.es}coordenadasHito/{http://www.uniovi.es}altitud').text

                # Escribir coordenadas de hitos en el KML
                kml_file.write(f'{longitud_hito},{latitud_hito},{altitud_hito}\n')

            # Finalizar LineString y Placemark
            kml_file.write('</coordinates>\n')
            kml_file.write('</LineString>\n')
            kml_file.write('<Style> id="lineaRoja">\n')
            kml_file.write('<LineStyle>\n')
            kml_file.write('<color>#ff0000ff</color>\n')
            kml_file.write('<width>5</width>\n')
            kml_file.write('</LineStyle>\n')
            kml_file.write('</Style>\n')
            kml_file.write('</Placemark>\n')

            kml_file.write('</Document>\n')
            kml_file.write('</kml>')

        print(f'Se ha convertido la ruta a KML en {kml_file_name}')

def main():
    archivo_xml = input('Introduce el archivo XML de entrada: ')
    convertir_xml_a_kml(archivo_xml)

if __name__ == "__main__":
    main()
