import xml.etree.ElementTree as ET

# xml2kml.py
# -*- coding: utf-8 -*-
# Procesado de archivo de rutas XML y generación de un archivo KML (Keyhole Markup Language)
# Versión 1.0 07/Noviembre/2023
# Alicia Fernández Pushkina - UO275727

ultimo=""

#ajustes en la gráfica con el -10
def toTexto(altura, distanciaTotal): 
    if(distanciaTotal==10):
        resultado =  str(distanciaTotal) + ",-10"
        global ultimo
        ultimo = '\n' + str(distanciaTotal) + ",-10"
    else:
        resultado = '\n' + str(distanciaTotal) + ",-" + str(altura)
    return resultado   



def prologoSVG(archivo, alturaMax, distanciaTotal):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
    line = '<svg viewBox="0 -' + str(alturaMax) + ' ' + str(distanciaTotal) + ' ' + str(alturaMax+500) + '"\n'
    archivo.write(line)
    archivo.write('xmlns="http://www.w3.org/2000/svg" version="2.0">\n')
    archivo.write('<polyline points=\n"')

def epilogoSVG(archivo, diccionarioTexto, alturaMax, distanciaTotal, alturaMin):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""
    archivo.write('\n' + str(distanciaTotal) + ",-10")
    archivo.write(ultimo + '"\nstyle="fill:white;stroke:red;stroke-width:4" />\n')
    escribirTexto(archivo, diccionarioTexto, alturaMax)
    archivo.write('</svg>')

def escribirTexto(archivo, diccionarioTexto, alturaMax):
    for coordenada in diccionarioTexto:
        archivo.write('<text x="' + str(diccionarioTexto[coordenada]) + '" y="0" style="writing-mode: tb; glyph-orientation-vertical: 0;" font-size="2em">\n')
        archivo.write(coordenada+'\n')
        archivo.write('</text>\n')

 

def main():
    nombreArchivo = input("Introduzca el nombre del archivo de rutas XML    = ")

    try:
        tree = ET.parse(nombreArchivo)
    except IOError:
        print ('No se encuentra el archivo ', nombreArchivo)
        exit()
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", nombreArchivo)
        exit()
        
    #Recorrido de las rutas
    root = tree.getroot() 
    numRutas=0
    for ruta in root.findall(".//{http://www.uniovi.es}ruta"):
        numRutas+=1
        puntos=""
        alturaMax=0
        

        nombreSalida  = input("Introduzca el nombre del archivo generado de la ruta " + str(numRutas) + " (*.svg) = ")

        try:
            salida = open(nombreSalida + ".svg",'w')
        except IOError:
            print ('No se puede crear el archivo ', nombreSalida + ".svg")
            exit()

        # Busqueda de altitud por ruta
        alt = int(ruta.find(".//{http://www.uniovi.es}altitud").text)
        distanciaTotal=10 
        puntos += toTexto(alt, distanciaTotal)

        alturaMin=alt
        if(alt>alturaMax):
            alturaMax =  alt
        else:
            alturaMax = alturaMax

        diccionarioTexto={}

        #recorro cada hito
        for hito in ruta.findall(".//{http://www.uniovi.es}hito"):
            altitud = int(hito.find(".//{http://www.uniovi.es}altitud").text)

            distancia = hito.find(".//{http://www.uniovi.es}distancia")
            distanciaTotal+=(int(distancia.text)/10)
            puntos += toTexto(altitud, distanciaTotal)

            if(alt>alturaMax):
                alturaMax =  alt
            else:
                alturaMax = alturaMax

            nombre = hito.attrib["nombreHito"]
            diccionarioTexto[nombre] = distanciaTotal

        prologoSVG(salida, alturaMax+50, distanciaTotal+50)
        salida.write(puntos)
        epilogoSVG(salida, diccionarioTexto, alturaMin-10, distanciaTotal, alturaMin)
        salida.close()
        print("KML de la ruta " + str(numRutas) + " completado")

if __name__ == "__main__":
    main()