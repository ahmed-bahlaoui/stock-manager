<?php

namespace App\Policies;

use App\Models\StockMovement;
use App\Models\User;

class StockMovementPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([User::ROLE_ADMIN, User::ROLE_WAREHOUSE]);
    }

    public function view(User $user, StockMovement $stockMovement): bool
    {
        return $this->viewAny($user);
    }

    public function stockIn(User $user): bool
    {
        return $user->hasAnyRole([User::ROLE_ADMIN, User::ROLE_WAREHOUSE]);
    }
}
