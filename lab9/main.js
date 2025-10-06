// Shared UI interactions for the site

// Utility: lock/unlock body scroll
function setBodyScrollLocked(locked) {
	if (locked) {
		document.body.style.overflow = 'hidden';
	} else {
		document.body.style.overflow = '';
	}
}

// Overlay helper
function getOverlay() {
	let overlay = document.getElementById('app-overlay');
	if (!overlay) {
		overlay = document.createElement('div');
		overlay.id = 'app-overlay';
		overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:9998';
		document.body.appendChild(overlay);
	}
	return overlay;
}

function showOverlay(onClick) {
	const overlay = getOverlay();
	overlay.style.opacity = '1';
	overlay.style.pointerEvents = 'auto';
	overlay.onclick = onClick;
}

function hideOverlay() {
	const overlay = getOverlay();
	overlay.style.opacity = '0';
	overlay.style.pointerEvents = 'none';
	overlay.onclick = null;
}

// Toasts
function getToastRoot() {
	let root = document.getElementById('toast-root');
	if (!root) {
		root = document.createElement('div');
		root.id = 'toast-root';
		root.style.cssText = 'position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:9999';
		document.body.appendChild(root);
	}
	return root;
}

export function showToast(message) {
	const root = getToastRoot();
	const toast = document.createElement('div');
	toast.textContent = message;
	toast.style.cssText = 'background:#222;color:#fff;padding:10px 12px;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,.25);opacity:0;transform:translateY(8px);transition:all .25s ease;font:14px/1.4 system-ui,Segoe UI,Roboto';
	root.appendChild(toast);
	requestAnimationFrame(() => {
		toast.style.opacity = '1';
		toast.style.transform = 'translateY(0)';
	});
	setTimeout(() => {
		toast.style.opacity = '0';
		toast.style.transform = 'translateY(8px)';
		setTimeout(() => toast.remove(), 250);
	}, 2500);
}

// Preloader
function initPreloader() {
	const pre = document.getElementById('preloader');
	if (pre) {
		window.addEventListener('load', () => {
			pre.style.opacity = '0';
			pre.style.pointerEvents = 'none';
			setTimeout(() => pre.remove(), 400);
		});
	}
}

// Burger menu for header
function initBurgerMenu() {
	const bars = document.getElementById('header_bars');
	const xmark = document.getElementById('header_xmark');
	const mobile = document.querySelector('.header_mobile');
	if (!bars || !mobile) return;

	function openMenu() {
		mobile.classList.add('open');
		mobile.style.transform = 'translateX(0)';
		mobile.style.transition = 'transform .25s ease';
		showOverlay(closeMenu);
		setBodyScrollLocked(true);
		bars.style.transform = 'rotate(90deg)';
		bars.style.transition = 'transform .25s ease';
	}

	function closeMenu() {
		mobile.classList.remove('open');
		mobile.style.transform = 'translateX(100%)';
		hideOverlay();
		setBodyScrollLocked(false);
		bars.style.transform = '';
	}

	// Initial off-screen
	mobile.style.transform = 'translateX(100%)';

	bars.addEventListener('click', openMenu);
	if (xmark) xmark.addEventListener('click', closeMenu);
	mobile.addEventListener('click', (e) => {
		if (e.target.matches('a')) {
			closeMenu();
		}
	});
}

// Smooth scroll for internal links
function initSmoothScroll() {
	document.addEventListener('click', (e) => {
		const a = e.target.closest('a[href^="#"]');
		if (!a) return;
		const id = a.getAttribute('href');
		if (id.length > 1) {
			e.preventDefault();
			const el = document.querySelector(id);
			if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
}

// Simple Swiper init if present
function initSlider() {
	if (window.Swiper) {
		const el = document.querySelector('.article_swiper');
		if (el) {
			// eslint-disable-next-line no-new
			new Swiper(el, {
				autoplay: { delay: 2500, disableOnInteraction: false },
				loop: true,
				slidesPerView: 1,
				spaceBetween: 20,
				breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
			});
		}
	}
}

// Animated counters when visible
function initCounters() {
	const nums = document.querySelectorAll('.title.title-lg');
	if (!nums.length) return;
	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const el = entry.target;
				const target = parseFloat(el.textContent.replace(/[^\d.]/g, ''));
				if (isNaN(target)) return;
				let start = 0;
				const step = Math.max(1, Math.ceil(target / 60));
				const timer = setInterval(() => {
					start += step;
					if (start >= target) {
						start = target;
						clearInterval(timer);
					}
					el.textContent = String(start);
				}, 16);
				io.unobserve(el);
			}
		});
	}, { threshold: 0.5 });
	nums.forEach(n => io.observe(n));
}

