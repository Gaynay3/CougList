function addListing() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  if (title === '' || price === '' || description === '') {
    alert("Please fill out all fields.");
    return;
  }

  const listings = document.getElementById("listings");
  const listingDiv = document.createElement("div");
  listingDiv.className = "listing";
  listingDiv.innerHTML = `<h3>${title} - $${price}</h3><p>${description}</p>`;
  listings.appendChild(listingDiv);

  document.getElementById("title").value = '';
  document.getElementById("price").value = '';
  document.getElementById("description").value = '';
}


  function changeImage(thumbnail) {
    document.getElementById('mainImage').src = thumbnail.src;
    document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
    thumbnail.classList.add('active');
  }



