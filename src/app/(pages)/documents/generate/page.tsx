"use client";
import { useRouter } from 'next/navigation';
import DocumentRequestForm from '@/components/DocumentRequestForm';
import axios from "axios";
import {useState} from "react";

export default function GeneratePage() {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleFormSubmit = async (formData: any) => {
        setIsLoading(true);
        try {
            const requestBody = {
                templateId: formData.templateId,
                format: formData.format,
                data: formData.data
            };

            const response = await axios.post(
                "http://localhost:8080/api/documents/generate",
                requestBody,
                { withCredentials: true }
            );

            router.push(`/documents/${response.data.jobId}`);
        } catch (error) {
            console.log("Generation failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto py-10 px-4">
            <DocumentRequestForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </main>
    )
}