import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { setError, setFulfilled, setPending, withRequestStatus } from "./store-features/request-status.feature";
import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TICKETS_URL } from "./tokens";
import { exhaustMap, pipe, switchMap, tap } from "rxjs";
import { TicketEntry } from "./cart.service";

interface CartState {
    ticketIds: string[];
}

export const CartStore = signalStore(
    { providedIn: 'root' },

    // 1. Initial State
    withState<CartState>({
        ticketIds: []
    }),

    // 2. Add Custom Feature (Gives us isPending, error, etc.)
    withRequestStatus(),

    // 3. Computed Selectors
    withComputed(({ ticketIds }) => ({
        count: () => ticketIds().length,
    })),

    // Next steps: withMethods...
    withMethods((store) => {
        const http = inject(HttpClient);
        const ticketsUrl = inject(TICKETS_URL);

        return {
            // rxMethod  turns this load right into the function, into the method that can take a value 
            // every time this method is called.
            // And what it does internally, it creates the almost observable pipeline and pushes values
            // into that pipeline.
            load: rxMethod<void>(
                pipe(
                    tap(() => {
                        patchState(store, setPending());
                    }),
                    switchMap(() =>
                        http.get<TicketEntry[]>(ticketsUrl).pipe(
                            tapResponse({
                                next: (tickets) => patchState(store, { ticketIds: tickets.map((t) => t.eventId) }, setFulfilled()),
                                error: (err: { message: string }) => patchState(store, setError(err.message))
                            })
                        )
                    )
                )
            ),
            addToCart: rxMethod<{ eventId: string }>(
                pipe(
                    exhaustMap(({ eventId }) => {
                        // Optimistic Update: We update the state first, before the backend call. This 
                        // gives a snappier feel to the UI. 
                        patchState(store, (state) => ({ ticketIds: [...state.ticketIds, eventId] }), setPending());
                        return http.post(ticketsUrl, { eventId }).pipe(
                            tapResponse({
                                next: () => {
                                    patchState(store, setFulfilled());
                                    console.log('Transaction Confirmed!');
                                },
                                error: (err: any) => {
                                    console.error('Transaction Failed - Rolling Back');

                                    // CRITICAL: ROLLBACK LOGIC
                                    // We optimistically added the ID. Now we must remove ONE instance of it.
                                    patchState(store, (state) => {
                                        const index = state.ticketIds.indexOf(eventId);
                                        if (index === -1) return state;

                                        const newIds = [...state.ticketIds];
                                        newIds.splice(index, 1);
                                        return { ticketIds: newIds };
                                    },
                                        setError(err.message),
                                    )
                                }
                            })
                        )
                    })
                )
            ),
        };
    }),
    // LIFECYCLE HOOKS
    withHooks({
        onInit(store) {
            // Automatically load data when the store is first injected
            store.load();
        }
    })
)