<script lang="ts">
  import { onMount } from 'svelte';
  import { Howl } from 'howler';
  
  let isMuted = false;
  let volumeLevel = 0.5; // Default volume level
  let backgroundMusic: Howl;
  
  onMount(() => {
    // Initialize background music
    backgroundMusic = new Howl({
      src: ['/sounds/ambient-library.mp3'], // Make sure this file exists in static/sounds/
      loop: true,
      volume: volumeLevel,
      autoplay: false
    });
    
    // Start playing with a slight delay to ensure everything is loaded
    setTimeout(() => {
      backgroundMusic.play();
    }, 1000);
    
    return () => {
      // Clean up when component is destroyed
      if (backgroundMusic) {
        backgroundMusic.stop();
      }
    };
  });
  
  function toggleMute() {
    isMuted = !isMuted;
    if (backgroundMusic) {
      backgroundMusic.mute(isMuted);
    }
  }
  
  function adjustVolume(e: Event) {
    const input = e.target as HTMLInputElement;
    volumeLevel = parseFloat(input.value);
    if (backgroundMusic) {
      backgroundMusic.volume(volumeLevel);
    }
  }
</script>

<div class="sound-controls fixed bottom-4 right-4 bg-gray-800 bg-opacity-70 p-2 rounded-lg z-50 flex items-center space-x-2">
  <button 
    class="text-white hover:text-amber-300 transition-colors" 
    on:click={toggleMute}
    aria-label={isMuted ? "Unmute sound" : "Mute sound"}
  >
    {#if isMuted}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    {/if}
  </button>
  
  <input 
    type="range" 
    min="0" 
    max="1" 
    step="0.05" 
    bind:value={volumeLevel} 
    on:input={adjustVolume}
    class="w-24 accent-amber-400"
    aria-label="Volume control"
  />
</div>
