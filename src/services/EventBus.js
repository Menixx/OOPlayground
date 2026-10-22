class EventBus {
  #h = new Map();
  on(evt, fn) { (this.#h.get(evt) ?? this.#h.set(evt, new Set()).get(evt)).add(fn); return () => this.#h.get(evt).delete(fn); }
  emit(evt, data) { this.#h.get(evt)?.forEach((fn) => fn(data)); }
}
export const bus = new EventBus();
