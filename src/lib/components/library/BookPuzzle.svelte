<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import SoundManager from '$lib/SoundManager';

  const dispatch = createEventDispatcher();

  // Define the Book type
  interface Book {
    id: number;
    title: string;
    color: string;
  }

  // Add proper type to the books prop
  export let books: Book[] = [];
  export let disabled = false;

  let draggedBook: number | null = null;
  let correctOrder = false;
  let shake = tweened(0, { duration: 300, easing: cubicOut });
  let touchedBook: number | null = null; // Track touched book for mobile

  // Add ARIA role and labels for accessibility
  const dragRole = "listitem";
  const dragLabel = "Draggable book item";

  function handleDragStart(event: DragEvent, id: number) {
    if (disabled) return;

    draggedBook = id;
    SoundManager.playEffect('book-drag.mp3', { volume: 0.3 });
    if (event.target instanceof HTMLElement) {
      event.target.style.opacity = "0.7";
      event.target.classList.add("dragging");
    }
  }

  function handleDragEnd(event: DragEvent) {
    if (disabled) return;

    draggedBook = null;
    if (event.target instanceof HTMLElement) {
      event.target.style.opacity = "1";
      event.target.classList.remove("dragging");
    }
  }

  function handleDrop(event: DragEvent, targetId: number) {
    event.preventDefault();
    if (disabled || draggedBook === null) return;

    swapBooks(draggedBook, targetId);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Touch handlers for mobile support
  function handleTouchStart(event: TouchEvent, id: number) {
    if (disabled) return;
    event.preventDefault(); // Prevent scrolling while touching books
    touchedBook = id;
    SoundManager.playEffect('book-drag.mp3', { volume: 0.3 });
    
    if (event.target instanceof HTMLElement) {
      event.target.classList.add("touching");
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (disabled || touchedBook === null) return;
    event.preventDefault(); // Prevent scrolling while dragging
  }

  function handleTouchEnd(event: TouchEvent, targetId: number) {
    if (disabled || touchedBook === null) return;
    event.preventDefault();
    
    if (event.target instanceof HTMLElement) {
      event.target.classList.remove("touching");
    }
    
    // If we have a touched book and it's different from the target, swap them
    if (touchedBook !== targetId) {
      swapBooks(touchedBook, targetId);
    }
    
    touchedBook = null;
  }

  // Common function to swap books
  function swapBooks(bookId1: number, bookId2: number) {
    const index1 = books.findIndex(book => book.id === bookId1);
    const index2 = books.findIndex(book => book.id === bookId2);

    if (index1 === -1 || index2 === -1) return;

    // Create a new array to trigger reactivity
    const newBooks = [...books];
    [newBooks[index1], newBooks[index2]] = [newBooks[index2], newBooks[index1]];
    books = newBooks;

    SoundManager.playEffect('book-place.mp3', { volume: 0.4 });

    checkOrder();
  }

  function checkOrder() {
    const sortedByBrightness = [...books].every((book, i) => {
      if (i === 0) return true;
      const curr = hexToHsl(book.color);
      const prev = hexToHsl(books[i - 1].color);
      return curr.l >= prev.l;
    });

    if (sortedByBrightness && !correctOrder) {
      correctOrder = true;
      dispatch('solve');
    }
  }

  function hexToHsl(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let h, s;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  
  function getDarkerColor(color: string): string {
    const hsl = hexToHsl(color);
    return `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(0, hsl.l - 20)}%)`;
  }
</script>

<div class="puzzle-board" class:disabled>
  <div 
    class="book-grid"
    role="list"
    aria-label="Draggable book list"
  >
    {#each books as book (book.id)}
      <div
        class="book-item"
        style="
          --book-color: {book.color};
          --book-dark: {getDarkerColor(book.color)};
          --text-color: {hexToHsl(book.color).l > 50 ? '#000' : '#fff'};
        "
        draggable={!disabled}
        role={dragRole}
        aria-label={`${dragLabel}: ${book.title}`}
        aria-grabbed={!disabled}
        on:dragstart={(e) => handleDragStart(e, book.id)}
        on:dragend={handleDragEnd}
        on:dragover={handleDragOver}
        on:drop={(e) => handleDrop(e, book.id)}
        on:touchstart={(e) => handleTouchStart(e, book.id)}
        on:touchmove={handleTouchMove}
        on:touchend={(e) => handleTouchEnd(e, book.id)}
      >
        <div class="book-spine">
          <div class="spine-line"></div>
        </div>
        <div class="book-content">
          <span class="book-title">{book.title}</span>
        </div>
        <div class="book-edge"></div>
      </div>
    {/each}
  </div>

  {#if correctOrder}
    <div 
      class="success-message"
      in:fly={{ y: 20, duration: 800 }}
    >
      <span class="text-accent animate-pulse">
        The books reveal their secret...
      </span>
    </div>
  {/if}
</div>

<style>
  .puzzle-board {
    position: relative;
    padding: 0.5rem;
    margin: 0 auto;
    max-width: 85%;
  }

  .puzzle-board.disabled {
    opacity: 0.8;
    pointer-events: none;
  }

  .book-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
    margin: 0 auto;
  }

  .book-item {
    position: relative;
    height: 50px;
    display: flex;
    cursor: grab;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    border-radius: 0 3px 3px 0;
    touch-action: none; /* Prevent browser handling of touch events */
    user-select: none; /* Prevent text selection during dragging */
  }

  .book-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
  }

  .book-spine {
    position: relative;
    width: 20px;
    background-color: var(--book-dark);
    border-radius: 2px 0 0 2px;
    overflow: hidden;
  }
  
  .spine-line {
    position: absolute;
    top: 25%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 25px 0 rgba(255, 255, 255, 0.2);
  }

  .book-content {
    flex: 1;
    background-color: var(--book-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0 3px 3px 0;
    position: relative;
    overflow: hidden;
  }
  
  .book-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }

  .book-edge {
    position: absolute;
    top: 2px;
    right: 0;
    bottom: 2px;
    width: 2px;
    background: linear-gradient(to right, #e8d8b7, #f5efe0);
    border-radius: 0 2px 2px 0;
    opacity: 0.7;
  }

  .book-title {
    font-family: var(--font-burton, serif);
    font-weight: normal;
    text-align: center;
    color: var(--text-color);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    font-size: 0.9rem;
    z-index: 1;
  }

  .success-message {
    position: absolute;
    bottom: -2rem;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 1rem;
    padding: 0.5rem;
  }

  /* Adding a subtle texture to all books */
  .book-item::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.1;
    border-radius: 0 3px 3px 0;
  }

  .book-item.dragging,
  .book-item.touching {
    cursor: grabbing;
    transform: scale(1.02) translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  @media (max-width: 768px) {
    .puzzle-board {
      max-width: 95%;
    }
    
    .book-item {
      height: 45px;
    }
    
    .book-title {
      font-size: 0.85rem;
    }
    
    .spine-line {
      box-shadow: 0 15px 0 rgba(255, 255, 255, 0.2);
    }
    
    .book-spine {
      width: 15px;
    }
  }
</style>
