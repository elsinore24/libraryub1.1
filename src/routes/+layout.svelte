<!-- Update your existing +layout.svelte file to include the SoundControls component -->
<script lang="ts">
  import '../app.postcss';
  import { onMount } from 'svelte';
  import { initSounds } from '$lib/sounds';
  import SoundControls from '$lib/components/SoundControls.svelte';
  import { loadEvidence, isLoading, hasError } from '$lib/stores/evidence';
  
  let showSoundControls = false;
  
  function toggleSoundControls() {
    showSoundControls = !showSoundControls;
  }
  
  onMount(() => {
    // Initialize sound system
    initSounds();
    
    // Load evidence data from Supabase
    loadEvidence();
    
    // Add keyboard shortcut for sound controls (M key)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        toggleSoundControls();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="app">
  <main>
    <slot />
  </main>
  
  <!-- Sound controls toggle button -->
  <button 
    class="sound-toggle"
    on:click={toggleSoundControls}
    title="Sound Settings (Press M)"
  >
    🔊
  </button>
  
  <!-- Sound controls panel -->
  <SoundControls showControls={showSoundControls} />
  
  <!-- Error notification for evidence loading -->
  {#if $hasError}
    <div class="error-notification">
      <p>There was an error loading your evidence. Some features may not work correctly.</p>
      <button on:click={() => loadEvidence()}>Try Again</button>
    </div>
  {/if}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
  
  .sound-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
  }
  
  .error-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: rgba(220, 53, 69, 0.9);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    z-index: 1002;
    max-width: 300px;
  }
  
  .error-notification button {
    background-color: white;
    color: #dc3545;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    margin-top: 5px;
    cursor: pointer;
  }
</style>
