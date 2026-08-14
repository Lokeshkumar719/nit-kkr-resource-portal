import { useEffect, useState } from "react";
import { createContribution, getSubjects } from "../services/api";

const RESOURCE_TYPES = ["BOOKS", "NOTES", "PYQS", "LECTURES"];

function Contribute() {
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    subjectId: "",
    title: "",
    type: "NOTES",
    url: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();

      setSubjects(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async () => {
    try {
      const formData = new FormData();

      formData.append("subjectId", form.subjectId);
      formData.append("title", form.title);
      formData.append("type", form.type);

      if (form.type === "LECTURES") {
        formData.append("url", form.url);
      } else {
        formData.append("resource", file);
      }

      await createContribution(formData);

      alert("Contribution submitted.");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Contribute</h2>

      <select onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
        <option>Select Subject</option>

        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.subjectName}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <br />
      <br />

      <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
        {RESOURCE_TYPES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <br />
      <br />

      {form.type === "LECTURES" ? (
        <input
          placeholder="Youtube URL"
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
      ) : (
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}

      <br />
      <br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default Contribute;
