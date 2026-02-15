"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';
import {
    Bold, Italic, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Heading1, Heading2, Heading3,
    Undo, Redo, Quote, Minus
} from 'lucide-react';

interface LegalEditorProps {
    content: string;
    onChange: (newContent: string) => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const btnClass = (active: boolean) =>
        `p-2 rounded transition-colors ${active ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-white sticky top-0 z-20 rounded-t-lg">
            <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="Undo"><Undo size={18}/></button>
            <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="Redo"><Redo size={18}/></button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><UnderlineIcon size={18}/></button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))}><Heading3 size={18}/></button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))}><AlignLeft size={18}/></button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))}><AlignCenter size={18}/></button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))}><AlignRight size={18}/></button>
            <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))}><AlignJustify size={18}/></button>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={18}/></button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)}><Minus size={18}/></button>
        </div>
    );
};

const LegalEditor = ({ content, onChange }: LegalEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        immediatelyRender: false,
        onCreate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[1000px] text-justify',
            },
        },
    });

    useEffect(() => {
        if (editor && content && editor.isEmpty) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className="w-full flex flex-col border rounded-lg shadow-xl bg-slate-50 overflow-hidden">
            <MenuBar editor={editor} />

            <div className="p-4 md:p-8 overflow-y-auto max-h-[80vh] flex justify-center bg-slate-200">
                <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[20mm] shadow-md">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div className="p-2 bg-white border-t text-xs text-slate-400 flex justify-between">
                <span>LegalDocsGPT Editor v2.0</span>
                <span>{editor.storage.characterCount?.characters?.() || 0} characters</span>
            </div>
        </div>
    );
};

export default LegalEditor;