<script lang="ts">
  import { channel } from "./store";

  let value: string;
  const handleLogin = (): void => {
    $channel = value;
    value = "";
    state = requestState();
  };

  const maxWait: number = 10 * 1000; // max timeout is 10s
  const request = (body: string, query: string): Promise<string> =>
    new Promise((resolve, reject) => {
      fetch(`https://ntfy.sh/${$channel}`, {
        method: "POST",
        body: body,
      })
        .then(async (statusReq) => {
          if (!statusReq.ok) {
            const err = await statusReq.text();
            console.error(err);
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
            console.error(e);
            reject(
              new Error("Something went wrong while listening for a response.")
            );
          };
          statusESS.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
            if (!data.message) return;
            if (!data.message.includes(query)) return;

            clearTimeout(statusESSTimeout);
            statusESS.close();
            resolve(data.message);
          };
        })
        .catch(() => {
          reject(
            new Error("Something went wrong while asking for the status.")
          );
        });
    });
  const requestState = (): Promise<boolean> =>
    request("status", "res s").then((v) => (v[6] === "1" ? true : false));
  let state: Promise<boolean> | undefined = $channel
    ? requestState()
    : undefined;

  const togglePower = (cstate: boolean | undefined): Promise<boolean> =>
    request("press", "pressed").then((v) => !cstate);
  const logout = () => $channel = "";
</script>

{#await state}
  <button class="btn btn-neutral btn" disabled
    ><span class="loading loading-ring loading-lg"></span></button
  >
{:then cstate}
  <button
    class="btn"
    class:btn-success={cstate}
    class:btn-error={!cstate}
    on:click={() => (state = togglePower(cstate))}
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      ><path
        fill="currentColor"
        d="M12 3a9 9 0 0 0-9 9a9 9 0 0 0 9 9a9 9 0 0 0 9-9a9 9 0 0 0-9-9m0 16a7 7 0 0 1-7-7a7 7 0 0 1 7-7a7 7 0 0 1 7 7a7 7 0 0 1-7 7m1-2h-2V7h2z"
      /></svg
    ></button
  >
{:catch error}
  <div role="alert" class="alert alert-error w-fit">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      /></svg
    >
    <span>ERROR: {error}</span>
    <div>
      <button class="btn btn-sm" on:click={logout}>Logout</button
      >
      <button
        class="btn btn-sm btn-primary"
        on:click={() => (state = requestState())}>Retry</button
      >
    </div>
  </div>
{/await}

<button class="btn btn-square btn-outline absolute right-0 top-0 m-3" on:click={logout}
  ><svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="M14.08 15.59L16.67 13H7v-2h9.67l-2.59-2.59L15.5 7l5 5l-5 5zM19 3a2 2 0 0 1 2 2v4.67l-2-2V5H5v14h14v-2.67l2-2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2z"
    /></svg
  ></button
>

<dialog
  id="my_modal_5"
  class="bg-base-200 modal modal-bottom sm:modal-middle"
  open={$channel === ""}
>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">
      You need to specify what <a class="text-accent" href="https://ntfy.sh"
        >ntfy.sh</a
      > channel should be used.
    </p>
    <div class="modal-action">
      <form
        method="dialog"
        on:submit={handleLogin}
        class="flex flex-row w-full gap-2"
      >
        <input
          class="input input-bordered focus:input-primary grow shrink"
          type="text"
          bind:value
        />
        <button class="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  </div>
</dialog>
