import "./movieCard.css";
import { useNavigate } from "react-router-dom";

const normalizeGenres = (movie) => {
  const raw = movie?.genre ?? movie?.genres ?? null;
  if (!raw) return [];

  if (Array.isArray(raw)) return raw.filter(Boolean).map(String);

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.filter(Boolean).map(String);
      } catch {}
    }
    return [s];
  }

  if (typeof raw === "object") {
    return Object.values(raw).filter(Boolean).map(String);
  }

  return [];
};

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const title = movie?.title || movie?.name || "Untitled";
  const year = movie?.releaseDate?.slice?.(0, 4) || movie?.year || "";
  const rating = movie?.averageRating ?? movie?.avgRating ?? movie?.rating ?? null;
  const poster = movie?.posterUrl || movie?.poster || "";
  const genres = normalizeGenres(movie);

  const id = movie?._id || movie?.id; // ВАЖНО

  const handleOpen = () => {
    if (!id) return; // чтобы не было /movies/undefined
    navigate(`/movies/${id}`);
  };

  return (
    <button className="movieCard glass" onClick={handleOpen} type="button">
      <div className="poster">
        {poster ? (
          <img
            src={poster}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Image";
            }}
          />
        ) : (
          <div className="posterPlaceholder">
            <div className="phIcon">🎬</div>
            <div className="phText">No poster</div>
          </div>
        )}

        {rating !== null && (
          <div className="ratingPill">
            ⭐ <span>{Number(rating).toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="meta">
        <div className="titleRow">
          <div className="movieTitle">{title}</div>
          {year && <div className="year">{year}</div>}
        </div>

        <div className="sub">
          {genres.length ? (
            genres.slice(0, 2).map((g) => (
              <span className="badge" key={g}>{g}</span>
            ))
          ) : (
            <span className="badge">Movie</span>
          )}
          {movie?.duration && <span className="badge">{movie.duration} min</span>}
        </div>
      </div>
    </button>
  );
}
