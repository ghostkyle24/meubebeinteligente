// Sistema de Sons Simples e Seguro
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isEnabled = true;
        this.volume = 0.3; // Volume baixo para não incomodar
    }

    // Inicializa o sistema de áudio
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (error) {
            console.log('Áudio não suportado neste navegador');
            this.isEnabled = false;
        }
    }

    // Cria sons simples usando Web Audio API
    createSounds() {
        if (!this.audioContext) return;

        // Som de clique suave
        this.sounds.click = this.createClickSound();
        
        // Som de sucesso suave
        this.sounds.success = this.createSuccessSound();
        
        // Som de erro suave
        this.sounds.error = this.createErrorSound();
    }

    // Cria som de clique
    createClickSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Cria som de sucesso
    createSuccessSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Cria som de erro
    createErrorSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // Toca um som
    playSound(soundName) {
        if (!this.isEnabled || !this.audioContext) return;
        
        try {
            if (soundName === 'click') {
                this.createClickSound();
            } else if (soundName === 'success') {
                this.createSuccessSound();
            } else if (soundName === 'error') {
                this.createErrorSound();
            }
        } catch (error) {
            console.log('Erro ao tocar som:', error);
        }
    }

    // Liga/desliga sons
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }

    // Ajusta volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

// Instância global
const soundManager = new SoundManager();

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    soundManager.init();
});

// Função global para tocar sons
function playSound(soundName) {
    soundManager.playSound(soundName);
}

// Função para ligar/desligar sons
function toggleSounds() {
    return soundManager.toggle();
}
