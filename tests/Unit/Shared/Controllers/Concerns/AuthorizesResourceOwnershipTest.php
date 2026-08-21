<?php

namespace Tests\Unit\Shared\Controllers\Concerns;

use App\Modules\Shared\Controllers\Concerns\AuthorizesResourceOwnership;
use Illuminate\Contracts\Auth\Authenticatable;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Tests\TestCase;

class AuthorizesResourceOwnershipTest extends TestCase
{
    public function test_it_aborts_with_a_404_when_there_is_no_authenticated_user(): void
    {
        $this->expectException(NotFoundHttpException::class);

        $this->subject()->callAbortUnlessOwner(null, 1);
    }

    public function test_it_aborts_with_a_404_when_the_authenticated_user_does_not_own_the_resource(): void
    {
        $this->expectException(NotFoundHttpException::class);

        $this->subject()->callAbortUnlessOwner($this->userWithId(2), 1);
    }

    public function test_it_does_not_abort_when_the_authenticated_user_owns_the_resource(): void
    {
        $this->subject()->callAbortUnlessOwner($this->userWithId(1), 1);

        $this->addToAssertionCount(1);
    }

    public function test_it_aborts_with_the_given_status_code(): void
    {
        try {
            $this->subject()->callAbortUnlessOwner($this->userWithId(2), 1, 403);
            $this->fail('Expected an HttpException to be thrown.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    /**
     * A minimal class using the trait, exposing its protected method for the
     * test — the smallest surface needed to exercise the trait in isolation.
     */
    private function subject(): object
    {
        return new class
        {
            use AuthorizesResourceOwnership;

            public function callAbortUnlessOwner(?Authenticatable $user, int $ownerId, int $status = 404): void
            {
                $this->abortUnlessOwner($user, $ownerId, $status);
            }
        };
    }

    private function userWithId(int $id): Authenticatable
    {
        return new class($id) implements Authenticatable
        {
            public function __construct(private readonly int $id) {}

            public function getAuthIdentifierName(): string
            {
                return 'id';
            }

            public function getAuthIdentifier(): int
            {
                return $this->id;
            }

            public function getAuthPasswordName(): string
            {
                return 'password';
            }

            public function getAuthPassword(): string
            {
                return '';
            }

            public function getRememberToken(): ?string
            {
                return null;
            }

            public function setRememberToken($value): void {}

            public function getRememberTokenName(): string
            {
                return '';
            }
        };
    }
}
