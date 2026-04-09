'use client';

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { documentsApi } from "@/lib/api";

interface DocumentTitleProps {
    jobId: string;
    initialTitle: string;
    onRenamed?: (newTitle: string) => void;
}

export default function DocumentTitle({ jobId, initialTitle, onRenamed }: DocumentTitleProps) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(initialTitle);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        const trimmed = value.trim();
        if (!trimmed || trimmed === initialTitle) {
            setEditing(false);
            setValue(initialTitle);
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await documentsApi.rename(jobId, trimmed);
            onRenamed?.(trimmed);
            setEditing(false);
        } catch {
            setError('Failed to rename');
            setValue(initialTitle);
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') { setValue(initialTitle); setEditing(false); }
    };

    if (editing) {
        return (
            <div className="flex items-center gap-1.5">
                <input
                    autoFocus
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    disabled={saving}
                    aria-label="Document title"
                    className="border border-indigo-400 rounded-lg px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                    maxLength={100}
                />
                <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={handleSave}
                    disabled={saving}
                    aria-label="Save title"
                    className="p-1 rounded text-green-600 hover:bg-green-50 transition-colors"
                >
                    <Check size={13} />
                </button>
                <button
                    onClick={() => { setValue(initialTitle); setEditing(false); }}
                    aria-label="Cancel rename"
                    className="p-1 rounded text-slate-400 hover:bg-slate-100 transition-colors"
                >
                    <X size={13} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 group">
            <span className="text-sm font-medium text-slate-700">{value}</span>
            <button
                onClick={() => setEditing(true)}
                aria-label={`Rename "${value}"`}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
                <Pencil size={12} />
            </button>
            {error && (
                <span className="text-red-500 text-xs" role="alert">{error}</span>
            )}
        </div>
    );
}
