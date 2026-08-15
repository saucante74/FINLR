<?php

namespace Tests\Unit;

use App\Modules\Auth\DTOs\ResetPasswordData;
use App\Modules\Auth\Requests\NewPasswordRequest;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;

class ResetPasswordDataTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_from_request_maps_validated_data_to_the_dto(): void
    {
        $request = Mockery::mock(NewPasswordRequest::class);
        $request->shouldReceive('validated')->andReturn([
            'token' => 'reset-token',
            'email' => 'john@example.com',
            'password' => 'new-secret-password',
        ]);

        $data = ResetPasswordData::fromRequest($request);

        $this->assertSame('reset-token', $data->token);
        $this->assertSame('john@example.com', $data->email);
        $this->assertSame('new-secret-password', $data->password);
    }

    public function test_to_array_returns_the_shape_expected_by_the_password_broker(): void
    {
        $data = new ResetPasswordData(
            token: 'reset-token',
            email: 'john@example.com',
            password: 'new-secret-password',
        );

        $this->assertSame([
            'token' => 'reset-token',
            'email' => 'john@example.com',
            'password' => 'new-secret-password',
        ], $data->toArray());
    }
}
