const FACEBOOK_PROFILE_URL = 'https://www.facebook.com/profile.php?id=61586307804834';
function setFacebookLinkTargets() {
const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
document.querySelectorAll('a[href*="facebook.com"]').forEach((link) => {
if (isDesktop) {
link.setAttribute('target', '_blank');
link.setAttribute('rel', 'noopener noreferrer');
} else {
link.removeAttribute('target');
link.removeAttribute('rel');
}
});
}
function syncNavCtaButtonWidths() {
const bashButton = document.querySelector('.nav-bash-btn');
const donateButton = document.querySelector('.nav-donate-btn');
if (!bashButton || !donateButton) {
return;
}
// Reset to natural width before measuring so resizing stays accurate.
bashButton.style.width = 'auto';
donateButton.style.width = 'auto';
const bashWidth = Math.ceil(bashButton.getBoundingClientRect().width);
if (!Number.isFinite(bashWidth) || bashWidth <= 0) {
return;
}
const targetWidth = `${bashWidth}px`;
bashButton.style.width = targetWidth;
donateButton.style.width = targetWidth;
}
function createFacebookCta(options = {}) {
const {
modifier = '',
showDivider = true,
dividerText = 'Stay Connected',
title = 'Follow the Campaign',
subtitle = 'News, updates & community events',
ctaText = 'Visit Page'
} = options;
const root = document.createElement('div');
root.className = modifier ? `facebook-cta facebook-cta--${modifier}` : 'facebook-cta';
if (showDivider) {
const divider = document.createElement('div');
divider.className = 'facebook-cta__divider';
divider.setAttribute('aria-hidden', 'true');
divider.innerHTML = `
<span class="facebook-cta__divider-line"></span>
<span class="facebook-cta__divider-text">${dividerText}</span>
<span class="facebook-cta__divider-line"></span>
`;
root.appendChild(divider);
}
const link = document.createElement('a');
link.className = 'facebook-cta__link';
link.href = FACEBOOK_PROFILE_URL;
link.setAttribute('aria-label', 'Follow Beller for Sheriff on Facebook');
link.innerHTML = `
<span class="facebook-cta__icon" aria-hidden="true">
<i class="fab fa-facebook-f"></i>
</span>
<span class="facebook-cta__copy">
<span class="facebook-cta__title">${title}</span>
<span class="facebook-cta__subtitle">${subtitle}</span>
</span>
<span class="facebook-cta__action" aria-hidden="true">
<span>${ctaText}</span>
<i class="fas fa-arrow-right"></i>
</span>
`;
root.appendChild(link);
return root;
}
function mountFacebookCtas() {
document.querySelectorAll('[data-facebook-cta]').forEach((placeholder) => {
const cta = createFacebookCta({
modifier: placeholder.dataset.modifier || '',
showDivider: placeholder.dataset.showDivider !== 'false',
dividerText: placeholder.dataset.dividerText || 'Stay Connected',
title: placeholder.dataset.title || 'Follow the Campaign',
subtitle: placeholder.dataset.subtitle || 'News, updates & community events',
ctaText: placeholder.dataset.ctaText || 'Visit Page'
});
placeholder.replaceWith(cta);
});
}
function scrollToTop() {
window.scrollTo({ top: 0, behavior: 'smooth' });
}
const campaignVideos = [
{
id: 'beller-bash',
tabLabel: 'Beller Bash',
mp4: 'media/bellerbash.mp4',
linkUrl: 'https://secure.anedot.com/beller-for-sheriff/cadd22fd-df9f-4de5-a77a-0469755382e7'
},
{
id: 'breakfast',
tabLabel: 'Dairy Breakfast',
mp4: 'media/breakfast.mp4'
},
{
id: 'daevon',
tabLabel: 'Crossing Paths',
mp4: 'media/daevon.mp4'
},
{
id: 'campaign-launch',
tabLabel: 'Campaign Launch',
mp4: 'media/campaignlaunch.mp4'
},
{
id: 'kenosha-tough',
tabLabel: 'Kenosha Tough',
mp4: 'media/kenoshatough.mp4'
},
{
id: 'memorial-day-remembrance',
tabLabel: 'Memorial Day Remembrance',
mp4: 'media/memorialdayremembrance.mp4'
},
{
id: 'test-video',
tabLabel: 'test-video',
devOnly: true,
mp4: 'media/test-video-does-not-exist.mp4'
}
];
function isDevelopmentMode() {
const host = window.location.hostname;
return window.location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';
}
function getVisibleCampaignVideos() {
const devMode = isDevelopmentMode();
return campaignVideos.filter((video) => !video.devOnly || devMode);
}
function bindCampaignVideoLoadingEvents(player) {
if (!player || player.dataset.loadingEventsBound === 'true') {
return;
}
const showLoading = () => {
player.classList.add('video-loading');
player.controls = false;
};
const hideLoading = () => {
player.classList.remove('video-loading');
player.controls = true;
};
player.addEventListener('loadstart', showLoading);
player.addEventListener('waiting', showLoading);
player.addEventListener('canplay', hideLoading);
player.addEventListener('loadeddata', hideLoading);
player.addEventListener('playing', hideLoading);
player.dataset.loadingEventsBound = 'true';
}
function bindCampaignVideoLinkEvents(player) {
if (!player || player.dataset.linkEventsBound === 'true') {
return;
}
const supportsPrecisePointer = window.matchMedia('(pointer: fine)').matches;
if (!supportsPrecisePointer) {
player.dataset.linkEventsBound = 'true';
return;
}
player.addEventListener('click', () => {
const linkUrl = player.dataset.linkUrl;
if (!linkUrl) {
return;
}
window.open(linkUrl, '_blank', 'noopener,noreferrer');
});
player.dataset.linkEventsBound = 'true';
}
function renderCampaignVideoModal() {
const availableVideos = getVisibleCampaignVideos();
const options = availableVideos
.map((video, index) => `
<option value="${video.id}" ${index === 0 ? 'selected' : ''}>${video.tabLabel}</option>
`)
.join('');
return `
<div class="video-modal-header">
<h2>Campaign Videos</h2>
<select id="campaign-video-select" aria-label="Choose campaign video" style="min-width: 220px; width: min(100%, 320px); padding: 10px 12px; border: 1px solid var(--primary-color); border-radius: 8px; font-size: 1rem;">
${options}
</select>
</div>
<div class="video-player-panel">
<div class="video-stage">
<video id="campaign-video-player" class="modal-video" autoplay muted controls playsinline>
Your browser does not support the video tag.
</video>
<div id="video-status-overlay" class="video-status-overlay" aria-hidden="true">
<div id="video-status-banner" class="video-status-banner"></div>
</div>
</div>
<a
id="video-link-action"
class="btn btn-primary"
href="#"
target="_blank"
rel="noopener noreferrer"
style="display: none; margin-top: 12px; width: 100%; text-align: center; background-color: dodgerblue; border-color: dodgerblue; color: white;">
Get Tickets Now!
</a>
<p id="video-playback-note" style="display: none; margin-top: 12px; color: #b00020;">
This browser cannot play this video format. Please try Safari or provide an MP4 version for universal playback.
</p>
</div>
`;
}
function selectCampaignVideo(modal, videoId) {
const availableVideos = getVisibleCampaignVideos();
const videoData = availableVideos.find((video) => video.id === videoId) || availableVideos[0];
const player = modal.querySelector('#campaign-video-player');
const statusOverlay = modal.querySelector('#video-status-overlay');
const statusBanner = modal.querySelector('#video-status-banner');
const note = modal.querySelector('#video-playback-note');
const linkAction = modal.querySelector('#video-link-action');
const videoSelect = modal.querySelector('#campaign-video-select');
if (!player || !videoData) {
return;
}
bindCampaignVideoLoadingEvents(player);
bindCampaignVideoLinkEvents(player);
if (videoData.linkUrl) {
player.dataset.linkUrl = videoData.linkUrl;
player.style.cursor = 'pointer';
player.setAttribute('title', 'Click to open related campaign link');
if (linkAction) {
linkAction.href = videoData.linkUrl;
linkAction.style.display = 'inline-block';
}
} else {
delete player.dataset.linkUrl;
player.style.cursor = '';
player.removeAttribute('title');
if (linkAction) {
linkAction.removeAttribute('href');
linkAction.style.display = 'none';
}
}
// Track the active load request to ignore stale async events from prior selections.
const loadRequestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
player.dataset.loadRequestId = loadRequestId;
const unavailableMessage = 'This video is unavailable right now. Please try another video.';
const formatMessage = 'This browser cannot play this video format. Please try Safari or provide an MP4 version for universal playback.';
const clearFailureTimeout = () => {
if (player.dataset.failureTimeoutId) {
window.clearTimeout(Number(player.dataset.failureTimeoutId));
delete player.dataset.failureTimeoutId;
}
};
const isCurrentLoadRequest = () => player.dataset.loadRequestId === loadRequestId;
const setStatusOverlay = (message = '') => {
if (!statusOverlay || !statusBanner) {
return;
}
if (message) {
statusBanner.textContent = message;
statusOverlay.classList.add('show');
return;
}
statusBanner.textContent = '';
statusOverlay.classList.remove('show');
};
const showUnavailable = () => {
if (!isCurrentLoadRequest()) {
return;
}
clearFailureTimeout();
player.classList.add('video-loading');
player.controls = false;
setStatusOverlay(unavailableMessage);
if (note) {
note.textContent = unavailableMessage;
note.style.display = 'none';
}
};
if (videoSelect) {
videoSelect.value = videoData.id;
}
player.pause();
player.innerHTML = '';
player.classList.add('video-loading');
player.controls = false;
setStatusOverlay('');
if (videoData.mp4) {
const mp4Source = document.createElement('source');
mp4Source.src = videoData.mp4;
mp4Source.type = 'video/mp4';
mp4Source.onerror = showUnavailable;
player.appendChild(mp4Source);
}
if (videoData.mov) {
const movSource = document.createElement('source');
movSource.src = videoData.mov;
movSource.onerror = showUnavailable;
player.appendChild(movSource);
}
player.load();
if (note) {
note.style.display = 'none';
note.textContent = formatMessage;
}
player.onerror = showUnavailable;
const markLoaded = () => {
if (!isCurrentLoadRequest()) {
return;
}
clearFailureTimeout();
setStatusOverlay('');
if (note) {
note.style.display = 'none';
}
};
player.addEventListener('loadeddata', markLoaded, { once: true });
player.addEventListener('canplay', markLoaded, { once: true });
player.addEventListener('playing', markLoaded, { once: true });
const timeoutId = window.setTimeout(() => {
if (!isCurrentLoadRequest()) {
return;
}
if (player.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
showUnavailable();
}
}, 2500);
player.dataset.failureTimeoutId = String(timeoutId);
const playPromise = player.play();
if (playPromise && typeof playPromise.catch === 'function') {
playPromise.catch((error) => {
if (!isCurrentLoadRequest()) {
return;
}
clearFailureTimeout();
if (error && error.name === 'NotAllowedError') {
player.classList.remove('video-loading');
player.controls = true;
setStatusOverlay('');
return;
}
setStatusOverlay(formatMessage);
if (note) {
note.textContent = formatMessage;
note.style.display = 'none';
}
});
}
}
function setupCampaignVideoSelection(modal) {
const videoSelect = modal.querySelector('#campaign-video-select');
if (!videoSelect) {
return;
}
videoSelect.addEventListener('change', () => {
const videoId = videoSelect.value;
if (videoId) {
selectCampaignVideo(modal, videoId);
}
});
}
function openModal(type) {
const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const modalBody = document.getElementById('modal-body');
const content = {
volunteer: `
<h2>Volunteer</h2>
<p>Thank you for your interest in volunteering for the Beller for Sheriff campaign!</p>
<p>Volunteers are the backbone of our campaign. Whether you can knock on doors, make phone calls, attend events, or help with social media, every contribution matters.</p>
<p>Email us at <a href="mailto:BellerforSheriff@gmail.com"><strong>BellerforSheriff@gmail.com</strong></a></p>
`,
donate: `
<h2>Support the Campaign</h2>
<p>Your donation helps us reach more voters and spread the message of leadership and integrity.</p>
<p>Every contribution, regardless of size, makes a difference in our campaign to bring positive change to our community.</p>
<div style="margin-top: 20px;">
<button onclick="window.open('https://secure.anedot.com/beller-for-sheriff/d48de606-13ac-4121-ab85-d313c6db8d66', '_blank');" class="btn btn-primary" style="width: 100%; margin-top: 15px;"><i class="fas fa-donate"></i> Donate Now</button>
</div>
<p style="font-size: 0.9rem; margin-top: 20px; color: #666;">Paid for by Beller for Sheriff Campaign. Contributions are not tax-deductible.</p>
`,
'executive-leadership-and-organizational-management': `
<h2 style='text-align: center;'>👮‍♂️</h2>
<p>His command responsibilities include staffing, budgets, policy compliance, case oversight, and inter-agency coordination. These units handle the most serious, high-risk, and high-liability cases in the region, requiring disciplined leadership, strict adherence to law and policy, and constant coordination with prosecutors, federal partners, and neighboring agencies.</p>
<p>Previously, Beller served as Administration Captain, where he directed the department's Planning, Training, and Research functions. In that role, he was the Department's Training Director, responsible for ensuring officers and supervisors met modern legal, ethical, and professional standards.</p>
<p>He also led the department's grant management and public safety technology initiatives, securing and implementing state and federal funding to modernize equipment, improve investigative capability, and strengthen accountability systems. These investments expanded the department's ability to prevent, detect, and solve crime while maintaining strong oversight and fiscal responsibility.</p>
`,
'regional-and-inter-agency-leadership': `
<h2 style='text-align: center;'>🔗</h2>
<p>James Beller was selected by the KRAIT Executive Committee, made up of Police Chiefs and Sheriffs from Kenosha and Racine Counties, to serve as Commander. In this role, he leads multi-agency investigative teams, coordinates complex critical-incident cases, and ensures every investigation is conducted objectively, professionally, and in full compliance with Wisconsin law.</p>
<p>Being selected by senior law enforcement executives across two counties reflects the trust placed in Beller's judgment, leadership, and ability to manage high-stakes investigations with transparency and professionalism.</p>
`,
'operational-command-experience': `
<h2 style='text-align: center;'>🎯</h2>
<p>This experience reinforced the importance of disciplined command, inter-agency cooperation, and clear lines of authority when communities face serious threats. It is the same leadership mindset he brings to every role he holds today.</p>
`,
'labor-community-and-board-leadership': `
<h2 style='text-align: center;'>🏛️</h2>
<p>Through those roles, he also led community initiatives, including expanding Shop with a Cop and initiated Back-to-School with a Cop, strengthening trust between law enforcement and local families.</p>
<p>Beyond policing, Beller serves as Secretary of the Southern Lakes Credit Union Board of Directors and on the Gateway Technical College Criminal Justice Advisory Committee, contributing to financial oversight, governance, and the training of future public safety professionals.</p>
`,
'request-sign': `
<h2>Request a sign</h2>
<p>Show your support for James Beller for Sheriff by requesting a campaign sign for your yard or business!</p>
<p>Please provide your name, address, and contact information so we can deliver a sign to you.</p>
<div style="margin-top: 20px;">
<button onclick="window.open('https://docs.google.com/forms/d/e/1FAIpQLSfB-Mlnw2draZ89nFQnLev0lhTs7c-TWzdnphZrkht280ZxWg/viewform', '_blank');" class="btn btn-primary" style="width: 100%; margin-top: 15px;"><i class="fas fa-sign"></i> Request Your Sign</button>
</div>
`,
'community-engagement-and-public-trust': `
<h2 style='text-align: center;'>🛡️</h2>
<p>That experience shaped his belief that public safety is built not only through enforcement, but through visibility, communication, and accountability.</p>
<p>As Sheriff, Beller will apply those same principles to the Kenosha County Sheriff's Office by ensuring professional conduct in the jail, respectful treatment of those who come through the court system, and strong partnerships with community organizations, municipalities, and service providers.
<p>Public trust in the Sheriff's Office is essential, and it is earned by how people are treated every day.</p>
`,
'employee-growth-and-professional-development': `
<h2 style='text-align: center;'>📚</h2>
<p>As Sheriff, James Beller will ensure all personnel receive high-quality, relevant training focused on judgment, accountability, and officer safety. He will establish consistent, department-wide training standards and ensure employees across all assignments have access to professional development opportunities. This includes creating clear pathways for jail personnel to pursue leadership roles through training, mentorship, and supervisory development.</p>
<p>James Beller's approach to employee development is grounded in experience. As a former Training Captain and graduate of the FBI National Academy, he has focused on organizational growth and strengthening training programs that improve performance across the entire department. As Sheriff, he will continue investing in people to build a professional, prepared, and trusted Sheriff's Office that serves the community with integrity.</p>
`
};
if (type === 'campaign-videos') {
modalBody.innerHTML = renderCampaignVideoModal();
} else {
modalBody.innerHTML = content[type] || '<p>Content not found</p>';
}
modalContent.classList.toggle('video-modal', type === 'campaign-videos');
if (type === 'campaign-videos') {
setupCampaignVideoSelection(modal);
const availableVideos = getVisibleCampaignVideos();
if (availableVideos.length > 0) {
selectCampaignVideo(modal, availableVideos[0].id);
}
}
modal.classList.add('show');
}
function closeModal() {
const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
modal.querySelectorAll('video').forEach((video) => {
video.pause();
video.currentTime = 0;
});
modalContent.classList.remove('video-modal');
modal.classList.remove('show');
}
window.onclick = function (event) {
const modal = document.getElementById('modal');
if (event.target == modal) {
closeModal();
}
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({
behavior: 'smooth',
block: 'start'
});
}
});
});
const observerOptions = {
threshold: 0.1,
rootMargin: '0px 0px -100px 0px'
};
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateY(0)';
}
});
}, observerOptions);
document.querySelectorAll('.platform-card, .involvement-card').forEach(card => {
card.style.opacity = '0';
card.style.transform = 'translateY(20px)';
card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
observer.observe(card);
});
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger.addEventListener('click', function () {
hamburger.classList.toggle('active');
navMenu.classList.toggle('active');
});
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
link.addEventListener('click', function () {
hamburger.classList.remove('active');
navMenu.classList.remove('active');
});
});
class ImageRotator {
constructor() {
this.currentIndex = 0;
this.images = document.querySelectorAll('.rotator-image');
this.dots = document.querySelectorAll('.rotator-dot');
this.prevBtn = document.querySelector('.rotator-prev');
this.nextBtn = document.querySelector('.rotator-next');
this.autoRotateInterval = null;
this.autoRotateDelay = 3000;
if (this.images.length === 0) return;
this.init();
}
init() {
this.applyScaling();
this.prevBtn.addEventListener('click', () => this.prev());
this.nextBtn.addEventListener('click', () => this.next());
this.dots.forEach((dot, index) => {
dot.addEventListener('click', () => this.goToSlide(index));
});
this.startAutoRotate();
const rotator = document.querySelector('.image-rotator');
rotator.addEventListener('mouseenter', () => this.stopAutoRotate());
rotator.addEventListener('mouseleave', () => this.startAutoRotate());
}
applyScaling() {
this.images.forEach(imageContainer => {
const img = imageContainer.querySelector('img');
if (img && img.hasAttribute('data-scale')) {
const scaleValue = img.getAttribute('data-scale');
img.style.objectFit = scaleValue;
}
});
}
showSlide(index) {
this.images.forEach(img => img.classList.remove('active'));
this.dots.forEach(dot => dot.classList.remove('active'));
this.images[index].classList.add('active');
this.dots[index].classList.add('active');
}
next() {
this.currentIndex = (this.currentIndex + 1) % this.images.length;
this.showSlide(this.currentIndex);
}
prev() {
this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
this.showSlide(this.currentIndex);
}
goToSlide(index) {
this.currentIndex = index;
this.showSlide(this.currentIndex);
this.resetAutoRotate();
}
startAutoRotate() {
this.stopAutoRotate();
this.autoRotateInterval = setInterval(() => this.next(), this.autoRotateDelay);
}
stopAutoRotate() {
if (this.autoRotateInterval) {
clearInterval(this.autoRotateInterval);
this.autoRotateInterval = null;
}
}
resetAutoRotate() {
this.stopAutoRotate();
this.startAutoRotate();
}
}
document.addEventListener('DOMContentLoaded', () => {
mountFacebookCtas();
setFacebookLinkTargets();
syncNavCtaButtonWidths();
new ImageRotator();
openModal('campaign-videos');
});
window.addEventListener('resize', setFacebookLinkTargets);
window.addEventListener('resize', syncNavCtaButtonWidths);
window.addEventListener('load', syncNavCtaButtonWidths);