import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
let dispose: (() => void) | undefined;

function initialize() {
  dispose?.();
  const section = document.querySelector<HTMLElement>('.design-metrics');
  if (!section) return;

  const context = gsap.context(() => {
    gsap.fromTo(section,
      { backgroundColor: '#000000', color: '#ffffff' },
      {
        backgroundColor: '#ffffff',
        color: '#000000',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
    const counters = [...section.querySelectorAll<HTMLElement>('[data-count]')];
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      counters.forEach((counter) => {
        const target = Number(counter.dataset.count);
        counter.textContent = '0';
        const value = { count: 0 };
        gsap.to(value, {
          count: target,
          duration: 1.7,
          ease: 'power2.out',
          onUpdate: () => { counter.textContent = String(Math.round(value.count)); },
          scrollTrigger: { trigger: section, start: 'top 78%', once: true },
        });
      });
    }, section);
  }, section);
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
