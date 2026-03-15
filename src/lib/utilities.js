import interact from "interactjs"

const MIN_WINDOW_WIDTH = 500;
const MIN_WINDOW_HEIGHT = 300;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function centerContainer(element) {
  element.style.left = (window.innerWidth / 2 - element.offsetWidth / 2) + 'px';
  element.style.top = (window.innerHeight / 2 - element.offsetHeight / 2) + 'px';
}

function interactable(element) {
  centerContainer(element);
  interact(element)
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      margin: 6, //resize trigger threshold
      listeners: {
        move(event) {
          const t = event.target;
          let x = (parseFloat(t.getAttribute('data-x')) || 0);
          let y = (parseFloat(t.getAttribute('data-y')) || 0);
          t.style.width = event.rect.width + 'px';
          t.style.height = event.rect.height + 'px';
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          t.style.transform = `translate(${x}px,${y}px)`;
          t.setAttribute('data-x', x);
          t.setAttribute('data-y', y);
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
      cursorChecker() { return null; }, //disable default css 'cursor: move'
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
          const x = (parseFloat(t.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(t.getAttribute('data-y')) || 0) + event.dy;
          t.style.transform = `translate(${x}px,${y}px)`;
          t.setAttribute('data-x', x);
          t.setAttribute('data-y', y);
        }
      }
    });

  return () => interact(element).unset();
}

function focusOnMount(element) {
  element.focus();
}

export { 
  sleep, 
  centerContainer, 
  interactable, 
  MIN_WINDOW_WIDTH, 
  MIN_WINDOW_HEIGHT,
  focusOnMount
}
