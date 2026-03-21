import tink from './Tink.wav';

const _audioContext = new AudioContext();
let _tinkBuffer: AudioBuffer | null = null;

console.log(tink);
fetch(tink)
  .then(r => r.arrayBuffer())
  .then(ab => _audioContext.decodeAudioData(ab))
  .then(buf => { _tinkBuffer = buf; })
  .catch(e => console.error('tink decode failed', e));

const _beepSound = {
  play() {
    if (!_tinkBuffer) return;
    const source = _audioContext.createBufferSource();
    source.buffer = _tinkBuffer;
    source.connect(_audioContext.destination);
    source.start();
  }
};

export { _beepSound };