<script lang="ts">
  import type { Item } from '../types';
  import { multiSelectStore } from '../store';
  import { classNames } from '../utils';

  export let item: Item;
  export let index: number;

  let isDragging = false;

  function handleSelect() {
    multiSelectStore.toggleSelection(item.id);
  }

  function handleDragStart(event: DragEvent) {
    if (!event.dataTransfer) return;
    isDragging = true;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', index.toString());
  }

  function handleDragEnd() {
    isDragging = false;
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    
    const sourceIndex = parseInt(event.dataTransfer.getData('text/plain'));
    if (sourceIndex !== index) {
      const items = $multiSelectStore.items;
      const newItems = [...items];
      const [movedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(index, 0, movedItem);
      multiSelectStore.updateSort(newItems);
    }
  }
</script>

<div
  class={classNames(
    'flex items-center p-3 border rounded-lg mb-2 bg-white cursor-move select-none',
    isDragging ? 'opacity-50' : 'hover:bg-gray-50'
  )}
  draggable="true"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:dragover={handleDragOver}
  on:drop={handleDrop}
  role="listitem"
>
  <div class="flex items-center flex-1 min-w-0">
    <input
      type="checkbox"
      class="w-4 h-4 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={item.selected}
      on:change={handleSelect}
    />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">
        {item.label}
      </p>
    </div>
  </div>
  <div class="ml-3 flex-shrink-0">
    <svg
      class="h-4 w-4 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 8h16M4 16h16"
      />
    </svg>
  </div>
</div>
