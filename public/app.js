'use strict';
const config = window.SITE_CONFIG;
if (config) {
  document.querySelectorAll('[data-booking]').forEach(a => { a.href = config.booking.url; });
  document.querySelectorAll('[data-contact]').forEach(a => { a.href = config.contact.url; });
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const dialog = document.querySelector('#lightbox');
if (dialog && typeof dialog.showModal === 'function') {
  let trigger;
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    trigger = button;
    dialog.querySelector('img').src = button.dataset.photo;
    dialog.querySelector('img').alt = button.querySelector('img').alt;
    dialog.querySelector('p').textContent = button.dataset.caption;
    dialog.showModal();
  }));
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => trigger?.focus());
} else {
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => { window.location.href = button.dataset.photo; }));
}