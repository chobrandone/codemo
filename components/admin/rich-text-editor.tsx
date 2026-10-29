"use client";

import { useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo, Underline, Undo, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * TipTap rich-text editor. The HTML is mirrored into a hidden input so it posts
 * with the surrounding form; it is sanitised again on the server before saving.
 */
export function RichTextEditor({
  name,
  defaultValue,
  onChange,
  minimal,
  placeholder,
}: {
  name?: string;
  defaultValue?: string | null;
  onChange?: (html: string) => void;
  minimal?: boolean;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, protocols: ["mailto", "tel"] },
        codeBlock: false,
        code: false,
      }),
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: {
        class:
          "rich prose-sm min-h-[120px] max-w-none px-3 py-2.5 text-sm leading-relaxed text-zinc-800 focus:outline-none",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate({ editor }) {
      const out = editor.isEmpty ? "" : editor.getHTML();
      setHtml(out);
      onChange?.(out);
    },
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            ul: e.isActive("bulletList"),
            ol: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
          }
        : null,
  });

  const btn = (active: boolean | undefined, onClick: () => void, label: string, Icon: typeof Bold) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={!!active}
      className={cn(
        "rounded p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100",
        active && "bg-primary/10 text-primary",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (e.g. /contact or https://…)", prev ?? "");
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      {name && <input type="hidden" name={name} value={html} />}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-100 bg-zinc-50/70 px-1.5 py-1">
        {btn(state?.bold, () => editor?.chain().focus().toggleBold().run(), "Bold", Bold)}
        {btn(state?.italic, () => editor?.chain().focus().toggleItalic().run(), "Italic", Italic)}
        {btn(state?.underline, () => editor?.chain().focus().toggleUnderline().run(), "Underline", Underline)}
        {!minimal && (
          <>
            <span className="mx-1 h-4 w-px bg-zinc-200" />
            {btn(state?.h2, () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), "Heading", Heading2)}
            {btn(state?.h3, () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), "Subheading", Heading3)}
            {btn(state?.quote, () => editor?.chain().focus().toggleBlockquote().run(), "Quote", Quote)}
          </>
        )}
        <span className="mx-1 h-4 w-px bg-zinc-200" />
        {btn(state?.ul, () => editor?.chain().focus().toggleBulletList().run(), "Bullet list", List)}
        {btn(state?.ol, () => editor?.chain().focus().toggleOrderedList().run(), "Numbered list", ListOrdered)}
        {btn(state?.link, setLink, "Link", Link2)}
        {state?.link && btn(false, () => editor?.chain().focus().unsetLink().run(), "Remove link", Unlink)}
        <span className="ml-auto" />
        {btn(false, () => editor?.chain().focus().undo().run(), "Undo", Undo)}
        {btn(false, () => editor?.chain().focus().redo().run(), "Redo", Redo)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
