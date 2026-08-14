import { useEffect, useState } from "react";

import {
  createSubject,
  uploadResource,
  getContributions,
  approveContribution,
  deleteContribution,
  getBugs,
  resolveBug,
  deleteBug,
  getSubjects,
} from "../services/api";

const RESOURCE_TYPES = ["BOOKS", "NOTES", "PYQS", "LECTURES"];

function AdminDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [contributions, setContributions] = useState([]);

  const [subject, setSubject] = useState({
    subjectName: "",
    subjectCode: "",
    branch: "",
    semester: "",
  });

  const [resource, setResource] = useState({
    subjectId: "",
    title: "",
    type: "NOTES",
    url: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      const s = await getSubjects();
      const c = await getContributions();
      const b = await getBugs();

      setSubjects(s.data.data);
      setContributions(c.data.data);
      setBugs(b.data.data);
    } catch (e) {}
  };

  const createSubjectHandler = async () => {
    await createSubject(subject);

    alert("Subject Created");

    refresh();
  };

  const uploadHandler = async () => {
    const fd = new FormData();

    fd.append("subjectId", resource.subjectId);
    fd.append("title", resource.title);
    fd.append("type", resource.type);

    if (resource.type === "LECTURES") {
      fd.append("url", resource.url);
    } else {
      fd.append("resource", file);
    }

    await uploadResource(fd);

    alert("Uploaded");

    refresh();
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Dashboard</h2>

      <hr />

      <h3>Create Subject</h3>

      <input
        placeholder="Subject Name"
        onChange={(e) =>
          setSubject({ ...subject, subjectName: e.target.value })
        }
      />

      <input
        placeholder="Subject Code"
        onChange={(e) =>
          setSubject({ ...subject, subjectCode: e.target.value })
        }
      />

      <input
        placeholder="Branch"
        onChange={(e) => setSubject({ ...subject, branch: e.target.value })}
      />

      <input
        placeholder="Semester"
        onChange={(e) => setSubject({ ...subject, semester: e.target.value })}
      />

      <button onClick={createSubjectHandler}>Create</button>

      <hr />

      <h3>Upload Resource</h3>

      <select
        onChange={(e) =>
          setResource({ ...resource, subjectId: e.target.value })
        }
      >
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
        onChange={(e) => setResource({ ...resource, title: e.target.value })}
      />

      <br />
      <br />

      <select
        onChange={(e) => setResource({ ...resource, type: e.target.value })}
      >
        {RESOURCE_TYPES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <br />
      <br />

      {resource.type === "LECTURES" ? (
        <input
          placeholder="Youtube URL"
          onChange={(e) => setResource({ ...resource, url: e.target.value })}
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

      <button onClick={uploadHandler}>Upload</button>

      <hr />

      <h3>Pending Contributions</h3>

      {contributions.map((c) => (
        <div key={c._id}>
          {c.title}

          <button onClick={() => approveContribution(c._id)}>Approve</button>

          <button onClick={() => deleteContribution(c._id)}>Reject</button>
        </div>
      ))}

      <hr />

      <h3>Bug Reports</h3>

      {bugs.map((b) => (
        <div key={b._id}>
          <p>{b.description}</p>

          <button onClick={() => resolveBug(b._id)}>Resolve</button>

          <button onClick={() => deleteBug(b._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
