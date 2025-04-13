const fileInput = document.getElementById('file-upload');
const submitButton = document.getElementById('submit-btn');
const fileNameDisplay = document.getElementById('file-name');

// Handle file selection via the file input
fileInput.addEventListener('change', handleFileSelect);
console.log(fileInput.files)
// Handle drag and drop functionality
const uploadBox = document.querySelector('.bg-white');
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('border-dashed', 'border-2', 'border-blue-400');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('border-dashed', 'border-2', 'border-blue-400');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    handleFileSelect();
});
// Show file name after file is selected
function handleFileSelect() {
    const file = fileInput.files[0];
    if (file) {
        fileNameDisplay.textContent = `Name: ${file.name} Size:${(file.size/1000)|0} KB`;
        submitButton.disabled = false;
        submitButton.classList.remove('cursor-not-allowed', 'opacity-50');
    } else {
        fileNameDisplay.textContent = '';
        submitButton.disabled = true;
        submitButton.classList.add('cursor-not-allowed', 'opacity-50');
    }
}
// sending the file file to the servers
async function submitForm(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(); // Create FormData object
    formData.append("image",fileInput.files[0]) 
    try {
      const response = await fetch("http://127.0.0.1:5000/uploads", {
        method: "POST",
        body: formData, // Content-Type is set automatically
      });
      const result = await response.json(); // Parse JSON response
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }
// Handle submit button click (you can integrate actual upload logic here)
submitButton.addEventListener('click', submitForm);
document.getElementById("file-upload").addEventListener("change", function (event) {
    const fileName = event.target.files[0]?.name;
    if (fileName) {
        document.getElementById("submit-btn").classList.remove("cursor-not-allowed", "opacity-50");
        document.getElementById("submit-btn").disabled = false;
    }
});

document.getElementById("submit-btn").addEventListener("click", function () {
    const submitBtn = document.getElementById("submit-btn");
    const fileNameDiv = document.getElementById("file-name");
    const loader = document.createElement("div");
    const filesize = fileInput.files[0].size
    // Create a loading spinner
    loader.innerHTML = `
        <div class="flex justify-center items-center">
            <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span class="ml-2 text-gray-700">Uploading...</span>
        </div>
    `;
    // Show loading spinner and disable button
    fileNameDiv.appendChild(loader);
    submitBtn.disabled = true;
    submitBtn.classList.add("cursor-not-allowed", "opacity-50");

    // Simulate file upload delay (e.g., 3 seconds)
    setTimeout(() => {
        loader.remove();
        fileNameDiv.innerHTML += `<p class="text-green-500 mt-2">File uploaded successfully!</p>`;
        submitBtn.disabled = false;
        submitBtn.classList.remove("cursor-not-allowed", "opacity-50");
    }, filesize/1000);
});
