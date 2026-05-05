document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const resumeInput = document.getElementById('resumeInput');
    const fileNameDisplay = document.getElementById('fileName');
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    const resultSection = document.getElementById('resultSection');
    
    // Result elements
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreText = document.getElementById('scoreText');
    const skillsList = document.getElementById('skillsList');
    const experienceLevel = document.getElementById('experienceLevel');
    const suggestionsList = document.getElementById('suggestionsList');

    // Update filename when file is selected
    resumeInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
            fileNameDisplay.style.color = 'var(--primary)';
        } else {
            fileNameDisplay.textContent = 'Select PDF Resume';
            fileNameDisplay.style.color = 'var(--text-muted)';
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = resumeInput.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a valid PDF file.');
            return;
        }

        // Show loader, hide results
        loader.classList.remove('hidden');
        resultSection.classList.add('hidden');
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://resume-analyzer-221293707187.us-central1.run.app/analyze-resume', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Analysis failed');
            }

            const data = await response.json();
            displayResults(data);
            
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    function displayResults(data) {
        // Show result section
        resultSection.classList.remove('hidden');

        // Animate Score
        animateScore(data.score);

        // Populate Skills
        skillsList.innerHTML = '';
        data.skills.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = skill;
            skillsList.appendChild(span);
        });

        // Populate Experience
        experienceLevel.textContent = data.experience;

        // Populate Suggestions
        suggestionsList.innerHTML = '';
        data.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
        });
        
        // Scroll to results
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function animateScore(targetScore) {
        let currentScore = 0;
        
        // Color logic based on score
        let strokeColor = 'var(--danger)'; // red
        if (targetScore >= 75) {
            strokeColor = 'var(--success)'; // green
        } else if (targetScore >= 50) {
            strokeColor = 'var(--warning)'; // yellow
        }
        
        scoreCircle.style.stroke = strokeColor;

        if (targetScore === 0) {
            scoreText.textContent = 0;
            scoreCircle.setAttribute('stroke-dasharray', `0, 100`);
            return;
        }

        const interval = setInterval(() => {
            if (currentScore >= targetScore) {
                clearInterval(interval);
                return;
            }
            currentScore++;
            scoreText.textContent = currentScore;
            scoreCircle.setAttribute('stroke-dasharray', `${currentScore}, 100`);
        }, 20); // Speed of animation
    }
});
