// services.ts
export class Services {
	private static instance: Services;
	private services: Map<string, any> = new Map();

	private constructor() {}

	static getInstance(): Services {
		if (!Services.instance) {
			Services.instance = new Services();
		}
		return Services.instance;
	}

	register(name: string, service: any) {
		this.services.set(name, service);
	}

	get<T>(name: string): T {
		return this.services.get(name) as T;
	}
}
