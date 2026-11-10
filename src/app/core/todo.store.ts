import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';

interface Book {
    id: string;
    price: number;
    title: string;
}

interface BookState {
    books: Book[],
    pencils: string[]
}

export const BooksStore = signalStore(
    { providedIn: 'root' },
    // Allows to declare the initial state of the store
    withState<BookState>({
        books: [],
        pencils: []
    }),
    // Allows to declare computed properties based on the state
    // We can also destruct the store immediately to access the 
    // state and computed properties
    withComputed((store) => {
        return {
            totalBooks: () => store.books().length,
            freeBooks: () => store.books().filter(book => book.price === 0)
        }
    }),
    withMethods((store) => ({
        addBook: (book: Book) => {
            patchState(store, { books: [...store.books(), book] })
        }
    })),
    // withHooks allows to declare lifecycle hooks for the store like 
    // ngOnInit, ngOnDestroy, etc. It can be used to perform side effects 
    // or subscribe to other signals or observables.
    withHooks({

    })
)