import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Eye, MessageCircle } from "lucide-react";
import LocationSearch from "../components/LocationSearch";
import { 
  fetchCompatibilityMatches, 
  fetchLocationMatches, 
  fetchAllUsers,
  fetchUsersByCity,
  generateMatches,
  setFilters,
  setSelectedMatch as setSelectedMatchRedux,
  clearError
} from "../store/slices/matchesSlice";
import { checkGameCompletion } from "../store/slices/gameSlice";
import { fetchUserProfile } from "../store/slices/authSlice";

const ActionButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full bg-[#EFEFEF]
      shadow-[inset_1px_1px_4px_rgba(215,219,184,0.5)]
      hover:bg-slate-200 flex items-center justify-center
      transition-all duration-200"
    >
      {children}
    </button>
  );
};

export default function Matches() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { list: matches, loading, generating, error, filters } = useSelector((state) => state.matches);
  const { hasCompleted: hasCompletedGame } = useSelector((state) => state.game);
  const currentUser = useSelector((state) => state.auth.user);
  
  // Local state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState("all"); // Start with "all" by default

  // Filter out current user from matches
  const filteredMatches = matches.filter((match) => {
    if (!currentUser?.id) return true; // Show all matches if current user not loaded yet
    const matchedUserId = match.matchedUser?.id || match.id;
    return matchedUserId && matchedUserId !== currentUser.id;
  });

  // Parse URL params
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");
  const lat = params.get("lat");
  const lng = params.get("lng");
  const radius = params.get("radius") || 10000;
  const city = params.get("city");
  const urlView = params.get("view");

  // Fetch current user profile if not already loaded
  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, currentUser]);

  // Check if user has completed the game on mount
  useEffect(() => {
    dispatch(checkGameCompletion());
  }, [dispatch]);

  // Sync viewMode with URL on mount
  useEffect(() => {
    if (urlView === "all") {
      setViewMode("all");
    } else if (mode !== "location") {
      // Default to all mode when not in location mode and no view param
      setViewMode("all");
    }
  }, [urlView, mode]);

  // Fetch data based on mode and viewMode
  useEffect(() => {
    // Don't fetch data until we know the game completion status
    if (hasCompletedGame === null) return;

    if (city) {
      // Fetch users by city name
      dispatch(fetchUsersByCity(city));
    } else if (mode === "location" && lat && lng) {
      dispatch(fetchLocationMatches({ lat, lng, radius }));
    } else {
      if (viewMode === "roommate") {
        if (hasCompletedGame) {
          dispatch(fetchCompatibilityMatches());
        } else {
          // If game not completed, switch to "all" mode
          setViewMode("all");
          dispatch(fetchAllUsers());
        }
      } else {
        dispatch(fetchAllUsers());
      }
    }
  }, [mode, lat, lng, radius, city, viewMode, hasCompletedGame, dispatch]);


  const handleGenerateMatches = async () => {
    dispatch(generateMatches());
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
    if (percentage >= 80) return "from-[#CCD1A5] to-[#CCD1A5]";
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
      <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#Fafafa]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading matches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#FAFAFA]">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fffbeb',
            color: '#92400e',
            border: '1px solid #fbbf24',
            borderRadius: '0.5rem',
            padding: '16px',
          },
        }}
      />
      
      {/* Blurred Green Semicircle - Responsive */}
      <div className="absolute top-[-150px] md:top-[-350px] left-1/2 -translate-x-1/2 
        w-[800px] h-[300px] md:w-[1600px] md:h-[500px]
        bg-[#D7DBB8] 
        rounded-[50%/40%]
        blur-[80px] md:blur-[60px]
        opacity-100
        pointer-events-none
        z-0">
      </div>
        <div className="relative z-50">
          <Navbar />
        </div>
        
        <div className="relative z-10 min-w-0 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-12">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#565656] mb-2">
              Your Matches
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#565656] mb-2">
              Find Your Perfect Roommate
            </h1>
            <p className="text-xs sm:text-sm text-[#565656] max-w-2xl mx-auto px-0">
              {mode === "location" 
                ? "Showing nearby users in your selected area"
                : "Based on your preferences and compatibility score"}
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
        {filteredMatches.length === 0 && (
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="bg-white/90 rounded-2xl border border-white/70 p-6 sm:p-8 shadow-xl text-center">
              <p className="text-slate-600 text-sm sm:text-base mb-4">
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
        {filteredMatches.length > 0 && (
          <>
            <div className="mb-6">
              {/* View Mode Tabs */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  {["all", "roommate"].map((mode) => {
                    const isActive = viewMode === mode;
                    const isRoommate = mode === "roommate";
                    const buttonClass = `px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                    } ${isRoommate && !hasCompletedGame ? "opacity-60" : ""}`;
                    
                    return (
                      <button
                        key={mode}
                        onClick={() => {
                          if (isRoommate && !hasCompletedGame) {
                            toast((t) => (
                              <div>
                                <p className="font-medium text-sm mb-2">
                                  Please answer the compatibility game first to see better matches!
                                </p>
                                <button
                                  onClick={() => {
                                    toast.dismiss(t.id);
                                    navigate('/game');
                                  }}
                                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
                                >
                                  Take the game now →
                                </button>
                              </div>
                            ), { icon: '⚠️', duration: 5000 });
                            return;
                          }
                          setViewMode(mode);
                          navigate(mode === "all" ? "/matches?view=all" : "/matches");
                        }}
                        className={buttonClass}
                      >
                        <span className="flex items-center gap-1">
                          {mode === "all" ? "Show All" : "Roommate"}
                          {isRoommate && !hasCompletedGame && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <div className="w-full sm:w-64">
                    <LocationSearch
                      placeholder="Search location..."
                      onSelect={(location) => {
                        const viewParam = viewMode === "all" ? "&view=all" : "";
                        navigate(`/matches?mode=location&lat=${location.lat}&lng=${location.lng}&radius=10000${viewParam}`);
                      }}
                    />
                  </div>
                  {viewMode === "roommate" && (
                    <button
                      onClick={handleGenerateMatches}
                      disabled={generating}
                      className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-full font-medium hover:bg-white disabled:opacity-50 transition-all whitespace-nowrap"
                    >
                      {generating ? "Refreshing..." : "Refresh Matches"}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Results count */}
              <p className="text-sm text-slate-600">
                Found <span className="font-semibold text-slate-900">{filteredMatches.length}</span> {viewMode === "all" ? "users" : "compatible roommates"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map((match, index) => (
                  <div
                    key={index}
                    className="min-h-[9rem] sm:min-h-[9rem] md:min-h-[11rem] w-full max-w-full mx-0 sm:mx-2 my-2 sm:my-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0px_1px_20px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col h-full min-w-0">
                      {/* Top Section: Image and Content */}
                      <div className="flex flex-1 min-w-0 border-b border-slate-200">
                        {/* Left: Profile Image */}
                        <div className="w-24 h-24 sm:w-28 sm:h-24 md:w-36 md:h-[129px] p-[4px] flex items-center justify-center flex-shrink-0 rounded-tl-xl bg-[linear-gradient(to_right,#ECE1C6_0%,rgba(232,232,232,0.1)_100%)]">
                          <div className="w-full h-full bg-gradient-to-br from-sky-400 to-violet-400 flex items-center justify-center text-white text-3xl sm:text-4xl md:text-6xl font-bold rounded-tl-xl overflow-hidden">
                            {match.matchedUser?.profilePicture || match.matchedUser?.profileImage ? (
                              <img 
                                src={match.matchedUser?.profilePicture || match.matchedUser?.profileImage}
                                alt={match.matchedUser?.name || 'Profile'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `<span class="text-6xl font-bold">${match.matchedUser?.name?.charAt(0).toUpperCase() || "?"}</span>`;
                                }}
                              />
                            ) : (
                              <span>{match.matchedUser?.name?.charAt(0).toUpperCase() || "?"}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Right: Content */}
                        <div className="flex-1 min-w-0 pt-2 px-2 sm:px-3 pb-2 sm:pb-3 flex flex-col gap-y-1 sm:gap-y-1">
                        {/* Top: Name & Location */}
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-[#595959] mb-0.5 sm:mb-1 truncate">
                            {match.matchedUser?.name}
                          </h3>
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[#9C9C9C] min-w-0">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[9px] sm:text-[10px] truncate">
                              {match.matchedUser?.currentCity || match.matchedUser?.city || 'Location not specified'}
                              {match.distance && ` • ${match.distance.toFixed(1)}km away`}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Three Column Info */}
                        <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
                          <div>
                            <p className="text-[12px] text-[#9C9C9C] mb-1">Rent</p>
                            <p className="text-xs font-semibold text-[#595959]">
                              {match.matchedUser?.budget || '₹15000'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[12px] text-[#9C9C9C] mb-1">Looking For</p>
                            <p className="text-xs font-semibold text-[#595959] capitalize">
                              {match.matchedUser?.gender || 'Any'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[12px] text-[#9C9C9C] mb-1">Looking For</p>
                            <p className="text-xs font-semibold text-[#595959]">
                              Roommate
                            </p>
                          </div>
                        </div>
                        </div>
                      </div>

                      {/* Bottom: Full Width - Age/Gender and Match Info */}
                      <div className="flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2 gap-2">
                        {/* Left: Age & Gender */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[#9C9C9C] min-w-0">
                          <span className="text-[9px] sm:text-[10px]">{match.matchedUser?.age || '22'}yrs</span>
                          <span className="text-[#9C9C9C]">-•-</span>
                          <span className="text-[9px] sm:text-[10px] uppercase font-medium truncate">{match.matchedUser?.gender || 'Female'}</span>
                        </div>
                        
                        {/* Right: Match Score & Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          {match.compatibilityScore ? (
                            <div className="text-center">
                              <div className="text-[10px] font-bold text-[#595959]">
                                {Math.round(match.compatibilityScore)}% Match
                              </div>
                              <div className={`h-1 w-full rounded-full mt-1 bg-gradient-to-r ${getCompatibilityColor(match.compatibilityScore)}`}></div>
                            </div>
                          ) : match.distance && (
                            <div className="text-center">
                              <div className="text-[10px] font-bold text-[#595959]">
                                {match.distance.toFixed(1)}km
                              </div>
                              <div className="text-[8px] text-[#9C9C9C]">away</div>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <ActionButton onClick={() => viewDetails(match)}>
                            <Eye className="w-4 h-4 text-[#B3B3B3]" />
                          </ActionButton>

                          <ActionButton
                            onClick={() =>
                              navigate(
                                `/chat?with=${match.matchedUser?.id || match.id}&name=${encodeURIComponent(
                                  match.matchedUser?.name || "User"
                                )}`
                              )
                            }
                          >
                            <MessageCircle className="w-4 h-4 text-[#B3B3B3]" />
                          </ActionButton>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1 sm:mb-2 truncate">
                  {selectedMatch.matchedUser?.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-600">Compatibility Details</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Close"
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
              <div className="text-center mb-4 sm:mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${getCompatibilityColor(
                  selectedMatch.compatibilityScore
                )} text-white text-2xl sm:text-3xl font-bold shadow-lg mb-2`}>
                  {Math.round(selectedMatch.compatibilityScore)}%
                </div>
                <p className="text-base sm:text-lg font-semibold text-slate-900">
                  {getCompatibilityLabel(selectedMatch.compatibilityScore)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
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
            <div className="space-y-4 mb-4 sm:mb-6">
              <h3 className="font-semibold text-slate-900">Profile Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium hover:shadow-lg transition-all text-sm sm:text-base">
                Send Connection Request
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-all text-sm sm:text-base"
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

