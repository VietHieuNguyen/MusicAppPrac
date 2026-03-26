// ===== Spotify-style Player Bar Controller =====
document.addEventListener("DOMContentLoaded", function () {
  // Player bar elements
  var playerTitle = document.getElementById("playerTitle");
  var playerArtist = document.getElementById("playerArtist");
  var playerThumbnail = document.getElementById("playerThumbnail");
  var btnPlayPause = document.getElementById("btnPlayPause");
  var iconPlay = btnPlayPause ? btnPlayPause.querySelector(".icon-play") : null;
  var iconPause = btnPlayPause
    ? btnPlayPause.querySelector(".icon-pause")
    : null;
  var progressBar = document.getElementById("playerProgressBar");
  var progressFill = document.getElementById("playerProgressFill");
  var currentTimeEl = document.getElementById("playerCurrentTime");
  var durationEl = document.getElementById("playerDuration");
  var volumeBar = document.getElementById("playerVolumeBar");
  var volumeFill = document.getElementById("playerVolumeFill");
  var btnMute = document.getElementById("btnMute");
  var btnDetailPlay = document.getElementById("btnDetailPlay");

  var ap = null;
  var isPlaying = false;
  var lastVolume = 0.6;

  // Format seconds to m:ss
  function formatTime(sec) {
    if (!sec || isNaN(sec) || !isFinite(sec)) return "0:00";
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // Update play/pause icon
  function updatePlayIcon(playing) {
    isPlaying = playing;
    if (iconPlay && iconPause) {
      iconPlay.style.display = playing ? "none" : "inline";
      iconPause.style.display = playing ? "inline" : "none";
    }
    if (btnPlayPause) {
      btnPlayPause.title = playing ? "Pause" : "Play";
    }
    // Also update the detail page play button
    if (btnDetailPlay) {
      if (playing) {
        btnDetailPlay.classList.add("playing");
      } else {
        btnDetailPlay.classList.remove("playing");
      }
    }
  }

  // Update player bar song info
  function updatePlayerInfo(title, artist, cover) {
    if (playerTitle) playerTitle.textContent = title || "Unknown";
    if (playerArtist) playerArtist.textContent = artist || "Unknown";
    if (playerThumbnail) {
      playerThumbnail.innerHTML = "";
      if (cover) {
        var img = document.createElement("img");
        img.src = cover;
        img.alt = title || "";
        playerThumbnail.appendChild(img);
      }
    }
  }

  // Initialize APlayer (hidden, engine only)
  function initPlayer(songData, singer) {
    if (!songData || !songData.audio) return;

    // Destroy previous instance
    if (ap) {
      try {
        ap.destroy();
      } catch (e) {}
    }

    ap = new APlayer({
      container: document.getElementById("aplayer"),
      theme: "#1DB954",
      volume: lastVolume,
      lrcType: 1,
      audio: [
        {
          name: songData.title || "Unknown",
          artist: singer.fullName,
          url: songData.audio,
          cover: songData.cover || "",
          lrc: songData.lyrics
        },
      ],
      autoplay: true,
    });

    // Update player bar info
    updatePlayerInfo(songData.title, songData.artist, songData.cover);

    // --- APlayer Events ---
    ap.on("timeupdate", function () {
      var current = ap.audio.currentTime;
      var duration = ap.audio.duration;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
      if (durationEl) durationEl.textContent = formatTime(duration);
      if (progressFill && duration > 0) {
        var pct = (current / duration) * 100;
        progressFill.style.width = pct + "%";
      }
    });

    ap.on("on", function () {
      updatePlayIcon(true);
    });

    ap.on("pause", function () {
      updatePlayIcon(false);
    });

    ap.on("ended", function () {
      updatePlayIcon(false);
      if (progressFill) progressFill.style.width = "0%";
      if (currentTimeEl) currentTimeEl.textContent = "0:00";
      const link = `/songs/listen/${songData._id}`;
      const option = {
        method: "PATCH"
      }
      fetch(link,option)
        .then(res => res.json())
        .then(data=>{
          if(data==200){
            const elementListenSpan = document.querySelector(".song-detail-hero__meta")
            const span = elementListenSpan.querySelector("[listen]");
            span.innerHTML = `${data.listen} listens`
          }
        })
    });

    // Set initial volume display
    if (volumeFill) {
      volumeFill.style.width = lastVolume * 100 + "%";
    }
  }

  // --- Player Bar Controls ---

  // Play / Pause
  if (btnPlayPause) {
    btnPlayPause.addEventListener("click", function () {
      if (ap) {
        ap.toggle();
      }
    });
  }

  // Detail page play button
  if (btnDetailPlay) {
    btnDetailPlay.addEventListener("click", function () {
      var dataSong = this.getAttribute("data-song");
      dataSong = JSON.parse(dataSong);
      var singer = this.getAttribute("data-singer");
      singer = JSON.parse(singer);
      initPlayer(dataSong, singer);
      if (ap) {
        ap.play();
      }
    });
  }

  // Progress bar click to seek
  if (progressBar) {
    progressBar.addEventListener("click", function (e) {
      if (!ap || !ap.audio.duration) return;
      var rect = progressBar.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      ap.seek(pct * ap.audio.duration);
    });
  }

  // Volume bar click
  if (volumeBar) {
    volumeBar.addEventListener("click", function (e) {
      if (!ap) return;
      var rect = volumeBar.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      ap.volume(pct, true);
      lastVolume = pct;
      if (volumeFill) volumeFill.style.width = pct * 100 + "%";
    });
  }

  // Mute toggle
  if (btnMute) {
    btnMute.addEventListener("click", function () {
      if (!ap) return;
      if (ap.audio.volume > 0) {
        lastVolume = ap.audio.volume;
        ap.volume(0, true);
        if (volumeFill) volumeFill.style.width = "0%";
      } else {
        ap.volume(lastVolume, true);
        if (volumeFill) volumeFill.style.width = lastVolume * 100 + "%";
      }
    });
  }

  //   // --- Init from page data ---
  //   if (window.__songData && window.__songData.audio) {
  //     initPlayer(window.__songData);
  //   }
});

//Button like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const idSong = buttonLike.getAttribute("button-like");
    const isActive = buttonLike.classList.contains("active");
    const songDetail = document.querySelector(".song-detail-hero__meta");
    const like = songDetail.querySelector("[like]");
    const typeLike = isActive ? "dislike" : "like";
    const link = `/songs/like/${typeLike}/${idSong}`;
    const option = {
      method: "PATCH",
    };
    fetch(link, option)
      .then((res) => res.json())
      .then((data) => {
        like.innerHTML = `${data.like.toLocaleString()} Likes`;

        buttonLike.classList.toggle("active");
      });
  });
}
//End Button like

