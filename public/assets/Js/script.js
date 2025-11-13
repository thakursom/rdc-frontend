// Select all sidebar links
// const links = document.querySelectorAll(".sidebar-links");

// // Function to set active link
// function setActiveLink() {
//   const currentPage = localStorage.getItem("activePage");

//   links.forEach(link => {
//     if (link.getAttribute("href") === currentPage) {
//       link.classList.add("active");
//     } else {
//       link.classList.remove("active");
//     }
//   });
// }

// // Set active link on page load
// setActiveLink();

// // Add click event to links
// links.forEach(link => {
//   link.addEventListener("click", function (e) {
//     // Store clicked page in localStorage
//     localStorage.setItem("activePage", this.getAttribute("href"));

//     // Remove 'active' class from all links
//     links.forEach(a => a.classList.remove("active"));

//     // Add 'active' class to clicked link
//     this.classList.add("active");

//     // Navigate to the link's href
//     window.location.href = this.getAttribute("href");

//     // Prevent default only if you want SPA behavior
//     e.preventDefault();
//   });
// });






// const links = document.querySelectorAll(".sidebar-item");

// links.forEach(link => {
//   link.addEventListener("click", function () {
//     links.forEach(a => a.classList.remove("active"));
//     this.classList.add("active");
//   });
// });


// ##### hamburger ########

const hamburg = document.querySelector(".hamburger");
const sidebar = document.querySelector("#left-sidebar");
const head  = document.querySelector(".header")
const rightbar  = document.querySelector("#right-sidebar")


hamburg.addEventListener("click", () => {
    sidebar.classList.toggle("active2")
    head.classList.toggle("headerWidth")
    rightbar.classList.toggle("rightbarWidth")
})


// ########### close btn ############

const closeBtn = document.querySelector(".rdc-close-btn");

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active2")
    // head.classList.toggle("headerWidth")
    // rightbar.classList.toggle("rightbarWidth")
})



































