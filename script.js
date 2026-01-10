// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Modal functionality
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    const content = {
        volunteer: `
            <h2>Volunteer</h2>
            <p>Thank you for your interest in volunteering for the Beller for Sheriff campaign!</p>
            <p>Volunteers are the backbone of our campaign. Whether you can knock on doors, make phone calls, attend events, or help with social media, every contribution matters.</p>
            <p>Email us at <strong>BellerforSheriff@gmail.com</strong></p>
        `,
        donate: `
            <h2>Support the Campaign</h2>
            <p>Your donation helps us reach more voters and spread the message of leadership and integrity.</p>
            <p>Every contribution, regardless of size, makes a difference in our campaign to bring positive change to our community.</p>
            <div style="margin-top: 20px;">
                <button onclick="window.open('https://www.paypal.com', '_blank');" class="btn btn-primary" style="width: 100%; margin-top: 15px;"><i class="fab fa-paypal"></i> Donate Now</button>
            </div>
            <p style="font-size: 0.9rem; margin-top: 20px; color: #666;">Paid for by Beller for Sheriff Campaign. Contributions are not tax-deductible.</p>
        `
    };
    
    modalBody.innerHTML = content[type] || '<p>Content not found</p>';
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function selectAmount(amount) {
    alert(`Selected: $${amount}`);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Form submission
function handleFormSubmit(event) {
    event.preventDefault();
}

// Smooth scrolling for navigation links
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

// Add scroll animation for elements coming into view
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

// Observe platform cards and involvement cards
document.querySelectorAll('.platform-card, .involvement-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});
