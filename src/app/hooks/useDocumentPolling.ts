'use client';

import { useState, useRef, useEffect } from 'react';
import { documentsApi } from '@/lib/api';
import { DocumentStatusResponse } from '@/types/api';

const MAX_POLLING_MS = 120_000;
const MAX_FINALIZE_MS = 180_000;

export interface PollingCallbacks {
    onCompleted: (forFinalize: boolean) => void;
    onFailed: (errorDetails: string | null, forFinalize: boolean) => void;
    onTimeout: (forFinalize: boolean) => void;
}

export function useDocumentPolling(jobId: string, callbacks: PollingCallbacks) {
    const [statusData, setStatusData] = useState<DocumentStatusResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isPolling = useRef(false);
    const pollTimer = useRef<NodeJS.Timeout | null>(null);
    const pollStartTime = useRef(Date.now());
    const isFinalizingPoll = useRef(false);
    // Always keep callbacks ref up-to-date to avoid stale closures
    const callbacksRef = useRef(callbacks);
    callbacksRef.current = callbacks;

    const stopPolling = () => {
        isPolling.current = false;
        if (pollTimer.current) clearTimeout(pollTimer.current);
    };

    const checkStatus = async () => {
        if (!isPolling.current) return;

        const elapsed = Date.now() - pollStartTime.current;
        const maxMs = isFinalizingPoll.current ? MAX_FINALIZE_MS : MAX_POLLING_MS;

        if (elapsed > maxMs) {
            stopPolling();
            callbacksRef.current.onTimeout(isFinalizingPoll.current);
            return;
        }

        try {
            const response = await documentsApi.getStatus(jobId);
            const data: DocumentStatusResponse = response.data;
            setStatusData(data);

            if (data.status === 'COMPLETED') {
                stopPolling();
                callbacksRef.current.onCompleted(isFinalizingPoll.current);
            } else if (data.status === 'FAILED') {
                stopPolling();
                callbacksRef.current.onFailed(data.errorDetails, isFinalizingPoll.current);
            } else {
                pollTimer.current = setTimeout(checkStatus, 2000);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch status';
            console.error('Polling error:', message);
            setError(message);
            // Back off and retry on network errors
            pollTimer.current = setTimeout(checkStatus, 4000);
        }
    };

    const startPolling = (forFinalize = false) => {
        isPolling.current = true;
        pollStartTime.current = Date.now();
        isFinalizingPoll.current = forFinalize;
        if (pollTimer.current) clearTimeout(pollTimer.current);
        pollTimer.current = setTimeout(checkStatus, 2000);
    };

    useEffect(() => {
        startPolling(false);
        return () => stopPolling();
    }, [jobId]);

    return { statusData, error, startPolling };
}
