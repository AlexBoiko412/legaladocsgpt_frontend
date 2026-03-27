"use client";

import { useEffect, useState } from "react";
import { DocumentEditor, IConfig } from "@onlyoffice/document-editor-react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {documentsApi} from "@/lib/api";

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
    refreshKey?: number;   // Added to force re-init
}

export default function WordEditor({ jobId, refreshKey = 0 }: WordEditorProps) {
    const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch fresh config whenever jobId OR refreshKey changes
    useEffect(() => {
        setLoading(true);
        setEditorConfig(null);
        setError(null);

        documentsApi.getEditorConfig(jobId)
            .then((res) => {
                setEditorConfig(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Editor config error:", err);
                setError("Failed to load editor configuration.");
                setLoading(false);
            });
    }, [jobId, refreshKey]);

    useEffect(() => {
        return () => {
            try {
                if (window.DocEditor && window.DocEditor.instances) {
                    const instance = window.DocEditor.instances["docxEditor"];
                    if (instance && typeof instance.destroyEditor === "function") {
                        console.log("Destroying previous OnlyOffice editor instance");
                        instance.destroyEditor();
                    }
                }
            } catch (e) {
                console.warn("Error destroying OnlyOffice instance:", e);
            }
        };
    }, [refreshKey]);   // Run cleanup on every refresh

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
        events: {
            onDocumentReady: () => {
                console.log("OnlyOffice Editor is ready (key:", editorConfig.document.key, ")");
            },
            onAppReady: () => console.log("OnlyOffice App is ready"),
        },
    };

    return (
        <div className="w-full h-[800px] border rounded-xl overflow-hidden shadow-lg">
            <DocumentEditor
                id="docxEditor"
                documentServerUrl="http://localhost:8089/"
                config={config}
            />
        </div>
    );
}