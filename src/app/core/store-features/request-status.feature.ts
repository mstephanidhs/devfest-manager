import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";

export type RequestStatus = 'idle' | 'pending' | 'fullfilled' | { error: string };
export type RequestStatusState = {
    requestStatus: RequestStatus
}

export function withRequestStatus() {
    return signalStoreFeature(
        withState<RequestStatusState>({
            requestStatus: 'idle'
        }),
        withComputed(({ requestStatus }) => ({
            isPending: () => requestStatus() === 'pending',
            isFulfilled: () => requestStatus() === 'fullfilled',
            error: () => {
                const status = requestStatus();
                return typeof status === 'object' ? status.error : null;
            }
        }))
    )
}