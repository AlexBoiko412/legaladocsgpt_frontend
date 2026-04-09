"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit3, Search, Plus, FileX, Clock, Trash2, Loader2 } from 'lucide-react';
import DocumentTitle from "@/components/DocumentTitle";
import { documentsApi } from "@/lib/api";
import { DocumentListItem, DocumentStatus } from "@/types/api";
import { Button, buttonVariants } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { PageSpinner } from '@/components/ui/Spinner';
import type { VariantProps } from 'class-variance-authority';

function statusBadge(status: DocumentStatus): VariantProps<typeof Badge>['variant'] {
    if (status === 'COMPLETED') return 'success';
    if (status === 'FAILED')    return 'danger';
    return 'warning';
}

export default function DocumentListPage() {
    const [docs, setDocs] = useState<DocumentListItem[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await documentsApi.getAll(search);
                setDocs(response.data);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Could not load documents.';
                setError(message);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchDocuments, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: string) => {
        setIsDeleteLoading(true);
        try {
            await documentsApi.delete(id);
            setDocs(prev => prev.filter(d => d.jobId !== id));
            setIsDeleting(null);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Could not delete document.';
            setError(message);
        } finally {
            setIsDeleteLoading(false);
        }
    };

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Documents</h1>
                    <p className="text-slate-500 mt-1">Manage and edit your AI-generated legal drafts.</p>
                </div>
                <Link href="/documents/generate" className={buttonVariants({ variant: 'primary' })}>
                    <Plus size={18} /> New Document
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    placeholder="Search by title…"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {error && <Alert className="mb-6">{error}</Alert>}

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {isLoading ? (
                    <PageSpinner label="Retrieving documents…" />
                ) : docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FileX className="text-slate-200 mb-4" size={56} />
                        <h3 className="text-base font-semibold text-slate-700">No documents found</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {search ? 'Try a different search term.' : 'Create your first document to get started.'}
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Document</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Modified</th>
                            <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {docs.map(doc => (
                            <tr key={doc.jobId} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-4">
                                    <DocumentTitle
                                        jobId={doc.jobId}
                                        initialTitle={doc.title || 'Untitled'}
                                        onRenamed={newTitle =>
                                            setDocs(prev => prev.map(d =>
                                                d.jobId === doc.jobId ? { ...d, title: newTitle } : d
                                            ))
                                        }
                                    />
                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{doc.jobId}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <Badge
                                        variant={statusBadge(doc.status)}
                                        pulse={doc.status === 'PENDING' || doc.status === 'IN_PROGRESS'}
                                    >
                                        {doc.status}
                                    </Badge>
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-500">
                                    {doc.lastEditedAt ? (
                                        <>
                                            <div>
                                                {new Date(doc.lastEditedAt).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                })}
                                            </div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Clock size={11} />
                                                {new Date(doc.lastEditedAt).toLocaleTimeString(undefined, {
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-1">
                                        <Link
                                            href={`/documents/${doc.jobId}`}
                                            className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                                            aria-label={`Open editor for ${doc.title || 'Untitled'}`}
                                        >
                                            <Edit3 size={16} />
                                        </Link>
                                        <button
                                            onClick={() => setIsDeleting(doc.jobId)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                            aria-label={`Delete ${doc.title || 'Untitled'}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete confirm modal */}
            {isDeleting && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Document?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            This will permanently delete the document and its PDF. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleting(null)}
                                disabled={isDeleteLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(isDeleting)}
                                loading={isDeleteLoading}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
