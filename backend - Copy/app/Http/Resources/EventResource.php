<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'category' => $this->category,
            'date' => $this->date,
            'time' => $this->time,
            'venue' => $this->venue,
            'description' => $this->description,
            'organizer' => $this->organizer,
            'targetParticipants' => $this->target_participants ?? [],
            'registrationRequired' => $this->registration_required,
        ];
    }
}
