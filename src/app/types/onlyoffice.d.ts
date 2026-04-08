export {};

declare global {
    interface Window {
        DocEditor?: {
            instances: Record<string, { destroyEditor: () => void }>;
        };
    }
}
