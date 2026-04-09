'use client';

import { useState } from 'react';
import { History, X } from 'lucide-react';
import { documentsApi } from '@/lib/api';
import { DocumentVersion } from '@/types/api';
import { Button } from '@/components/ui/Button';

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
            <Button
                variant="outline"
                onClick={loadVersions}
                loading={loadingVersions}
                className="w-full"
            >
                <History size={14} />
                Version History
            </Button>

            {showVersions && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 col-span-2 mt-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-slate-800">Version History</h3>
                        <button
                            onClick={() => setShowVersions(false)}
                            aria-label="Close version history"
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    <div className="space-y-2.5">
                        {versions.map(v => (
                            <div key={v.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold text-slate-800">
                                                Version {v.version}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                v.source === 'INITIAL'
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {v.source === 'INITIAL' ? 'Original' : 'AI refinement'}
                                            </span>
                                        </div>

                                        {v.refinementPrompt && (
                                            <p className="text-xs text-slate-500 italic truncate" title={v.refinementPrompt}>
                                                &ldquo;{v.refinementPrompt}&rdquo;
                                            </p>
                                        )}

                                        <p className="text-xs text-slate-400 line-clamp-2">
                                            {v.content?.substring(0, 120)}…
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {new Date(v.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => handleRestore(v.version)}
                                        disabled={restoring === v.version || isProcessing}
                                        loading={restoring === v.version}
                                        className="shrink-0"
                                    >
                                        Restore
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
