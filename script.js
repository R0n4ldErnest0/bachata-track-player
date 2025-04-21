// Configuración de instrumentos
const instruments = ['bongo', 'bass', 'majao', 'derecho'];
const audioElements = {};
const isPlaying = {};

// Rutas a los archivos de audio predeterminados
const defaultAudioFiles = {
    'bongo': 'audio/bongo.mp3',
    'bass': 'audio/bass.mp3',
    'majao': 'audio/guira-majao.mp3',
    'derecho': 'audio/guira-derecho.mp3'
};

// Nombres de visualización para los archivos predeterminados
const defaultAudioNames = {
    'bongo': 'Bongo Predeterminado',
    'bass': 'Bass Predeterminado',
    'majao': 'Güira Majao Predeterminado',
    'derecho': 'Güira Derecho Predeterminado'
};

// Inicializar cada instrumento
instruments.forEach(instrument => {
    const uploadElement = document.getElementById(`${instrument}-upload`);
    const audioElement = document.getElementById(`${instrument}-audio`);
    const playBtn = document.getElementById(`${instrument}-play-btn`);
    const playIcon = document.getElementById(`${instrument}-play-icon`);
    const pauseIcon = document.getElementById(`${instrument}-pause-icon`);
    const controlsElement = document.getElementById(`${instrument}-controls`);
    const fileInfoElement = document.getElementById(`${instrument}-file-info`);
    const volumeElement = document.getElementById(`${instrument}-volume`);
    
    // Guardar referencia al elemento de audio
    audioElements[instrument] = audioElement;
    isPlaying[instrument] = false;
    
    // Cargar archivo predeterminado
    audioElement.src = defaultAudioFiles[instrument];
    fileInfoElement.textContent = defaultAudioNames[instrument];
    
    // Mostrar controles (ya que tenemos audio predeterminado)
    controlsElement.classList.remove('hidden');
    
    // Manejar carga de archivo
    uploadElement.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file && file.type.includes('audio')) {
            // Crear URL para el archivo
            const audioUrl = URL.createObjectURL(file);
            
            // Actualizar fuente de audio
            audioElement.src = audioUrl;
            
            // Mostrar información del archivo
            fileInfoElement.textContent = file.name;
            
            // Reiniciar estado del reproductor
            audioElement.pause();
            audioElement.currentTime = 0;
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            isPlaying[instrument] = false;
        }
    });
    
    // Manejar reproducción/pausa
    playBtn.addEventListener('click', function() {
        togglePlayPause(instrument);
    });
    
    // Manejar fin de reproducción
    audioElement.addEventListener('ended', function() {
        resetPlayState(instrument);
    });
    
    // Manejar cambio de volumen
    volumeElement.addEventListener('input', function() {
        audioElement.volume = volumeElement.value;
    });
});

// Función para cambiar entre reproducción y pausa
function togglePlayPause(instrument) {
    const audioElement = audioElements[instrument];
    const playIcon = document.getElementById(`${instrument}-play-icon`);
    const pauseIcon = document.getElementById(`${instrument}-pause-icon`);
    const playBtn = document.getElementById(`${instrument}-play-btn`);
    
    if (isPlaying[instrument]) {
        // Pausar
        audioElement.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        playBtn.classList.remove('playing');
        isPlaying[instrument] = false;
    } else {
        // Reproducir
        audioElement.play().catch(error => {
            console.error(`Error al reproducir ${instrument}:`, error);
            // Si falla al reproducir, intentar cargar de nuevo
            audioElement.load();
            audioElement.play().catch(e => {
                console.error(`Segundo intento fallido para ${instrument}:`, e);
            });
        });
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        playBtn.classList.add('playing');
        isPlaying[instrument] = true;
    }
}

// Función para reiniciar estado de reproducción
function resetPlayState(instrument) {
    const playIcon = document.getElementById(`${instrument}-play-icon`);
    const pauseIcon = document.getElementById(`${instrument}-pause-icon`);
    const playBtn = document.getElementById(`${instrument}-play-btn`);
    
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playBtn.classList.remove('playing');
    isPlaying[instrument] = false;
}

// Controles maestros
document.getElementById('play-all-btn').addEventListener('click', function() {
    instruments.forEach(instrument => {
        const audioElement = audioElements[instrument];
        if (audioElement.src && !isPlaying[instrument]) {
            togglePlayPause(instrument);
        }
    });
});

document.getElementById('stop-all-btn').addEventListener('click', function() {
    instruments.forEach(instrument => {
        const audioElement = audioElements[instrument];
        if (audioElement.src) {
            audioElement.pause();
            audioElement.currentTime = 0;
            resetPlayState(instrument);
        }
    });
});