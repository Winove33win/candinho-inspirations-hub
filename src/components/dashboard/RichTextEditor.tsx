import { useMemo, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sanitizeHtml } from "@/lib/sanitize";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export function RichTextEditor({ value, onChange, placeholder, id }: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  // Sanitize content before passing to parent
  const handleChange = useCallback((content: string) => {
    const sanitized = sanitizeHtml(content);
    onChange(sanitized);
  }, [onChange]);

  return (
    <div className="rich-text-editor">
      <ReactQuill
        id={id}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="font-['Open_Sans']"
      />
    </div>
  );
}
