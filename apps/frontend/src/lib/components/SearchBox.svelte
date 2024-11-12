<script lang="ts">
  import { multiSelectStore } from '../store';
  import { debounce } from '../utils';

  let searchValue = '';
  const debouncedSearch = debounce((value: string) => {
    multiSelectStore.search(value);
  }, 300);

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchValue = target.value;
    debouncedSearch(searchValue);
  }
</script>

<div class="relative">
  <input
    type="text"
    placeholder="Search items..."
    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    bind:value={searchValue}
    on:input={handleInput}
  />
  {#if searchValue}
    <button
      class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      on:click={() => {
        searchValue = '';
        multiSelectStore.search('');
      }}
    >
      ✕
    </button>
  {/if}
</div>
