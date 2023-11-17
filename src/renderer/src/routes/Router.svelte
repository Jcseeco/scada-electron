<script context="module" lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import Monitor from '../pages/Monitor.svelte'
  import Protocols from '../pages/Protocols.svelte'
  import Versions from '../pages/Versions.svelte'

  export type Routes = {
    [x: string]: ConstructorOfATypedSvelteComponent
  }
</script>

<script lang="ts">
  let routes: Routes = {
    '/': Monitor,
    '/versions': Versions,
    '/protocols': Protocols
  }

  const dispatch = createEventDispatcher()

  location.hash = '#/'
  let currentPath = '/'
  let page: ConstructorOfATypedSvelteComponent | null = routes[currentPath] ?? null

  onMount(() => {
    window.addEventListener('hashchange', hashChange)
  })

  onDestroy(() => {
    window.removeEventListener('hashchange', hashChange)
  })

  function hashChange() {
    currentPath = location.hash.replace(/^#/, '')

    dispatch('hashChange', currentPath)

    page = routes[currentPath] ?? null
  }
</script>

<slot {page} {currentPath} />
