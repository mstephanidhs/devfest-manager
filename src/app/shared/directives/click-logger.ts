import { Directive, input } from "@angular/core";

// Adds behavior to a component or element when it is clicked. This is a directive, not a component, 
// so it doesn't have its own template. Instead, it adds behavior to the element it is applied to.
@Directive({
    selector: `[appClickLogger]`,
    // Whenever the host element is clicked (click event), call the onClick method of this directive.
    host: {
        '(click)': 'onClick()'
    }
})
export class ClickLogger {
    // The directive expects an input named 'eventName'
    readonly eventName = input<string>('unknown_event');

    onClick() {
        console.log('[Analytics] Card Clicked: ', this.eventName());
    }
}