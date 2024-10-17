This HTML code outlines the structure for a simple web page called "Knights Gallery." Here's a breakdown of its key components:

### 1. Document Structure
- `<!DOCTYPE html>`: Declares that this document is an HTML5 document.
- `<html lang="en">`: Starts the HTML document and sets the language to English.

### 2. Head Section
- `<head>`: Contains meta-information about the document.
  - `<meta charset="UTF-8">`: Sets the character encoding to UTF-8, allowing for a wide range of characters.
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: Ensures the page is responsive and displays well on different devices.
  - `<title>Knights Gallery</title>`: Sets the title of the webpage that appears in the browser tab.
  - `<link rel="stylesheet" href="styles.css">`: Links to an external CSS file for styling.

### 3. Body Section
- `<body>`: Contains the content of the webpage.
  - `<h1>Knights Gallery</h1>`: Main heading of the page.
  
  - `<select id="genreFilter">`: A dropdown menu for filtering knight genres:
    - `<option>` tags represent different genre options (All, Historical, Legendary, Fictional).
    
  - `<div id="knightGallery"></div>`: A container where the gallery of knights will be displayed.

  - `<div id="knightDetails"></div>`: Another container intended for displaying details about a selected knight.
  
  - `<button id="refreshButton">Refresh Knights</button>`: A button that likely refreshes or reloads the knight gallery.
  
  - `<h2>Comments</h2>`: Subheading for the comments section.
  
  - `<form id="commentForm">`: A form for submitting comments:
    - `<textarea id="commentInput" placeholder="Add your comment here..."></textarea>`: A text area for user input.
    - `<button id="submitComment">Submit</button>`: A button to submit the comment.
  
  - `<div id="commentsDisplay"></div>`: A container for displaying submitted comments.

### 4. Scripts
- `<script src="script.js"></script>`: Links to an external JavaScript file, which likely contains the functionality for interactivity (like filtering knights, submitting comments, etc.).


## Java script

This JavaScript code is designed to handle the interactivity of the "Knights Gallery" webpage. Here’s a breakdown of its functionality and key components:

### 1. DOM Content Loaded Event
```javascript
document.addEventListener("DOMContentLoaded", () => {
```
This ensures the script runs after the HTML content is fully loaded, allowing it to manipulate the DOM elements effectively.

### 2. Element References
```javascript
const genreFilter = document.getElementById("genreFilter");
const knightGallery = document.getElementById("knightGallery");
const knightDetails = document.getElementById("knightDetails");
const refreshButton = document.getElementById("refreshButton");
const commentsDisplay = document.getElementById("commentsDisplay");
const commentForm = document.getElementById("commentForm");
```
These lines get references to the HTML elements that will be manipulated, such as the genre filter, knight gallery, details section, refresh button, and comments display.

### 3. API URLs
```javascript
const API_URL = "http://localhost:3000/knights"; // Local JSON server
const COMMENTS_URL = "http://localhost:3000/comments"; // Comments endpoint
const WIKI_SEARCH_URL = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=";
const WIKI_DETAIL_URL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&explaintext=&titles=";
```
These constants define the URLs for fetching knight data, comments, and Wikipedia information.

### 4. Event Listeners
```javascript
genreFilter.addEventListener("change", filterKnights);
refreshButton.addEventListener("click", fetchKnights);
commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addComment();
});
refreshButton.addEventListener("click", async () => {
    await fetchKnights();
    await filterKnights();
});
```
- **Filtering**: The genre filter updates the displayed knights when changed.
- **Refreshing**: The refresh button fetches new knight data when clicked.
- **Submitting Comments**: The comment form prevents the default submission behavior and calls `addComment()` to handle the input.

### 5. Fetching Knights
```javascript
async function fetchKnights() {
    const response = await fetch(API_URL);
    const knights = await response.json();
    return knights; // Return knights for filtering
}
```
This function fetches knight data from the API and returns it as a JSON object.

### 6. Filtering Knights
```javascript
async function filterKnights() {
    const selectedCategory = genreFilter.value;
    const knights = await fetchKnights();
    // Filtering logic...
    displayKnights(filteredKnights);
    fetchComments(selectedCategory); // Fetch comments for the selected category
}
```
This function filters knights based on the selected genre and updates the display. It also fetches comments related to the selected category.

### 7. Displaying Knights
```javascript
function displayKnights(knights) {
    knightGallery.innerHTML = ""; // Clear previous knights
    knights.forEach(knight => {
        const knightCard = document.createElement("div");
        knightCard.className = "knightCard";
        knightCard.innerHTML = `<h3>${knight.name}</h3><p>${knight.title}</p>`;
        knightCard.addEventListener("click", () => showKnightDetails(knight.name));
        knightGallery.appendChild(knightCard);
    });
}
```
This function creates and displays cards for each knight in the gallery, allowing the user to click on a knight to view details.

### 8. Showing Knight Details
```javascript
async function showKnightDetails(knightName) {
    const searchResponse = await fetch(WIKI_SEARCH_URL + encodeURIComponent(knightName) + "&format=json&origin=*");
    const searchData = await searchResponse.json();
    // Details fetching logic...
}
```
This function fetches details about a knight from Wikipedia and displays them. If no details are found, it informs the user.

### 9. Adding Comments
```javascript
async function addComment() {
    const selectedCategory = genreFilter.value;
    const commentText = commentInput.value;
    // Comment submission logic...
}
```
This function handles the creation and submission of comments to the server, refreshing the comments display afterward.

### 10. Fetching Comments
```javascript
async function fetchComments(category) {
    const response = await fetch(COMMENTS_URL);
    const comments = await response.json();
    const filteredComments = comments.filter(comment => comment.category === category);
    // Comments display logic...
}
```
This function fetches comments, filters them by category, and updates the comments display.

### 11. Initializing the Page
```javascript
async function init() {
    genreFilter.value = "All"; // Set default to "All"
    await filterKnights(); // Fetch and display all knights
}
init(); // Initial fetch to populate gallery with all knights
```
The `init()` function sets the default genre to "All" and populates the gallery with all knights when the page loads.

