import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
let dispose: (() => void) | undefined;

function initialize() {
  dispose?.();
  const section = document.querySelector<HTMLElement>('.project-rail');
  const viewport = section?.querySelector<HTMLElement>('.project-rail__viewport');
  const track = section?.querySelector<HTMLElement>('.project-rail__track');
  if (!section || !viewport || !track) return;

  const context = gsap.context(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: viewport,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });
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
