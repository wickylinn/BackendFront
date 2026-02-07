import MovieCard from "./MovieCard";

export default function MovieList({ movies = [], onOpen }) {
  if (!movies.length) {
    return (
      <div className="glass" style={{ padding: 18, borderRadius: 22 }}>
        <div style={{ fontWeight: 650 }}>No movies found</div>
        <div style={{ marginTop: 6, color: "rgba(232,238,255,.65)" }}>
          Try changing the search or filters.
        </div>
      </div>
    );
  }

  return (
    <div className="movieGrid">
      {movies.map((m) => (
        <MovieCard key={m._id || m.id || m.title} movie={m} onOpen={onOpen} />
      ))}
    </div>
  );
}
