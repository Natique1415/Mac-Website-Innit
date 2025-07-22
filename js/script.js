function updateTime() {
  const now = new Date();
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById("currentTime").textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 60000);

// // Navigation functionality
// function initNavigation() {
//   const navBar = document.getElementById('navBar');

//   navBar.addEventListener('load', function () {
//     const svgDoc = navBar.contentDocument;

//     if (svgDoc) {
//       // Add click event listeners to navigation links
//       const links = [
//         { id: 'gmail-link', url: 'https://gmail.com' },
//         { id: 'github-link', url: 'https://github.com' },
//         { id: 'linkedin-link', url: 'https://linkedin.com' }
//       ];

//       links.forEach(link => {
//         const element = svgDoc.getElementById(link.id);
//         if (element) {
//           element.style.cursor = 'pointer';
//           element.addEventListener('click', function () {
//             window.open(link.url, '_blank');
//           });

//           // Add hover effect
//           element.addEventListener('mouseenter', function () {
//             element.style.opacity = '0.7';
//           });

//           element.addEventListener('mouseleave', function () {
//             element.style.opacity = '1';
//           });
//         }
//       });
//     }
//   });
// }

// // Initialize navigation when DOM is loaded
// document.addEventListener('DOMContentLoaded', initNavigation);