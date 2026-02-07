import { useEffect, useState } from "react";
import API from "../services/api";

const ReviewList = ({ movieId, refreshKey = 0 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    API.get(`/reviews/${movieId}`)
      .then((res) => {
        if (!alive) return;
        setReviews(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (!alive) return;
        setReviews([]);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [movieId, refreshKey]);

  return (
    <div className="glass" style={{ padding: 16, borderRadius: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ margin: 0 }}>Reviews</h3>
        <span style={{ color: "rgba(232,238,255,.6)", fontSize: 13 }}>
          {loading ? "Loading…" : `${reviews.length} total`}
        </span>
      </div>

      <hr className="hr" />

      {!loading && reviews.length === 0 && (
        <div style={{ color: "rgba(232,238,255,.65)" }}>No reviews yet. Be the first.</div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {reviews.map((r) => (
          <div
            key={r._id}
            style={{
              padding: 12,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,.10)",
              background: "rgba(255,255,255,.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 650 }}>
                {r?.user?.username || "Anonymous"}
              </div>
              <div className="badge">⭐ {r?.rating ?? "?"}</div>
            </div>
            {r?.comment && <p style={{ margin: "10px 0 0", color: "rgba(232,238,255,.75)" }}>{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
