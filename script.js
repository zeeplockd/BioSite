document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/zeeplockd/BioSite/refs/heads/main/bio.txt');
    if (response.ok) {
      const bioText = await response.text();
      document.getElementById('bio-text').textContent = bioText.trim();
    } else {
      console.error('Failed to fetch bio text:', response.status);
      document.querySelector('.bio').style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching bio text:', error);
    document.querySelector('.bio').style.display = 'none';
  }
});
