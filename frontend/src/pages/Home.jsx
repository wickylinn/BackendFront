import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "../components/MovieList";
import API from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      // Вариант 1: если у тебя GET /api/movies возвращает массив
      const res = await API.get("/movies");
      const data = Array.isArray(res.data) ? res.data : (res.data?.movies || []);
      setMovies(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load movies.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter((m) => (m.title || "").toLowerCase().includes(q));
  }, [movies, query]);

  const openMovie = (movie) => {
    const id = movie?._id || movie?.id;
    if (!id) return;
    navigate(`/movies/${id}`);
  };

  return (
    <>
      <div className="hero">
        <div className="heroCard glass">
          <div className="heroRow">
            <div>
              <h1 className="h1">Discover movies. Rate. Review.</h1>
              <p className="p">Now connected to your MongoDB backend.</p>
            </div>
            <div className="kpis">
              <span className="badge">⭐ ratings</span>
              <span className="badge">🎞 trailers</span>
              <span className="badge">💬 reviews</span>
            </div>
          </div>

          <div className="searchRow">
            <input
              className="input"
              placeholder="Search by title…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: "1 1 320px" }}
            />
            <button className="btn" onClick={load} type="button">Refresh</button>
          </div>

          {err && <div style={{ marginTop: 10, color: "rgba(239,68,68,.95)", fontSize: 13 }}>{err}</div>}
        </div>

        <div className="sectionTitle">
          <h2>Movies</h2>
          <span>{loading ? "Loading…" : `${filtered.length} items`}</span>
        </div>
      </div>

      {loading ? (
        <div className="glass" style={{ padding: 18, borderRadius: 22 }}>Loading movies…</div>
      ) : (
        <MovieList movies={filtered} onOpen={openMovie} />
      )}
    </>
  );
}
