<script>
  let mode = "on";
  const base_css = "bg-BASE-500 b-BASE hover:bg-BASE-400";

  const colors = {
    on: "green",
    booting: "orange",
    off: "red",
    loading: "gray",
  };
  $: c = colors[mode];
</script>

<main class="w-full h-screen flex justify-center items-center">
  <button
    class={c}
    on:click={() => (mode = mode == "on" ? "off" : "on")}
  >
    <i/>
  </button>
</main>

<style>
  main {
    --at-apply: "w-full h-screen flex justify-center items-center dark:bg-black";
  }
  i {
    --at-apply: i-material-symbols-power-plug w-full h-full text-5xl block text-shadow-xl;
  }
  button {
    --at-apply: w-xs h-xs sm: w-sm sm: h-sm md: w-lg md: h-lg text-white
      font-bold py-8 px-12 b-b-12 rounded cursor-pointer outline-hidden
      transition-[0.2s];
  }
  button:active {
    --at-apply: b-b-4;
    transform: translateY(4px);
  }
  .green {
    --at-apply: "bg-green-500 b-green hover:bg-green-400";
  }
  .orange {
    --at-apply: "bg-orange-500 b-orange hover:bg-orange-400";
  }
  .red {
    --at-apply: "bg-red-500 b-red hover:bg-red-400";
  }
  .gray {
    --at-apply: "bg-gray-500 b-gray hover:bg-gray-400";
  }
  @screen sm {
    button {
      --at-apply: w-sm h-sm;
    }
  }
  @screen md {
    button {
      --at-apply: w-lg h-lg;
    }
  }
</style>
