<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserMatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MatchController extends Controller
{
    /**
     * Display all matches for the authenticated user.
     */
    public function index()
    {
        $user = auth()->user();

        // Get matches where user1 is current user
        $matches = \App\Models\UserMatch::with('user2')
                    ->where('user1_id', $user->id)
                    ->orderBy('compatibility_score', 'desc')
                    ->limit(20)
                    ->get();

        return response()->json($matches);
    }

    /**
     * Generate matches for the authenticated user based on preferences.
     */
    public function generateMatches()
    {
        $user = auth()->user();

        // Get all other users with preferences
        $others = User::with('preferences')
                    ->where('id', '!=', $user->id)
                    ->get();

        $matches = [];

        foreach ($others as $other) {
            $score = $this->calculateScore($user, $other);

            // store or update match
            UserMatch::updateOrCreate(
                [
                    'user1_id' => $user->id,
                    'user2_id' => $other->id,
                ],
                [
                    'compatibility_score' => $score,
                ]
            );

            $matches[] = [
                'user' => $other,
                'score' => $score,
            ];
        }

        // Sort by score descending
        usort($matches, function($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        return response()->json($matches);
    }

    /**
     * Accept a match.
     */
    public function accept($id)
    {
        $user = auth()->user();

        $match = \App\Models\UserMatch::findOrFail($id);

        // user must be user1 or user2
        if ($match->user1_id !== $user->id && $match->user2_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $match->update(['status' => 'accepted']);

        return response()->json(['message' => 'Match accepted']);
    }

    /**
     * Reject a match.
     */
    public function reject($id)
    {
        $user = auth()->user();

        $match = \App\Models\UserMatch::findOrFail($id);

        if ($match->user1_id !== $user->id && $match->user2_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $match->update(['status' => 'rejected']);

        return response()->json(['message' => 'Match rejected']);
    }

    /**
     * Calculate compatibility score between two users.
     */
    private function calculateScore($user, $otherUser): float
    {
        $score = 0;
        $prefs1 = $user->preferences;
        $prefs2 = $otherUser->preferences;

        if (!$prefs1 || !$prefs2) {
            return 0;
        }

        // 1. Budget range match (+20)
        if ($prefs1->budget && $prefs2->budget) {
            // Consider same range if within 20% difference
            $diff = abs($prefs1->budget - $prefs2->budget) / max($prefs1->budget, $prefs2->budget);
            if ($diff <= 0.2) {
                $score += 20;
            }
        }

        // 2. Preferred location match (+20)
        if ($prefs1->preferred_location && $prefs2->preferred_location) {
            if ($prefs1->preferred_location === $prefs2->preferred_location) {
                $score += 20;
            }
        }

        // 3. Cleanliness difference small (+15)
        if ($prefs1->cleanliness_level && $prefs2->cleanliness_level) {
            $diff = abs($prefs1->cleanliness_level - $prefs2->cleanliness_level);
            // Small difference: 0-1 difference gets full points, 2 gets partial, 3+ gets none
            if ($diff <= 1) {
                $score += 15;
            } elseif ($diff === 2) {
                $score += 7.5;
            }
        }

        // 4. Same lifestyle (+15)
        if ($prefs1->lifestyle && $prefs2->lifestyle) {
            if ($prefs1->lifestyle === $prefs2->lifestyle) {
                $score += 15;
            }
        }

        // 5. Same sleeping schedule (+15)
        if ($prefs1->sleeping_schedule && $prefs2->sleeping_schedule) {
            if ($prefs1->sleeping_schedule === $prefs2->sleeping_schedule) {
                $score += 15;
            }
        }

        // 6. pet_friendly + smoking + drinking (+15 distributed: 5 each)
        if ($prefs1->pet_friendly === $prefs2->pet_friendly) {
            $score += 5;
        }
        if ($prefs1->smoking === $prefs2->smoking) {
            $score += 5;
        }
        if ($prefs1->drinking === $prefs2->drinking) {
            $score += 5;
        }

        // 7. Hobbies similarity count (+15)
        if ($prefs1->hobbies && $prefs2->hobbies) {
            $hobbies1 = array_map('trim', explode(',', $prefs1->hobbies));
            $hobbies2 = array_map('trim', explode(',', $prefs2->hobbies));
            $commonHobbies = array_intersect($hobbies1, $hobbies2);
            $totalHobbies = count(array_unique(array_merge($hobbies1, $hobbies2)));
            
            if ($totalHobbies > 0) {
                $similarityRatio = count($commonHobbies) / $totalHobbies;
                $score += $similarityRatio * 15;
            }
        }

        // Return score between 0-100
        return min(100, round($score, 2));
    }
}

