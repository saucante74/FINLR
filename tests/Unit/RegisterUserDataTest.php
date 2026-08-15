<?php

namespace Tests\Unit;

use App\Modules\Auth\DTOs\RegisterUserData;
use App\Modules\Auth\Requests\RegisterUserRequest;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;

class RegisterUserDataTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_from_request_maps_validated_data_to_the_dto(): void
    {
        $request = Mockery::mock(RegisterUserRequest::class);
        $request->shouldReceive('validated')->andReturn([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'secret-password',
        ]);

        $data = RegisterUserData::fromRequest($request);

        $this->assertSame('John Doe', $data->name);
        $this->assertSame('john@example.com', $data->email);
        $this->assertSame('secret-password', $data->password);
    }
}
