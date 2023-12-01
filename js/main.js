//variable para cambiar idiomas
let languages;
let api;
//Funcion para verificar si en el localStorage esta guardado el idioma
function getLang() {
  console.log('getLang');
  //corroborar si en el localstorage existe un idioma
  var language = localStorage.getItem("lng")
  console.log({ language });
  if (language) {
    languages = language;
  } else {
    localStorage.setItem("lng", "es-ES")
    languages = "es-ES"
  }
  // toggleOptions(language)
  api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
      'api_key': API_KEY,
      "language": languages,
    },
  });
}
getLang();
// function toggleOptions(language) {
//   console.log('toggleOptions');
//   if (language === 'en-EN') {
//     languageHeader.insertAdjacentElement('afterbegin', idiomEnglish);
//   } else {
//     languageHeader.insertAdjacentElement('afterbegin', idiomEspanol);
//   }
// }
//Al seleccionar un idioma este cambia y se recarga la pag
languageHeader.addEventListener('change', (e) => {
  console.log(e.target.value)
  localStorage.setItem('lng', e.target.value)
  console.log('cambio en el localstorage');
  window.location.reload();
})

//instancia de AXIOS
// let api = axios.create({
//   baseURL: 'https://api.themoviedb.org/3/',
//   headers: {
//     'Content-Type': 'application/json;charset=utf-8',
//   },
//   params: {
//     'api_key': API_KEY,
//     "language": lenguage,
//   },
// });


//funcion para guardar peli en localStorange
function likeMovie(movie) {
  const likedMovies = likedMoviesList();
  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;

  } else {
    likedMovies[movie.id] = movie;
    console.log(likedMovies);
  }
  localStorage.setItem("liked_movies", JSON.stringify(likedMovies))
}
//funcion para mostrar todas las pelis favoritas
function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;
  if (item) {
    movies = item;
  } else {
    movies = {};
  }
  return movies;
}
//funciones para reutilizar codigo
const lazyLoader = new IntersectionObserver((entries) => {
  //cada elem que va hacer observado
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url)
      console.log({ entries });
    }


  })
})
//funcion para cambiar el idioma 


function createMovies(
  movies,
  container,
  {
    lazyLoad = false,
    clean = true
  } = {},
) {
  if (clean) {
    //Se borra el contenedor para que cuando se recargue o vuelva al home no se agreguen los nodos
    container.innerHTML = "";

  }

  //recorrer el array para traer cada pelicula 
  movies.forEach(movie => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    //al clickear navegue en la pag para mostrar la pelicula

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    //se envia dos argumentos el atributo y el valor por la propiedad title
    movieImg.setAttribute("alt", movie.title);

    //se envia los argumentos del atributo, la base de la url de las imagenes concatenando la propiedad de poster_path
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      "https://image.tmdb.org/t/p/w300/"
      + movie.poster_path);
    movieImg.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });
    //cuando hay un error en la carga de img por defecto
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute("src", "https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png")
    });

    //btn favorito
    const movieBtn = document.createElement("button")
    movieBtn.classList.add("movie-btn");
    //indica si las pelis estan guardadas
    likedMoviesList()[movie.id] && movieBtn.classList.add("movie-btn-liked")
    movieBtn.addEventListener("click", () => {
      movieBtn.classList.toggle("movie-btn-liked")
      //guardar o borrar en el localStorage
      likeMovie(movie);
      getLikedMovies();
      getTrendingMoviesPreview();

    })


    //visualizacion de imagenes a medida que el usuario lo solicite
    if (lazyLoad) {
      lazyLoader.observe(movieImg)
    }

    //agregar los nodos
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);


  });

}
function createCategories(categories, container) {
  container.innerHTML = "";
  categories.forEach(category => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");
    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');

    categoryTitle.setAttribute('id', 'id' + category.id);
    const categoryTitleText = document.createTextNode(category.name);
    //Al clickear las categorias indica el id y el nombre
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category="${category.id}-${category.name}`
        ;
    })
    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  })


}

//Llamados a la API

