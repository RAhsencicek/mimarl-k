import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let dispose: (() => void) | undefined;

function initialize() {
  dispose?.();
  const section = document.querySelector<HTMLElement>('.design-statement');
  if (!section) return;

  const context = gsap.context(() => {
    const media = gsap.matchMedia();

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

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.design-statement__word', { yPercent: 100, opacity: 0 }, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.075,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'top 35%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);
  }, section);

  dispose = () => context.revert();
}

initialize();
function cleanup() {
  dispose?.();
  dispose = undefined;
}
document.addEventListener('astro:page-load', initialize);
document.addEventListener('astro:before-swap', cleanup);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanup();
    document.removeEventListener('astro:page-load', initialize);
    document.removeEventListener('astro:before-swap', cleanup);
  });
}
