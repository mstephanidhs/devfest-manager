// src/app/core/cart.store.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';
import { CartStore } from './cart.store';
import { API_URL } from './tokens';

describe('CartStore', () => {
    // 1. The Setup Function
    // Configures the module and returns the needed instances
    // SIFERS testing pattern - Setup, Inject, Fire, Expect, Repeat
    function setup() {
        TestBed.configureTestingModule({
            providers: [
                { provide: API_URL, useValue: 'http://localhost:3000' },
                CartStore,
                provideHttpClientTesting(),
            ],
        });

        return {
            store: TestBed.inject(CartStore),
            httpMock: TestBed.inject(HttpTestingController),
        };
    }

    it('loads initial tickets on init', () => {
        const { store, httpMock } = setup();

        // Expect the onInit load request
        // We expect a GET request to the tickets endpoint and we flush mock data to simulate a successful response.
        // expectOne() will throw an error if no request or multiple requests are made to the specified URL.
        const req = httpMock.expectOne('http://localhost:3000/tickets');
        expect(req.request.method).toBe('GET');

        expect(store.ticketIds().length).toBe(0);

        // Flush mock data
        // This simulates a successful response from the backend with a list of tickets.
        req.flush([{ id: '100', eventId: '1' }]);

        // Verify Store State
        expect(store.ticketIds().length).toBe(1);
        expect(store.count()).toBe(1);

        // Verify that there are no outstanding requests
        httpMock.verify();
    });

    it('optimistically adds ticket and reverts on error', () => {
        const { store, httpMock } = setup();

        // Handle initial load
        httpMock.expectOne('http://localhost:3000/tickets').flush([]);

        // Action: Add to cart
        store.addToCart({ eventId: '999' });

        // Assert: Optimistic Update
        expect(store.count()).toBe(1);
        expect(store.isPending()).toBe(true);

        // Action: Simulate Network Error
        const req = httpMock.expectOne('http://localhost:3000/tickets');
        req.flush('Server Error', { status: 500, statusText: 'Server Error' });

        // Assert: Rollback
        expect(store.count()).toBe(0);
        expect(store.error()).toContain('Server Error');

        httpMock.verify();
    });
});
