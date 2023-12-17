class Reproductor {
    constructor() {
        //API File para subir el audio en el html
        this.audio = $('<audio controls></audio>'); //API Web Audio

        //visualizar la canción
        this.canvas = $('<canvas></canvas>');  // Crear el elemento canvas
        this.canvasCtx = this.canvas[0].getContext('2d');  // Obtener el contexto 2D del canvas

        // Inicializa el contexto de audio aquí, después de que el usuario haya seleccionado un archivo
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioSource = null;
        this.analyser = null;
        // Fuente de audio actualmente conectada
        this.sourceNode = null;

        // $('main').append(this.fileInput);
        $('main').append(this.audio);
        $('main').append(this.canvas);

        
        this.cargarCancionAlmacenada();
         // Agrega un listener para el evento 'play' en el constructor
         this.audio[0].addEventListener('play', () => {
            this.iniciarVisualizacion();
        });
    }

    cargarCancion(files) {
        const file = files[0];

        if (file) {
            localStorage.setItem('currentSong', file.name);
            const songURL = URL.createObjectURL(file);
            this.audio.attr('src', songURL);
            localStorage.setItem('currentSongURL', songURL);

            // Detener la reproducción actual antes de cargar una nueva canción
            this.audio[0].pause();
            this.audioContext.resume().then(() => {
                // Desconectar cualquier nodo anterior antes de conectar uno nuevo
                if (this.sourceNode) {
                    this.sourceNode.disconnect();
                }

                // Inicia el reproductor después de cargar la canción
                this.iniciarVisualizacion();
            });
        }
    }

    // cargarCancionAlmacenada() {
    //     //API web audio
    //     //almacenar el nombre y la URL de la canción actual, lo que permite persistir esa información incluso después de cerrar y volver a abrir el navegador.
    //     const storedSongURL = localStorage.getItem('currentSongURL');

    //     if (storedSongURL!= null) {
    //         // Verifica si la URL almacenada es válida antes de establecerla en el elemento audio
    //         const audio = this.audio[0];
    //         const storedSong = localStorage.getItem('currentSong');
    //         console.log(audio)
    //         console.log(storedSong)
    //         if (storedSong && storedSongURL) {
    //             this.audio.attr('src', storedSongURL);
    //         }
    //         // if (audio && audio.canPlayType && audio.canPlayType('audio/*')) {
    //         //     this.audio.attr('src', storedSongURL);
    //         // }
    //     }
    // }

    cargarCancionAlmacenada() {
        const storedSongURL = localStorage.getItem('currentSongURL');
        const storedSongName = localStorage.getItem('currentSong');
    
        if (storedSongURL && storedSongName) {
            //solo persisten los audios que tengo en la carpeta multimedia, storedSongURL es un blov
            const songURL = `multimedia/audios/${storedSongName}`;
            this.audio.attr('src', songURL);
        }
    }
    



  

    iniciarVisualizacion() {
        //fragmento de codigo para reproducir la cancion si ya está guardada por la API Web Storage
         // Detener la reproducción actual antes de cargar una nueva canción
        //  this.audio[0].pause();
        //  this.audioContext.resume().then(() => {
        //      // Desconectar cualquier nodo anterior antes de conectar uno nuevo
        //      if (this.sourceNode) {
        //          this.sourceNode.disconnect();
        //      }

        //  });
         //----------------------------

        if (this.audioSource == null) {
            this.audioSource = this.audioContext.createMediaElementSource(this.audio[0]);
            this.analyser = this.audioContext.createAnalyser();
            this.audioSource.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        }

        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Lógica para visualización
        const draw = () => {
            this.analyser.getByteFrequencyData(dataArray);

            this.canvasCtx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);

            const barWidth = (this.canvas[0].width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                this.canvasCtx.fillRect(x, this.canvas[0].height - barHeight / 2, barWidth, barHeight / 2);

                x += barWidth + 1;
            }

            requestAnimationFrame(draw);
        };

        draw();
    }
}
