import { useState } from 'react';
import toast from 'react-hot-toast';
import { createBug } from '../services/api';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function ReportBug() {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!ALLOWED_MIME_TYPES.includes(selected.type)) {
        toast.error('Unsupported file type. Only images, PDFs, and ZIP files are allowed.');
        e.target.value = '';
        setFile(null);
        return;
      }
      if (selected.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds the 5MB limit.');
        e.target.value = '';
        setFile(null);
        return;
      }
      setFile(selected);
    } else {
      setFile(null);
    }
  };

  const submit = async () => {
    if (!description.trim()) {
      toast.error('Description is required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }

      await createBug(formData);
      toast.success('Bug reported.');
      setDescription('');
      setFile(null);
      // Reset the file input if needed (requires a ref, but simple state reset is often enough)
      const fileInput = document.getElementById('bug-file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report bug.');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Report Bug</h2>

      <textarea
        rows={8}
        cols={60}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the bug here..."
      />

      <br />
      <br />

      <div>
        <label htmlFor="bug-file-input">Attach screenshot/file (optional, max 5MB):</label>
        <br />
        <input
          id="bug-file-input"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.pdf,.zip"
          onChange={handleFileChange}
        />
      </div>

      <br />
      <br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default ReportBug;
