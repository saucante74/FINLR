<?php

namespace Tests\Unit;

use App\Modules\Auth\DTOs\RegisterUserData;
use App\Modules\Auth\Requests\RegisterUserRequest;
use Illuminate\Support\Str;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;

class RegisterUserDataTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_from_request_maps_validated_data_to_the_dto(): void
    {
        $request = Mockery::mock(RegisterUserRequest::class);
        $request->shouldReceive('string')->with('name')->andReturn(Str::of('John Doe'));
        $request->shouldReceive('string')->with('email')->andReturn(Str::of('john@example.com'));
        $request->shouldReceive('string')->with('password')->andReturn(Str::of('secret-password'));

        $data = RegisterUserData::fromRequest($request);

        $this->assertSame('John Doe', $data->name);
        $this->assertSame('john@example.com', $data->email);
        $this->assertSame('secret-password', $data->password);
    }
}
