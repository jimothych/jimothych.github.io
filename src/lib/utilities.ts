import interact from "interactjs"

const MIN_WINDOW_WIDTH: number = 500;
const MIN_WINDOW_HEIGHT: number = 300;

type WINDOW_ACTION_TYPE = {
  MINIMIZE: string,
  MAXIMIZE: string,
  EXIT: string
}
const WINDOW_ACTION: WINDOW_ACTION_TYPE = {
  MINIMIZE: "MINIMIZE",
  MAXIMIZE: "MAXIMIZE",
  EXIT: "EXIT"
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve: () => void) => {
    setTimeout(resolve, ms);
  });
}

function centerContainer(element: HTMLElement): void {
  element.style.left = r((window.innerWidth / 2) - (element.offsetWidth / 2)) + 'px';
  element.style.top = r((window.innerHeight / 2) - (element.offsetHeight / 2)) + 'px';
  element.style.transform = 'translate(0px, 0px)';
  element.setAttribute('data-x', String(0));
  element.setAttribute('data-y', String(0));
}

function interactable(element: HTMLElement): () => void {
  centerContainer(element);
  interact(element)
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      margin: 6, //resize trigger threshold
      listeners: {
        move(event) {
          const t = event.target;
          let x = r(parseFloat(t.getAttribute('data-x')) || 0);
          let y = r(parseFloat(t.getAttribute('data-y')) || 0);
          t.style.width = r(event.rect.width) + 'px';
          t.style.height = r(event.rect.height) + 'px';
          x = r(x + (event.deltaRect?.left ?? 0));
          y = r(y + (event.deltaRect?.top ?? 0));
          t.style.transform = `translate(${x}px,${y}px)`;
          t.setAttribute('data-x', String(x));
          t.setAttribute('data-y', String(y));
        }
      },
      modifiers: [
        interact.modifiers.restrictEdges({ outer: 'parent' }),
        interact.modifiers.restrictSize({ 
          min: { width: MIN_WINDOW_WIDTH, height: MIN_WINDOW_HEIGHT } 
        })
      ],
      inertia: false
    })
    .draggable({
      cursorChecker(): string { return ''; }, //disable default css 'cursor: move'
      allowFrom: '.drag-handle',
      inertia: false,
      modifiers: [
        interact.modifiers.restrictRect({ 
          restriction: 'parent', 
          endOnly: false //restrict immediately
        })
      ],
      listeners: {
        move(event) {
          const t = event.target;
          const x = r((parseFloat(t.getAttribute('data-x')) || 0) + event.dx);
          const y = r((parseFloat(t.getAttribute('data-y')) || 0) + event.dy);
          t.style.transform = `translate(${x}px,${y}px)`;
          t.setAttribute('data-x', String(x));
          t.setAttribute('data-y', String(y));
        }
      }
    });

  return () => interact(element).unset();
}

function maximizeContainer(container: HTMLElement): void {
  container.style.width = (window.innerWidth - 4) + 'px';
  container.style.height = (window.innerHeight - 4) + 'px';
  centerContainer(container);
}

function minimizeContainer(container: HTMLElement): void {
  container.style.width = MIN_WINDOW_WIDTH + 'px';
  container.style.height = MIN_WINDOW_HEIGHT + 'px';
  centerContainer(container);
}

function r(n: number): number {
  return Math.round(n);
}

function focusOnMount(element: HTMLElement): void {
  element.focus();
}

export { 
  sleep, 
  centerContainer, 
  interactable, 
  MIN_WINDOW_WIDTH, 
  MIN_WINDOW_HEIGHT,
  WINDOW_ACTION,
  focusOnMount,
  maximizeContainer,
  minimizeContainer
}
