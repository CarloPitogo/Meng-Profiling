<?php

namespace App\Services;

use App\Models\Event;

class EventService
{
    public function getAllEvents()
    {
        return Event::all();
    }
}
