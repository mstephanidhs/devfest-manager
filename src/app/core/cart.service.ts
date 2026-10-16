import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { TICKETS_URL } from "./tokens";

interface TicketEntry {
    id: string;
    eventId: string;
}

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly http = inject(HttpClient);
    private readonly ticketsUrl = inject(TICKETS_URL);

    // It will work as an internal state of the service, and it 
    // will be used to store the ticket ids that are added to the cart.
    private readonly ticketIds = signal<string[]>([]);

    readonly count = computed(() => this.ticketIds().length);

    constructor() {
        this.loadTickets();
    }

    private loadTickets(): void {
        this.http.get<TicketEntry[]>(this.ticketsUrl).subscribe({
            next: (data) => {
                const ids = data.map(t => t.eventId);
                this.ticketIds.set(ids);
            }
        })
    }

    // this approach does not work with race conditions well
    addTicket(eventId: string): void {
        const previousIds = this.ticketIds();

        this.ticketIds.update(ids => [...ids, eventId]);

        this.http.post(this.ticketsUrl, { eventId }).subscribe({
            next: () => console.log('optimistic update was successful'),
            error: (err) => {
                console.error('Sync failed for: ', eventId);
                this.ticketIds.set(previousIds);
            }
        })
    }
}