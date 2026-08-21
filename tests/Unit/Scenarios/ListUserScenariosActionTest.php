<?php

namespace Tests\Unit\Scenarios;

use App\Modules\Scenarios\Actions\ListUserScenariosAction;
use App\Modules\Scenarios\DTOs\ScenarioSummaryData;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListUserScenariosActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_only_returns_scenarios_belonging_to_the_given_user(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();

        Scenario::factory()->count(2)->create(['user_id' => $owner->id]);
        Scenario::factory()->count(3)->create(['user_id' => $other->id]);

        $action = new ListUserScenariosAction;
        $summaries = $action->handle($owner);

        $this->assertCount(2, $summaries);
        $this->assertContainsOnlyInstancesOf(ScenarioSummaryData::class, $summaries);
    }

    public function test_it_sorts_scenarios_from_most_recent_to_oldest(): void
    {
        $user = User::factory()->create();

        $oldest = Scenario::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDays(2)]);
        $newest = Scenario::factory()->create(['user_id' => $user->id, 'created_at' => now()]);
        $middle = Scenario::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDay()]);

        $action = new ListUserScenariosAction;
        $summaries = $action->handle($user);

        $this->assertSame(
            [$newest->id, $middle->id, $oldest->id],
            array_map(fn (ScenarioSummaryData $summary): int => $summary->id, $summaries),
        );
    }
}
