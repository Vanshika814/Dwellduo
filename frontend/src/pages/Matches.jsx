import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get("/matches/top?limit=20");
      console.log("Matches response:", response.data); // Debug log
      if (response.data.success) {
        setMatches(response.data.data || []); // Backend returns data in 'data' field
      }
    } catch (err) {
      console.error("Fetch matches error:", err.response || err); // Debug log
      if (err.response?.status === 404) {
        setError("No matches found. Please generate matches first.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Please complete the game first");
      } else {
        setError("Failed to load matches");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMatches = async () => {
    console.log("🔵 Generate Matches button clicked!");
    setGenerating(true);
    setError("");
    
    try {
      console.log("📡 Calling POST /matches/calculate...");
      const response = await api.post("/matches/calculate");
      console.log("✅ Generate response:", response.data);
      
      // Wait for async match calculation to complete
      console.log("⏳ Waiting 2 seconds for match calculation to complete...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fetch updated matches
      console.log("🔄 Fetching updated matches...");
      await fetchMatches();
      console.log("✅ Matches refreshed!");
    } catch (err) {
      console.error("❌ Generate matches error:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error status:", err.response?.status);
      setError(
        err.response?.data?.message || "Failed to generate matches"
      );
    } finally {
      setGenerating(false);
      console.log("🏁 Generate matches process complete");
    }
  };

  const viewDetails = async (match) => {
    try {
      const response = await api.get(
        `/matching/compatibility/${match.matchedUser.id}`
      );
      setSelectedMatch({
        ...match,
        details: response.data.compatibility,
      });
      setShowDetails(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getCompatibilityColor = (percentage) => {
    if (percentage >= 80) return "from-green-500 to-emerald-500";
    if (percentage >= 60) return "from-sky-500 to-violet-500";
    if (percentage >= 40) return "from-violet-500 to-fuchsia-500";
    return "from-slate-500 to-gray-500";
  };

  const getCompatibilityLabel = (percentage) => {
    if (percentage >= 80) return "Excellent Match";
    if (percentage >= 60) return "Great Match";
    if (percentage >= 40) return "Good Match";
    return "Okay Match";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading matches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-500 mb-2">
            Your Matches
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Find Your Perfect Roommate
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Based on your preferences and compatibility score
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-amber-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Generate/Refresh Button - Always show when no matches */}
        {matches.length === 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/90 rounded-2xl border border-white/70 p-8 shadow-xl text-center">
              <p className="text-slate-600 mb-4">
                No matches found yet. Click below to find compatible roommates!
              </p>
              <button
                onClick={handleGenerateMatches}
                disabled={generating}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {generating ? "Generating..." : "Generate Matches"}
              </button>
            </div>
          </div>
        )}

        {/* Matches Grid */}
        {matches.length > 0 && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-slate-600">
                Found <span className="font-semibold text-slate-900">{matches.length}</span> compatible roommates
              </p>
              <button
                onClick={handleGenerateMatches}
                disabled={generating}
                className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-full font-medium hover:bg-white disabled:opacity-50 transition-all"
              >
                {generating ? "Refreshing..." : "Refresh Matches"}
              </button>
            </div>

            <div className="space-y-4">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-6">
                    {/* Left: User Info */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-violet-400 flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {match.matchedUser?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            {match.matchedUser?.name}
                          </h3>
                          {match.rank && match.rank <= 3 && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                              #{match.rank}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          {match.matchedUser?.age && <span>{match.matchedUser.age} yrs</span>}
                          {match.matchedUser?.currentCity && (
                            <>
                              <span>•</span>
                              <span>{match.matchedUser.currentCity}</span>
                            </>
                          )}
                          {match.matchedUser?.gender && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{match.matchedUser.gender.toLowerCase()}</span>
                            </>
                          )}
                          {match.matchedUser?.budget && (
                            <>
                              <span>•</span>
                              <span>{match.matchedUser.budget}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Compatibility & Actions */}
                    <div className="flex items-center gap-4">
                      {/* Compatibility */}
                      <div className="text-center">
                        <div className={`text-3xl font-bold bg-gradient-to-r ${getCompatibilityColor(
                          match.compatibilityScore
                        )} bg-clip-text text-transparent`}>
                          {Math.round(match.compatibilityScore)}%
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {getCompatibilityLabel(match.compatibilityScore)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewDetails(match)}
                          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg font-medium hover:bg-slate-800 transition-colors"
                        >
                          View
                        </button>
                        <button className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg font-medium hover:bg-green-600 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  {selectedMatch.matchedUser?.name}
                </h2>
                <p className="text-slate-600">Compatibility Details</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Compatibility Breakdown */}
            <div className="mb-6">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getCompatibilityColor(
                  selectedMatch.compatibilityScore
                )} text-white text-3xl font-bold shadow-lg mb-2`}>
                  {Math.round(selectedMatch.compatibilityScore)}%
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {getCompatibilityLabel(selectedMatch.compatibilityScore)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Compatibility Score
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round(selectedMatch.gameScore || 0)} game score
                  </p>
                </div>

                {selectedMatch?.hard_constraints_met !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Important Requirements
                    </p>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      selectedMatch.hard_constraints_met
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedMatch.hard_constraints_met ? (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            All important requirements met
                          </span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            Some requirements not met
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile Details */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-900">Profile Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedMatch.matchedUser.age && (
                  <div>
                    <p className="text-xs text-slate-500">Age</p>
                    <p className="font-medium text-slate-900">{selectedMatch.matchedUser.age}</p>
                  </div>
                )}
                {selectedMatch.matchedUser.gender && (
                  <div>
                    <p className="text-xs text-slate-500">Gender</p>
                    <p className="font-medium text-slate-900 capitalize">
                      {selectedMatch.matchedUser.gender}
                    </p>
                  </div>
                )}
                {selectedMatch.matchedUser.city && (
                  <div>
                    <p className="text-xs text-slate-500">City</p>
                    <p className="font-medium text-slate-900">{selectedMatch.matchedUser.city}</p>
                  </div>
                )}
                {selectedMatch.matchedUser.budget && (
                  <div>
                    <p className="text-xs text-slate-500">Budget</p>
                    <p className="font-medium text-slate-900">{selectedMatch.matchedUser.budget}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium hover:shadow-lg transition-all">
                Send Connection Request
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

