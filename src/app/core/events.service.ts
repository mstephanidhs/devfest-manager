import { HttpClient, httpResource } from "@angular/common/http";
import { inject, Injectable, Signal } from "@angular/core";
import { DevFestEvent } from "../models/event.model";

@Injectable({
    providedIn: 'root',
})
export class EventsService {
    private apiUrl = 'http://localhost:3000/events';
    private readonly http = inject(HttpClient);

    getEventsResource(query: Signal<string>) {
        // Το httpResource παρακολουθεί μόνο τα signals που 
        // καλούνται (διαβάζονται με παρενθέσεις ()) μέσα στη συνάρτηση callback του.
        // μόνο για get http methods
        return httpResource<DevFestEvent[]>(() => {
            const q = query();
            return q ? `${this.apiUrl}?q=${q}` : this.apiUrl;
        })
    }

    getEventResource(id: Signal<string>) {
        return httpResource<DevFestEvent>(() => {
            const eventId = id();
            return `${this.apiUrl}/${eventId}`;
        })

    }

    // Unlike promises where the request is made immediately (despite the fact that the promise is not awaited or not awaited), 
    // observable does not execute the code until it is subscribed to
    deleteEvent(id: string) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    createEvent(event: Omit<DevFestEvent, 'id'>,) {
        return this.http.post<DevFestEvent>(this.apiUrl, event);
    }
}