// Scroll animations (fade-in)
function initScrollAnimations() {
	const els = document.querySelectorAll('[data-animate]');
	if (!els.length) return;
	els.forEach(el => el.style.opacity = '0');
	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.transition = 'opacity .6s ease, transform .6s ease';
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
				io.unobserve(entry.target);
			}
		});
	}, { threshold: 0.2 });
	els.forEach(el => {
		el.style.transform = 'translateY(12px)';
		io.observe(el);
	});
}

// Parallax for .order section
function initParallax() {
	const section = document.querySelector('.order');
	if (!section) return;
	const img = section.querySelector('.order_imgBox');
	const text = section.querySelector('.order_textBox');
	function onScroll() {
		const rect = section.getBoundingClientRect();
		const viewH = window.innerHeight || document.documentElement.clientHeight;
		if (rect.bottom < 0 || rect.top > viewH) return;
		const p = 1 - Math.max(0, Math.min(1, rect.top / viewH));
		if (img) img.style.transform = `translateY(${p * -15}px)`; // opposite dir
		if (text) text.style.transform = `translateY(${p * 25}px)`;
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
}

// Media Gallery with sounds
function initMediaGallery() {
	const gallery = document.getElementById('media-gallery');
	if (!gallery) return;
	const imgEl = gallery.querySelector('img');
	const playBtn = gallery.querySelector('[data-play]');
	const statusEl = gallery.querySelector('[data-status]');
	const volume = gallery.querySelector('input[type="range"]');
	const images = [
		'1984.jpg','A Bruefer History of Time.jpg','alchemist.jpeg','dune.jpg','Educated.webp','Guns germs and steel.webp','Pride and prejudice.jpg','Sapines.jpg','The catcher in rye.webp','The da vinci code.jpg','The hobbit.jpg','The name of the wind.webp','to kill a Mockingbird.jpg'
	].map(n => `public/images/${n}`);
	let audioCtx;
	let oscillator;
	let gain;

	function stopSound() {
		if (oscillator) {
			oscillator.stop();
			oscillator.disconnect();
			oscillator = null;
			statusEl.textContent = 'paused';
		}
	}

	function playToneForIndex(idx) {
		if (!audioCtx) {
			audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			gain = audioCtx.createGain();
			gain.connect(audioCtx.destination);
		}
		stopSound();
		oscillator = audioCtx.createOscillator();
		oscillator.type = 'sine';
		const base = 220; // A3
		oscillator.frequency.value = base + (idx * 30);
		if (gain && volume) gain.gain.value = (Number(volume.value) || 50) / 100;
		oscillator.connect(gain);
		oscillator.start();
		statusEl.textContent = 'playing';
	}

	function setRandomImageAndSound() {
		const idx = Math.floor(Math.random() * images.length);
		imgEl.style.transition = 'opacity .3s ease';
		imgEl.style.opacity = '0';
		setTimeout(() => {
			imgEl.src = images[idx];
			imgEl.style.opacity = '1';
			playToneForIndex(idx);
		}, 200);
	}

	gallery.addEventListener('click', (e) => {
		if (e.target.matches('[data-change]')) {
			setRandomImageAndSound();
		}
		if (e.target === playBtn) {
			if (statusEl.textContent === 'playing') stopSound(); else playToneForIndex(0);
		}
	});

	if (volume) {
		volume.addEventListener('input', () => {
			if (gain) gain.gain.value = (Number(volume.value) || 50) / 100;
		});
	}
}

// Map modal (uses Google Maps iframe)
function openMapModal() {
	const modal = ensureModal('map-modal');
	modal.content.innerHTML = '<div style="width:100%;height:60vh"><iframe title="map" width="100%" height="100%" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95565131531517!3d-37.81732774202171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzAyLjQiUyAxNDTCsDU3JzI2LjQiRQ!5e0!3m2!1sen!2s!4v1614031234567"></iframe></div>';
	showModal(modal);
}

// Video modal
function openVideoModal() {
	const modal = ensureModal('video-modal');
	modal.content.innerHTML = '<video id="video-player" controls style="width:100%;height:auto" src="author_video.mp4"></video>';
	showModal(modal);
	setTimeout(() => {
		const v = document.getElementById('video-player');
		if (v) v.play().catch(() => {});
	}, 0);
}

// Generic modal helpers
function ensureModal(id) {
	let wrap = document.getElementById(id);
	if (!wrap) {
		wrap = document.createElement('div');
		wrap.id = id;
		wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;pointer-events:none;transition:opacity .2s ease;';
		const box = document.createElement('div');
		box.style.cssText = 'max-width:900px;width:90%;max-height:85vh;overflow:auto;background:#fff;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.25);transform:translateY(12px);transition:transform .2s ease';
		const close = document.createElement('button');
		close.textContent = '×';
		close.setAttribute('aria-label', 'Close');
		close.style.cssText = 'position:absolute;top:8px;right:12px;font-size:24px;background:transparent;border:0;cursor:pointer';
		const content = document.createElement('div');
		content.style.cssText = 'position:relative;padding:20px';
		box.appendChild(close);
		box.appendChild(content);
		wrap.appendChild(box);
		document.body.appendChild(wrap);
		wrap.addEventListener('click', (e) => { if (e.target === wrap) hideModal({ wrap, box }); });
		close.addEventListener('click', () => hideModal({ wrap, box }));
		wrap._modal = { wrap, box, content };
	}
	return wrap._modal;
}

function showModal(modal) {
	showOverlay(() => hideModal(modal));
	setBodyScrollLocked(true);
	modal.wrap.style.opacity = '1';
	modal.wrap.style.pointerEvents = 'auto';
	modal.box.style.transform = 'translateY(0)';
}

function hideModal(modal) {
	if (!modal) return;
	modal.wrap.style.opacity = '0';
	modal.wrap.style.pointerEvents = 'none';
	modal.box.style.transform = 'translateY(12px)';
	hideOverlay();
	setBodyScrollLocked(false);
}

// Product detail modal on catalog cards
function initProductDetailModal() {
	const list = document.getElementById('book-list');
	if (!list) return;
	list.addEventListener('click', (e) => {
		const card = e.target.closest('.book-card');
		if (!card) return;
		const img = card.querySelector('img');
		const title = card.querySelector('h3');
		const author = card.querySelector('p.desc');
		const price = card.querySelector('.desc-yellow');
		const modal = ensureModal('product-modal');
		modal.content.innerHTML = `
			<div style="display:flex;gap:20px;flex-wrap:wrap">
				<img src="${img ? img.src : ''}" alt="" style="width:220px;height:auto;border-radius:8px" />
				<div>
					<h3 class="title title-sm">${title ? title.textContent : ''}</h3>
					<p class="desc desc-sm">${author ? author.textContent : ''}</p>
					<p class="desc desc-sm desc-yellow">${price ? price.textContent : ''}</p>
				</div>
			</div>
		`;
		showModal(modal);
	});
}

// Admin: move book form into modal
function initAdminFormModal() {
	const form = document.getElementById('book-form');
	if (!form) return;
	const modal = ensureModal('admin-book-modal');
	modal.content.innerHTML = '';
	modal.content.appendChild(form);
	const trigger = document.createElement('button');
	trigger.className = 'button';
	trigger.textContent = 'Add / Edit Book';
	const section = form.closest('section');
	if (section) {
		section.insertBefore(trigger, section.firstChild);
	}
	form.style.display = 'block';
	const cancelBtn = document.getElementById('cancel-edit');
	if (cancelBtn) cancelBtn.addEventListener('click', () => hideModal(modal));
	trigger.addEventListener('click', () => showModal(modal));
}

// Wire buttons for map/video
function initGlobalButtons() {
	document.querySelectorAll('[data-open-map]').forEach(btn => btn.addEventListener('click', openMapModal));
	document.querySelectorAll('[data-open-video]').forEach(btn => btn.addEventListener('click', openVideoModal));
}

document.addEventListener('DOMContentLoaded', () => {
	initPreloader();
	initBurgerMenu();
	initSmoothScroll();
	initSlider();
	initCounters();
	initScrollAnimations();
	initParallax();
	initMediaGallery();
	initProductDetailModal();
	initAdminFormModal();
	initGlobalButtons();
});

// Expose for other scripts
window.showToast = showToast;


