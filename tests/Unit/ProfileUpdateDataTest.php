<?php

namespace Tests\Unit;

use App\Modules\User\DTOs\ProfileUpdateData;
use App\Modules\User\Requests\ProfileUpdateRequest;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;

class ProfileUpdateDataTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_from_request_maps_validated_data_to_the_dto(): void
    {
        $request = Mockery::mock(ProfileUpdateRequest::class);
        $request->shouldReceive('validated')->andReturn([
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);

        $data = ProfileUpdateData::fromRequest($request);

        $this->assertSame('John Doe', $data->name);
        $this->assertSame('john@example.com', $data->email);
    }
}
