// src/components/RichTextEditor.js
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles for the editor

const RichTextEditor = ({ value, onChange }) => {
  return (
    <div>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={RichTextEditor.modules}
        formats={RichTextEditor.formats}
        className="bg-white border p-4 rounded-md shadow"
      />
    </div>
  );
};

// Configurations for the editor
RichTextEditor.modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

RichTextEditor.formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
];

export default RichTextEditor;
