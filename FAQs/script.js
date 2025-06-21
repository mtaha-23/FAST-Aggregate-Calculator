document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faq-container');
    const categoryNav = document.getElementById('category-nav');
    const themeToggleButton = document.getElementById('theme-toggle');
    const searchBar = document.getElementById('search-bar');
    const toTopBtn = document.getElementById('to-top-btn');
    const body = document.body;

    // Load and display FAQs
    Promise.all([
        fetch('official_faqs.json').then(response => response.json()),
        fetch('student_faqs.json').then(response => response.json())
    ])
    .then(([officialFaqs, studentFaqs]) => {
        const data = [...officialFaqs, ...studentFaqs];
        const faqsByCategory = data.reduce((acc, faq) => {
            const { category } = faq;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(faq);
            return acc;
        }, {});

        for (const category in faqsByCategory) {
            const categoryId = 'category-' + category.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
            const navLink = document.createElement('a');
            navLink.href = `#${categoryId}`;
            navLink.textContent = category;
            navLink.classList.add('category-nav-link');
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
            });
            categoryNav.appendChild(navLink);
        }

        for (const category in faqsByCategory) {
            const categoryId = 'category-' + category.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('faq-category');
            categoryContainer.id = categoryId;
            
            const categoryTitle = document.createElement('h2');
            categoryTitle.classList.add('category-title');
            categoryTitle.textContent = category;
            categoryContainer.appendChild(categoryTitle);

            faqsByCategory[category].forEach(faq => {
                const faqItem = document.createElement('div');
                faqItem.classList.add('faq-item');
                faqItem.dataset.question = faq.question.toLowerCase();
                faqItem.dataset.answer = faq.answer.toLowerCase();
                faqItem.dataset.category = faq.category.toLowerCase();

                const answerText = faq.answer
                    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
                    .replace(/\n/g, '<br>');

                faqItem.innerHTML = `
                    <div class="faq-question">${faq.question}</div>
                    <div class="faq-answer">${answerText}</div>
                `;

                categoryContainer.appendChild(faqItem);

                const question = faqItem.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    const wasActive = faqItem.classList.contains('active');
                    
                    document.querySelectorAll('.faq-item.active').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    if (!wasActive) {
                        faqItem.classList.add('active');
                    }
                });
            });
            faqContainer.appendChild(categoryContainer);
        }
    })
    .catch(error => console.error('Error fetching FAQs:', error));
    
    // Search functionality
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allFaqItems = document.querySelectorAll('.faq-item');
        const allCategoryTitles = document.querySelectorAll('.category-title');

        let visibleCategories = new Set();

        allFaqItems.forEach(item => {
            const questionText = item.dataset.question;
            const answerText = item.dataset.answer;
            const categoryText = item.dataset.category;
            
            const isVisible = questionText.includes(searchTerm) || answerText.includes(searchTerm);
            item.style.display = isVisible ? 'block' : 'none';

            if (isVisible) {
                visibleCategories.add(categoryText);
            }
        });

        allCategoryTitles.forEach(title => {
            const category = title.textContent.toLowerCase();
            const isVisible = visibleCategories.has(category);
            title.style.display = isVisible ? 'block' : 'none';
        });
    });
    
    // Theme switcher
    themeToggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        // Optional: Save theme preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark-mode');
        } else {
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    } else {
        body.classList.add('light-mode'); // Default theme
    }

    // "Go to top" button logic
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            toTopBtn.classList.add('visible');
        } else {
            toTopBtn.classList.remove('visible');
        }
    });

    toTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 