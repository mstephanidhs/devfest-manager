import { Component, computed, inject, input } from "@angular/core";
import { TabState } from "./tab-state";

@Component(
    {
        selector: 'app-tab',
        template: `
           <!-- Only render content if active -->
            @if (isActive()) {
            <div class="py-6 animate-in fade-in duration-300">
                    <ng-content />
                </div>
            }
        `
    }
)
export class Tab {
    // It will go up the hierachy and find the closest provider of this type. In this case, 
    // it will find the TabState provided by the TabGroup component.
    private readonly state = inject(TabState);

    readonly label = input.required<string>();

    // Derived state: am I active?
    readonly isActive = computed(() => this.state.activeTab() === this.label());
}