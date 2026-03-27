"use client";

import React, { useEffect, useState, useRef } from 'react';
import {Loader2, CheckCircle, AlertCircle, Download, RefreshCw, Wand2} from 'lucide-react';
import { useRouter } from "next/navigation";
import WordEditor from "@/components/WordEditor";
import {documentsApi, storageApi} from "@/lib/api";

export default function DocumentStatusHandler({ jobId }: { jobId: string }) {
    const [statusData, setStatusData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingType, setProcessingType] = useState<'REFINE' | 'CONVERT' | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [refinementPrompt, setRefinementPrompt] = useState('');
    const router = useRouter();
    const [editorRefreshKey, setEditorRefreshKey] = useState(0);

    const isPolling = useRef(true);
    const pollTimer = useRef<NodeJS.Timeout | null>(null);
    const pollStartTime = useRef(Date.now());
    const isFinalizingPoll = useRef(false);
    const MAX_POLLING_MS = 120_000;
    const MAX_FINALIZE_MS = 180_000;

    const startPolling = (forFinalize = false) => {

        isPolling.current = true;
        pollStartTime.current = Date.now();
        isFinalizingPoll.current = forFinalize;
        scheduleNext();
    };

    const stopPolling = () => {
        isPolling.current = false;
        if (pollTimer.current) clearTimeout(pollTimer.current);
    };

    const scheduleNext = () => {
        if (pollTimer.current) clearTimeout(pollTimer.current);
        pollTimer.current = setTimeout(checkStatus, 2000);
    };

    const checkStatus = async () => {
        if (!isPolling.current) return;

        const elapsed = Date.now() - pollStartTime.current;
        const maxMs = isFinalizingPoll.current ? MAX_FINALIZE_MS : MAX_POLLING_MS;

        if (elapsed > maxMs) {
            stopPolling();
            if (isFinalizingPoll.current) {
                setIsProcessing(false);

                setError("Finalization timed out. Please try again.");
            } else {
                router.push('/documents?timeout=true');
            }
            return;
        }

        try {
            const response = await documentsApi.getStatus(jobId);

            const data = response.data;
            setStatusData(data);

            if (data.status === 'COMPLETED') {
                stopPolling();
                if (isFinalizingPoll.current) {
                    setIsProcessing(false);
                    setError(null);

                    // Longer delay to ensure file is fully written + OnlyOffice cache is cleared
                    setTimeout(() => {
                        setEditorRefreshKey(prev => prev + 1);
                        console.log("Editor remounted with new key");
                    }, 1500);   // 1.5 seconds
                }
            } else if (data.status === 'FAILED') {
                stopPolling();
                if (isFinalizingPoll.current) {
                    setIsProcessing(false);
                    setError(data.errorDetails || "Finalization failed. Please try again.");
                }
            } else {
                scheduleNext();
            }
        } catch (err: any) {
            console.error("Polling error:", err);
            setError(err.response?.data?.message || "Failed to fetch status");
            pollTimer.current = setTimeout(checkStatus, 4000);
        }
    };

    useEffect(() => {
        startPolling(false);
        return () => stopPolling();
    }, [jobId]);

    const handleFinalize = async () => {
        if (!refinementPrompt.trim()) return;

        const confirmRefine = window.confirm(
            "Warning: Regenerating will use AI to rewrite the document content. Your manual edits in the editor may be overwritten. Proceed?"
        );
        if (!confirmRefine) return;

        setIsProcessing(true);
        setProcessingType('REFINE');
        setActionError(null);

        try {
            await documentsApi.finalize(jobId, refinementPrompt.trim());
            startPolling(true);
        } catch (err: any) {
            setIsProcessing(false);
            setActionError("AI refinement failed to start.");
        }
    };

    const handleSyncPdf = async () => {
        setIsProcessing(true);
        setProcessingType('CONVERT');
        setActionError(null);

        try {
            await documentsApi.convertToPdf(jobId);
            startPolling(true);
        } catch (err) {
            setIsProcessing(false);
            setActionError("Sync failed. Please try again.");
        }
    };

    if (!statusData) return (
        <div className="flex flex-col items-center justify-center p-16 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-500 text-sm">Loading document...</p>
        </div>
    );

    if (statusData.status === 'FAILED' && !isProcessing) return (
        <div className="flex flex-col items-center p-12 bg-red-50 rounded-xl shadow-sm border border-red-200 max-w-lg mx-auto mt-10">
            <div className="bg-red-100 p-4 rounded-full mb-4">
                <AlertCircle className="text-red-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-red-700">Generation Failed</h3>
            <p className="text-red-500 text-sm mt-2 text-center">
                {statusData.errorDetails || "An unexpected error occurred."}
            </p>
            <button
                onClick={() => router.push('/documents')}
                className="mt-6 text-sm bg-white border border-red-200 px-5 py-2 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
            >
                <RefreshCw size={14} /> Back to Documents
            </button>
        </div>
    );

    if (statusData.status === 'PENDING' || statusData.status === 'IN_PROGRESS') return (
        <div className="flex flex-col items-center p-16 bg-white rounded-xl shadow-sm border max-w-lg mx-auto mt-10">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <h3 className="text-lg font-semibold text-slate-700">
                Processing your legal document...
            </h3>
            <p className="text-slate-400 text-sm mt-2">Status: {statusData.status}</p>
        </div>
    );

    if (statusData?.status === 'COMPLETED') return (
        <div className="space-y-6">
            {/* The Editor - Key fix in backend ensures this reloads after Refine */}
            <WordEditor jobId={jobId} key={editorRefreshKey} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* AI REFINEMENT BOX */}
                <div className="bg-white rounded-xl border p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <Wand2 size={18} />
                        <h3>AI Assistant</h3>
                    </div>
                    <p className="text-xs text-slate-500">Regenerate content using a custom prompt. This overwrites current body text.</p>
                    <textarea
                        value={refinementPrompt}
                        onChange={e => setRefinementPrompt(e.target.value)}
                        placeholder="e.g. 'Add a clause about intellectual property'"
                        className="w-full border rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={handleFinalize}
                        disabled={isProcessing || !refinementPrompt.trim()}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {isProcessing && processingType === 'REFINE' ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        Regenerate with AI
                    </button>
                </div>

                {/* PDF & SYNC BOX */}
                <div className="bg-white rounded-xl border p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <h3>Sync & Export</h3>
                    </div>
                    <p className="text-xs text-slate-500">Update the PDF to match your manual changes in the editor above.</p>

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={handleSyncPdf}
                            disabled={isProcessing}
                            className="w-full border border-slate-200 hover:bg-slate-50 py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-2"
                        >
                            {isProcessing && processingType === 'CONVERT' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                            Save & Sync to PDF
                        </button>

                        {statusData.pdfUrl && (
                            <button
                                onClick={() => window.open(storageApi.downloadUrl(statusData.pdfUrl), '_blank')}
                                className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-2"
                            >
                                <Download size={14} /> Download PDF File
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Global feedback for actions */}
            {actionError && <p className="text-red-500 text-center text-sm">{actionError}</p>}
        </div>
    );

    return null;
}