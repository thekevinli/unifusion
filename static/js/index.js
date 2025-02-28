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

    // Pause videos on hover
    video.addEventListener("mouseenter", () => {
      video.pause();
    });

    // Resume videos on leave
    video.addEventListener("mouseleave", () => {
      video.play();
    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

    // carousel for the video
    let carousel_div = document.getElementById("results-carousel");
    var video_id_list = [
      "room",
      "stump",
      "garden",
      "kitchen",
      "hotdog",
      "lego",
      "ship",
      "materials",
      "chair"
    ];
    for (var i = 0; i < video_id_list.length; i++) {
        let video_element = document.getElementById(video_id_list[i]);
        console.log(video_element);
        video_element.addEventListener('mouseenter', () => {
          video_element.pause();
        });

        // Play the video when the mouse leaves
        video_element.addEventListener('mouseleave', () => {
          video_element.play();
        });
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	carousels[i].on('before:show', state => {
        console.log('before:show', state);
    	});
    }



    // Access to bulmaCarousel instance of an element
    var element = document.querySelector("#carousel-div");
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before:show', function(state) {
    		console.log("before show", state);
    	});
    }
    bulmaSlider.attach();
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

