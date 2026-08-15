<?php

namespace Tests\Unit;

use App\Modules\Auth\DTOs\PasswordResetLinkData;
use App\Modules\Auth\Requests\PasswordResetLinkRequest;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;

class PasswordResetLinkDataTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_from_request_maps_validated_data_to_the_dto(): void
    {
        $request = Mockery::mock(PasswordResetLinkRequest::class);
        $request->shouldReceive('validated')->andReturn([
            'email' => 'john@example.com',
        ]);

        $data = PasswordResetLinkData::fromRequest($request);

        $this->assertSame('john@example.com', $data->email);
    }

    public function test_to_array_returns_the_shape_expected_by_the_password_broker(): void
    {
        $data = new PasswordResetLinkData(email: 'john@example.com');

        $this->assertSame(['email' => 'john@example.com'], $data->toArray());
    }
}
