import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Game() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchQuestions();
    checkCompletion();
  }, []);

  // Layout wrapper component to avoid repetition
  const GameLayout = ({ children }) => (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#FAFAFA]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-120px] md:top-[-280px] left-1/2 -translate-x-1/2 
          w-[800px] h-[340px] md:w-[1600px] md:h-[560px]
          bg-[#EADEC2] 
          rounded-[50%/40%]
          blur-[80px] md:blur-[60px]
          opacity-100">
        </div>
      </div>
      <Navbar />
      {children}
    </div>
  );

  const buildOptions = (question) => {
    if (!question.options) return [];
    
    return question.options.map((text, index) => {
      const letter = String.fromCharCode(65 + index); // A, B, C, D
      return {
        text: text,
        image: question[`option${letter}ImageUrl`],
      };
    });
  };
  
  const fetchQuestions = async () => {
    try {
      const response = await api.get("/game/questions");
      if (response.data.success) {
        const questions = response.data.data;
        setQuestions(questions);
        // Initialize answers object
        const initialAnswers = {};
        questions.forEach((q) => {
          initialAnswers[q.id] = [];
        });
        setAnswers(initialAnswers);
      }
    } catch (err) {
      setError("Failed to load questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkCompletion = async () => {
    try {
      const response = await api.get("/game/completed");
      if (response.data.success && response.data.data) {
        setCompleted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleOption = (questionId, optionIndex) => {
    setAnswers((prev) => {
      const currentSelections = prev[questionId] || [];
      if (currentSelections.includes(optionIndex)) {
        // Remove if already selected
        return {
          ...prev,
          [questionId]: currentSelections.filter((i) => i !== optionIndex),
        };
      } else {
        // Add if less than 3 selections
        if (currentSelections.length < 3) {
          return {
            ...prev,
            [questionId]: [...currentSelections, optionIndex],
          };
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    const unanswered = questions.filter((q) => !answers[q.id]?.length);
    if (unanswered.length > 0) {
      setError(`Please answer all questions. ${unanswered.length} remaining.`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Format answers for backend (convert selected options array to JSON string)
      const formattedAnswers = Object.entries(answers).map(([qId, opts]) => {
        const question = questions.find(q => q.id === parseInt(qId));
        const builtOptions = buildOptions(question);
        const selectedTexts = opts.map(optIndex => {
          const option = builtOptions[optIndex];
          return option?.text;
        });
        
        return {
          questionId: parseInt(qId),
          answer: JSON.stringify(opts), // Store indices as JSON
          answerText: selectedTexts.join(', ') // Store readable text
        };
      });

      const response = await api.post("/game/answers/bulk", formattedAnswers);

      if (response.data.success) {
        setCompleted(true);
        
        // Mark profile as completed after game
        try {
          await api.post("/users/me/complete-profile");
          console.log("Profile marked as complete");
        } catch (profileErr) {
          console.error("Error marking profile complete:", profileErr);
        }
        
        // Generate matches
        try {
          await api.post("/matches/calculate");
        } catch (matchErr) {
          console.error("Match calculation error:", matchErr);
        }
        // Navigate to matches
        setTimeout(() => navigate("/matches"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save answers");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-[80vh] px-4 w-full overflow-x-hidden">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading questions...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-[80vh] px-4 w-full overflow-x-hidden">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">No Questions Available</h1>
              <p className="text-slate-600 text-sm sm:text-base">
                The game questions haven't been set up yet. Please contact the administrator.
              </p>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (completed && !submitting) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-[80vh] px-4 w-full overflow-x-hidden">
          <div className="w-full max-w-2xl text-center min-w-0">
            <div className="bg-white/90 rounded-2xl sm:rounded-3xl border border-white/70 p-6 sm:p-8 md:p-12 shadow-2xl backdrop-blur">
              <div className="mb-4 sm:mb-6">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
                  Game Complete!
                </h1>
                <p className="text-slate-600">
                  Finding your perfect roommate matches...
                </p>
              </div>
              <button
                onClick={() => navigate("/matches")}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                View Matches
              </button>
            </div>
          </div>
        </div>
      </GameLayout>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <GameLayout>
      <div className="flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12 min-w-0 w-full overflow-x-hidden">
        <div className="w-full max-w-3xl min-w-0 overflow-x-hidden">
          {/* Header - sits up in the gradient circle area */}
          <div className="mb-6 sm:mb-8 text-center relative z-10">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-500 mb-2">
              Roommate Matching Game
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
              Find Your Perfect Roommate
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Answer 10 questions to find compatible roommates
            </p>
          </div>

         
          {question && (
            <div className="mb-6 sm:mb-8">
              {/* Question Header */}
              <div className="mb-4 sm:mb-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {question.constraint_type === "hard" && (
                    <span className="px-2.5 sm:px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      Important
                    </span>
                  )}
                  <span className="px-2.5 sm:px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                    {question.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-0">
                  {question.question}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select 1-3 options that describe you
                </p>
              </div>

              {/* Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 min-w-0 overflow-x-hidden">
                {buildOptions(question).map((option, index) => {
                  const isSelected = answers[question.id]?.includes(index);
                  const optionText = option.text;
                  const optionImage = option.image;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleOption(question.id, index)}
                      className={`
                        group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-[1.02] md:hover:scale-105 min-h-[220px] sm:min-h-[280px] md:min-h-[320px] flex flex-col min-w-0
                        ${
                          isSelected
                            ? "border-sky-400 shadow-2xl ring-2 sm:ring-4 ring-sky-200"
                            : "border-slate-200 hover:border-sky-300 hover:shadow-xl"
                        }
                      `}
                    >
                      {/* Option Image with Text Overlay */}
                      {optionImage ? (
                        <div className="relative w-full h-full min-h-[220px] sm:min-h-[280px] md:min-h-[320px]">
                          {/* Background Image */}
                          <img
                            src={optionImage}
                            alt={optionText}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          
                          {/* Dark Gradient Overlay for Text Readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          
                          {/* Text Overlay */}
                          <div className="absolute inset-0 flex items-end justify-center p-4 sm:p-6">
                            <p className="text-base sm:text-lg md:text-xl font-bold text-white text-center leading-relaxed drop-shadow-lg z-10">
                              {optionText}
                            </p>
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
                              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center shadow-xl border-2 border-white">
                                <svg
                                  className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Fallback for text-only options */
                        <>
                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center shadow-lg">
                                <svg
                                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                          
                          {/* Text Only (No Image) */}
                          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
                            <p
                              className={`text-base sm:text-lg font-bold leading-relaxed text-center transition-colors ${
                                isSelected
                                  ? "text-slate-900"
                                  : "text-slate-700 group-hover:text-slate-900"
                              }`}
                            >
                              {optionText}
                            </p>
                          </div>
                        </>
                      )}

                      {/* Gradient Overlay on Hover (for unselected) */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-sky-500/5 group-hover:via-violet-500/5 group-hover:to-fuchsia-500/5 transition-all duration-300 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-sky-500 to-violet-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50 transition-all text-sm sm:text-base"
              >
                {submitting ? "Submitting..." : "Submit & Find Matches"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all text-sm sm:text-base"
              >
                Next →
              </button>
            )}
          </div>

          {/* Question Dots */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${
                    index === currentQuestion
                      ? "bg-sky-500 w-8"
                      : answers[questions[index]?.id]?.length
                      ? "bg-green-400"
                      : "bg-slate-300"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
