<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRateLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_sixth_registration_attempt_within_the_same_minute_is_rejected(): void
    {
        foreach (range(1, 5) as $attempt) {
            $this->post('/register', [])->assertStatus(302);
        }

        $this->post('/register', [])->assertStatus(429);
    }

    public function test_a_sixth_password_reset_attempt_within_the_same_minute_is_rejected(): void
    {
        foreach (range(1, 5) as $attempt) {
            $this->post('/reset-password', [])->assertStatus(302);
        }

        $this->post('/reset-password', [])->assertStatus(429);
    }

    public function test_a_fourth_forgot_password_attempt_from_the_same_ip_is_rejected(): void
    {
        foreach (range(1, 3) as $attempt) {
            $this->post('/forgot-password', ['email' => "user{$attempt}@example.com"])
                ->assertStatus(302);
        }

        $this->post('/forgot-password', ['email' => 'user4@example.com'])
            ->assertStatus(429);
    }

    public function test_forgot_password_is_also_capped_per_target_email_across_ip_addresses(): void
    {
        foreach (['10.0.0.1', '10.0.0.2', '10.0.0.3'] as $ip) {
            $this->withServerVariables(['REMOTE_ADDR' => $ip])
                ->post('/forgot-password', ['email' => 'victim@example.com'])
                ->assertStatus(302);
        }

        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.4'])
            ->post('/forgot-password', ['email' => 'victim@example.com'])
            ->assertStatus(429);
    }

    public function test_the_email_budget_is_scoped_to_a_single_mailbox(): void
    {
        foreach (['10.0.0.1', '10.0.0.2', '10.0.0.3'] as $ip) {
            $this->withServerVariables(['REMOTE_ADDR' => $ip])
                ->post('/forgot-password', ['email' => 'victim@example.com'])
                ->assertStatus(302);
        }

        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.4'])
            ->post('/forgot-password', ['email' => 'someone-else@example.com'])
            ->assertStatus(302);
    }
}
