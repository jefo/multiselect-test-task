<script lang="ts">
  import MultiSelect from '$lib/components/MultiSelect.svelte';
</script>

<div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Multi-Select Component
      </h1>
      <p class="mt-2 text-sm text-gray-600">
        Search, select, and reorder items using drag and drop
      </p>
    </div>

    <MultiSelect />
  </div>
</div>
