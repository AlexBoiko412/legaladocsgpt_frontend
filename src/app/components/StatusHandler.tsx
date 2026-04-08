"use client";

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Download, RefreshCw, Wand2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import WordEditor from "@/components/WordEditor";
import VersionHistory from "@/components/VersionHistory";
import { documentsApi, storageApi } from "@/lib/api";
import { useDocumentPolling } from "@/hooks/useDocumentPolling";

export default function DocumentStatusHandler({ jobId }: { jobId: string }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingType, setProcessingType] = useState<'REFINE' | 'CONVERT' | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [refinementPrompt, setRefinementPrompt] = useState('');
    const [editorRefreshKey, setEditorRefreshKey] = useState(0);
    const [editorVisible, setEditorVisible] = useState(true);
    const router = useRouter();

    const { statusData, error, startPolling } = useDocumentPolling(jobId, {
        onCompleted: (forFinalize) => {
            if (!forFinalize) return;
            setIsProcessing(false);
            setProcessingType(null);
            setEditorVisible(false);
            setTimeout(() => {
                setEditorRefreshKey(prev => prev + 1);
                setEditorVisible(true);
            }, 3000);
        },
        onFailed: (errorDetails, forFinalize) => {
            if (!forFinalize) return;
            setIsProcessing(false);
            setActionError(errorDetails || "Finalization failed. Please try again.");
        },
        onTimeout: (forFinalize) => {
            if (forFinalize) {
                setIsProcessing(false);
                setActionError("Finalization timed out. Please try again.");
            } else {
                router.push('/documents?timeout=true');
            }
        },
    });

    const handleFinalize = async () => {
        if (!refinementPrompt.trim()) return;
        if (!window.confirm(
            "Warning: Regenerating will use AI to rewrite the document content. Your manual edits may be overwritten. Proceed?"
        )) return;

        setIsProcessing(true);
        setProcessingType('REFINE');
        setActionError(null);

        try {
            await documentsApi.finalize(jobId, refinementPrompt.trim());
            startPolling(true);
        } catch {
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
        } catch {
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
            <h3 className="text-lg font-semibold text-slate-700">Processing your legal document...</h3>
            <p className="text-slate-400 text-sm mt-2">Status: {statusData.status}</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center p-12 bg-red-50 rounded-xl shadow-sm border border-red-200 max-w-lg mx-auto mt-10">
            <AlertCircle className="text-red-600 mb-4" size={32} />
            <p className="text-red-700 text-sm text-center">{error}</p>
        </div>
    );

    if (statusData.status === 'COMPLETED') return (
        <div className="space-y-6">
            {editorVisible ? (
                <WordEditor jobId={jobId} key={editorRefreshKey} />
            ) : (
                <div className="min-h-[512px] flex flex-col items-center justify-center p-16 gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-slate-500 text-sm">Loading editor...</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Refinement */}
                <div className="bg-white rounded-xl border p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <Wand2 size={18} />
                        <h3>AI Assistant</h3>
                    </div>
                    <p className="text-xs text-slate-500">
                        Regenerate content using a custom prompt. This overwrites current body text.
                    </p>
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
                        {isProcessing && processingType === 'REFINE'
                            ? <Loader2 size={14} className="animate-spin" />
                            : <RefreshCw size={14} />}
                        Regenerate with AI
                    </button>
                </div>

                {/* Sync & Export */}
                <div className="bg-white rounded-xl border p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <h3>Sync & Export</h3>
                    </div>
                    <p className="text-xs text-slate-500">
                        Update the PDF to match your manual changes in the editor above.
                    </p>
                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={handleSyncPdf}
                            disabled={isProcessing}
                            className="w-full border border-slate-200 hover:bg-slate-50 py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-2"
                        >
                            {isProcessing && processingType === 'CONVERT'
                                ? <Loader2 size={14} className="animate-spin" />
                                : <CheckCircle size={14} />}
                            Save & Sync to PDF
                        </button>

                        {statusData.pdfUrl && (
                            <button
                                onClick={() => window.open(storageApi.downloadUrl(statusData.pdfUrl!), '_blank')}
                                className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-2"
                            >
                                <Download size={14} /> Download PDF File
                            </button>
                        )}

                        <VersionHistory
                            jobId={jobId}
                            isProcessing={isProcessing}
                            onRestoreStart={() => startPolling(true)}
                            onError={setActionError}
                        />
                    </div>
                </div>
            </div>

            {actionError && <p className="text-red-500 text-center text-sm">{actionError}</p>}
        </div>
    );

    return null;
}
