// MacOS Dock Magnification Effect for Icon Group
document.addEventListener('DOMContentLoaded', function () {
  const dock = document.getElementById('mac-dock');
  const items = Array.from(dock.querySelectorAll('.icon-item'));
  const maxScale = 1.5; // 60px (from 40px)
  const midScale = 1.2; // 48px
  const minScale = 1;   // 40px

  // Helper: Find which icon is nearest to mouse
  dock.addEventListener('mousemove', function (e) {
    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;
    let closestIdx = 0;
    let minDist = Infinity;
    items.forEach((item, idx) => {
      const iconRect = item.getBoundingClientRect();
      const iconCenter = iconRect.left - dockRect.left + iconRect.width / 2;
      const dist = Math.abs(mouseX - iconCenter);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });

    // Apply scaling
    items.forEach((item, idx) => {
      if (idx === closestIdx) {
        item.style.transform = `scale(${maxScale})`;
      } else if (idx === closestIdx - 1 || idx === closestIdx + 1) {
        item.style.transform = `scale(${midScale})`;
      } else {
        item.style.transform = `scale(${minScale})`;
      }
    });
  });

  // Reset scaling when mouse leaves dock
  dock.addEventListener('mouseleave', function () {
    items.forEach(item => {
      item.style.transform = `scale(${minScale})`;
    });
  });
});