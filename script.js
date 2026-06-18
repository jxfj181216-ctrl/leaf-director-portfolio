const body = document.body;
const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-panel');
const toggle = document.querySelector('.menu-toggle');
const closeButton = document.querySelector('.menu-close');
const backdrop = document.querySelector('.menu-backdrop');
const videoModal = document.querySelector('.video-modal');
const videoPlayer = videoModal.querySelector('video');
const videoTitle = videoModal.querySelector('.video-modal-title');
const videoClose = videoModal.querySelector('.video-close');
let lastVideoTrigger = null;

window.addEventListener('load', () => body.classList.add('loaded'));
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

function setMenu(open) {
  body.classList.toggle('menu-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  toggle.setAttribute('aria-expanded', String(open));
  if (open) closeButton.focus();
}

toggle.addEventListener('click', () => setMenu(true));
closeButton.addEventListener('click', () => setMenu(false));
backdrop.addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
  if (event.key === 'Escape' && body.classList.contains('video-open')) closeVideo();
});

function openVideo(trigger) {
  lastVideoTrigger = trigger;
  videoTitle.textContent = trigger.dataset.title;
  videoPlayer.src = trigger.dataset.video;
  videoModal.setAttribute('aria-hidden', 'false');
  body.classList.add('video-open');
  videoClose.focus();
  videoPlayer.play().catch(() => {});
}

function closeVideo() {
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoPlayer.load();
  videoModal.setAttribute('aria-hidden', 'true');
  body.classList.remove('video-open');
  if (lastVideoTrigger) lastVideoTrigger.focus();
}

document.querySelectorAll('.video-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => openVideo(trigger));
});
videoClose.addEventListener('click', closeVideo);
videoModal.addEventListener('click', event => {
  if (event.target === videoModal || event.target.classList.contains('video-stage')) closeVideo();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

document.querySelector('form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button');
  const originalButtonContent = button.innerHTML;

  if (window.location.protocol === 'file:') {
    status.textContent = '请通过“启动网页预览.command”打开网站后再发送。';
    return;
  }

  button.disabled = true;
  button.textContent = '发送中…';
  status.textContent = '';

  try {
    const response = await fetch('https://formsubmit.co/ajax/jxfj181216@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error('Form submission failed');
    }

    status.textContent = '发送成功，感谢你的来信。';
    form.reset();
  } catch (error) {
    status.textContent = '发送失败，请稍后重试或直接发送邮件。';
  } finally {
    button.disabled = false;
    button.innerHTML = originalButtonContent;
  }
});
