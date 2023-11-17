<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let label = ''
  export let value: string = ''

  export let editing = false

  let hold: string = value

  const dispatch = createEventDispatcher()

  function edited() {
    dispatch('edited', value)
    hold = value
    editing = false
  }

  function cancelEdit() {
    value = hold
    editing = false
  }

  function edit() {
    editing = true
  }
</script>

<div class="form-control">
  <label class="label" for="">
    <span class="px-2">{label}</span>
    {#if editing}
      <input
        type="text"
        bind:value
        class="input input-bordered input-sm"
        on:change
        on:keydown={(ev) => {
          ev.key === 'Enter' && edited()
        }}
      />
      <button type="button" class="btn btn-sm btn-success" on:click={edited}>V</button>
      <button type="button" class="btn btn-sm btn-error" on:click={cancelEdit}>X</button>
    {:else}
      <button
        type="button"
        class="text-base rounded-box bg-transparent hover:bg-slate-300 hover:bg-opacity-30"
        on:click={edit}>{value}</button
      >
    {/if}
  </label>
</div>
