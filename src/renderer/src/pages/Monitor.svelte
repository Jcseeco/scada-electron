<script lang="ts">
  import Icon from '@iconify/svelte/offline'
  import { LayerCake, Svg, Html } from 'layercake'
  import AxisX from '../components/chart/AxisX.svelte'
  import AxisY from '../components/chart/AxisY.svelte'
  import Line from '../components/chart/Line.svelte'
  import SharedTooltipHtml from '../components/chart/SharedTooltip.html.svelte'
  import signal from '@iconify/icons-heroicons/signal'
  import signalSlash from '@iconify/icons-heroicons/signal-slash'
  import arrowsUpDown from '@iconify/icons-heroicons/arrows-up-down'
  import heartSolid from '@iconify/icons-heroicons/heart-solid'
  import arrowPath from '@iconify/icons-heroicons/arrow-path'
  import { onMount, onDestroy } from 'svelte'
  import type { DataUpdateBody } from '../../../main/api/modbus-controller'
  import { TimedData } from '../../../main/lib/models/timed-data'
  import { DeviationDataSchema } from '../display-schemas/deviation-data'

  let availablePorts: Promise<Array<any>>
  listPorts()

  let portPath: string = ''
  let managerId: string = ''
  let isPolling: boolean = false
  let dataUpdated: boolean = false

  let latestData: TimedData = new TimedData(1)

  onMount(() => {
    window.api.rendererEvents.listen('data:update', updateMonitor)
  })

  onDestroy(() => {
    window.api.rendererEvents.removeAllListeners('data:update')
    window.api.serial.disconnect(managerId)
  })

  function listPorts() {
    availablePorts = window.api.serial.listPorts()
  }

  async function connect() {
    let res = await window.api.serial.connect(portPath)

    if (res.success) managerId = res.uid
  }

  function disconnect() {
    window.api.serial.disconnect(managerId).then(() => (managerId = ''))
  }

  async function startPolling() {
    await window.api.serial.startPolling(managerId)
    isPolling = true
  }

  async function stopPolling() {
    await window.api.serial.stopPolling(managerId)
    isPolling = false
  }

  function updateMonitor(_, body: DataUpdateBody) {
    dataUpdated = true
    setTimeout(() => {
      dataUpdated = false
    }, 200)
    latestData = body.data

    console.log(latestData.cellValues.length)
  }
</script>

<div class="flex flex-col gap-3 px-3 py-6">
  <section id="connectivities">
    <div class="flex items-center">
      <!-- port select -->
      {#await availablePorts then ports}
        <div class="form-control">
          <div class="input-group">
            <span>選擇阜口</span>
            <div class="tooltip" data-tip="刷新">
              <button
                type="button"
                class="btn btn-sm bg-base-300 btn-ghost rounded-none"
                on:click={listPorts}
              >
                <Icon icon={arrowPath} />
              </button>
            </div>
            <select
              id="select_port"
              class="select select-sm select-bordered max-w-fit"
              disabled={managerId !== ''}
              bind:value={portPath}
            >
              {#each ports as port}
                <option value={port.path}>{port.friendlyName}</option>
              {/each}
            </select>

            {#if managerId && !isPolling}
              <button type="button" class="btn btn-sm gap-2 btn-error" on:click={disconnect}>
                <Icon icon={signalSlash} /> 關閉</button
              >
              <button type="button" class="btn btn-sm gap-2 btn-success" on:click={startPolling}>
                <Icon icon={arrowsUpDown} /> 開始讀取</button
              >
            {:else if managerId && isPolling}
              <button type="button" class="btn btn-sm gap-2 btn-error" on:click={stopPolling}>
                <Icon icon={arrowsUpDown} /> 結束讀取</button
              >
            {:else}
              <button type="button" class="btn btn-sm gap-2 btn-primary" on:click={connect}>
                <Icon icon={signal} /> 連接</button
              >
            {/if}
          </div>
        </div>
      {/await}
      <!-- end port select -->
    </div>
  </section>

  <section class="card card-compact shadow bg-base-100">
    <div class="card-body">
      <div class="flex gap-3">
        <h3 class="card-title">General</h3>

        <!-- data update status -->
        <div class="swap text-lg font-bold cursor-auto" title="通訊狀態">
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" bind:checked={dataUpdated} />

          <div class="swap-on text-success duration-150"><Icon icon={heartSolid} /></div>
          <div class="swap-off text-slate-400 duration-150"><Icon icon={heartSolid} /></div>
        </div>

        <span class="flex items-center gap-2">
          T: <span class="text-secondary">{latestData._timestamp.toLocaleString('zh-tw')}</span>
        </span>
      </div>

      <div id="alarms" class="flex gap-4 mb-3">
        {#each Object.entries(DeviationDataSchema.alarms) as [key, schema]}
          <div class="flex gap-3">
            <span>{schema?.label || key}:</span>
            <span
              class="badge badge-md"
              class:badge-success={!latestData.alarms[key]}
              class:badge-error={latestData.alarms[key]}
            />
          </div>
        {/each}
      </div>

      <div class="grid grid-cols-4 gap-0">
        {#each Object.entries(DeviationDataSchema.generals) as [key, schema]}
          <div class="grid grid-cols-2">
            <span class="text-center border border-gray-300">{schema?.label || key}</span>
            <td class="px-3 flex-1 border border-gray-300">{latestData[key]}</td>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="w-full flex flex-col gap-3">
    <div class="card bg-base-100 rounded-md shadow p-2">
      <div class="card-head mb-3">
        <h3 class="font-bold text-lg">離群指標值</h3>

        <div class="flex gap-3">
          <span>異常電新數量: {latestData.errorCells}</span>
          <span>異常標準值: {latestData.svThresh}</span>
          <span>異常標準門檻偏移量: {latestData.devThresh / 10}</span>
        </div>
      </div>
      <div class="wrapper h-32">
        <LayerCake
          data={latestData.cellValues.length
            ? latestData.cellValues.map((v, i) => {
                return { label: i + 1, value: v }
              })
            : Array.from({ length: 160 }, (_, i) => {
                return { label: i + 1, value: 0 }
              })}
          x="label"
          y="value"
          padding={{ top: 10, right: 15, bottom: 20, left: 20 }}
          xNice={20}
          xDomain={[1, 160]}
          yNice={10}
          yDomain={[0, 30]}
        >
          <Svg>
            <Line />
            <AxisX />
            <AxisY />
          </Svg>

          <Html>
            <SharedTooltipHtml
              dataset={latestData.cellValues.length
                ? latestData.cellValues.map((v, i) => {
                    return { label: i + 1, value: v }
                  })
                : Array.from({ length: 160 }, (_, i) => {
                    return { label: i + 1, value: 0 }
                  })}
            />
          </Html>
        </LayerCake>
      </div>
    </div>
  </section>
</div>
