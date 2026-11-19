const section = document.querySelector<HTMLElement>('.cinematic-scroll');
const entrance = section?.querySelector<HTMLElement>('.entrance');

if (section && entrance) {
  const scenes = [...entrance.querySelectorAll<HTMLElement>('[data-scene]')];
  const chapters = [...entrance.querySelectorAll<HTMLElement>('[data-chapter]')];
  const staticView = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  let elapsed = 0;
  let lastTime = 0;
  let frame = 0;
  let visible = false;
  let disposed = false;
  const firstSceneDuration = 4000; // İlk video süresi (4 saniye)
  const defaultDuration = 4000;    // Diğer videolar (4 saniye)
  const fade = 800;

  // Her sahnenin başlangıç ve bitiş zamanlarını hesapla
  function getSceneTiming(sceneIndex: number) {
    const dur = sceneIndex === 0 ? firstSceneDuration : defaultDuration;
    return dur;
  }

  const totalCycleDuration = firstSceneDuration + (scenes.length - 1) * defaultDuration;

  for (const chapter of chapters) {
    const scene = scenes[Number(chapter.dataset.chapter)];
    if (scene) scene.dataset.title = chapter.querySelector('h2')?.textContent ?? '';
  }

  function getCurrentSceneState(timeInCycle: number) {
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      const dur = getSceneTiming(i);
      if (timeInCycle < accumulated + dur) {
        const timeIntoScene = timeInCycle - accumulated;
        const current = i;
        const next = (i + 1) % scenes.length;
        const blend = clamp((timeIntoScene - (dur - fade)) / fade);
        return { current, next, blend };
      }
      accumulated += dur;
    }
    return { current: 0, next: 1, blend: 0 };
  }

  function render() {
    if (!section || !entrance) return;
    if (staticView.matches) {
      scenes.forEach((scene) => scene.querySelector('video')?.pause());
      return;
    }

    const { current, next, blend } = getCurrentSceneState(elapsed);
    const intro = current === 0 ? 1 - blend : next === 0 ? blend : 0;
    entrance.style.setProperty('--intro-opacity', String(intro));
    entrance.style.setProperty('--brand-opacity', String(intro));
    entrance.style.setProperty('--brand-shift', `${(1 - intro) * -60}px`);

    scenes.forEach((scene, index) => {
      const visibility = index === current ? 1 - blend : index === next ? blend : 0;
      scene.style.setProperty('--scene-opacity', String(visibility));
      scene.style.setProperty('--scene-scale', String(1.04 - visibility * 0.04));
      const video = scene.querySelector('video');
      if (!video) return;
      if (visibility > 0 && visible && !document.hidden) {
        if (!video.getAttribute('src') && video.dataset.src) {
          video.src = video.dataset.src;
          video.loop = true;
          video.addEventListener('playing', () => video.classList.add('is-ready'));
          video.addEventListener('error', () => video.classList.remove('is-ready'));
        }
        if (video.paused && !video.error) void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    chapters.forEach((chapter) => {
      const index = Number(chapter.dataset.chapter);
      const visibility = index === current ? 1 - blend : index === next ? blend : 0;
      chapter.style.setProperty('--chapter-opacity', String(visibility));
      chapter.style.setProperty('--chapter-shift', `${(1 - visibility) * 18}px`);
    });
  }

  function tick(time: number) {
    frame = 0;
    if (disposed) return;
    if (lastTime) elapsed = (elapsed + Math.min(time - lastTime, 100)) % totalCycleDuration;
    lastTime = time;
    render();
    if (visible && !document.hidden && !staticView.matches) frame = requestAnimationFrame(tick);
    else lastTime = 0;
  }

  let splashActive = !!document.getElementById('splash-screen') && !document.getElementById('splash-screen')?.classList.contains('fade-out');

  function updatePlayback() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (!disposed && visible && !splashActive && !document.hidden && !staticView.matches) frame = requestAnimationFrame(tick);
    if (!disposed) render();
  }

  // Açılış ekranı varsa bittiği an (fade-out) ilk videoyu tam o anda sıfırdan başlat
  if (splashActive) {
    window.addEventListener(
      'splash:done',
      () => {
        splashActive = false;
        elapsed = 0;
        lastTime = 0;
        const firstVideo = scenes[0]?.querySelector('video');
        if (firstVideo) {
          firstVideo.currentTime = 0;
        }
        updatePlayback();
      },
      { once: true }
    );
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updatePlayback();
  });
  observer.observe(section);

  document.addEventListener('visibilitychange', updatePlayback);
  staticView.addEventListener('change', updatePlayback);
  function cleanup() {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    scenes.forEach((scene) => scene.querySelector('video')?.pause());
    document.removeEventListener('visibilitychange', updatePlayback);
    document.removeEventListener('astro:before-swap', cleanup);
    staticView.removeEventListener('change', updatePlayback);
  }
  document.addEventListener('astro:before-swap', cleanup, { once: true });
  if (import.meta.hot) import.meta.hot.dispose(cleanup);
  render();
  updatePlayback();
}
