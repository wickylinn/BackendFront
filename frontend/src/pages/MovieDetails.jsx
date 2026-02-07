import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

const toEmbed = (url) => {
  if (!url) return "";
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.includes("/embed/")) return url;
    }

    return url;
  } catch {
    return url;
  }
};

const normalizeGenres = (movie) => {
  // поддерживаем разные названия поля
  const raw = movie?.genre ?? movie?.genres ?? null;
  if (!raw) return [];

  // Если это уже массив
  if (Array.isArray(raw)) return raw.filter(Boolean).map(String);

  // Если строка: может быть "Sci-Fi" или JSON строка '["Sci-Fi","Drama"]'
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.filter(Boolean).map(String);
      } catch {}
    }
    // если просто строка жанра
    return [s];
  }

  // Если пришёл объект (редко): {0:"Sci-Fi",1:"Drama"}
  if (typeof raw === "object") {
    const vals = Object.values(raw);
    return vals.filter(Boolean).map(String);
  }

  return [];
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    API.get(`/movies/${id}`).then((res) => setMovie(res.data));
  }, [id]);

  const genres = useMemo(() => normalizeGenres(movie), [movie]);
  const trailerSrc = useMemo(() => toEmbed(movie?.trailerUrl), [movie]);

  if (!movie) {
    return (
      <div className="glass" style={{ padding: 18, borderRadius: 22 }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="glass" style={{ padding: 16, borderRadius: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
          <div>
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,.10)",
                background: "rgba(255,255,255,.05)",
              }}
            >
              <img
                src={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Image"}
                alt={movie.title || "Movie"}
                style={{ width: "100%", height: "auto", display: "block" }}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Image";
                }}
              />
            </div>
          </div>

          <div>
            <h1 style={{ margin: 0 }}>{movie.title || "No Title"}</h1>
            <p className="p" style={{ marginTop: 10 }}>
              {movie.description || "No Description"}
            </p>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {genres.length ? (
                genres.map((g) => (
                  <span className="badge" key={g}>🎭 {g}</span>
                ))
              ) : (
                <span className="badge">🎭 N/A</span>
              )}

              <span className="badge">
                📅 {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "N/A"}
              </span>

              <span className="badge">⏱ {movie.duration || "N/A"} min</span>
            </div>

            {trailerSrc && (
              <div
                style={{
                  marginTop: 14,
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <iframe
                  width="100%"
                  height="315"
                  src={trailerSrc}
                  title={movie.title || "Movie"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <ReviewForm movieId={id} onCreated={() => setRefreshKey((x) => x + 1)} />
      <ReviewList movieId={id} refreshKey={refreshKey} />
    </div>
  );
};

export default MovieDetails;
