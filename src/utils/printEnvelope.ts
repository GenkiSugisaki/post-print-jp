export function printEnvelope(): void {
  const source = document.getElementById('print-root');
  if (!source) return;

  // Clone at actual size (remove preview scale transform)
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.position = 'static';
  clone.style.border = '1px solid #374151';
  clone.style.display = 'inline-block';

  const portal = document.createElement('div');
  portal.id = 'print-portal';
  portal.appendChild(clone);
  document.body.appendChild(portal);

  const style = document.createElement('style');
  style.id = 'print-page-size';
  style.textContent = `@page { size: A4 portrait; margin: 20mm; }`;
  document.head.appendChild(style);

  const cleanup = () => {
    if (portal.parentNode) document.body.removeChild(portal);
    if (style.parentNode) document.head.removeChild(style);
  };

  // iOS Safari: window.print() returns asynchronously before the print
  // dialog finishes, so we must defer cleanup to the afterprint event.
  window.addEventListener('afterprint', cleanup, { once: true });

  window.print();

  // Fallback: if afterprint never fires (some older mobile browsers),
  // clean up after a generous timeout.
  setTimeout(() => {
    cleanup();
    window.removeEventListener('afterprint', cleanup);
  }, 60000);
}
