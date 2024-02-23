// Add event listener to delete buttons
const deleteButtons = document.querySelectorAll('.del');

// Loop through each delete button and attach a click event listener
Array.from(deleteButtons).forEach((element) => {
    element.addEventListener('click', crossItem);
});

// Function to handle the deletion of a todo item
async function crossItem() {
    // Retrieve the item name from the list item
    const iName = this.parentNode.childNodes[1].innerText;

    try {
        // Send a DELETE request to the server to delete the item
        const response = await fetch('/deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemName': iName // Pass the item name in the request body
            })
        });

        // Parse the JSON response from the server
        const data = await response.json();
        console.log(data); // Log the response data to the console
        location.reload(); // Reload the page to reflect the updated todo list
    } catch (error) {
        console.log(error); // Log any errors that occur during the process
    }
}
