document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.grid');
    const result = document.getElementById('result');
    const progressBar = document.getElementById('progress-bar').firstElementChild;
    const linkBtn = document.getElementById('link-btn');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const retryBtn = document.getElementById('retry-btn');
    const soundBtn = document.getElementById('sound-btn');
    const backgroundMusic = document.getElementById('background-music');
    const attemptsElement = document.getElementById('attempts');

    let diamonds = 20;
    let bombs = 5;
    let foundDiamonds = 0;
    let gameOver = false;
    let musicPlaying = false;
    let attempts = localStorage.getItem('attempts') ? parseInt(localStorage.getItem('attempts')) : 5;

    attemptsElement.textContent = attempts;

    soundBtn.addEventListener('click', function() {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicPlaying = false;
            soundBtn.textContent = '🔇';
        } else {
            backgroundMusic.play();
            musicPlaying = true;
            soundBtn.textContent = '🔊';
        }
    });

    function createGrid() {
        for (let i = 0; i < 25; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('id', i);

            square.addEventListener('click', function() {
                if (!square.classList.contains('checked') && !gameOver) {
                    if (square.classList.contains('bomb')) {
                        square.style.backgroundImage = 'url("img/bomba.png")';
                        square.style.backgroundColor = 'red';
                        result.textContent = '¡Perdiste! Intenta de nuevo.';
                        attempts = Math.max(attempts - 1, 0);  // Ensure attempts don't go negative
                        attemptsElement.textContent = attempts;
                        localStorage.setItem('attempts', attempts);
                        if (attempts === 0) {
                            showNotification('Se han agotado los intentos. Refresca la página para reiniciar.');
                            gameOver = true;
                        } else {
                            gameOver = true;
                            showNotification('Game Over');
                            revealBoard();
                            playExplosionSound();
                        }
                    } else {
                        square.style.backgroundColor = 'lightgrey';
                        if (square.classList.contains('diamond')) {
                            square.style.backgroundImage = 'url("img/diamante.png")';
                            foundDiamonds++;
                            progressBar.style.width = (foundDiamonds * 5) + '%';
                            if (foundDiamonds === diamonds) {
                                result.textContent = '¡Ganaste!';
                                gameOver = true;
                                showNotification('¡Felicidades, has ganado!');
                                linkBtn.style.display = 'block';
                            }
                        }
                        square.classList.add('checked');
                    }
                }
            });

            grid.appendChild(square);
        }

        addDiamonds();
        addBombs();
    }

    function addDiamonds() {
        let diamondCount = 0;
        while (diamondCount < diamonds) {
            const randomIndex = Math.floor(Math.random() * 25);
            const square = document.getElementById(randomIndex);
            if (!square.classList.contains('bomb') && !square.classList.contains('diamond')) {
                square.classList.add('diamond');
                diamondCount++;
            }
        }
    }

    function addBombs() {
        let bombCount = 0;
        while (bombCount < bombs) {
            const randomIndex = Math.floor(Math.random() * 25);
            const square = document.getElementById(randomIndex);
            if (!square.classList.contains('bomb') && !square.classList.contains('diamond')) {
                square.classList.add('bomb');
                bombCount++;
            }
        }
    }

    function revealBoard() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.style.backgroundImage = 'url("img/bomba.png")';
                square.style.backgroundColor = 'red';
            } else if (square.classList.contains('diamond')) {
                square.style.backgroundImage = 'url("img/diamante.png")';
            }
            square.classList.add('checked');
        });
    }

    function showNotification(message) {
        notificationText.textContent = message;
        notification.style.display = 'block';
    }

    function playExplosionSound() {
        const explosionSound = new Audio('sounds/explosión.mp3');
        explosionSound.play();
    }

    retryBtn.addEventListener('click', function() {
        if (attempts === 0) {
            localStorage.removeItem('attempts');
            location.reload();  // Refresh the entire page
        } else {
            notification.style.display = 'none';
            grid.innerHTML = '';
            result.textContent = '';
            progressBar.style.width = '0%';
            linkBtn.style.display = 'none';
            gameOver = false;
            foundDiamonds = 0;
            createGrid();
        }
    });

    createGrid();
});