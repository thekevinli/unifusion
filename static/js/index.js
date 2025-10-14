window.HELP_IMPROVE_VIDEOJS = false;


function sleepSync(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy-waiting: do nothing, just wait for the time to pass
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Get references to all videos and the grid container
  const videos = document.querySelectorAll('.synced-video');
  const videoGrid = document.getElementById('syncedVideoGrid');
  
  // Function to synchronize all videos to the first one
  function syncVideos() {
    const firstVideo = videos[0];
    const currentTime = firstVideo.currentTime;
    
    // Sync all other videos to the first one
    for (let i = 1; i < videos.length; i++) {
      // Only adjust if the time difference is significant
      if (Math.abs(videos[i].currentTime - currentTime) > 0.1) {
        videos[i].currentTime = currentTime;
      }
    }
  }
  
  // Sync videos every second
  setInterval(syncVideos, 1000);
  
  // Pause all videos on mouse enter
  videoGrid.addEventListener('mouseenter', function() {
    videos.forEach(video => {
      video.pause();
    });
  });
  
  // Play all videos on mouse leave
  videoGrid.addEventListener('mouseleave', function() {
    videos.forEach(video => {
      video.play();
    });
  });
  
  // Ensure all videos start at the same time
  videos.forEach(video => {
    video.addEventListener('loadedmetadata', function() {
      // Reset to beginning to ensure sync
      video.currentTime = 0;
      
      // Handle autoplay issues
      video.play().catch(e => {
        console.log('Autoplay prevented. User interaction required.', e);
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const sceneSelector = document.getElementById('scene-selector');
  const modelButtons = document.querySelectorAll('.model-buttons .button');
  const comparisonVideo = document.getElementById('comparison-video');
  
  // Initial values
  let currentScene = 'room';
  let currentModel = 'pc_match';
  
  // Function to update the video source
  function updateVideo() {
    // Special naming for specific scenes
    const specialScenes = ['room', 'garden', 'kitchen', 'stump'];
    const suffix = specialScenes.includes(currentScene) ? '_insets' : '';
    
    const videoPath = `./static/videos/${currentScene}_${currentModel}_focal_stack${suffix}.mp4`;
    
    // Store current time to maintain position after source change
    const currentTime = comparisonVideo.currentTime;
    
    // Update source
    comparisonVideo.querySelector('source').src = videoPath;
    comparisonVideo.load();
    
    // Resume playback and restore time position
    comparisonVideo.addEventListener('loadedmetadata', function onceLoaded() {
      comparisonVideo.currentTime = currentTime;
      comparisonVideo.play();
      comparisonVideo.removeEventListener('loadedmetadata', onceLoaded);
    });
  }
  
  // Scene selector change event
  sceneSelector.addEventListener('change', function() {
    currentScene = this.value;
    updateVideo();
  });
  
  // Model button click events
  modelButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove selected class from all buttons
      modelButtons.forEach(btn => {
        btn.classList.remove('is-active');
      });
      
      // Add selected class to clicked button
      this.classList.add('is-active');
      
      // Update current model
      currentModel = this.dataset.model;
      updateVideo();
    });
  });
});

$(document).ready(function() {

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    // teaser
    const video = document.getElementById("teaser-video");
    if (video) {
      // Pause videos on hover
      video.addEventListener("mouseenter", () => {
        video.pause();
      });
      // Resume videos on leave
      video.addEventListener("mouseleave", () => {
        video.play();
      });
    }

    // Minimal, dependency-free image carousel (rotation + dots + arrows)
    initImageCarousel('carousel-div', { delayMs: 2000 });
    bulmaSlider.attach();
    
    function initImageCarousel(rootId, { delayMs = 3000 } = {}) {
      const root = document.getElementById(rootId);
      if (!root || root.dataset.carouselInitialized === '1') return;
      root.dataset.carouselInitialized = '1';
      root.style.position = 'relative';
      root.style.overflow = 'hidden';
      // Use robust child collection instead of :scope selector (better CDN/older browser compatibility)
      const slides = Array.from(root.children).filter(el => el.classList.contains('item') || el.tagName === 'DIV');
      if (slides.length === 0) return;
      let idx = 0;

      // Build sliding track
      const track = document.createElement('div');
      track.className = 'simple-track';
      track.style.display = 'flex';
      track.style.width = (slides.length * 100) + '%';
      track.style.transition = 'transform 400ms ease';
      track.style.willChange = 'transform';

      // Move slides into track and size them
      slides.forEach((s) => {
        s.style.display = 'block';
        s.style.flex = '0 0 100%';
        s.style.width = '100%';
        s.style.margin = '0';
        s.style.boxSizing = 'border-box';
        const img = s.querySelector('img');
        if (img) {
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          img.style.display = 'block';
        }
        track.appendChild(s);
      });
      root.appendChild(track);

      // Dots
      const dots = document.createElement('div');
      dots.style.position = 'absolute';
      dots.style.left = '50%';
      dots.style.bottom = '10px';
      dots.style.transform = 'translateX(-50%)';
      dots.style.display = 'flex';
      dots.style.gap = '8px';
      dots.style.zIndex = '3';
      const dotEls = slides.map((_, i) => {
        const d = document.createElement('div');
        d.style.width = '8px';
        d.style.height = '8px';
        d.style.borderRadius = '50%';
        d.style.background = i === 0 ? '#222' : '#999';
        d.style.opacity = i === 0 ? '1' : '.6';
        d.style.cursor = 'pointer';
        d.addEventListener('click', () => goTo(i));
        dots.appendChild(d);
        return d;
      });
      root.appendChild(dots);

      // Arrows
      const left = document.createElement('div');
      const right = document.createElement('div');
      [left, right].forEach(el => {
        el.style.position = 'absolute';
        el.style.top = '50%';
        el.style.transform = 'translateY(-50%)';
        el.style.width = '36px';
        el.style.height = '36px';
        el.style.lineHeight = '36px';
        el.style.textAlign = 'center';
        el.style.fontSize = '22px';
        el.style.color = '#fff';
        el.style.background = 'rgba(0,0,0,0.45)';
        el.style.borderRadius = '18px';
        el.style.cursor = 'pointer';
        el.style.userSelect = 'none';
        el.style.zIndex = '3';
      });
      left.style.left = '10px';
      right.style.right = '10px';
      left.textContent = '‹';
      right.textContent = '›';
      left.addEventListener('click', () => goTo(idx - 1));
      right.addEventListener('click', () => goTo(idx + 1));
      root.appendChild(left);
      root.appendChild(right);

      let timer = startTimer();
      root.addEventListener('mouseenter', () => { clearInterval(timer); });
      root.addEventListener('mouseleave', () => { timer = startTimer(); });

      function startTimer() {
        return setInterval(() => goTo(idx + 1), delayMs);
      }

      function goTo(next) {
        dotEls[idx].style.background = '#999';
        dotEls[idx].style.opacity = '.6';
        idx = (next + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-idx * 100) + '%)';
        dotEls[idx].style.background = '#222';
        dotEls[idx].style.opacity = '1';
      }
    }
})


// supplemental materials
let currentScene = 'mipnerf360-bicycle';
let currentModel = '3DGS';
let currentTimeVaryGaussians = 0;
let videoPaused = false;

let currentSceneDecomp = 'mipnerf360-bicycle';
let currentTexDecomp = 'none';
let currentColorDecomp = 'base';
let currentTimeColorDecomp = 0;
let videoPausedDecomp = false;


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("video-vary-gaussians").addEventListener('pause', () => {
    console.log("pause video");
    videoPaused = true;
  });
  document.getElementById("video-vary-gaussians").addEventListener('play', () => {
    videoPaused = false;
  });
  document.getElementById("video-color-decomp").addEventListener('pause', () => {
    console.log("pause video");
    videoPausedDecomp = true;
  });
  document.getElementById("video-color-decomp").addEventListener('play', () => {
    videoPausedDecomp = false;
  });
  currentTimeVaryGaussians = document.getElementById('video-vary-gaussians').currentTime;
  currentTimeColorDecomp = document.getElementById('video-color-decomp').currentTime;
});


// Select teaser scene
let teaserScene = "garden";
function selectTeaserScene(scene) {
  console.log("selecting scene: " + scene);
  document.querySelectorAll('[id^="teaser-button"]').forEach(button => button.classList.remove('is-active-teaser'));
  document.getElementById(`teaser-button-${scene}`).classList.add('is-active-teaser');
  teaserScene = scene;
  updateTeaserVideo();
}

function updateTeaserVideo() {
  document.getElementById('teaser-video').src = `static/videos/${teaserScene}_nvs_focal_stack.mp4`;
}

