<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import BookPuzzle from '$lib/components/library/BookPuzzle.svelte';
  import FloatingBooks from '$lib/components/library/FloatingBooks.svelte';
  import SecretCompartment from '$lib/components/library/SecretCompartment.svelte';
  import VisualEffects from '$lib/components/library/VisualEffects.svelte';
  import Candle from '$lib/components/library/Candle.svelte';
  import { evidence } from '$lib/stores/evidence';
  import SoundManager from '$lib/SoundManager';
  import { base } from '$app/paths';

  let showPuzzle = false,
      puzzleSolved = false,
      pageLoaded = false,
      bookshelfHovered = false,
      touchExploring = false,
      touchProximity = 0;

  const LIBRARY_BG = 'https://kxmwcpeuiklblpehddkz.supabase.co/storage/v1/object/public/suspects//library.jpeg';

  const books = [
    { id: 1, title: "Mortiferous Mushrooms", color: "#8C0000" },
    { id: 2, title: "Aconitum Anthology", color: "#2A003C" },
    { id: 3, title: "Venomous Flora", color: "#39FF14" },
    { id: 4, title: "Dark Rituals", color: "#0A0004" }
  ];

  // Hotspot definition
  const bookshelfHotspot = {
    x: 50, // center x position (percentage)
    y: 40, // center y position (percentage)
    radius: 20, // detection radius (percentage)
  };

  let touchStartTime = 0;
  let touchPosition = { x: 0, y: 0 };
  let touchFeedbackVisible = false;
  let container: HTMLElement;

  onMount(() => {
    SoundManager.playAmbient('library-ambience', {
      volume: 0.3,
      fade: true,
      fadeIn: 3000
    });
    setTimeout(() => (pageLoaded = true), 100);
    
    // Setup touch event listeners
    setupTouchInteractions();
  });

  onDestroy(() => {
    SoundManager.stopAmbient('library-ambience', {
      fade: true,
      fadeOut: 2000
    });
  });

  function setupTouchInteractions() {
    if (!container) return;

    // Touch start - begin exploration
    container.addEventListener('touchstart', handleTouchStart);
    
    // Touch move - continue exploration
    container.addEventListener('touchmove', handleTouchMove);
    
    // Touch end - check for hotspot activation
    container.addEventListener('touchend', handleTouchEnd);
  }

  function handleTouchStart(e: TouchEvent) {
    if (showPuzzle) return; // Don't process if puzzle is already shown
    
    touchStartTime = Date.now();
    const touch = e.touches[0];
    updateTouchPosition(touch);
    
    // Show touch feedback
    touchFeedbackVisible = true;
    
    // Check proximity to hotspot
    checkHotspotProximity();
  }

  function handleTouchMove(e: TouchEvent) {
    if (showPuzzle) return;
    
    const touch = e.touches[0];
    updateTouchPosition(touch);
    
    // Update proximity to hotspot
    checkHotspotProximity();
  }

  function handleTouchEnd(e: TouchEvent) {
    if (showPuzzle) return;
    
    const touchDuration = Date.now() - touchStartTime;
    touchFeedbackVisible = false;
    
    // If touch was held long enough and close enough to hotspot, activate it
    if (touchDuration > 300 && touchProximity > 0.7) {
      handleBookshelfClick();
    }
  }

  function updateTouchPosition(touch: Touch) {
    // Calculate touch position as percentage of container
    const rect = container.getBoundingClientRect();
    touchPosition = {
      x: ((touch.clientX - rect.left) / rect.width) * 100,
      y: ((touch.clientY - rect.top) / rect.height) * 100
    };
  }

  function checkHotspotProximity() {
    // Calculate distance to bookshelf hotspot
    const distance = calculateDistance(
      touchPosition.x, 
      touchPosition.y, 
      bookshelfHotspot.x, 
      bookshelfHotspot.y
    );
    
    // Convert distance to proximity (1 = at center, 0 = outside radius)
    touchProximity = Math.max(0, 1 - (distance / bookshelfHotspot.radius));
    
    // Update hover state based on proximity
    bookshelfHovered = touchProximity > 0.3;
    
    // Provide haptic feedback based on proximity
    if (touchProximity > 0.7 && navigator.vibrate) {
      navigator.vibrate(Math.floor(touchProximity * 30));
    }
    
    // Play sound effect when first entering proximity zone
    if (touchProximity > 0.5 && !touchExploring) {
      touchExploring = true;
      SoundManager.playEffect('creak', { volume: touchProximity * 0.3 });
    } else if (touchProximity < 0.3) {
      touchExploring = false;
    }
  }

  function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  async function handlePuzzleSolved() {
    puzzleSolved = true;
    console.log("Puzzle solved, setting puzzleSolved to:", puzzleSolved); // Debugging line
    SoundManager.playEffect('puzzle-solve', { volume: 0.5 });
    
    evidence.update(items => [
      ...items,
      {
        id: 'book-puzzle',
        description: 'The arrangement reveals a hidden message about poisonous plants...',
        discovered_at: new Date().toISOString(),
        image: '/images/clues/poisoned-page.png'
      }
    ]);

    SoundManager.playEffect('secret-reveal', {
      volume: 0.4,
      fade: true,
      fadeIn: 1000
    });
  }

  function handleBookshelfClick() {
    if (!showPuzzle) {
      showPuzzle = true;
      SoundManager.playEffect('bookshelf-creak', { volume: 0.4 });
    }
  }
  
  function handleBookshelfHover() {
    if (!showPuzzle && !bookshelfHovered) {
      bookshelfHovered = true;
      SoundManager.playEffect('creak', { volume: 0.2 });
    }
  }
