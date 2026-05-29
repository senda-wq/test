// Country to Google Domain mapping
const countryToDomain = {
    'US': 'google.com',
    'UK': 'google.co.uk',
    'FR': 'google.fr',
    'TN': 'google.tn',
    'DZ': 'google.dz',
    'MA': 'google.co.ma',
    'CA': 'google.ca',
    'DE': 'google.de',
    'ES': 'google.es',
    'IT': 'google.it',
    'BR': 'google.com.br',
    'MX': 'google.com.mx',
    'IN': 'google.co.in',
    'JP': 'google.co.jp',
    'AU': 'google.com.au'
};

// Simulated SEO data (in production, this would come from APIs)
function generateSimulatedData(keyword, country) {
    // Generate pseudo-random but consistent data based on keyword
    const keywordHash = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return {
        keyword: keyword,
        searchVolume: Math.floor((keywordHash * 127) % 50000 + 100),
        resultsCount: Math.floor((keywordHash * 1234567) % 1000000000 + 1000000),
        averagePosition: Math.floor((keywordHash * 3) % 100 + 1),
        competitionLevel: (keywordHash % 3 === 0) ? 'High' : (keywordHash % 3 === 1) ? 'Medium' : 'Low',
        trend: (keywordHash % 2 === 0) ? '📈 Increasing' : '📉 Decreasing'
    };
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update Google Domain when country changes
document.getElementById('country').addEventListener('change', function() {
    const selectedCountry = this.value;
    const domain = countryToDomain[selectedCountry] || '';
    document.getElementById('googleDomain').value = domain;
});

// Form submission handler
document.getElementById('seoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const keywordsInput = document.getElementById('keywords').value;
    const country = document.getElementById('country').value;
    const googleDomain = document.getElementById('googleDomain').value;
    const websiteUrl = document.getElementById('websiteUrl').value;
    
    // Parse and validate keywords
    const keywords = keywordsInput
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
    
    if (keywords.length !== 5) {
        alert('❌ Please enter exactly 5 keywords separated by commas.');
        return;
    }
    
    if (!country) {
        alert('❌ Please select a country.');
        return;
    }
    
    if (!websiteUrl) {
        alert('❌ Please enter a website URL.');
        return;
    }
    
    // Generate and display results
    displayResults(keywords, country, googleDomain, websiteUrl);
});

function displayResults(keywords, country, googleDomain, websiteUrl) {
    const resultsDiv = document.getElementById('results');
    let resultHTML = `
        <div class="analysis-info">
            <p><strong>Country:</strong> ${country} | <strong>Google Domain:</strong> ${googleDomain}</p>
            <p><strong>Website:</strong> <a href="${websiteUrl}" target="_blank">${websiteUrl}</a></p>
            <hr style="margin: 15px 0;">
        </div>
    `;
    
    keywords.forEach((keyword, index) => {
        const data = generateSimulatedData(keyword, country);
        resultHTML += `
            <div class="keyword-result">
                <h3>🔑 Keyword ${index + 1}: "${data.keyword}"</h3>
                <div class="metric">
                    <span class="metric-label">📊 Average Search Volume:</span>
                    <span class="metric-value">${formatNumber(data.searchVolume)} searches/month</span>
                </div>
                <div class="metric">
                    <span class="metric-label">🔍 Google Results:</span>
                    <span class="metric-value">${formatNumber(data.resultsCount)} results</span>
                </div>
                <div class="metric">
                    <span class="metric-label">🏆 Average Position on Google:</span>
                    <span class="metric-value">#${data.averagePosition}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">⚔️ Competition Level:</span>
                    <span class="metric-value">${data.competitionLevel}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">📈 Trend:</span>
                    <span class="metric-value">${data.trend}</span>
                </div>
            </div>
        `;
    });
    
    resultHTML += `
        <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #2196F3;">
            <strong>💡 Note:</strong> This data is simulated for demonstration. To get real data, integrate with Google Search Console API, SERPStack, or similar SEO data providers.
        </div>
    `;
    
    document.getElementById('resultContent').innerHTML = resultHTML;
    resultsDiv.style.display = 'block';
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}
