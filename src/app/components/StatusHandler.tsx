"use client";

import { useState } from 'react';
import { CheckCircle, Download, RefreshCw, Wand2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import WordEditor from "@/components/WordEditor";
import VersionHistory from "@/components/VersionHistory";
import { documentsApi, storageApi } from "@/lib/api";
import { useDocumentPolling } from "@/hooks/useDocumentPolling";
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { PageSpinner, Spinner } from '@/components/ui/Spinner';

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
            setActionError(errorDetails || 'Finalization failed. Please try again.');
        },
        onTimeout: (forFinalize) => {
            if (forFinalize) {
                setIsProcessing(false);
                setActionError('Finalization timed out. Please try again.');
            } else {
                router.push('/documents?timeout=true');
            }
        },
    });

    const handleFinalize = async () => {
        if (!refinementPrompt.trim()) return;
        if (!window.confirm(
            'Warning: Regenerating will use AI to rewrite the document content. Your manual edits may be overwritten. Proceed?'
        )) return;

        setIsProcessing(true);
        setProcessingType('REFINE');
        setActionError(null);

        try {
            await documentsApi.finalize(jobId, refinementPrompt.trim());
            startPolling(true);
        } catch {
            setIsProcessing(false);
            setActionError('AI refinement failed to start.');
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
            setActionError('Sync failed. Please try again.');
        }
    };

    if (!statusData) return <PageSpinner label="Loading document…" />;

    if (statusData.status === 'FAILED' && !isProcessing) return (
        <div className="flex flex-col items-center p-12 bg-red-50 rounded-xl border border-red-200 max-w-lg mx-auto mt-10 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <span className="text-2xl text-red-500">!</span>
            </div>
            <h3 className="text-lg font-semibold text-red-700">Generation Failed</h3>
            <p className="text-red-500 text-sm mt-2">
                {statusData.errorDetails || 'An unexpected error occurred.'}
            </p>
            <Button
                variant="outline"
                className="mt-6"
                onClick={() => router.push('/documents')}
            >
                <RefreshCw size={14} /> Back to Documents
            </Button>
        </div>
    );

    if (statusData.status === 'PENDING' || statusData.status === 'IN_PROGRESS') return (
        <div className="flex flex-col items-center p-16 bg-white rounded-xl border max-w-lg mx-auto mt-10">
            <Spinner size={40} />
            <h3 className="mt-4 text-base font-semibold text-slate-700">Processing your legal document…</h3>
            <p className="text-slate-400 text-sm mt-1">Status: {statusData.status}</p>
        </div>
    );

    if (error) return (
        <div className="max-w-lg mx-auto mt-10">
            <Alert variant="error">{error}</Alert>
        </div>
    );

    if (statusData.status === 'COMPLETED') return (
        <div className="space-y-6">
            {editorVisible ? (
                <WordEditor jobId={jobId} key={editorRefreshKey} />
            ) : (
                <div className="min-h-[512px] flex flex-col items-center justify-center gap-4">
                    <Spinner size={36} label="Reloading editor…" />
                    <p className="text-sm text-slate-500">Applying changes…</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Refinement */}
                <Card className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                        <Wand2 size={16} />
                        <h3 className="text-sm">AI Assistant</h3>
                    </div>
                    <p className="text-xs text-slate-500">
                        Regenerate content using a custom prompt. This overwrites current body text.
                    </p>
                    <Textarea
                        value={refinementPrompt}
                        onChange={e => setRefinementPrompt(e.target.value)}
                        placeholder="e.g. 'Add a clause about intellectual property'"
                        rows={4}
                        aria-label="AI refinement prompt"
                    />
                    <Button
                        onClick={handleFinalize}
                        disabled={isProcessing || !refinementPrompt.trim()}
                        loading={isProcessing && processingType === 'REFINE'}
                        className="w-full"
                    >
                        <RefreshCw size={14} />
                        Regenerate with AI
                    </Button>
                </Card>

                {/* Sync & Export */}
                <Card className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-800">Sync & Export</h3>
                    <p className="text-xs text-slate-500">
                        Update the PDF to match your manual changes in the editor above.
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                        <Button
                            variant="outline"
                            onClick={handleSyncPdf}
                            disabled={isProcessing}
                            loading={isProcessing && processingType === 'CONVERT'}
                            className="w-full"
                        >
                            <CheckCircle size={14} />
                            Save & Sync to PDF
                        </Button>

                        {statusData.pdfUrl && (
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => window.open(storageApi.downloadUrl(statusData.pdfUrl!), '_blank')}
                            >
                                <Download size={14} /> Download PDF
                            </Button>
                        )}

                        <VersionHistory
                            jobId={jobId}
                            isProcessing={isProcessing}
                            onRestoreStart={() => startPolling(true)}
                            onError={setActionError}
                        />
                    </div>
                </Card>
            </div>

            {actionError && (
                <Alert variant="error" className="mt-2">{actionError}</Alert>
            )}
        </div>
    );

    return null;
}
