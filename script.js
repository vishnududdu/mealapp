const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', function() {
    const query = searchInput.value;
    // Fetch meals from API based on search query
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            // Display search results
            displaySearchResults(data.meals);
        });
});

function displaySearchResults(meals) {
    searchResults.innerHTML = '';
    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');
        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <button onclick="addToFavourites('${meal.idMeal}')">Add to Favourites</button>
            <a href="meal-detail.html?id=${meal.idMeal}" class="meal-detail-link"><button>View Details</button></a>
        `;
        searchResults.appendChild(mealCard);
    });
}

function addToFavourites(mealId) {
    // Retrieve favourites from local storage or initialize as empty array
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    // Check if the meal is already in favourites
    const existingMeal = favourites.find(meal => meal.id === mealId);
    if (!existingMeal) {
        alert('Added to favourites');
        // Fetch meal details from API based on mealId
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                if (meal) {
                    // Add meal to favourites array
                    favourites.push({
                        id: meal.idMeal,
                        name: meal.strMeal,
                        image: meal.strMealThumb
                    });

                    // Update local storage
                    localStorage.setItem('favourites', JSON.stringify(favourites));

                    // Update UI to reflect the addition
                    updateFavouritesUI();
                } else {
                    alert('Meal not found')
                    console.error('Meal not found');
                }
            })
            .catch(error => console.error('Error fetching meal details:', error));
    } else {
        alert('Meal already in favourites')
        console.log('Meal already in favourites');
    }
}

function updateFavouritesUI() {
    // Retrieve favourites from local storage
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const favouritesList = document.getElementById('favouritesList');
    if (favourites.length === 0) {
        favouritesList.innerHTML = `<p>No favorite items yet</p>`;
    }
    else{
    // Display favourites on UI
    
    favouritesList.innerHTML = '';
    favourites.forEach(meal => {
        const favouriteItem = document.createElement('div');
        favouriteItem.classList.add('favourite-item');
        favouriteItem.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}">
            <h3>${meal.name}</h3>
            <button onclick="removeFromFavourites('${meal.id}')">Remove from Favourites</button>
            <a href="meal-detail.html?id=${meal.id}" class="meal-detail-link"><button>View Details</button></a>
        `;
        favouritesList.appendChild(favouriteItem);
    });
}
}


