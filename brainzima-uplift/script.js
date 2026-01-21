document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar ---
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('menuButton');

    window.showsidebar = function () {
        if (sidebar) {
            sidebar.classList.add('active');
        }
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', 'true');
        }
    }
    window.hidesidebar = function () {
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', 'false');
        }
    }
    // --- NEW: Module Toggle Functionality ---
    const moduleToggleButtons = document.querySelectorAll('.module-toggle-button');
    moduleToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contentId = button.getAttribute('aria-controls'); 
            const contentElement = document.getElementById(contentId); 
            if (contentElement) {
                // Check if the content is currently expanded
                const isExpanded = contentElement.classList.contains('active');
                // Toggle the 'active' class on the content element
                contentElement.classList.toggle('active');
                // Update the button's state and text based on the new state
                if (!isExpanded) {
                    button.setAttribute('aria-expanded', 'true');
                    button.textContent = '−';
                } else {       
                    button.setAttribute('aria-expanded', 'false');
                    button.textContent = '+'; 
                }
            } else {
                console.error(`Content element with ID "${contentId}" not found.`); 
            }
        });

        // Optional: Make the entire header clickable to toggle too
        const header = button.closest('.module-header');
        if (header) {
            header.style.cursor = 'pointer'; 
            header.addEventListener('click', (event) => {
                if (event.target !== button) {
                    button.click(); 
                }
            });
        }
    });
});