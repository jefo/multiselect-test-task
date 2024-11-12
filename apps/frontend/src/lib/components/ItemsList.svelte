<script lang="ts">
  import { multiSelectStore } from '../store';
  import Item from './Item.svelte';
  import type { Item as ItemType } from '../types';
  import { onMount } from 'svelte';

  let items: ItemType[] = [];
  let loading = false;
  let hasMore = true;

  const unsubscribe = multiSelectStore.subscribe(state => {
    items = state.items;
    loading = state.loading;
    hasMore = state.hasMore;
  });

  onMount(() => {
    multiSelectStore.loadItems();
    return unsubscribe;
  });

  function handleScroll(event: Event) {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && hasMore) {
      const currentPage = Math.ceil(items.length / 20);
      multiSelectStore.loadItems(currentPage + 1);
    }
  }
</script>

<div 
  class="overflow-y-auto max-h-[400px] p-4"
  on:scroll={handleScroll}
>
  {#each items as item, index (item.id)}
    <Item {item} {index} />
  {/each}

  {#if loading}
    <div class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  {/if}

  {#if !hasMore && items.length > 0}
    <div class="text-center text-gray-500 py-4">
      No more items to load
    </div>
  {/if}

  {#if !loading && items.length === 0}
    <div class="text-center text-gray-500 py-4">
      No items found
    </div>
  {/if}
</div>
