import {
    TiptapImage,
    TiptapUnderline,
    HorizontalRule,
    Placeholder,
    TaskItem,
    TaskList,
    CharacterCount,
    StarterKit,

} from "novel";


import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import TextAlign from "@tiptap/extension-text-align";

// Configure Placeholder to look like a legal document prompt
const placeholder = Placeholder.configure({
    placeholder: ({ node }) => {
        if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
        }
        return "Start typing legal clauses or press '/' for commands...";
    },
});

const tiptapUnderline = TiptapUnderline.configure({
    HTMLAttributes: {
        class: "underline-offset-4",
    },
});

const starterKit = StarterKit.configure({
    bulletList: {
        HTMLAttributes: {
            class: "list-disc list-outside leading-3 -mt-2",
        },
    },
    orderedList: {
        HTMLAttributes: {
            class: "list-decimal list-outside leading-3 -mt-2",
        },
    },
    listItem: {
        HTMLAttributes: {
            class: "leading-normal -mb-2",
        },
    },
    blockquote: {
        HTMLAttributes: {
            class: "border-l-4 border-slate-300 pl-4 italic",
        },
    },
    codeBlock: false,
});

const textAlign = TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
});

export const defaultExtensions = [
    starterKit,
    placeholder,
    tiptapUnderline,
    textAlign,
    BulletList,
    ListItem,
    TaskList,
    TaskItem,
    HorizontalRule,
    CharacterCount,
];

import '@tiptap/react'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        textAlign: {
            /**
             * Set the text alignment
             */
            setTextAlign: (alignment: string) => ReturnType,
            /**
             * Unset the text alignment
             */
            unsetTextAlign: () => ReturnType,
            /**
             * Toggle the text alignment
             */
            toggleTextAlign: (alignment: string) => ReturnType, // Added this line
        }
    }
}