//funcion para traer las peliculas en tendencias preview
async function getTrendingMoviesPreview() {
  const { data } = await api("/trending/movie/day");
  const movies = data.results;
  /* console.log(data); */
  createMovies(movies, trendingMoviesPreviewList, true);

}

//funcion para traer las categorias
async function getCategoriesPreview() {
  const { data } = await api("/genre/movie/list");

  // variable para buscar en el array los generos
  const categories = data.genres;
  /* console.log({ data, categories }); */
  /*   categoriesPreviewList.innerHTML = ""; */
  createCategories(categories, categoriesPreviewList)
}

//funcion para traer las peliculas de las categorias 
async function getMoviesByCategory(id) {
  const { data } = await api("/discover/movie", {
    params: {
      with_genres: id,
    }
  });
  const movies = data.results;
  console.log(data);
  createMovies(movies, genericSection, { lazyLoader: true })
  maxPage = data.total_pages;
}
function getPaginatedMoviesByCategory(id) {
  return async function () {
    //desestructuracion de medidas 
    const { scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement
    //Final scroll
    const scrollIsBotton = (scrollTop + scrollTop) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage;

    if (scrollIsBotton && pageIsNotMax) {
      page++;
      const { data } = await api("/discover/movie", {
        params: {
          with_genres: id,
          page,
        }
      });
      const movies = data.results;
      createMovies(
        movies,
        genericSection,
        {
          lazyLoad: true,
          clean: false
        });

    }
  }
}
//funcion para encontrar la busqueda atraves del query
async function getMovieBySearch(query) {
  console.log("pelicula encontrada");
  const { data } = await api("/search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;
  createMovies(movies, genericSection);
  maxPage = data.total_pages;
  console.log(maxPage);
}
function getPaginatedMoviesBySearch(query) {
  return async function () {
    //desestructuracion de medidas 
    const { scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement
    //Final scroll
    const scrollIsBotton = (scrollTop + scrollTop) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage;

    if (scrollIsBotton && pageIsNotMax) {
      page++;
      const { data } = await api("/search/movie", {
        params: {
          query,
          page,
        },
      });
      const movies = data.results;
      createMovies(
        movies,
        genericSection,
        {
          lazyLoad: true,
          clean: false
        });

    }
  }
}
// funcion para filtrar las tendencias 
async function getTrendingMovies() {
  const { data } = await api("/trending/movie/day");
  const movies = data.results;
  maxPage = data.total_pages;
  createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}
//funcion para paginacion
async function getPaginatedTrendingMovies() {
  //desestructuracion de medidas 
  const { scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement
  //Final scroll
  const scrollIsBotton = (scrollTop + scrollTop) >= (scrollHeight - 15)
  const pageIsNotMax = page < maxPage;

  if (scrollIsBotton && pageIsNotMax) {
    page++;
    const { data } = await api("/trending/movie/day", {
      params: {
        page,
      },
    });
    const movies = data.results;
    createMovies(
      movies,
      genericSection,
      {
        lazyLoad: true,
        clean: false
      });

  }

}

//funcion para mostrar el detalle de peliculas al clickear
async function getMovieById(id) {
  //se renombra el objeto data 
  const { data: movie } = await api("/movie/" + id);
  //carga de informacion
  const movieImgUrl =
    "https://image.tmdb.org/t/p/w500/"
    + movie.poster_path;
  console.log(movieImgUrl);
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;
  headerSection.style.background = `
  linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
  url( ${movieImgUrl})
 `;
  createCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMoviesById(id);
}
//funcion para filtrar las peliculas relacionadas
async function getRelatedMoviesById(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;
  createMovies(relatedMovies, relatedMoviesContainer);
}
//funcion para leer peliculas favoritas
function getLikedMovies() {
  const likedMovies = likedMoviesList();

  //crear un array con todos los obj
  const movieArrays = Object.values(likedMovies);
  createMovies(movieArrays,
    likedMovieListArticle,
    {
      lazyLoad: true,
      clean: true,
    });
  /* console.log(likedMovies); */

}
