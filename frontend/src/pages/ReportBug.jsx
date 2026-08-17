import { useState } from "react";
import toast from "react-hot-toast";
import { createBug } from "../services/api";

function ReportBug() {
  const [description, setDescription] = useState("");

  const submit = async () => {
    try {
      await createBug(description);
      toast.success("Bug reported.");
      setDescription("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to report bug.");
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
      />

      <br />
      <br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default ReportBug;
