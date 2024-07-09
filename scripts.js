function createDebounce (fn, delay) {
    let isDebouncing = false;
    let timer = 0;
    return function (...args) {
        if (!isDebouncing) {
            isDebouncing = true;
            timer = setTimeout(function() {
                fn(...args);
                isDebouncing = false;
            }, delay)
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
                isDebouncing = false;
            }, delay)
        }
    }
}

function addRepo(event) {
    document.querySelectorAll('.find-element').forEach(el => el.remove());
    document.querySelector('#input').value = '';
    document.querySelector('.repo-list').insertAdjacentHTML('afterbegin', `
    <li class="repo-list__element">
            <p class="repo-list__description">
                <span>Name: ${event.target.textContent}</span>
                <span>Owner: ${event.target.dataset.owner}</span>
                <span>stars: ${event.target.dataset.stars}</span>
            </p>
            <button type="button" class="delete-repo">
                <img src="./trash.png" alt="delete" class="trash">
            </button>
        </li>
    `);
    document.querySelectorAll('.trash').forEach(button => {
        button.addEventListener('click', function(event) {
            event.target.parentNode.parentNode.remove();
        })
    })
}

async function check (event) {
    if (!event.target.value) {
        document.querySelectorAll('.find-element').forEach(el => el.remove());
    } else {
        let result = await fetch(`https://api.github.com/search/repositories?q=${event.target.value}`);
        let resultJson = await result.json();
        let repos = resultJson.items.slice(0, 5);
        let search = document.querySelector('.search')
        repos.forEach(repo => {
            search.insertAdjacentHTML('beforeend',`
            <div data-stars="${repo.stargazers_count}" data-owner="${repo.owner.login}" class="find-element">${repo.name}</div>
            `)
        });
        let found = document.querySelectorAll('.find-element');
        found.forEach(foundElement => {
            foundElement.addEventListener('click', addRepo)
        });
    }
}

let checkDebounce = createDebounce(check, 500);

let input = document.getElementById('input');
input.addEventListener('keydown', checkDebounce);