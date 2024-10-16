/*
eventBus.ts: Implements an event bus for the Chain Plugin
- Allows components to subscribe to and emit events
- Facilitates loose coupling between plugin components
*/

type Listener = (...args: any[]) => void;

export class EventBus {
	private listeners: Map<string, Listener[]> = new Map();

	on(event: string, callback: Listener) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}
		this.listeners.get(event)!.push(callback);
	}

	emit(event: string, ...args: any[]) {
		if (this.listeners.has(event)) {
			this.listeners.get(event)!.forEach((callback) => callback(...args));
		}
	}
}
