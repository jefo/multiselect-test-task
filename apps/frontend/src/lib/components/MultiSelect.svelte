<script lang="ts">
  import SearchBox from './SearchBox.svelte';
  import ItemsList from './ItemsList.svelte';
  import { multiSelectStore } from '../store';

  let selectedCount = 0;

  multiSelectStore.subscribe(state => {
    selectedCount = state.selectedItems.size;
  });
</script>

<div class="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
  <div class="p-4 border-b">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">
        Select Items
      </h2>
      {#if selectedCount > 0}
        <span class="text-sm text-gray-600">
          {selectedCount} item{selectedCount === 1 ? '' : 's'} selected
        </span>
      {/if}
    </div>
    <SearchBox />
  </div>
  
  <ItemsList />
</div>
