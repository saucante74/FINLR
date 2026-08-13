<?php

namespace App\Enums;

enum Permission: string
{
    case EXPORT_REPORTS = 'export_reports';
    case CREATE_PROJECT = 'create_project';
    case ADVANCED_CALCULATOR = 'advanced_calculator';
}
