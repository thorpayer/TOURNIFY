// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  // console.log("tournify JS imported successfully!");
});

function handleImageSelect(event) {
  const selectedImage = document.getElementById('selectedImage');
  const selectedBannerDiv = document.querySelector('.selected-banner');

  const file = event.target.files[0];

  if (file && file.type.includes('image')) {
    const reader = new FileReader();

    reader.onload = function(event) {
      selectedImage.src = event.target.result;
      selectedBannerDiv.style.display = 'inline';
    };

    reader.readAsDataURL(file);
  } else {
    selectedImage.src = '';
    selectedBannerDiv.style.display = 'none';
  }
}
