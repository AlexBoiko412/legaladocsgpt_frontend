'use client';

import { useState } from 'react';
import { Loader2, History, X } from 'lucide-react';
import { documentsApi } from '@/lib/api';
import { DocumentVersion } from '@/types/api';

interface VersionHistoryProps {
    jobId: string;
    isProcessing: boolean;
    onRestoreStart: () => void;
    onError: (message: string) => void;
}

export default function VersionHistory({ jobId, isProcessing, onRestoreStart, onError }: VersionHistoryProps) {
    const [versions, setVersions] = useState<DocumentVersion[]>([]);
    const [showVersions, setShowVersions] = useState(false);
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [restoring, setRestoring] = useState<number | null>(null);

    const loadVersions = async () => {
        setLoadingVersions(true);
        try {
            const res = await documentsApi.getVersions(jobId);
            setVersions(res.data);
            setShowVersions(true);
        } catch {
            onError('Failed to load version history. Please try again.');
        } finally {
            setLoadingVersions(false);
        }
    };

    const handleRestore = async (version: number) => {
        if (!confirm(`Restore to version ${version}? Current content will be saved as a new version.`)) return;
        setRestoring(version);
        try {
            await documentsApi.restoreVersion(jobId, version);
            setShowVersions(false);
            onRestoreStart();
        } catch {
            onError('Failed to restore version.');
        } finally {
            setRestoring(null);
        }
    };

    return (
        <>
            <button
                onClick={loadVersions}
                disabled={loadingVersions}
                className="w-full border border-slate-200 hover:bg-slate-50 py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-2"
            >
                {loadingVersions ? <Loader2 size={14} className="animate-spin" /> : <History size={14} />}
                Version History
            </button>

            {showVersions && (
                <div className="bg-white rounded-xl border shadow-sm p-6 col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-800">Version History</h3>
                        <button
                            onClick={() => setShowVersions(false)}
                            aria-label="Close version history"
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {versions.map(v => (
                            <div key={v.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold text-slate-800">
                                                Version {v.version}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                v.source === 'INITIAL'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {v.source === 'INITIAL' ? 'Original generation' : 'AI refinement'}
                                            </span>
                                        </div>

                                        {v.refinementPrompt && (
                                            <p className="text-xs text-slate-500 italic truncate" title={v.refinementPrompt}>
                                                Prompt: &quot;{v.refinementPrompt}&quot;
                                            </p>
                                        )}

                                        <p className="text-xs text-slate-400 line-clamp-2">
                                            {v.content?.substring(0, 120)}...
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Saved {new Date(v.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleRestore(v.version)}
                                        disabled={restoring === v.version || isProcessing}
                                        className="shrink-0 text-sm text-blue-600 hover:underline disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {restoring === v.version && <Loader2 size={12} className="animate-spin" />}
                                        Restore
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
