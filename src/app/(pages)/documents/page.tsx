"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit3, Search, Plus, Loader2, AlertCircle, FileX, Clock, Trash2 } from 'lucide-react';
import DocumentTitle from "@/components/DocumentTitle";
import {documentsApi} from "@/lib/api";

export default function DocumentListPage() {
    const [docs, setDocs] = useState<any[]>([]);
    const [search, setSearch] = useState("");
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
            } catch (err: any) {
                setError(err.response?.data?.message || "Could not load documents.");
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
        } catch (err: any) {
            setError(err.response?.data?.message || "Could not delete document.");
        } finally {
            setIsDeleteLoading(false);
        }
    };

    return (
        <main className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Documents</h1>
                    <p className="text-slate-500 mt-1">Manage and edit your AI-generated legal drafts.</p>
                </div>
                <Link
                    href="/documents/generate"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-sm"
                >
                    <Plus size={20} /> New Document
                </Link>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                    placeholder="Search by title..."
                    className="pl-10 p-3 border border-slate-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                        <p className="text-slate-500 font-medium">Retrieving documents...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <AlertCircle className="text-red-500 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-800">Connection Error</h3>
                        <p className="text-slate-500 max-w-sm">{error}</p>
                        <button
                            onClick={() => setSearch(s => s)}
                            className="mt-4 text-blue-600 font-semibold hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                ) : docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FileX className="text-slate-300 mb-4" size={60} />
                        <h3 className="text-lg font-bold text-slate-800">No documents found</h3>
                        <p className="text-slate-500">Try a different search term or create a new document.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 text-slate-600 font-semibold">Document</th>
                            <th className="p-4 text-slate-600 font-semibold">Status</th>
                            <th className="p-4 text-slate-600 font-semibold">Last Modified</th>
                            <th className="p-4 text-right text-slate-600 font-semibold">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {docs.map((doc: any) => (
                            <tr key={doc.jobId} className="border-b hover:bg-slate-50 transition-colors group">
                                <td className="p-4">
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
                                <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            doc.status === 'COMPLETED'
                                                ? 'bg-green-100 text-green-700'
                                                : doc.status === 'FAILED'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-amber-100 text-amber-700 animate-pulse'
                                        }`}>
                                            {doc.status}
                                        </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    <div>
                                        {doc.lastEditedAt
                                            ? new Date(doc.lastEditedAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })
                                            : 'N/A'}
                                    </div>
                                    <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                                        <Clock size={12} />
                                        {doc.lastEditedAt
                                            ? new Date(doc.lastEditedAt).toLocaleTimeString(undefined, {
                                                hour: '2-digit', minute: '2-digit'
                                            })
                                            : '--:--'}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/documents/${doc.jobId}`}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                                            title="Open editor"
                                        >
                                            <Edit3 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setIsDeleting(doc.jobId)}
                                            className="p-2 hover:bg-red-50 text-red-500 rounded transition-colors"
                                            title="Delete document"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete confirmation modal */}
            {isDeleting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-bold mb-2">Delete Document?</h3>
                        <p className="text-slate-500 mb-6">
                            This will permanently delete the document and its PDF. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleting(null)}
                                disabled={isDeleteLoading}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(isDeleting)}
                                disabled={isDeleteLoading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {isDeleteLoading && <Loader2 size={14} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}