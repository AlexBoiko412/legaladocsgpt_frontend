import {
    Heading1, Heading2, Heading3,
    List, ListOrdered, Text,
    Quote, CheckSquare
} from "lucide-react";
import { createSuggestionItems } from "novel";

import React from "react";

export const suggestionItems = createSuggestionItems([
    {
        title: "Text",
        description: "Just start typing with plain text.",
        searchTerms: ["p", "paragraph"],
        icon: React.createElement(Text, { size: 18 }),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
        },
    },
    {
        title: "Heading 1",
        description: "Big section heading.",
        searchTerms: ["title", "big", "large"],
        icon: React.createElement(Heading1, { size: 18 }),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
        },
    },
    {
        title: "Heading 2",
        description: "Medium section heading.",
        searchTerms: ["subtitle", "medium"],
        icon: React.createElement(Heading2, { size: 18 }),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
        },
    },
    {
        title: "Bullet List",
        description: "Create a simple bulleted list.",
        searchTerms: ["unordered", "point"],
        icon: React.createElement(List, { size: 18 }),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: "Numbered List",
        description: "Create a list with numbering.",
        searchTerms: ["ordered"],
        icon: React.createElement(ListOrdered, { size: 18 }),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: "Quote",
        description: "Capture a quotation or legal citation.",
        searchTerms: ["blockquote"],
        icon: React.createElement(Quote, { size: 18 }),
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
    },
]);

// This is the actual extension that Novel uses
import { Command } from "novel";

export const slashCommand = Command.configure({
    suggestion: {
        items: () => suggestionItems,
        render: () => {
            return {
                // This is handled by the <EditorCommand /> component in your main file
                onStart: () => {},
                onUpdate: () => {},
                onKeyDown: () => false,
                onExit: () => {},
            };
        },
    },
});