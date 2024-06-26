document.addEventListener('DOMContentLoaded', function() {
    const clickerButton = document.getElementById('center-button');
    const finishButton = document.getElementById('finish');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let cur_width = 100;

    bounceEmojis()
    finishButton.style.visibility = null
    finishButton.disabled = true

    clickerButton.addEventListener('click', function() {
        finishButton.disabled = false
        score++;
        scoreDisplay.textContent = score;
        bounceEmojis()
        scoreDisplay.style.color = `hsl(${getRandomInt(0, 256)} 120% 70%)`
        if (score.toString().length > (score - 1).toString().length) {
            cur_width += 56;
            scoreDisplay.style.width = `${cur_width}px`
        }
    });

    finishButton.addEventListener('click', function() {
        const username = prompt('Enter your username:');
        if (username) {
            // Set the username and score in the form
            document.getElementById('username').value = username;
            document.getElementById('score-input').value = score;

            // Get the CSRF token from the cookie
            const csrftoken = getCookie('csrftoken');

            // Send AJAX request with CSRF token
            fetch('/save-score/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    username: username,
                    score: score
                })
            })
            .then(response => {
                if (response.ok) {
                    // Handle successful response
                    console.log('Score saved successfully!');
                } else {
                    // Handle error response
                    console.error('Failed to save score:', response.statusText);
                }
            })
            .catch(error => {
                // Handle fetch error
                console.error('Error:', error);
            });
        }
    });

    // Function to get CSRF token from cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
