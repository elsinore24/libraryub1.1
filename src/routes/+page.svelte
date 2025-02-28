<script lang="ts">
  import { onMount } from 'svelte';
  import { evidence, loadEvidence } from '$lib/stores/evidence';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';

  let pageLoaded = false;
  
  // Create a derived array of unique evidence items
  $: uniqueEvidence = getUniqueEvidence($evidence);
  
  // Function to deduplicate evidence
  function getUniqueEvidence(items) {
    const uniqueMap = new Map();
    items.forEach(item => {
      uniqueMap.set(item.id, item);
    });
    return Array.from(uniqueMap.values());
  }

  onMount(() => {
    // Use sessionStorage to determine if this is an initial page load
    if (browser) {
      const sessionStarted = sessionStorage.getItem('sessionStarted');
      
      if (!sessionStarted) {
        // This is a fresh page load (either initial or after refresh)
        sessionStorage.setItem('sessionStarted', 'true');
        
        // Clear evidence
        evidence.set([]);
        localStorage.removeItem('evidence');
      }
    }
    
    // Load evidence if needed
    if ($evidence.length === 0) {
      loadEvidence();
    }
    
    setTimeout(() => (pageLoaded = true), 100);
  });
</script>

<div class="p-8 pt-16 animate-fade-in font-burton text-parchment flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-black via-obsidian to-gray-900 relative">
  <div class="mist"></div>
  
  <div class="max-w-xl w-full mx-auto text-center z-10">
    <!-- Page Title -->
    <h1 class="text-3xl md:text-4xl lg:text-5xl mb-12 text-parchment animate-fade-in transform scale-95 hover:scale-100 transition-all duration-500 tracking-wide glow-title dripping-title">
      The Haunted Library
      <span class="drip"></span>
    </h1>
    
    <!-- Room Links -->
    <div class="mb-12">
      <a 
        href="{base}/library" 
        class="w-40 h-40 mx-auto p-4 border border-accent rounded-full hover:bg-accent/10 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-[0_0_15px_#00ff00] text-parchment flex items-center justify-center text-center"
      >
        <p class="text-sm md:text-base leading-snug">
          Uncover secrets hidden among ancient tomes...
        </p>
      </a>
    </div>
    
    <!-- Game Shortcut -->
    <div class="mb-12">
      <a 
        href="{base}/game" 
        class="w-40 h-40 mx-auto p-4 border border-accent rounded-full hover:bg-accent/10 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-[0_0_15px_#00ff00] text-parchment flex items-center justify-center text-center"
      >
        <p class="text-sm md:text-base leading-snug">
          Go to Game
        </p>
      </a>
    </div>

    <!-- Evidence Board -->
    <div class="w-full">
      <h3 class="text-2xl md:text-3xl mb-6 text-parchment">Evidence Board</h3>
      {#if uniqueEvidence.length === 0}
        <p class="text-accent animate-flicker text-xl shadow-[0_0_20px_#ff0000]">No evidence collected yet...</p>
      {:else}
        <ul class="space-y-4">
          {#each uniqueEvidence as item (item.id)}
            <li class="evidence-card p-4 border border-accent/50 rounded bg-parchment text-black shadow-lg hover:shadow-[0_0_25px_#ff0000] transform hover:-rotate-1 transition-all duration-300">
              <p class="mb-2">{item.description}</p>
              
              {#if item.image}
                <img 
                  src="{base}{item.image}" 
                  alt="Evidence photo" 
                  class="w-full max-w-md mx-auto rounded-lg border border-primary/30 mt-4"
                  loading="lazy"
                  on:error={(e) => e.currentTarget.src = `${base}/default-clue.png`}
                />
              {/if}
              
              <div class="text-sm text-accent/60 mt-2">
                {new Date(item.discovered_at || '').toLocaleString()}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
