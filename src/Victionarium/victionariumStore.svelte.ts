class VictionariumInputStore {
  value = $state<string>('');
  element = $state<HTMLElement | null>(null);
}

let victionariumInputStore = new VictionariumInputStore()
export { victionariumInputStore }