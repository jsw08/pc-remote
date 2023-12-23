<script lang="ts">
  import { channel } from "./store";

  let value: string;
  function handleLogin(): void {
    $channel = value;
    value = "";
    state = requestState();
  }

  const maxWait = 10 * 1000; // max timeout is 10s
  const requestState = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      let statusESS: EventSource;

      fetch(`https://ntfy.sh/${$channel}`, {
        method: "POST",
        body: "status",
      })
        .then(async (statusReq) => {
          if (!statusReq.ok) {
            const err = await statusReq.text();
            reject(
              new Error("Something went wrong while asing for the status.")
            );
          }

          let statusESS = new EventSource(`https://ntfy.sh/${$channel}/sse`);
          const statusESSTimeout = setTimeout(() => {
            statusESS.close();
            reject(new Error(`Response took too long. Over ${maxWait}ms.`));
          }, maxWait);
          statusESS.onerror = (e) => {
            reject(
              new Error("Something went wrong while listening for a response.")
            );
          };
          statusESS.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
            if (!data.message) return;
            if (!data.message.includes("res s")) return;

            clearTimeout(statusESSTimeout);
            statusESS.close();
            resolve(data.message[6] == "1");
          };
        })
        .catch(() => {
          reject(
            new Error("Something went wrong while asking for the status.")
          );
        });
    });
  let state: Promise<boolean> | undefined = $channel
    ? requestState()
    : undefined;
</script>

<main>
  {#if $channel !== ""}
    {#await state}
      loading...
    {:then cstate}
      <p on:visibilitychange={() => state = requestState()}>{cstate}</p>
    {:catch error}
      <h1>ERROR: {error}</h1>
      <button on:click={(e) => (state = requestState())}>me</button>
    {/await}
    <h1>press za button</h1>
    <button on:click={() => ($channel = "")}>{$channel}</button>
  {:else}
    <h1>ya aint logged in</h1>
    <input type="text" bind:value on:change={handleLogin} />
    <button on:click={handleLogin}>login</button>
  {/if}
</main>
