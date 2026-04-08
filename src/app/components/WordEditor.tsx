"use client";

import { useEffect, useState } from "react";
import { DocumentEditor, IConfig } from "@onlyoffice/document-editor-react";
import { Loader2 } from "lucide-react";
import { documentsApi } from "@/lib/api";

interface EditorConfig {
    document: {
        key: string;
        title: string;
        url: string;
        fileType: string;
        permissions: {
            edit: boolean;
            download: boolean;
            print: boolean;
        };
    };
    editorConfig: {
        callbackUrl: string;
        lang: string;
        mode: string;
        user: {
            id: string;
            name: string;
        };
    };
    token: string;
}

interface WordEditorProps {
    jobId: string;
    refreshKey?: number;
}

const ONLYOFFICE_URL = process.env.NEXT_PUBLIC_ONLYOFFICE_URL ?? 'http://localhost:8089/';

export default function WordEditor({ jobId, refreshKey = 0 }: WordEditorProps) {
    const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setEditorConfig(null);
        setError(null);

        documentsApi.getEditorConfig(jobId)
            .then((res) => {
                setEditorConfig(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load editor configuration.");
                setLoading(false);
            });
    }, [jobId, refreshKey]);

    useEffect(() => {
        return () => {
            try {
                const instance = window.DocEditor?.instances["docxEditor"];
                if (instance && typeof instance.destroyEditor === "function") {
                    instance.destroyEditor();
                }
            } catch {
                // Ignore cleanup errors — editor may already be destroyed
            }
        };
    }, [refreshKey]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-[800px] border rounded-xl bg-red-50 text-red-600 text-sm">
                {error}
            </div>
        );
    }

    if (loading || !editorConfig) {
        return (
            <div className="flex items-center justify-center h-[800px] border rounded-xl bg-white">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <span className="ml-3 text-slate-500">Loading document...</span>
            </div>
        );
    }

    const config: IConfig = {
        document: {
            fileType: editorConfig.document.fileType,
            key: editorConfig.document.key,
            title: editorConfig.document.title,
            url: editorConfig.document.url,
            permissions: editorConfig.document.permissions,
        },
        documentType: "word",
        editorConfig: {
            callbackUrl: editorConfig.editorConfig.callbackUrl,
            lang: editorConfig.editorConfig.lang,
            mode: editorConfig.editorConfig.mode,
            user: editorConfig.editorConfig.user,
            customization: {
                forcesave: true,
            },
        },
        token: editorConfig.token,
    };

    return (
        <div className="w-full h-[800px] border rounded-xl overflow-hidden shadow-lg">
            <DocumentEditor
                id="docxEditor"
                documentServerUrl={ONLYOFFICE_URL}
                config={config}
            />
        </div>
    );
}
