const YOUTUBE_API_KEY = "AIzaSyDrF1KACHuzL00zEHEg0fFKdb6GX2wxBBg"; // ✅ Tumhari API key
const YOUTUBE_MAX_RESULTS = 60;

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const videoList = document.getElementById("videoList");
const mainVideoContainer = document.getElementById("mainVideoContainer");
const mainVideoFrame = document.getElementById("mainVideoFrame");
const mainVideoTitle = document.getElementById("mainVideoTitle");
const closeBtn = document.getElementById("closeBtn");

// Search button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) searchYouTube(query);
});

//  Press Enter to search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

//  Close video
closeBtn.addEventListener("click", () => {
  mainVideoContainer.classList.remove("active");
  mainVideoFrame.src = "";
});

//  Fetch and display videos
async function searchYouTube(query) {
  videoList.innerHTML = "<p>Loading videos...</p>";

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${YOUTUBE_MAX_RESULTS}&q=${encodeURIComponent(
    query
  )}&key=${YOUTUBE_API_KEY}`;

  const resp = await fetch(url);
  const data = await resp.json();

  videoList.innerHTML = "";

  data.items.forEach((video) => {
    const div = document.createElement("div");
    div.classList.add("video-item");

    div.innerHTML = `
      <div class="video-thumb">
        <img src="${video.snippet.thumbnails.medium.url}" alt="">
      </div>
      <div class="video-meta">
        <div class="video-title">${video.snippet.title}</div>
        <div class="muted">${video.snippet.channelTitle}</div>
      </div>
    `;

    div.addEventListener("click", () => {
      playVideo(video.id.videoId, video.snippet.title);
    });

    videoList.appendChild(div);
  });
}

// ▶ Play Selected Video (with YouTube check)
function playVideo(videoId, title) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  mainVideoFrame.src = embedUrl;
  mainVideoTitle.textContent = title;
  mainVideoContainer.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
  
  //  Check if embedding blocked
  setTimeout(() => {
    try {
      const iframeDoc =
        mainVideoFrame.contentDocument ||
        mainVideoFrame.contentWindow.document;

      if (
        !iframeDoc ||
        iframeDoc.body.innerText.includes("unavailable") ||
        iframeDoc.title.includes("YouTube")
      ) {
        // Open directly on YouTube
        window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
        mainVideoFrame.src = "";
        mainVideoContainer.classList.remove("active");
      }
    } catch (err) {
      // Same-domain restriction → assume allowed
    }
  }, 2500);
}
//  Check if embedding blocked after 2.5 seconds//
setTimeout(() => {
  try {
    const iframeDoc =
      mainVideoFrame.contentDocument ||
      mainVideoFrame.contentWindow.document;

    if (
      !iframeDoc ||
      iframeDoc.body.innerText.includes("unavailable") ||
      iframeDoc.title.includes("YouTube")
    ) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
      mainVideoFrame.src = "";
      mainVideoContainer.classList.remove("active");
    }
  } catch (err) {
    // Ignore cross-origin restriction
  }
}, 2500);

//  Initial focus on search input
searchInput.focus();

//  Add a simple loading animation
videoList.innerHTML = "<p>Loading videos...</p>";

