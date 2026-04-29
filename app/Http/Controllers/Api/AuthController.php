<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create([
            ...$request->validated(),
            'role' => User::ROLE_SALES,
        ]);

        $token = $user->createToken(
            name: 'api-token',
            abilities: $this->abilitiesForRole($user->role),
        )->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully.',
            'token' => $token,
            'data' => new UserResource($user),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user->tokens()->delete();

        $token = $user->createToken(
            name: 'api-token',
            abilities: $this->abilitiesForRole($user->role),
        )->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'data' => new UserResource($user),
        ]);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }

    private function abilitiesForRole(string $role): array
    {
        return match ($role) {
            User::ROLE_ADMIN => ['*'],
            User::ROLE_WAREHOUSE => ['categories:view', 'products:view', 'orders:view', 'stock:view', 'stock:manage'],
            User::ROLE_SALES => ['categories:view', 'products:view', 'orders:view', 'orders:create'],
            default => [],
        };
    }
}
