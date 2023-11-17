<script lang="ts">
  import type { Protocol } from '../../../main/lib/protocol'
  import Input from '../components/form/EditableInput.svelte'

  let list: Promise<{ [x: string]: Protocol }> = window.api.protocol.list
</script>

<div class="px-4 py-6">
  {#await list}
    <span class="bg-base-200 h-8 w-full rounded-md shadow" />
  {:then protocols}
    {#each Object.entries(protocols) as [key, protocol]}
      <details class="p-2 bg-base-100 rounded-box">
        <summary class="flex gap-2">
          <Input
            label={'設定名稱:'}
            bind:value={protocol.meta.name}
            on:edited={() => {
              window.api.protocol.set(protocol, key)
            }}
          />
        </summary>
        <div class="">
          {protocol.meta.baudRate}
        </div>
      </details>
    {/each}
    <details class="bg-base-100 rounded-box">
      <summary class="text-xl">sesef</summary>
      <div class="">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, doloribus veniam officia
        corporis maiores reprehenderit id aliquam consectetur neque quam iure esse expedita
        inventore molestias non. Dolorem vel corrupti ratione.
      </div>
    </details>
  {/await}
</div>
