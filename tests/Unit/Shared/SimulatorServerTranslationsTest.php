<?php

namespace Tests\Unit\Shared;

use Illuminate\Support\Facades\App;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Regression guard for the Analogy defaultLabelA/defaultLabelB bug: every
 * `simulator.*` key resolved server-side via __() must live in
 * lang/{locale}/simulator.php (Laravel's own group/item convention), never
 * only in lang/{locale}.json (i18next's nested convention, consumed by the
 * frontend, which __() cannot read by dotted path — a dotted key always
 * resolves as "group.item" against a PHP lang file). Before
 * lang/{locale}/simulator.php existed, every key below silently returned
 * its own raw key string instead of a translation, identically in all 3
 * locales (verified via tinker) — not a duplicated JSON key, not a
 * per-language issue.
 */
class SimulatorServerTranslationsTest extends TestCase
{
    /**
     * @return list<array{0: string}>
     */
    public static function serverResolvedKeys(): array
    {
        return [
            ['simulator.analogy.defaultLabelA'],
            ['simulator.analogy.defaultLabelB'],
            ['simulator.calculationFailed'],
            ['simulator.fire.form.invalidInput'],
        ];
    }

    #[DataProvider('serverResolvedKeys')]
    public function test_the_key_resolves_to_an_actual_translation_in_every_supported_locale(string $key): void
    {
        foreach (['fr', 'en', 'it'] as $locale) {
            App::setLocale($locale);

            $this->assertNotSame(
                $key,
                __($key),
                "__('{$key}') returned its own raw key for locale '{$locale}' instead of a translation ".
                '— is it missing from lang/'.$locale.'/simulator.php?',
            );
        }
    }
}