</script>

<div 
  class="library-container min-h-screen overflow-hidden relative"
  style="background-image: url({LIBRARY_BG}); background-size: cover; background-position: center;"
  bind:this={container}
>
  <div class="absolute inset-0 bg-black/50 z-0"></div>
  <VisualEffects intensity={puzzleSolved ? 0.18 : 0.12} flickerSpeed={0.15} />

  <div class="absolute bottom-8 left-8 z-50">
    <a 
      href="{base}/"
      class="text-parchment hover:text-accent transition-colors duration-300 text-lg"
    >
      ← Return Home
    </a>
  </div>

  <Candle size="large" position={{ x: 50, y: 20 }} intensity={puzzleSolved ? 1.2 : 1} />
  <Candle size="medium" position={{ x: 15, y: 40 }} />
  <Candle size="medium" position={{ x: 85, y: 40 }} />

  <div class="absolute inset-0 z-10">
    {#if !showPuzzle}
      <FloatingBooks {books} />
    {/if}
  </div>

  <!-- Touch feedback indicator -->
  {#if touchFeedbackVisible}
    <div 
      class="touch-feedback"
      style="
        left: {touchPosition.x}%;
        top: {touchPosition.y}%;
        opacity: {touchProximity > 0.3 ? 0.7 : 0.4};
        transform: scale({1 + touchProximity});
      "
    ></div>
  {/if}

  {#if pageLoaded}
    <main
      class="relative z-20 max-w-6xl mx-auto px-4 py-4 md:py-12 min-h-screen flex items-center justify-center"
      in:fade={{ duration: 1000, delay: 300 }}
    >
      <div class="puzzle-container relative p-4 md:p-8 rounded-lg border-0 w-full max-w-2xl {puzzleSolved ? 'solved' : ''}">
        {#if !showPuzzle}
          <div 
            class="bookshelf-interactive"
            in:fade={{ duration: 500 }}
          >
            <div 
              class="bookshelf-area {bookshelfHovered ? 'hovered' : ''}"
              on:click={handleBookshelfClick}
              on:mouseenter={handleBookshelfHover}
              on:mouseleave={() => bookshelfHovered = false}
              role="button"
              aria-label="Interact with the bookshelf"
              tabindex="0"
              on:keydown={(e) => e.key === 'Enter' && handleBookshelfClick()}
            >
              <div class="bookshelf-highlight" style="opacity: {touchProximity > 0.3 ? touchProximity : 0}"></div>
              <div class="bookshelf-hint" style="opacity: {bookshelfHovered ? 1 : 0}; transform: translateY({bookshelfHovered ? 0 : 10}px);">
                <span class="hint-text">A peculiar arrangement of books catches your eye...</span>
              </div>
              
              <!-- Mobile discovery guide - shows briefly when near hotspot -->
              {#if touchProximity > 0.5 && touchProximity < 0.8}
                <div class="mobile-hint" in:fade={{ duration: 300 }}>
                  <span>Hold to examine...</span>
                </div>
              {/if}
            </div>
          </div>
        {:else}
          <div class="puzzle-wrapper" in:fade={{ duration: 800 }}>
            <BookPuzzle 
              {books} 
              on:solve={handlePuzzleSolved}
              disabled={puzzleSolved}
            />
          </div>
        {/if}

        {#if puzzleSolved}
          <div class="mt-8" in:fly={{ y: 20, duration: 800 }}>
            <SecretCompartment visible={true} />
          </div>
        {/if}
      </div>
    </main>
  {/if}
  
  <!-- First-time user guide for mobile - shows briefly on page load -->
  {#if pageLoaded && !showPuzzle}
    <div class="mobile-tutorial" in:fade={{ duration: 800, delay: 1500 }} out:fade={{ duration: 500 }}>
      <div class="tutorial-content">
        <span>Explore the library by touching different areas...</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .library-container {
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  :global(body) {
    overflow-x: hidden;
    background-color: #0A0004;
  }

  .puzzle-container {
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.0);
    transition: all 0.5s ease-in-out;
    background: transparent;
    -webkit-backdrop-filter: blur(0px);
            backdrop-filter: blur(0px);
  }

  .puzzle-container.solved {
    box-shadow: 
      0 0 40px rgba(0, 0, 0, 0.3),\\n      0 0 2px rgba(57, 255, 20, 0.2);
  }

  .puzzle-wrapper {
    transition: transform 0.3s ease-out;
  }

  /* Bookshelf interactive styles */
  .bookshelf-interactive {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bookshelf-area {
    position: relative;
    width: 80%;
    height: 100%;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .bookshelf-area::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .bookshelf-area.hovered::before {
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  .bookshelf-highlight {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .bookshelf-area.hovered .bookshelf-highlight {
    opacity: 1;
    animation: pulse 2s infinite;
  }

  .bookshelf-hint {
    position: relative;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 6px;
    transform: translateY(10px);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 80%;
    text-align: center;
  }

  .bookshelf-area.hovered .bookshelf-hint {
    transform: translateY(0);
    opacity: 1;
  }

  .hint-text {
    color: #f0e6d2;
    font-family: var(--font-burton, serif);
    font-size: 1.1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  /* Touch feedback styles */
  .touch-feedback {
    position: absolute;
    width: 60px;
    height: 60px;
    margin-left: -30px;
    margin-top: -30px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 30;
    animation: touch-ripple 1s infinite;
  }

  /* Mobile tutorial */
  .mobile-tutorial {
    position: fixed;
    bottom: 20%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 40;
  }

  .tutorial-content {
    background: rgba(0, 0, 0, 0.7);
    color: #f0e6d2;
    padding: 12px 20px;
    border-radius: 30px;
    font-family: var(--font-burton, serif);
    font-size: 1rem;
    text-align: center;
    animation: fade-out 5s forwards;
  }

  /* Mobile hint for when near hotspot */
  .mobile-hint {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #f0e6d2;
    font-family: var(--font-burton, serif);
    font-size: 0.9rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }

  @keyframes touch-ripple {
    0% { opacity: 0.7; transform: scale(0.8); }
    50% { opacity: 0.5; transform: scale(1); }
    100% { opacity: 0.7; transform: scale(0.8); }
  }

  @keyframes fade-out {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }

  @media (max-width: 768px) {
    .bookshelf-interactive {
      height: 250px;
    }
    
    .hint-text {
      font-size: 0.9rem;
    }
    
    .touch-feedback {
      width: 50px;
      height: 50px;
      margin-left: -25px;
      margin-top: -25px;
    }
  }
</style>
