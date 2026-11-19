import { gsap } from 'gsap';

let dispose: (() => void) | undefined;

function initialize() {
  dispose?.();
  const gallery = document.querySelector<HTMLElement>('.design-gallery');
  if (!gallery) return;
  const cards = [...gallery.querySelectorAll<HTMLElement>('.design-gallery__card')];
  const listeners: (() => void)[] = [];
  const context = gsap.context(() => {
    const media = gsap.matchMedia();
    media.add({ reduced: '(prefers-reduced-motion: reduce)', normal: '(prefers-reduced-motion: no-preference)' }, (match) => {
      let active = -1;
      const reduced = Boolean(match.conditions?.reduced);
      const timelines = cards.map((card) => {
        const image = card.querySelector('.design-gallery__image');
        const panel = card.querySelector('.design-gallery__panel');
        const copy = card.querySelector('.design-gallery__copy');
        const text = card.querySelectorAll('.design-gallery__copy > *');
        gsap.set(panel, { zIndex: 0, xPercent: reduced ? 0 : 12 });
        gsap.set(copy, { autoAlpha: 1, y: 0 });
        gsap.set(text, { autoAlpha: 0, y: reduced ? 0 : 30 });
        return gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
          .to(image, { xPercent: -100, duration: reduced ? 0 : .8 }, 0)
          .to(panel, { xPercent: 0, duration: reduced ? 0 : .8 }, 0)
          .to(text, { autoAlpha: 1, y: 0, stagger: reduced ? 0 : .1, duration: reduced ? 0 : .55 }, reduced ? 0 : .22)
          // Keep the panel behind the moving image until the reveal finishes.
          .set(panel, { zIndex: 3 });
      });

      function activate(index: number) {
        if (index === active) return;
        active = index;
        cards.forEach((card, i) => {
          const open = i === index;
          card.querySelector('button')?.setAttribute('aria-expanded', String(open));
          card.querySelector('.design-gallery__panel')?.setAttribute('aria-hidden', String(!open));
          // Reverse from the current progress; never queue another tween.
          if (open) timelines[i].play();
          else timelines[i].reverse();
        });
      }

      function listen(target: EventTarget, name: string, handler: EventListener) {
        target.addEventListener(name, handler);
        listeners.push(() => target.removeEventListener(name, handler));
      }

      cards.forEach((card, index) => {
        const button = card.querySelector('button')!;
        listen(card, 'pointerenter', (event) => {
          if ((event as PointerEvent).pointerType === 'mouse') activate(index);
        });
        listen(button, 'focus', () => {
          if (button.matches(':focus-visible')) activate(index);
        });
        listen(button, 'click', () => activate(active === index ? -1 : index));
      });
      listen(gallery, 'pointerleave', (event) => {
        if ((event as PointerEvent).pointerType === 'mouse') activate(-1);
      });
      listen(gallery, 'focusout', (event) => {
        if (!gallery.contains((event as FocusEvent).relatedTarget as Node | null)) activate(-1);
      });
      listen(gallery, 'keydown', (event) => {
        if ((event as KeyboardEvent).key === 'Escape') activate(-1);
      });
      gallery.dataset.enhanced = '';
      return () => {
        listeners.splice(0).forEach((remove) => remove());
        delete gallery.dataset.enhanced;
        cards.forEach((card) => {
          card.querySelector('button')?.setAttribute('aria-expanded', 'false');
          card.querySelector('.design-gallery__panel')?.setAttribute('aria-hidden', 'true');
        });
      };
    });
  }, gallery);
  dispose = () => context.revert();
}

function cleanup() { dispose?.(); dispose = undefined; }
initialize();
document.addEventListener('astro:page-load', initialize);
document.addEventListener('astro:before-swap', cleanup);
if (import.meta.hot) import.meta.hot.dispose(() => {
  cleanup();
  document.removeEventListener('astro:page-load', initialize);
  document.removeEventListener('astro:before-swap', cleanup);
});
