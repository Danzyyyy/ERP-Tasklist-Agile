<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignUuid('feature_id')->nullable()->constrained('features')->nullOnDelete();
            $table->string('task_code')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('complexity_weight', ['LOW', 'MEDIUM', 'HIGH'])->default('MEDIUM');
            $table->decimal('estimated_man_hours', 8, 2)->default(0);
            $table->decimal('actual_man_hours', 8, 2)->default(0);
            $table->timestamp('target_deadline')->comment('SLA H-1 deadline');
            $table->enum('status', ['DRAFT', 'RELEASED', 'DEVELOPMENT', 'CODE_REVIEW', 'TESTING', 'DONE'])->default('DRAFT')->index();
            $table->boolean('is_pm_verified')->default(false);
            $table->timestamp('pm_verified_at')->nullable();
            $table->string('pm_verified_by')->nullable();
            $table->boolean('is_tl_signed')->default(false);
            $table->timestamp('tl_signed_at')->nullable();
            $table->string('tl_signed_by')->nullable();
            $table->string('assignee_id')->nullable();
            $table->string('assignee_name')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
