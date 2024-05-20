const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

let animeList = [];

// Загрузка JSON файла с аниме
async function loadAnimeList() {
  const res = await fetch('animeG.json');  
  const data = await res.json();
  animeList = data.anime_list;
}

// Поиск аниме по жанру
function searchGenre(e) {
  e.preventDefault();

  // Очистка информации о конкретном аниме
  single_mealEl.innerHTML = '';

  // Получение поискового запроса
  const term = search.value.toLowerCase();

  // Проверка на пустой запрос
  if (term.trim()) {
    const results = animeList.filter(anime =>
      anime.genres.some(genre => genre.toLowerCase().includes(term))
    );

    resultHeading.innerHTML = `<h2>Результаты поиска для жанра '${term}':</h2>`;

    if (results.length === 0) {
      resultHeading.innerHTML = `<p>Результатов нет. Попробуйте еще раз!</p>`;
    } else {
      mealsEl.innerHTML = results
        .map(
          anime => `
            <div class="anime">
              <img src="${anime.image_url}" alt="${anime.title}" />
              <div class="anime-info" data-title="${anime.title}">
                <h3>${anime.title}</h3>
                <p>${anime.genres.join(', ')}</p>
              </div>
            </div>
          `
        )
        .join('');
    }

    // Очистка текстового поля поиска
    search.value = '';
  } else {
    alert('Пожалуйста, введите поисковый запрос');
  }
}

// Получение аниме по названию
function getAnimeByTitle(title) {
  const anime = animeList.find(a => a.title === title);
  addAnimeToDOM(anime);
}

// Получение случайного аниме
function getRandomAnime() {
  // Очистка аниме и заголовка
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];
  addAnimeToDOM(randomAnime);
}

// Добавление аниме в DOM
function addAnimeToDOM(anime) {
  single_mealEl.innerHTML = `
    <div class="single-anime">
      <h1>${anime.title}</h1>
      <img src="${anime.image_url}" alt="${anime.title}" />
      <div class="single-anime-info">
        <p>${anime.description}</p>
        <h2>Жанры</h2>
        <ul>
          ${anime.genres.map(genre => `<li>${genre}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Слушатели событий
submit.addEventListener('submit', searchGenre);
random.addEventListener('click', getRandomAnime);

mealsEl.addEventListener('click', e => {
  const path = e.composedPath ? e.composedPath() : e.path || (e.target && [e.target]);

  const animeInfo = path.find(item => {
    if (item.classList) {
      return item.classList.contains('anime-info');
    } else {
      return false;
    }
  });

  if (animeInfo) {
    const title = animeInfo.getAttribute('data-title');
    getAnimeByTitle(title);
  }
});

// Загрузка списка аниме при запуске приложения
document.addEventListener('DOMContentLoaded', loadAnimeList);
