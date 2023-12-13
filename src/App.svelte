<script>
  let powered = true;
  let loading = false;
  const base_css = "bg-BASE-500 b-BASE hover:bg-BASE-400";
  const green_css = base_css.replaceAll("BASE", "green")
  const red_css = base_css.replaceAll("BASE", "red")
  const load_css = base_css.replaceAll("BASE", "gray")
</script>

<main class="w-full h-screen flex justify-center items-center">
  <button
    class={"button w-xs h-xs sm:w-sm sm:h-sm md:w-lg md:h-lg text-white font-bold py-8 px-12 b-b-12 active:b-b-4 rounded cursor-pointer " +
      (loading ? load_css : powered ? green_css : red_css)}
    on:mouseup={() => powered = !powered}
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
