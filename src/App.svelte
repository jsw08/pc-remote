<script>
  let mode = "on"
  const base_css = "bg-BASE-500 b-BASE hover:bg-BASE-400";

  const colors = {
    "on": "green",
    "booting": "orange",
    "off": "red",
    "loading": "gray"
  }
  $: c = colors[mode]
</script>

<main class="w-full h-screen flex justify-center items-center">
  <button
    class="button w-xs h-xs sm:w-sm sm:h-sm md:w-lg md:h-lg text-white font-bold py-8 px-12 b-b-12 active:b-b-4 rounded cursor-pointer bg-{c}-500 hover:bg-{c}-4"
    on:click={() => mode = mode == "on" ? "off" : "on"}
  >
    <i class="i-material-symbols-power-plug w-full h-full text-5xl block"></i>
  </button>
</main>

<style>
  .button {
    transition: all 0.2s;
    outline: none;
  }

  .button:active {
    transform: translateY(4px);
  }
</style>
