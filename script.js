
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal functionality
function openModal(type) {
    const modal = document.getElementById('modal');
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
                <button onclick="window.open('https://www.paypal.com', '_blank');" class="btn btn-primary" style="width: 100%; margin-top: 15px;"><i class="fab fa-paypal"></i> Donate Now</button>
            </div>
            <p style="font-size: 0.9rem; margin-top: 20px; color: #666;">Paid for by Beller for Sheriff Campaign. Contributions are not tax-deductible.</p>
        `,
        'executive-leadership-and-organizational-management': `
            <h2 style='text-align: center;'>👮‍♂️</h2>
            <p>His command responsibilities include staffing, budgets, policy compliance, case oversight, and inter-agency coordination. These units handle the most serious, high-risk, and high-liability cases in the region, requiring disciplined leadership, strict adherence to law and policy, and constant coordination with prosecutors, federal partners, and neighboring agencies.</p>
            <p>Previously, Beller served as Administration Captain, where he directed the department’s Planning, Training, and Research functions. In that role, he was the Department’s Training Director, responsible for ensuring officers and supervisors met modern legal, ethical, and professional standards.</p>
            <p>He also led the department's grant management and public safety technology initiatives, securing and implementing state and federal funding to modernize equipment, improve investigative capability, and strengthen accountability systems. These investments expanded the department’s ability to prevent, detect, and solve crime while maintaining strong oversight and fiscal responsibility.</p>
        `,
        'regional-and-inter-agency-leadership': `
            <h2 style='text-align: center;'>🔗</h2>
            <p>James Beller was selected by the KRAIT Executive Committee, made up of Police Chiefs and Sheriffs from Kenosha and Racine Counties, to serve as Commander. In this role, he leads multi-agency investigative teams, coordinates complex critical-incident cases, and ensures every investigation is conducted objectively, professionally, and in full compliance with Wisconsin law.</p>
            <p>Being selected by senior law enforcement executives across two counties reflects the trust placed in Beller’s judgment, leadership, and ability to manage high-stakes investigations with transparency and professionalism.</p>
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
            <p>Email us at <a href="mailto:BellerforSheriff@gmail.com"><strong>BellerforSheriff@gmail.com</strong></a></p>
        `,
        'community-engagement-and-public-trust': `
            <h2 style='text-align: center;'>🛡️</h2>
            <p>That experience shaped his belief that public safety is built not only through enforcement, but through visibility, communication, and accountability.</p>
            <p>As Sheriff, Beller will apply those same principles to the Kenosha County Sheriff's Office by ensuring professional conduct in the jail, respectful treatment of those who come through the court system, and strong partnerships with community organizations, municipalities, and service providers.
            <p>Public trust in the Sheriff's Office is essential, and it is earned by how people are treated every day.</p>
        `
    };

    modalBody.innerHTML = content[type] || '<p>Content not found</p>';
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
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

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});