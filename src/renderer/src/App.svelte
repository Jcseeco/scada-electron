<script context="module" lang="ts">
  import { writable, type Writable } from 'svelte/store'

  export let drawerShow: Writable<boolean> = writable(false)
</script>

<script lang="ts">
  import Icon from '@iconify/svelte/offline'
  import barsThreeSolid from '@iconify/icons-heroicons/bars-3-20-solid'
  import documentText from '@iconify/icons-heroicons/document-text'
  import cog from '@iconify/icons-heroicons/cog-6-tooth'
  import envelope from '@iconify/icons-heroicons/envelope'
  import Router from './routes/Router.svelte'

  // toggle whether to send notification email
  function toggleEmail() {
    window.api.settings.get('sendEmail').then((value) => {
      window.api.settings.set('sendEmail', !value)
    })
  }
</script>

<svelte:head>
  {#await window.api.app.meta() then meta}
    <title>{meta.name} - v{meta.version}</title>
  {/await}
</svelte:head>

<Router let:page let:currentPath>
  <div class="drawer bg-base-200">
    <input id="drawer-control" type="checkbox" class="drawer-toggle" bind:checked={$drawerShow} />

    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <header class="w-full navbar bg-base-100">
        <div class="flex-none lg:hidden">
          <label for="drawer-control" class="btn btn-square btn-ghost">
            <Icon icon={barsThreeSolid} height="1.5em" />
          </label>
        </div>
        <div class="flex-1 px-2 mx-2">
          {#await window.api.app.meta() then meta}
            <a href="#/" class="py-2 px-3 rounded-box hover:bg-slate-300 hover:bg-opacity-30">
              <h2 class="flex items-center gap-2">
                {meta.name.toUpperCase()}
              </h2>
            </a>
          {/await}
        </div>

        <div class="flex-none hidden lg:block">
          <ul class="menu menu-horizontal">
            <!-- Navbar menu content here -->
            <li>
              <a href="#/protocols" class:active={currentPath === '/protocols'}
                ><Icon icon={documentText} />protocols</a
              >
            </li>
            <li><a href="#/versions" class:active={currentPath === '/versions'}>versions</a></li>
          </ul>
        </div>

        <div id="header-actions" class="flex-none">
          <ul class="menu menu-horizontal">
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <li tabindex="0" class="dropdown dropdown-end">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="btn btn-ghost rounded-full text-lg">
                <Icon icon={cog} />
              </label>
              <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
                <li>
                  <div class="form-control">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="cursor-pointer label gap-2">
                      <Icon icon={envelope} />
                      <span class="label-text">Email:</span>
                      {#await window.api.settings.get('sendEmail') then value}
                        <input
                          type="checkbox"
                          class="toggle toggle-success"
                          checked={value ?? true}
                          on:change={toggleEmail}
                        />
                      {/await}
                    </label>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </header>

      <!-- Page content here -->
      <svelte:component this={page} />
    </div>

    <div class="drawer-side">
      <label for="drawer-control" class="drawer-overlay" />
      <ul class="menu p-4 w-80 bg-base-100">
        <!-- Sidebar content here -->
        <li><a href="#/protocols">protocols</a></li>
        <li><a href="#/versions">versions</a></li>
      </ul>
    </div>
  </div>
</Router>
