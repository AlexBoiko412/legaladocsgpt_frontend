export interface TemplateField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'textarea';
    placeholder: string;
    required: boolean;
}

export interface TemplateDefinition {
    id: string;
    name: string;
    description: string;
    fields: TemplateField[];
}