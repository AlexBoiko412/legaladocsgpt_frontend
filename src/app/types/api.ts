export type DocumentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface GenerateFormData {
    templateId: string;
    format?: string;
    data: Record<string, string>;
}

export interface DocumentListItem {
    jobId: string;
    title: string;
    status: DocumentStatus;
    lastEditedAt: string | null;
    pdfUrl: string | null;
    errorDetails: string | null;
}

export interface DocumentStatusResponse {
    jobId: string;
    status: DocumentStatus;
    errorDetails: string | null;
    pdfUrl: string | null;
}

export interface DocumentVersion {
    id: string;
    version: number;
    source: 'INITIAL' | 'REFINEMENT';
    refinementPrompt: string | null;
    content: string;
    createdAt: string;
}
