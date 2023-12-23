import { writable } from "@macfja/svelte-persistent-store"
import type { Writable } from "svelte/store"

export const channel: Writable<string> = writable("channel", "")