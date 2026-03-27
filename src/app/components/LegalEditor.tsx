"use client";

import React, { useMemo } from "react";
import {
    EditorRoot,
    EditorContent,
    EditorCommand,
    EditorCommandItem,
    EditorCommandEmpty,
    EditorCommandList,
    EditorBubble,
    handleCommandNavigation,
    useEditor // We need this to get the instance
} from "novel";
import { generateJSON } from "@tiptap/html";
import {
    Bold, Italic, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from "lucide-react";
import { defaultExtensions } from "./editorExtensions/extensions";
import { slashCommand, suggestionItems } from "./editorExtensions/slash-command";

interface LegalEditorProps {
    content: string;
    onChange: (html: string) => void;
}

const LegalEditor = ({ content, onChange }: LegalEditorProps) => {
    const extensions = useMemo(() => [...defaultExtensions, slashCommand], []);

    const initialJSON = useMemo(() => {
        if (!content) return { type: "doc", content: [{ type: "paragraph" }] };
        try {
            return generateJSON(content, extensions as any);
        } catch (e) {
            return { type: "doc", content: [{ type: "paragraph" }] };
        }
    }, [content, extensions]);

    return (
        <div className="relative w-full max-w-[210mm] mx-auto bg-white shadow-2xl border border-slate-200 min-h-[297mm] mb-10">
            <EditorRoot>
                <EditorContent
                    initialContent={initialJSON}
                    extensions={extensions as any}
                    className="relative w-full max-w-[210mm] mx-auto bg-white shadow-2xl border border-slate-200 min-h-[297mm] mb-10"
                    onUpdate={({ editor }) => {
                        onChange(editor.getHTML());
                    }}
                    editorProps={{
                        attributes: {
                            class: "prose prose-slate prose-lg focus:outline-none p-[20mm] legal-document-viewer",
                        },
                    }}
                >
                    {/* --- THE BUBBLE MENU (Floating Buttons) --- */}
                    <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-white p-1 shadow-xl animate-in fade-in zoom-in duration-200">
                        {/* We use a simple helper component here because EditorBubble
                            passes the editor instance to its children.
                        */}
                        <BubbleMenuContent />
                    </EditorBubble>

                    {/* --- THE SLASH COMMAND MENU --- */}
                    <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border bg-white px-1 py-2 shadow-md">
                        <EditorCommandEmpty className="px-2 text-slate-500">No results</EditorCommandEmpty>
                        <EditorCommandList>
                            {suggestionItems.map((item: any) => (
                                <EditorCommandItem
                                    value={item.title}
                                    onCommand={(val) => item.command?.(val)}
                                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-slate-100 cursor-pointer"
                                    key={item.title}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-slate-50">{item.icon}</div>
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-slate-400">{item.description}</p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>
                </EditorContent>
            </EditorRoot>
        </div>
    );
};

// --- HELPER COMPONENT FOR BUBBLE MENU LOGIC ---
const BubbleMenuContent = () => {
    const { editor } = useEditor();
    if (!editor) return null;

    const btnClass = (active: boolean) =>
        `p-2 transition-colors duration-200 ${active ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100'}`;

    const setAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
        (editor.chain() as any).focus().setTextAlign(alignment).run();
    };

    return (
        <div className="flex items-center divide-x divide-slate-200 bg-white">
            {/* Formatting Group */}
            <div className="flex items-center px-1">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
                    <Bold size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}>
                    <UnderlineIcon size={16} />
                </button>
            </div>

            {/* Alignment Group */}
            <div className="flex items-center px-1">
                <button type="button" onClick={() => setAlign('left')} className={btnClass(editor.isActive({ textAlign: 'left' }))}>
                    <AlignLeft size={16} />
                </button>
                <button type="button" onClick={() => setAlign('center')} className={btnClass(editor.isActive({ textAlign: 'center' }))}>
                    <AlignCenter size={16} />
                </button>
                {/* --- NEW RIGHT ALIGN BUTTON --- */}
                <button type="button" onClick={() => setAlign('right')} className={btnClass(editor.isActive({ textAlign: 'right' }))}>
                    <AlignRight size={16} />
                </button>
                <button type="button" onClick={() => setAlign('justify')} className={btnClass(editor.isActive({ textAlign: 'justify' }))}>
                    <AlignJustify size={16} />
                </button>
            </div>
        </div>
    );
};

export default LegalEditor;