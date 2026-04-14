<?php

namespace App\Services;

use App\Models\SystemLog;
use Illuminate\Support\Facades\Auth;

class SystemLogService
{
    public static function log($action, $module, $description, $itemId = null, $oldValues = null, $newValues = null)
    {
        return SystemLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'module' => $module,
            'item_id' => $itemId,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
        ]);
    }
}
