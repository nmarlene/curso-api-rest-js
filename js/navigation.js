//comience en la primera pag
let page = 1;
let infiniteScroll;
let maxPage;

//navegador escucha el evento de cambio de rutas
window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);
//se escucha el evento de scroll
window.addEventListener("scroll", infiniteScroll, false)

//Al clickear los botones de ver mas y busqueda redireccione a las pag correspondiente

trendingBtn.addEventListener("click", () => {
  location.hash = "#trends";

})
arrowBtn.addEventListener("click", () => {
  //Vuelve al historial de busqueda 
  if (history.length > 1) {
    history.back();
  } else {
    location.hash = "#home";
  }

})


//Busqueda y filtracion accediendo al input 
searchBtn.addEventListener("click", () => {

  location.hash = "#search=" + searchFormInput.value;
})


//funcion para navegar con location.hash
function navigator() {
  /*  console.log({ location }); */
  //si tiene algo el infiteScroll se cambie
  if (infiniteScroll) {
    window.removeEventListener("scroll", infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }
  //condicionales para saber en que pagina esta el usuario
  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();

  } else if (location.hash.startsWith("#movie=")) {
    movieDetailPage();
  } else if (location.hash.startsWith("#category=")) {
    categoryPage();
  } else {
    homePage();
  }
  //Cada vez que selecciona una categoria se redireccione en el inicio (top)
  scrollTo(top)
  if (infiniteScroll) {

    window.addEventListener("scroll", infiniteScroll, { passive: false })
  }

}
//funciones para ir a las distintas paginas
function homePage() {
  /*  console.log("home!"); */
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  headerTitle.classList.remove("inactive")
  arrowBtn.classList.add("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.remove("inactive");
  categoriesPreviewSection.classList.remove("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.add("inactive");
  likedContainer.classList.remove("inactive");
  languageHeader.classList.remove("inactive")
  /*   switch (lan.value) {
      case 'en':
        trendingPreviewTitle.innerHTML = 'Trends';
        trendingBtn.innerHTML = 'See more';
        categoriesPreviewTitle.innerHTML = 'Categories';
        likedTitle.innerHTML = 'Favorite movies';
        break;
      case "es":
        trendingPreviewTitle.innerHTML = 'Tendencias';
        trendingBtn.innerHTML = 'Ver más';
        categoriesPreviewTitle.innerHTML = 'Categorias';
        likedTitle.innerHTML = 'Peliculas favoritas';
        break;
    } */
  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
}
function categoryPage() {
  console.log("Category!");
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");

  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");
  likedContainer.classList.add("inactive");
  languageHeader.classList.add("inactive")
  //Para encontrar el id de las peliculas se separa la url con el metodo split  //=>["#category", "id-name"]
  const [_, categoryData] = location.hash.split("=")
  //Se sapara el id con el nombre de la categoria
  const [categoryId, categoryName] = categoryData.split("-")
  headerCategoryTitle.innerHTML = categoryName;
  //funcion para traer las pelis de las categorias
  getMoviesByCategory(categoryId);
  infiniteScroll = getPaginatedMoviesByCategory(categoryId)
}
function movieDetailPage() {
  console.log("Movie!");
  headerSection.classList.add("header-container--long");
  /* headerSection.style.background = ""; */
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.add("header-arrow--white");
  headerTitle.classList.add("inactive");

  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.remove("inactive");
  likedContainer.classList.add("inactive");
  languageHeader.classList.add("inactive")
  //Para encontrar las busquedas de los usuarios se separa la url con el metodo split  //=>["#movie=", "id"]
  const [_, idMovie] = location.hash.split("=");
  getMovieBySearch(idMovie);
  //funcion para mostrar el detalle de peli
  getMovieById(idMovie);
}
function searchPage() {
  console.log("Search!");
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");

  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");
  likedContainer.classList.add("inactive");
  languageHeader.classList.add("inactive")
  //Para encontrar las busquedas de los usuarios se separa la url con el metodo split  //=>["#search", "busqueda"]
  const [_, query] = location.hash.split("=");
  getMovieBySearch(query);
  infiniteScroll = getPaginatedMoviesBySearch(query);
}
function trendsPage() {
  console.log("trends");
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");

  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");
  likedContainer.classList.add("inactive");
  languageHeader.classList.add("inactive")
  headerCategoryTitle.innerHTML = "Tendencias";
  getTrendingMovies();
  infiniteScroll = getPaginatedTrendingMovies;
}

