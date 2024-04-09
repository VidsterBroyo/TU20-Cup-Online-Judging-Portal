const emojis = [
    '💻', '🏀', '🍳', '🗣️', '📚',
    '🥾', '📸', '✈️', '🎵', '🍿',
    '🎨', '🔭', '🧘', '💃', '🌱',
    '🎮', '🌍', '🚴', '📖', '🎨',
    '🐶', '🍕', '🎳', '🚗', '📷'
];

const cellPrompts = [
    'Try to find someone in the room who likes coding.',
    'Try to find someone in the room who enjoys playing basketball.',
    'Try to find someone in the room who knows how to cook.',
    'Try to find someone in the room who can speak more than two languages.',
    'Try to find someone in the room who has read a book in the last week.',
    'Try to find someone in the room who likes hiking.',
    'Try to find someone in the room who enjoys photography.',
    'Try to find someone in the room who has traveled to more than three countries.',
    'Try to find someone in the room who plays a musical instrument.',
    'Try to find someone in the room who loves watching movies.',
    'Try to find someone in the room who likes to draw or paint.',
    'Try to find someone in the room who is interested in astronomy.',
    'Try to find someone in the room who practices yoga.',
    'Try to find someone in the room who likes to dance.',
    'Try to find someone in the room who enjoys gardening.',
    'Try to find someone in the room who likes to play video games.',
    'Try to find someone in the room who has traveled to different continents.',
    'Try to find someone in the room who enjoys cycling.',
    'Try to find someone in the room who likes to read poetry.',
    'Try to find someone in the room who enjoys painting.',
    'Try to find someone in the room who has a pet.',
    'Try to find someone in the room who enjoys eating pizza.',
    'Try to find someone in the room who likes bowling.',
    'Try to find someone in the room who enjoys driving.',
    'Try to find someone in the room who likes photography.',
];

function createBingoBoard() {
    const board = document.getElementById('bingo-board');
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('bg-gray-300', 'p-4', 'text-4xl', 'text-center', 'rounded', 'cursor-pointer');
        const emoji = emojis[i];
        cell.dataset.initialEmoji = emoji;
        // cell.textContent = emoji;

        var para = document.createElement("p");
        var node = document.createTextNode(emoji);
        para.appendChild(node);

        cell.appendChild(para);

        cell.dataset.prompt = cellPrompts[i];
        const val = localStorage.getItem(`cell-${i}`);
        if(val != null) {
            cell.dataset.playerName = val;
            if(val.trim() != '') {
                cell.classList.add('bg-green-500', 'text-white');
            }
        } else {
            cell.dataset.playerName = '';
        }
        cell.addEventListener('click', () => showModal(cell, i));
        board.appendChild(cell);
    }
}

// Function to show modal when cell is clicked
function showModal(cell, id) {
    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');

    const playerNameInput = document.getElementById('playerNameInput');
    playerNameInput.value = cell.dataset.playerName; 

    const promptDisplay = document.getElementById('promptDisplay');
    promptDisplay.textContent = cell.dataset.prompt;

    const submitButton = document.getElementById('submitButton');
    submitButton.onclick = function () {
        const playerName = playerNameInput.value;
        localStorage.setItem(`cell-${id}`, playerName);
        if (playerName.trim() !== '') {
            cell.dataset.playerName = playerName;
            if (!cell.classList.contains('bg-green-500')) {
                cell.textContent = cell.dataset.initialEmoji;
            }
            cell.classList.add('bg-green-500', 'text-white');
            cell.removeEventListener('click', showModal);
            modal.classList.add('hidden');
        } else {
            cell.dataset.playerName = playerName; 
            cell.textContent = cell.dataset.initialEmoji;
            cell.classList.remove('bg-green-500', 'text-white');
            cell.addEventListener('click', () => showModal(cell));
            modal.classList.add('hidden');
        }
        playerNameInput.value = '';
    };

    document.addEventListener('click', function closeModalOutside(e) {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.removeEventListener('click', closeModalOutside);
        }
    });
}
