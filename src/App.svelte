<script lang="ts">
  import { channel } from "./store";

  let value: string;
  const handleLogin = (): void => {
    $channel = value;
    value = "";
    cpromise = requestState();
  };

  const maxWait: number = 10 * 1000; // max timeout is 10s
  const request = (body: string, query: string): Promise<string> =>
    new Promise((resolve, reject) => {
      fetch(`https://ntfy.sh/${$channel}`, {
        method: "POST",
        body: body,
      })
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.text();
            console.error(err);
            reject(
              new Error("Something went wrong while asing for the status.")
            );
          }

          let sse = new EventSource(`https://ntfy.sh/${$channel}/sse`);
          const sseTimeout = setTimeout(() => {
            sse.close();
            reject(new Error(`Response took too long. Over ${maxWait}ms.`));
          }, maxWait);
          sse.onerror = (e) => {
            console.error(e);
            reject(
              new Error("Something went wrong while listening for a response.")
            );
          };
          sse.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
            if (!data.message) return;
            if (!data.message.includes(query)) return;

            clearTimeout(sseTimeout);
            sse.close();
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
    request("s", "res s").then((v) => (v[6] === "1" ? true : false));

  // const togglePower = (cstate: boolean | undefined): Promise<boolean> =>
    // request("p", "res p").then((v) => !cstate);
  const togglePower = (cstate: boolean | undefined): Promise<boolean> => new Promise(r => r(!cstate))
  const logout = () => ($channel = "");
  let cpromise: Promise<boolean> | undefined = $channel
    //? requestState()
    ? new Promise((r) => r(true))
    : undefined;
</script>

{#await cpromise}
  <button class="btn btn-neutral btn btn-square" disabled
    ><span class="loading loading-spinner loading-lg"></span> loading</button
  >
{:then cstate}
  <button
    data-state={cstate}
    class="btn h-32 "
    class:btn-success={cstate}
    class:btn-error={!cstate}
    on:click={() => (cpromise = togglePower(cstate))}
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
      <button class="btn btn-sm" on:click={logout}>Logout</button>
      <button
        class="btn btn-sm btn-primary"
        on:click={() => (cpromise = requestState())}>Reload</button
      >
    </div>
  </div>
{/await}

<div class="absolute right-0 bottom-0 sm:top-0 p-3">
  <button class="btn btn-square btn-outline" on:click={() => cpromise = requestState()}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      ><path
        fill="currentColor"
        d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20"
      /></svg
    >
  </button>
  <button class="btn btn-square btn-outline" on:click={logout}
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
</div>

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
        <button class="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  </div>
</dialog>
