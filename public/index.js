const originalUrlInput = document.getElementById("originalUrl");
const zipzapButton = document.getElementById("zipzapButton");
const urlList = document.getElementById("urlList");

zipzapButton.addEventListener("click", async () => {
  const originalUrl = originalUrlInput.value;
  if (!originalUrl) return;

  // Send a POST request to your backend to shorten the URL
  const response = await fetch("http://localhost:8000/url/short", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: originalUrl }),
  });

  if (response.ok) {
    originalUrlInput.value = "";
    refreshUrlList();
  }
});

async function refreshUrlList() {
  // Send a GET request to your backend to get the list of existing URLs
  const response = await fetch("http://localhost:8000/url/getUrls");
  const data = await response.json();

  // Update the UI with the list of existing URLs
  urlList.innerHTML = "";
  data.URLs.forEach((urlData) => {
    const listItem = document.createElement("li");
    listItem.className = "url-list-item";

    // Create a div to hold the short URL, copy icon, and original URL
    const urlContainer = document.createElement("div");
    urlContainer.className = "url-container";

    // Create the anchor tag for the short URL
    const shortUrlAnchor = document.createElement("a");
    shortUrlAnchor.href = `http://localhost:8000/url/${urlData.shortCode}`;
    shortUrlAnchor.textContent = `http://localhost:8000/url/${urlData.shortCode}`;
    shortUrlAnchor.target = "_blank"; // Open in a new tab

    // Create a copy icon span
    const copyIconSpan = document.createElement("span");
    copyIconSpan.className = "copy-icon";
    copyIconSpan.title = "Copy URL";
    copyIconSpan.innerHTML = '<i class="fas fa-copy"></i>';
    copyIconSpan.addEventListener("click", () => {
      copyToClipboard(`http://localhost:8000/url/${urlData.shortCode}`);
    });

    // Create a span for the original URL
    const originalUrlSpan = document.createElement("span");
    originalUrlSpan.className = "original-url";
    originalUrlSpan.textContent = urlData.originalUrl;

    // Append the short URL anchor, copy icon span, and original URL span to the URL container
    urlContainer.appendChild(shortUrlAnchor);
    urlContainer.appendChild(copyIconSpan);
    urlContainer.appendChild(originalUrlSpan);

    // Append the URL container to the list item
    listItem.appendChild(urlContainer);

    urlList.appendChild(listItem);
  });
}
function copyToClipboard(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

// Initial refresh of the URL list
refreshUrlList();
