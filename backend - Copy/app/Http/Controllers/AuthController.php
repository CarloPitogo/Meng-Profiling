<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\SystemLogService;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        
        SystemLogService::log(
            'LOGIN', 
            'Authentication', 
            "User logged in: {$user->email}",
            $user->id
        );

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'firstName' => $user->first_name,
                'middleName' => $user->middle_name,
                'lastName' => $user->last_name,
                'gender' => $user->gender,
                'email' => $user->email,
                'role' => $user->role ?? 'student'
            ]
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'sometimes|string|in:admin,faculty,student'
        ]);

        $role = $request->role ?? 'student';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role
        ]);

        $nameParts = explode(' ', $request->name, 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';

        if ($role === 'student') {
            \App\Models\Student::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $request->email,
                'student_number' => 'STU-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'status' => 'Active',
            ]);
        } elseif ($role === 'faculty') {
            \App\Models\Faculty::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $request->email,
                'employee_number' => 'FAC-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'phone' => 'N/A',
                'department' => 'Unassigned',
                'position' => 'Unassigned',
                'status' => 'Active',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        
        SystemLogService::log(
            'REGISTER', 
            'Authentication', 
            "New user registered: {$user->email} with role: {$user->role}",
            $user->id,
            null,
            ['name' => $user->name, 'email' => $user->email, 'role' => $user->role]
        );

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'firstName' => $user->first_name,
                'middleName' => $user->middle_name,
                'lastName' => $user->last_name,
                'gender' => $user->gender,
                'email' => $user->email,
                'role' => $user->role ?? 'student'
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        
        SystemLogService::log(
            'LOGOUT', 
            'Authentication', 
            "User logged out: {$user->email}",
            $user->id
        );

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match your current password.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        SystemLogService::log(
            'UPDATE', 
            'Authentication', 
            "User updated their password: {$user->email}",
            $user->id
        );

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'gender' => 'nullable|string|max:20',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $fullName = trim("{$request->firstName} {$request->middleName} {$request->lastName}");
        $fullName = str_replace('  ', ' ', $fullName);

        $user->update([
            'name' => $fullName,
            'first_name' => $request->firstName,
            'middle_name' => $request->middleName,
            'last_name' => $request->lastName,
            'gender' => $request->gender,
            'email' => $request->email,
        ]);

        // Sync with related models
        if ($user->role === 'student') {
            \App\Models\Student::where('email', $user->getOriginal('email'))->update([
                'first_name' => $request->firstName,
                'middle_name' => $request->middleName,
                'last_name' => $request->lastName,
                'gender' => $request->gender,
                'email' => $request->email,
            ]);
        } elseif ($user->role === 'faculty') {
            \App\Models\Faculty::where('email', $user->getOriginal('email'))->update([
                'first_name' => $request->firstName,
                'middle_name' => $request->middleName,
                'last_name' => $request->lastName,
                'gender' => $request->gender,
                'email' => $request->email,
            ]);
        }

        SystemLogService::log(
            'UPDATE', 
            'Authentication', 
            "User updated their profile: {$user->email}",
            $user->id
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'firstName' => $user->first_name,
                'middleName' => $user->middle_name,
                'lastName' => $user->last_name,
                'gender' => $user->gender,
                'email' => $user->email,
                'role' => $user->role ?? 'student'
            ]
        ]);
    }
}
