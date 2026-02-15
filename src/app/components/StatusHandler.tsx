"use client";

import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import axios from 'axios';
import LegalEditor from './LegalEditor';
import { CheckCircle2, Loader2, Download } from 'lucide-react';

export default function DocumentStatusHandler({ jobId }: { jobId: string }) {
    const [statusData, setStatusData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState("");
    const [isFinalizing, setIsFinalizing] = useState(false);

    const isPolling = useRef(true);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        isPolling.current = true;

        const checkStatus = async () => {
            if (!isPolling.current) return;

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/documents/status/${jobId}?t=${Date.now()}`,
                    { withCredentials: true }
                );

                setStatusData(response.data);

                if (response.data.status === 'COMPLETED' && !editedContent) {
                    setEditedContent(response.data.generatedContent);
                }

                if (response.data.status === 'COMPLETED' || response.data.status === 'FAILED') {
                    isPolling.current = false;
                } else {
                    timer = setTimeout(checkStatus, 1500);
                }
            } catch (err: any) {
                if (err?.message) {
                    setError(err.response?.data?.message || "Failed to fetch status")
                }

                console.error("Polling error:", err);
                timer = setTimeout(checkStatus, 3000);
            }
        };

        checkStatus();

        return () => {
            isPolling.current = false;
            clearTimeout(timer);
        };
    }, [jobId, editedContent]);

    const handleFinalize = async () => {
        setIsFinalizing(true);
        try {
            setStatusData((prev: any) => ({ ...prev, status: 'IN_PROGRESS' }));
            isPolling.current = true;

            await axios.post(
                `http://localhost:8080/api/documents/${jobId}/finalize`,
                {
                    editedContent: editedContent
                },
                {withCredentials: true }
            );

            const restartPolling = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/documents/status/${jobId}?t=${Date.now()}`,
                        { withCredentials: true }
                    );
                    setStatusData(response.data);
                    if (response.data.status !== 'COMPLETED') {
                        setTimeout(restartPolling, 2000);
                    } else {
                        isPolling.current = false;
                    }
                } catch (err: any) {
                    if (err?.message) {
                        setError(err.response?.data?.message || "Failed to fetch status")
                    }

                    console.error(err);
                }
            };
            restartPolling();

        } catch (err: any) {
            if (err?.message) {
                setError(err.response?.data?.message || "Finalization failed")
            }

            console.log("Finalization failed", err);
        } finally {
            setIsFinalizing(false);
        }
    };

    if (error) return <div className="text-red-500">{error}</div>;
    if (!statusData) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-6">
            {statusData.status === 'FAILED' && (
                <div className="flex flex-col items-center p-12 bg-red-50 rounded-xl shadow-sm border border-red-200">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <span className="text-red-600 font-bold text-2xl">!</span>
                    </div>
                    <h3 className="text-lg font-semibold text-red-700">Generation Failed</h3>
                    <p className="text-red-500 text-sm mt-1">{statusData.errorDetails || "An unexpected error occurred."}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-sm bg-white border border-red-200 px-4 py-2 rounded hover:bg-red-100 transition"
                    >
                        Retry Generation
                    </button>
                </div>
            )}

            {(statusData.status === 'PENDING' || statusData.status === 'IN_PROGRESS') && (
                <div className="flex flex-col items-center p-12 bg-white rounded-xl shadow-sm border">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                    <h3 className="text-lg font-semibold text-slate-700">Processing your legal document...</h3>
                    <p className="text-slate-500 text-sm mt-1">Status: {statusData.status}</p>
                </div>
            )}

            {statusData.status === 'COMPLETED' && (
                <div className="animate-in fade-in duration-700">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 size={24} />
                            <span className="font-bold text-xl text-slate-800">Ready for Review</span>
                        </div>
                        {statusData.fileUrl && (
                            <a
                                href={`http://localhost:8080${statusData.fileUrl}`}
                                target="_blank"
                                className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition"
                            >
                                <Download size={18} /> Download PDF
                            </a>
                        )}
                    </div>

                    <LegalEditor
                        content={editedContent || statusData.generatedContent}
                        onChange={(newContent) => setEditedContent(newContent)}
                    />

                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={handleFinalize}
                            disabled={isFinalizing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-md disabled:opacity-50"
                        >
                            {isFinalizing ? <Loader2 className="animate-spin" /> : "Save Changes & Update PDF"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}