//Button Favourite
const listButtonFavorites = document.querySelectorAll("[button-favorite]");
if (listButtonFavorites.length > 0) {
  listButtonFavorites.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const isActive = buttonFavorite.classList.contains("active");
      const typeFavorite = isActive ? "unfavorite" : "favorite";
      const link = `/songs/favorite/${typeFavorite}/${idSong}`;
      const option = {
        method: "PATCH",
      };

      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            buttonFavorite.classList.toggle("active");

            const favoriteRow = buttonFavorite.closest(".favorite-songs-table__row");
            if(favoriteRow){
              if (typeFavorite === "unfavorite" && favoriteRow) {
              favoriteRow.remove();
            }
            }
            
          }
        });
    });
  });
}
//End Button Favorite
//Searh Suggest
const boxSearch = document.querySelector(".header-search")
if(boxSearch){
  const input = boxSearch.querySelector("input[name='keyword']");
  const boxSuggest = boxSearch.querySelector(".header-search__panel");
  input.addEventListener("keyup", () => {
    const keyword = input.value;
    const link = `/search/suggest?keyword=${keyword}`;
    fetch(link)
      .then((res) => res.json())
      .then((data) => {
        const songs = data.songs;
        if (songs.length > 0) {
          boxSuggest.classList.add("show");
          const htmls = songs.map((song) => {
            return `    <span class="header-search__group-label">Songs</span>
                            <a class="header-search__item" href="/songs/detail/${song.slug}">
                              <div class="header-search__item-thumb header-search__item-thumb--song">
                                  <img src="${song.avatar}" alt="${song.title}">
                              </div>
                              <div class="header-search__item-content">
                                  <span class="header-search__item-title header-search__item-title--highlighted">${song.title}</span>
                                  <span class="header-search__item-meta">${song.infoSinger.fullName}</span>

                  `
          });
          const boxList = boxSuggest.querySelector(".header-search__group")
          console.log(boxList)
          boxList.innerHTML = htmls.join("")
        }else{
          boxSuggest.classList.remove("show")
        }
      });
  });
}
//End Searh Suggest