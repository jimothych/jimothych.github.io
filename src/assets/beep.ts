import tink from './Tink.wav';

const _audio = new Audio(tink);

export default function beep() {
  _audio.currentTime = 0;
  _audio.play().catch(e => console.error('tink play failed', e));
}