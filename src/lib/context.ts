import { getContext, setContext } from 'svelte';

type WindowContext = { action: string | null };
const KEY: string = 'WINDOW_CONTEXT';

function setWindowContext(ctx: WindowContext) { return setContext(KEY, ctx); }
function getWindowContext() { return getContext<WindowContext>(KEY); }

export { setWindowContext, getWindowContext }
export type { WindowContext }