<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Announcement;

class AnnouncementController extends Controller
{
    public function index()
    {
        return response()->json(Announcement::orderBy('date', 'desc')->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|in:important,event,warning,success,info',
            'date' => 'required|date',
            'author' => 'nullable|string|max:255',
        ]);

        if (empty($validated['author'])) {
            $validated['author'] = 'System Admin'; // defaults to system admin
        }

        $announcement = Announcement::create($validated);
        return response()->json($announcement, 201);
    }

    public function show($id)
    {
        return response()->json(Announcement::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'type' => 'sometimes|required|string|in:important,event,warning,success,info',
            'date' => 'sometimes|required|date',
            'author' => 'nullable|string|max:255',
        ]);

        $announcement->update($validated);
        return response()->json($announcement);
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted successfully']);
    }
}
