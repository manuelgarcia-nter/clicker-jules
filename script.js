// Helper functions to manage browser cookies (document.cookie)
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || 0) + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Prevent right-click context menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Prevent developer tools keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Prevent F12
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault();
    return;
  }

  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  const isShiftOrAlt = e.shiftKey || e.altKey;

  // Prevent Ctrl+Shift+I / Cmd+Option+I, Ctrl+Shift+J / Cmd+Option+J,
  // Ctrl+Shift+C / Cmd+Option+C, Ctrl+Shift+K
  if (isCtrlOrCmd && isShiftOrAlt && (
    e.key === 'I' || e.key === 'i' ||
    e.key === 'J' || e.key === 'j' ||
    e.key === 'C' || e.key === 'c' ||
    e.key === 'K' || e.key === 'k'
  )) {
    e.preventDefault();
    return;
  }

  // Prevent Ctrl+U / Cmd+Option+U (View Source)
  if (isCtrlOrCmd && (e.key === 'U' || e.key === 'u')) {
    e.preventDefault();
    return;
  }
});

const ACHIEVEMENTS = [
  { threshold: 10, id: 'trophy-10', name: 'Beginner (10 Clicks)' },
  { threshold: 100, id: 'trophy-100', name: 'Enthusiast (100 Clicks)' },
  { threshold: 1000, id: 'trophy-1000', name: 'Master (1,000 Clicks)' }
];

let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function updateAchievements(currentClicks, showNotification = true) {
  ACHIEVEMENTS.forEach(ach => {
    const trophyElem = document.getElementById(ach.id);
    if (!trophyElem) return;

    if (currentClicks >= ach.threshold) {
      if (trophyElem.classList.contains('locked')) {
        trophyElem.classList.remove('locked');
        trophyElem.classList.add('unlocked');
        if (showNotification) {
          showToast(`🏆 Trophy Unlocked: ${ach.name}!`);
        }
      }
    } else {
      trophyElem.classList.remove('unlocked');
      trophyElem.classList.add('locked');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let count = parseInt(getCookie('cookieClicks'), 10) || 0;
  const countDisplay = document.getElementById('click-count');
  const cookieBtn = document.getElementById('cookie-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (countDisplay) {
    countDisplay.textContent = count;
  }

  // Initial achievement check without showing toast on page load
  updateAchievements(count, false);

  if (cookieBtn) {
    cookieBtn.addEventListener('click', (e) => {
      count++;
      countDisplay.textContent = count;
      setCookie('cookieClicks', count);

      // Check achievements after increment
      updateAchievements(count, true);

      // Create floating +1 animation
      const floatingText = document.createElement('div');
      floatingText.className = 'floating-number';
      floatingText.textContent = '+1';

      const rect = cookieBtn.getBoundingClientRect();
      const x = e.clientX ? (e.clientX - rect.left) : rect.width / 2;
      const y = e.clientY ? (e.clientY - rect.top) : rect.height / 2;

      floatingText.style.left = `${x}px`;
      floatingText.style.top = `${y}px`;

      cookieBtn.appendChild(floatingText);

      setTimeout(() => {
        floatingText.remove();
      }, 800);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      count = 0;
      countDisplay.textContent = count;
      setCookie('cookieClicks', count);

      // Reset achievement states
      updateAchievements(count, false);
    });
  }
});