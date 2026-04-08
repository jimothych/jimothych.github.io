import { windowManager } from "./windowManager.svelte";
import interact from "interactjs"

const MIN_WINDOW_WIDTH: number = 500;
const MIN_WINDOW_HEIGHT: number = 300;

const WINDOW_ACTION_ENUM = {
  MINIMIZE: "MINIMIZE",
  MAXIMIZE: "MAXIMIZE",
  EXIT: "EXIT"
} as const;
type WINDOW_ACTION = typeof WINDOW_ACTION_ENUM[keyof typeof WINDOW_ACTION_ENUM];

const WINDOW_ID_ENUM = { 
  NONE: "NONE",
  TERMINAL: "TERMINAL",
  BLOG: "BLOG", 
  VICTIONARIUM: "VICTIONARIUM"
} as const;
type WINDOW_ID = typeof WINDOW_ID_ENUM[keyof typeof WINDOW_ID_ENUM];

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve: () => void) => {
    setTimeout(resolve, ms);
  });
}

function centerContainer(element: HTMLElement, offsetX: number = 0, offsetY: number = 0): void {
  element.style.left = r((window.innerWidth / 2) - (element.offsetWidth / 2) + (window.innerWidth * offsetX)) + 'px';
  element.style.top = r((window.innerHeight / 2) - (element.offsetHeight / 2) + (window.innerHeight * offsetY)) + 'px';
  element.style.transform = 'translate(0px, 0px)';
  element.setAttribute('data-x', String(0));
  element.setAttribute('data-y', String(0));
}

function interactable(element: HTMLElement): () => void {
  resolveInitialSize(element);
  const dragHandle = element.querySelector('.drag-handle') as HTMLElement;
  const onPointerDown = () => { dragHandle.style.cursor = 'grabbing'; };
  const onPointerUp = () => { dragHandle.style.cursor = ''; };
  dragHandle.addEventListener('pointerdown', onPointerDown);
  dragHandle.addEventListener('pointerup',   onPointerUp);
  interact(element)
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      margin: 6, //resize trigger threshold
      listeners: {
        start() { element.style.userSelect = 'none'; },
        move(event) {
          const t = event.target;
          let x = r(parseFloat(t.getAttribute('data-x')) || 0);
          let y = r(parseFloat(t.getAttribute('data-y')) || 0);
          t.style.width  = event.rect.width + 'px';
          t.style.height = event.rect.height + 'px';
          x = r(x + (event.deltaRect?.left ?? 0));
          y = r(y + (event.deltaRect?.top ?? 0));
          t.style.transform = `translate(${x}px,${y}px)`;
          t.setAttribute('data-x', String(x));
          t.setAttribute('data-y', String(y));
        },
        end() { element.style.userSelect = ''; }
      },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: () => ({
            top: 2,
            left: 2,
            right: window.innerWidth - 2,
            bottom: window.innerHeight - 2,
          })
        }),
        interact.modifiers.restrictSize({ 
          min: { width: MIN_WINDOW_WIDTH, height: MIN_WINDOW_HEIGHT }
        })
      ],
      inertia: false
    })
    .draggable({
      cursorChecker(): string { return ''; }, //disable default css 'cursor: move'
      allowFrom: '.drag-handle',
      ignoreFrom: '.drag-handle .github-link, .drag-handle .tab',
      inertia: false,
      modifiers: [
        interact.modifiers.restrictRect({ 
          restriction: 'parent',
          endOnly: false //restrict immediately
        })
      ],
      listeners: {
        start() { element.style.userSelect = 'none'; },
        move(event) {
          const t = event.target;
          const x = r((parseFloat(t.getAttribute('data-x')) || 0) + event.dx);
          const y = r((parseFloat(t.getAttribute('data-y')) || 0) + event.dy);
          t.style.transform = `translate(${x}px,${y}px)`;
          t.setAttribute('data-x', String(x));
          t.setAttribute('data-y', String(y));
        },
        end() { element.style.userSelect = ''; }
      }
    });

  return () => {
    interact(element).unset();
    dragHandle.removeEventListener('pointerdown', onPointerDown);
    dragHandle.removeEventListener('pointerup',   onPointerUp);
  };
}

function maximizeContainer(container: HTMLElement): void {
  container.style.width = window.innerWidth + 'px';
  container.style.height = window.innerHeight + 'px';
}

function minimizeContainer(container: HTMLElement): void {
  container.style.width = MIN_WINDOW_WIDTH + 'px';
  container.style.height = MIN_WINDOW_HEIGHT + 'px';
}

function r(n: number): number {
  return Math.round(n);
}

function focusElement(element: HTMLElement): void {
  element.focus();
}

function resolveInitialSize(element: HTMLElement): void {
  element.style.width  = element.offsetWidth  + 'px';
  element.style.height = element.offsetHeight + 'px';
}

//https://javascript.info/bubbling-and-capturing
function activateWindowViaDOMCapture(id: WINDOW_ID) {
  return (element: HTMLElement) => {
    const handler = () => { 
      windowManager.setActiveWindow(id); 
    };
    element.addEventListener('pointerdown', handler, { capture: true });
    return () => element.removeEventListener('pointerdown', handler, { capture: true });
  }
}
function activateWindowViaDOMBubbleUp(id: WINDOW_ID) {
  return (element: HTMLElement) => {
    const handler = (event: PointerEvent) => { 
      if((event.target as HTMLElement).closest('.window-container')) { return; }
      windowManager.setActiveWindow(id); 
    };
    element.addEventListener('pointerdown', handler, { capture: false });
    return () => element.removeEventListener('pointerdown', handler, { capture: false });
  }
}

export { 
  sleep, 
  interactable,
  centerContainer,
  MIN_WINDOW_WIDTH, 
  MIN_WINDOW_HEIGHT,
  WINDOW_ACTION_ENUM,
  WINDOW_ACTION,
  WINDOW_ID_ENUM,
  WINDOW_ID,
  focusElement,
  activateWindowViaDOMCapture,
  activateWindowViaDOMBubbleUp,
  maximizeContainer,
  minimizeContainer,
}
