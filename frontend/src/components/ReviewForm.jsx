import { useState } from "react";
import API from "../services/api";

const ReviewForm = ({ movieId, onCreated }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      setErr("Rating must be between 1 and 5.");
      return;
    }
    if (!comment.trim()) {
      setErr("Comment is required.");
      return;
    }

    try {
      setLoading(true);
      await API.post(`/reviews/${movieId}`, { rating: r, comment: comment.trim() });
      setComment("");
      setRating(5);
      onCreated?.(); // чтобы родитель обновил список
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Failed to send review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass" style={{ padding: 16, borderRadius: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ margin: 0 }}>Add review</h3>
        <span className="badge">1–5 ⭐</span>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <label className="label">
          Rating
          <input
            className="input"
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </label>

        <label className="label">
          Comment
          <textarea
            className="input"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write something useful…"
            style={{ resize: "vertical" }}
          />
        </label>

        {err && <div style={{ color: "rgba(239,68,68,.95)", fontSize: 13 }}>{err}</div>}

        <button className="btn btnPrimary" disabled={loading} type="submit">
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
