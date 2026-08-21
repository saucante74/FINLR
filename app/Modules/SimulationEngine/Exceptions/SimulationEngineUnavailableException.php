<?php

namespace App\Modules\SimulationEngine\Exceptions;

use RuntimeException;

/**
 * Thrown when the simulation engine cannot be resolved or fails to compute
 * a projection (e.g. the private saucante74/finlr-engine package is
 * absent). The message is technical, for logs only — bootstrap/app.php
 * renders a generic, translated message to the end user instead.
 */
class SimulationEngineUnavailableException extends RuntimeException {}
