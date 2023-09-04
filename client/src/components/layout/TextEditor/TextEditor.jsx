import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function TextEditor({ label }) {
  var toolbarOptions = ['bold', 'italic', 'underline', 'strike'];

  return (
    <div>
      <ReactQuill />
    </div>
  );
}
