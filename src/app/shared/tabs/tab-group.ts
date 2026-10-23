import { Component, contentChildren, effect, inject } from "@angular/core";
import { TabState } from "./tab-state";
import { Tab } from "./tab";

@Component({
    selector: 'app-tab-group',
    // This injectable will be available only when this component is instantiated. This is a great way 
    // to scope state to a specific component and its children. It'a basically to its lifecycle and this
    // specific instance of the component.
    providers: [TabState],
    template: `
        <div class="border-b border-gray-200 flex gap-4">
        <!-- Render the buttons -->
        @for (tab of tabs(); track tab.label()) {
            <button
                (click)="activate(tab.label())"
                class="px-4 py-2 border-b-2 transition-colors font-medium"
                [class.border-blue-600]="state.activeTab() === tab.label()"
                [class.text-blue-600]="state.activeTab() === tab.label()"
                [class.border-transparent]="state.activeTab() !== tab.label()"
            >
                {{ tab.label() }}
            </button>
        }
        </div>

        <!-- Render the active tab content -->
        <ng-content />
    `
})
export class TabGroup {
    readonly state = inject(TabState);

    // Look for elements of type Tab in the content of this component. This will be a signal that will 
    // update when the content changes.
    readonly tabs = contentChildren(Tab);

    constructor() {
        // This effect will run whenever the tabs signal changes. It will check if there is an active tab, and if not, it will activate the first tab.  
        effect(() => {
            const allTabs = this.tabs();
            if (allTabs.length > 0 && !this.state.activeTab()) {
                this.state.active(allTabs[0].label());
            }
        })
    }

    activate(label: string) {
        this.state.active(label);
    }
}