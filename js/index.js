//marvel js correto


const timeStamp = "1673440309";

const marvelApiKey ='2bbfb63c4afc519cfec90a8264bb31bd';
const md5 = "f60978396333b3a64f5c2a1ceee8863d";

// Criar o slider com Swipper
function createNewSwiper() {
  new Swiper(".heroSwiper", {
    draggable: true,
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 50,
    observer: true,
    observeParents: true,
  
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
  });
}

// Inserir um slide para cada herói
function setAllHeroes(heroes) {
  let swiper = document.getElementById("swiper");

  if (heroes.length === 0) return swiper.innerHTML = '<div class="swiper-slide">Sem resultados</div>'
  
  const heroesHTML = heroes.map(hero => {
    let slideElement = `
      <div class="swiper-slide hero">
        <a class="hero-image" href="${hero.urls[0].url}" target="_blank">
          <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}">
          <span class="hero-name">${hero.name}</span>
        </a>
      </div>
    `;

    return slideElement;
  })

  swiper.innerHTML = heroesHTML.join(" ");
}

// Buscar todos os heróis da Marvel
function getAllHeroes() {
  fetch(`http://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&apikey=${marvelApiKey}&hash=${md5}&limit=100`)
    .then(response => response.json())
    .then(response => {
      const heroes = response.data.results;
      setAllHeroes(heroes);
    })
}

// Pesquisar por heróis específicos da Marvel
function searchHero() {
  const search = document.getElementById("search");

  const nameStartsWith = search.value.length > 0 ? `&nameStartsWith=${search.value}` : ''

  fetch(`http://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&apikey=${marvelApiKey}&hash=${md5}&limit=100${nameStartsWith}`)
    .then(response => response.json())
    .then(response => {
      const heroes = response.data.results;
      setAllHeroes(heroes);
    })
}

function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

getAllHeroes();
createNewSwiper();
document.getElementById("search").addEventListener("input", debounce(searchHero, 800));
document.getElementById("search").addEventListener("propertychange", debounce(searchHero, 800)); // IE18