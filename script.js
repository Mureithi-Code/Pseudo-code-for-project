document.addEventListener("DOMContentLoaded", () => {
    
    //Get references to HTML elements
    const genreFilter = document.getElementById("genreFilter");
    const knightGallery = document.getElementById("knightGallery");
    const knightDetails = document.getElementById("knightDetails");
    const refreshButton = document.getElementById("refreshButton");
    //const commentInput = document.getElementById("commentInput");
    //const submitComment = document.getElementById("submitComment");
    const commentsDisplay = document.getElementById("commentsDisplay");
    const commentForm = document.getElementById("commentForm");

    //Define API URLs
    const API_URL = "http://localhost:3000/knights"; // Local JSON server
    const COMMENTS_URL = "http://localhost:3000/comments"; // Comments endpoint
    const WIKI_SEARCH_URL = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=";
    const WIKI_DETAIL_URL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&explaintext=&titles=";

    //Event listeners for filtering, refreshing and submitting comments
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

    //Fetch knights from the server
    async function fetchKnights() {
        const response = await fetch(API_URL);
        const knights = await response.json();
        return knights; // Return knights for filtering
    }

    //Felter knights based on the selected genre
    async function filterKnights() {
        const selectedCategory = genreFilter.value;
        const knights = await fetchKnights();

        let filteredKnights; //Initialize filtered knights array
        //Filter knights based on the selected category
        if (selectedCategory === "All") {
            filteredKnights = Object.values(knights.Historical)
                .concat(Object.values(knights.Legendary))
                .concat(Object.values(knights.Fictional));
        } else {
            filteredKnights = knights[selectedCategory] || []; //Get knights from the selected category
        }

        displayKnights(filteredKnights);
        fetchComments(selectedCategory); // Fetch comments for the selected category
    }

    //Display knight cards in the gallery
    function displayKnights(knights) {
        knightGallery.innerHTML = ""; // Clear previous knights
        knights.forEach(knight => {
            const knightCard = document.createElement("div");
            knightCard.className = "knightCard";
            knightCard.innerHTML = `<h3>${knight.name}</h3><p>${knight.title}</p>`;
            knightCard.addEventListener("click", () => showKnightDetails(knight.name)); // Pass knight name
            knightGallery.appendChild(knightCard);
        });
    }

    //Show details of the selected knight from Wikipedia
    async function showKnightDetails(knightName) {
        const searchResponse = await fetch(WIKI_SEARCH_URL + encodeURIComponent(knightName) + "&format=json&origin=*");
        const searchData = await searchResponse.json();

        if (searchData.query.search.length > 0) {
            const pageTitle = searchData.query.search[0].title; // First matching title
            const detailResponse = await fetch(WIKI_DETAIL_URL + encodeURIComponent(pageTitle) + "&format=json&origin=*");
            const detailData = await detailResponse.json();

            const pageContent = detailData.query.pages[Object.keys(detailData.query.pages)[0]].extract;
            knightDetails.innerHTML = `<h2>${pageTitle}</h2><p>${pageContent}</p>`;
        } else {
            knightDetails.innerHTML = `<p>Details not found for ${knightName}.</p>`;
        }
    }

    //Add a comment to the selected category
    async function addComment() {
        const selectedCategory = genreFilter.value;
        const commentText = commentInput.value;

        if (commentText) {
            // Create a new comment object
            const newComment = { 
                id: Date.now().toString(), // Generate a unique ID
                category: selectedCategory, 
                comment: commentText 
            };
            //Send new comment to the server
            await fetch(COMMENTS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newComment),
            });
            commentInput.value = ""; // Clear the input
            fetchComments(selectedCategory); // Refresh comments display
        }
    }

    //Delete a specific comment by id
    async function deleteComment(commentId) {
        await fetch(`${COMMENTS_URL}/${commentId}`, {
            method: "DELETE",
        });
        const selectedCategory = genreFilter.value;
        fetchComments(selectedCategory); // Refresh comments display
    }

    //Fetch comment for the selected category
    async function fetchComments(category) {
        const response = await fetch(COMMENTS_URL);
        const comments = await response.json();
        const filteredComments = comments.filter(comment => comment.category === category);
        
        commentsDisplay.innerHTML = ""; // Clear previous comments
        if (filteredComments.length > 0) {
            filteredComments.forEach(comment => {
                const commentDiv = document.createElement("div");
                commentDiv.innerHTML = `
                    <p>${comment.comment}</p>
                    <button class="deleteButton" data-id="${comment.id}">Delete</button>
                    `;
                commentsDisplay.appendChild(commentDiv);
            });
        } else {
            commentsDisplay.innerHTML = `<p>No comments for this category yet.</p>`;
        }

          // Add event listeners for delete button
        const deleteButton = document.querySelectorAll(".deleteButton");
        deleteButton.forEach(button => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const commentId = button.getAttribute("data-id");
                deleteComment(commentId); // Call deleteComment with the ID
            });
        });
    }

    //Initialize the website
    async function init() {
        genreFilter.value = "All"; // Set default to "All"
        await filterKnights(); // Fetch and display all knights
    }

    init(); // Initial fetch to populate gallery with all knights
});
