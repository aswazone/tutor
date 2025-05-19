import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const QUILL_TOOLBAR_OPTIONS = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ]
};

export const QuillEditor = ({ value, onChange, placeholder, error }: QuillEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    // Focus the editor when mounted
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.focus();
    }
  }, []);

  return (
    <div className="relative min-h-[200px] max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-auto">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={QUILL_TOOLBAR_OPTIONS}
        placeholder={placeholder}
        className={`h-full ${error ? 'border-destructive' : ''}`}
      />
      {error && (
        <span className="text-destructive text-sm mt-2 block">
          {error}
        </span>
      )}
    </div>
  );
};
