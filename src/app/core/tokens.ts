import { inject, InjectionToken } from "@angular/core";

export const API_URL = new InjectionToken<string>('API_URL')

// It works as a singleton, so it is provided in the root injector and 
// can be injected anywhere in the application.
export const TICKETS_URL = new InjectionToken<string>('TICKET_URL', {
    providedIn: 'root',
    factory: () => {
        const api = inject(API_URL);
        return `${api}/tickets`;
    }
})