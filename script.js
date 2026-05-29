// ============================================
// LOGIQUE PRINCIPALE DE L'APPLICATION
// ============================================

// Variable globale pour stocker les pays actuellement affichés
let filteredCountries = [...countriesData];

// ============================================
// ÉLÉMENTS DU DOM
// ============================================

const countriesGrid = document.getElementById('countriesGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const modal = document.getElementById('countryModal');
const closeBtn = document.querySelector('.close');
const modalBody = document.getElementById('modalBody');

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    renderCountries();
    setupEventListeners();
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Recherche en temps réel
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterCountries(searchTerm);
    });

    // Filtres
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    // Tri
    sortSelect.addEventListener('change', function(e) {
        sortCountries(e.target.value);
        renderCountries();
    });

    // Modal
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// ============================================
// RECHERCHE
// ============================================

function filterCountries(searchTerm) {
    if (searchTerm === '') {
        filteredCountries = [...countriesData];
    } else {
        filteredCountries = countriesData.filter(country => 
            country.name.toLowerCase().includes(searchTerm) ||
            country.continent.toLowerCase().includes(searchTerm) ||
            country.cities.some(city => city.toLowerCase().includes(searchTerm)) ||
            country.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    renderCountries();
}

// ============================================
// FILTRES
// ============================================

function applyFilter(filter) {
    searchInput.value = ''; // Réinitialiser la recherche

    if (filter === 'all') {
        filteredCountries = [...countriesData];
    } else if (filter === 'no-visa') {
        filteredCountries = countriesData.filter(c => c.visaStatus === 'no-visa');
    } else if (filter === 'low-budget') {
        filteredCountries = countriesData.filter(c => c.budget <= 500);
    } else if (filter === 'beach') {
        filteredCountries = countriesData.filter(c => c.tags.includes('beach'));
    } else if (filter === 'culture') {
        filteredCountries = countriesData.filter(c => c.tags.includes('culture'));
    }

    renderCountries();
}

// ============================================
// TRI
// ============================================

function sortCountries(sortBy) {
    if (sortBy === 'name') {
        filteredCountries.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'visa') {
        filteredCountries.sort((a, b) => {
            if (a.visaStatus === 'no-visa' && b.visaStatus === 'with-visa') return -1;
            if (a.visaStatus === 'with-visa' && b.visaStatus === 'no-visa') return 1;
            return 0;
        });
    } else if (sortBy === 'budget') {
        filteredCountries.sort((a, b) => a.budget - b.budget);
    }
}

// ============================================
// AFFICHAGE DES CARTES
// ============================================

function renderCountries() {
    countriesGrid.innerHTML = '';

    if (filteredCountries.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    filteredCountries.forEach(country => {
        const card = createCountryCard(country);
        countriesGrid.appendChild(card);
    });
}

function createCountryCard(country) {
    const card = document.createElement('div');
    card.className = 'country-card';
    card.innerHTML = `
        <div class="country-image">${country.emoji}</div>
        <div class="country-card-body">
            <div class="country-name">${country.name}</div>
            
            <div class="visa-badge ${country.visaStatus}">
                ${country.visaText}
            </div>

            <div class="country-quick-info">
                <div class="info-item">
                    <span>💰</span>
                    <span>Budget: ${country.budget}€/jour</span>
                </div>
                <div class="info-item">
                    <span>🗓️</span>
                    <span>Meilleure période: ${country.bestPeriod}</span>
                </div>
                <div class="info-item">
                    <span>🌎</span>
                    <span>Continent: ${country.continent}</span>
                </div>
            </div>

            <div class="country-description">
                ${country.description}
            </div>

            <button class="view-more-btn" onclick="openModal(${country.id})">
                Voir les détails →
            </button>
        </div>
    `;

    return card;
}

// ============================================
// MODAL - DÉTAILS DU PAYS
// ============================================

function openModal(countryId) {
    const country = countriesData.find(c => c.id === countryId);
    if (!country) return;

    // Générer le contenu du modal
    modalBody.innerHTML = `
        <div class="modal-header">
            ${country.emoji} ${country.name}
        </div>

        <!-- Visa Info -->
        <div class="modal-section">
            <h3>✈️ Informations de Voyage</h3>
            <div class="modal-info-grid">
                <div class="modal-info-box">
                    <strong>Visa</strong>
                    <span>${country.visaText}</span>
                </div>
                <div class="modal-info-box">
                    <strong>Budget/jour</strong>
                    <span>${country.budget}€</span>
                </div>
                <div class="modal-info-box">
                    <strong>Continent</strong>
                    <span>${country.continent}</span>
                </div>
                <div class="modal-info-box">
                    <strong>Meilleure période</strong>
                    <span>${country.bestPeriod}</span>
                </div>
            </div>
        </div>

        <!-- Transport -->
        <div class="modal-section">
            <h3>🚗 Transport</h3>
            <p>${country.transport}</p>
        </div>

        <!-- Sécurité -->
        <div class="modal-section">
            <h3>🛡️ Sécurité</h3>
            <p>${country.security}</p>
        </div>

        <!-- Villes à visiter -->
        <div class="modal-section">
            <h3>🏙️ Villes à Visiter</h3>
            <ul>
                ${country.cities.map(city => `<li>${city}</li>`).join('')}
            </ul>
        </div>

        <!-- Monuments -->
        <div class="modal-section">
            <h3>🏛️ Monuments et Lieux Emblématiques</h3>
            <ul>
                ${country.monuments.map(monument => `<li>${monument}</li>`).join('')}
            </ul>
        </div>

        <!-- Gastronomie -->
        <div class="modal-section">
            <h3>🍽️ Plats Locaux à Goûter</h3>
            <div class="dish-list">
                ${country.dishes.map(dish => `<div class="dish-item">${dish}</div>`).join('')}
            </div>
        </div>

        <!-- Activités -->
        <div class="modal-section">
            <h3>🎯 Idées d'Activités & Expériences</h3>
            <div class="activity-list">
                ${country.activities.map(activity => `<div class="activity-item">${activity}</div>`).join('')}
            </div>
        </div>

        <!-- Conseil pratique -->
        <div class="modal-section" style="background: #FFF3CD; padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-color);">
            <h3 style="margin-top: 0;">💡 Conseil Pratique</h3>
            <p>Consultez les dernières recommandations du gouvernement tunisien avant de voyager. Assurez-vous que votre passeport est valide pour au moins 6 mois après votre voyage.</p>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fermer modal sur Esc
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});