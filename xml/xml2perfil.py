import xml.etree.ElementTree as ET



def generar_svg(archivo_xml, archivo_svg):
    try:
        arbol = ET.parse(archivo_xml)
    except IOError:
        print('No se encuentra el archivo', archivo_xml)
        return
    except ET.ParseError:
        print("Error procesando el archivo XML =", archivo_xml)
        return

    raiz = arbol.getroot()

    # Crear el archivo SVG
    with open(archivo_svg, 'w') as svg_file:
        svg_file.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
        svg_file.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n')
        svg_file.write('<polyline points="\n')

        for ruta_element in raiz.findall('.//{http://www.uniovi.es}ruta'):
            for hito_element in ruta_element.findall('.//{http://www.uniovi.es}hito'):
                distancia = hito_element.find('.//{http://www.uniovi.es}distancia').text
                altitud = hito_element.find('.//{http://www.uniovi.es}altitud').text

                # Escribir las coordenadas (distancia, altitud) en el SVG
                svg_file.write(f" {distancia},{altitud}\n")

        # Cerrar la etiqueta polyline y agregar el estilo
        svg_file.write(' style="fill:white;stroke:red;stroke-width:4" />\n')
        svg_file.write('</svg>')

    print(f'Se ha generado el archivo SVG en {archivo_svg}')

def main():
    archivo_xml = input('Introduce el archivo XML de entrada: ')
    archivo_svg = input('Introduce el nombre del archivo SVG de salida: ')
    generar_svg(archivo_xml, archivo_svg)

if __name__ == "__main__":
    main()
