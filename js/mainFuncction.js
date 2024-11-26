document.addEventListener('DOMContentLoaded', () => {
    // Function to toggle the navbar for mobile view
    const navbarToggle = document.querySelector('[data-collapse-toggle="navbar"]');
    const navbarMenu = document.getElementById('navbar');
  
    navbarToggle.addEventListener('click', () => {
      const isExpanded = navbarMenu.classList.contains('hidden');
      if (isExpanded) {
        navbarMenu.classList.remove('hidden', 'opacity-0', 'scale-95');
        navbarMenu.classList.add('opacity-100', 'scale-100');
      } else {
        navbarMenu.classList.add('hidden', 'opacity-0', 'scale-95');
        navbarMenu.classList.remove('opacity-100', 'scale-100');
      }
    });
  
    // Dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
    dropdownToggles.forEach(toggle => {
      const targetId = toggle.getAttribute('data-target');
      const dropdownMenu = document.getElementById(targetId);
  
      let hoverTimeout;
  
      // Show dropdown with animation
      const showDropdown = () => {
        clearTimeout(hoverTimeout); // Cancel any pending close
        dropdownMenu.classList.remove('hidden', 'opacity-0', 'scale-95');
        dropdownMenu.classList.add('opacity-100', 'scale-100');
      };
  
      // Hide dropdown with animation
      const hideDropdown = () => {
        hoverTimeout = setTimeout(() => {
          dropdownMenu.classList.add('hidden', 'opacity-0', 'scale-95');
          dropdownMenu.classList.remove('opacity-100', 'scale-100');
        }, 200); // Delay for smooth hover transitions
      };
  
      // Hover and click events
      toggle.addEventListener('mouseenter', showDropdown);
      toggle.addEventListener('mouseleave', hideDropdown);
      dropdownMenu.addEventListener('mouseenter', showDropdown);
      dropdownMenu.addEventListener('mouseleave', hideDropdown);
  
      toggle.addEventListener('click', (event) => {
        const isVisible = !dropdownMenu.classList.contains('hidden');
        if (isVisible) {
          hideDropdown();
        } else {
          showDropdown();
        }
        event.stopPropagation();
      });
    });
  
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden', 'opacity-0', 'scale-95');
        menu.classList.remove('opacity-100', 'scale-100');
      });
    });
  });
  
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: true,
    centeredSlides: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
});