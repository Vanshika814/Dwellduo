import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError("Session expired or invalid token. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setMatchesLoading(true);
    api.get("/matches")
      .then((res) => setMatches(res.data))
      .finally(() => setMatchesLoading(false));
  }, []);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Error during logout:", err);
      // Even if the API call fails, clear token locally to force re-auth
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top section, inspired by Home hero */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-500">
              Dwell Duo
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Your Matches
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Logout
          </button>
        </div>

        {/* Matches grid */}
        {matchesLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No matches found. Try updating your preferences.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white shadow-md p-4 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-3"></div>
                <h2 className="text-xl font-semibold">{match.user2?.name || "Unknown"}</h2>
                <p className="text-sm text-gray-600">
                  {match.user2?.age ? `${match.user2.age} • ` : ""}
                  {match.user2?.city || ""}
                </p>
                <span className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
                  {Math.round(match.compatibility_score || 0)}% Match
                </span>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


