<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\UserMatch;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display messages for a specific match.
     */
    public function index($matchId)
    {
        // 1. Check if user is part of the match
        $user = auth()->user();
        $match = UserMatch::findOrFail($matchId);
        
        if ($match->user1_id !== $user->id && $match->user2_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // 2. Fetch messages sorted by created_at
        $messages = Message::where('match_id', $matchId)
            ->with('sender:id,name,avatar_url')
            ->orderBy('created_at', 'asc')
            ->get();

        // 3. Return JSON
        return response()->json($messages);
    }

    /**
     * Send a message in a match.
     */
    public function send(Request $request, $id)
    {
        // 1. Validate body field
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        // 2. Create new Message
        $message = Message::create([
            'match_id' => $id,
            'sender_id' => auth()->id(),
            'body' => $validated['body'],
        ]);
        return response()->json($message->load('sender:id,name,avatar_url'));
    }
}

