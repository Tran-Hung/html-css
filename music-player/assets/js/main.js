const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $('.playlist');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playPause = $('.btn-toggle-play');
const player = $('.player');
const cd = $('.cd');
const heading = $("header h2");
const progress = $('#progress');
const bntPrev = $('.btn-prev');
const bntNext = $('.btn-next');
const bntRandom = $('.btn-random');
const bntRepeat = $('.btn-repeat');
const volume = $('#volume');
const iconVolume = $('.btn-volume');
const bntPlus = $('.btn-plus');
const modal = $('.js-modal')
const modalClose = $('.js-modal-close')
const modalContaniner = $('.js-modal-contaniner')
const bntAdd = $('#add-music')


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,

  songs: [
    {
      name: "Hotaru No Hiraki",
      singer: "Naruto op3",
      path: "https://aredir.nixcdn.com/NhacCuaTui828/HotaruNoHikari-IkimonoGakari-2434364_hq.mp3?st=wXAqcCQDveJxSDHD-4vRQg&e=1655262024&download=true",
      image: "https://data.chiasenhac.com/data/cover/131/130974.jpg"
    },
    {
      name: "Giày Cao Gót Màu Đỏ",
      singer: "Thái Kiện Nhã",
      path: "https://aredir.nixcdn.com/NhacCuaTui993/GiayCaoGotMauDo-ThaiKienNhaTanyaChua-6178396.mp3?st=mg1uNX4YcA0pazvANBaWjQ&e=1655261961&download=true",
      image:
        "https://i.ytimg.com/vi/muvNBWqtrv4/maxresdefault.jpg"
    },
    {
      name: "Lang Quen Chieu Thu",
      singer: "Hoa Vinh",
      path:
        "https://aredir.nixcdn.com/NhacCuaTui964/LangQuenChieuThu-HoaVinh-5489152_hq.mp3?st=3HLMQbcq_iqhR_mXjNaBmQ&e=1655262066&download=true",
      image: "https://i.ytimg.com/vi/89WM3df3Xvw/maxresdefault.jpg"
    },
    {
      name: "Hay Trao Cho Anh",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://aredir.nixcdn.com/NhacCuaTui985/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3?st=vydFG5nA1PeHNjHbouGNtg&e=1655177551&download=true",
      image:
        "https://billboardvn.vn/wp-content/uploads/2019/06/Teasing-Poster-1.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://aredir.nixcdn.com/NhacCuaTui964/ChayNgayDi-SonTungMTP-5468704.mp3?st=SQf1GzmOFx8jjE9Ojx8LzQ&e=1655177551&download=true",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
  ],

  objectProperties: function(){
    Object.defineProperty(this, 'currentSong', {
        get: function() {
          return this.songs[this.currentIndex];
        }
    });
  },

  render: function() {
    var html = this.songs.map((song,index) => {
      return ` <div class="song" data-index="${index}">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`
    }).join('')

    playList.innerHTML = html;
  },

  handleEvents: function() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    var cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000, // 10s
      iterations: Infinity
    })
    cdThumbAnimate.pause();

    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0? newCdWidth + 'px': 0;
      cd.style.opacity = newCdWidth/cdWidth;

    }

    playPause.onclick = function() {
      if (_this.isPlaying) {
        audio.pause();
      }
      else {
        audio.play();
      }
    }
    audio.onplay = function() {
      _this.isPlaying = true
      player.classList.add("playing");
      cdThumbAnimate.play();
      audio.volume = volume.value/100;
    }
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    }

    audio.ontimeupdate = function() {
      if (audio.duration)
        progress.value = audio.currentTime/audio.duration*100
    }

    progress.onchange = function(e) {
      const seekTime = audio.duration * e.target.value / 100;
      audio.currentTime = seekTime;
    }

    bntPrev.onclick = function() {
      _this.prevSong();
      audio.play();
      _this.scrollToActiveSong();
    }

    bntNext.onclick = function() {
      _this.nextSong();
      audio.play();
      _this.scrollToActiveSong();
    }

    bntRandom.onclick = function() {
      // if (_this.isRandom) {
      //   _this.isRandom = false
      //   bntRandom.classList.remove('active')
      // }else{
      //   _this.isRandom = true
      //   bntRandom.classList.add('active')
      // }
      _this.isRandom = !_this.isRandom;
      bntRandom.classList.toggle('active', _this.isRandom)
    }

    bntRepeat.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      bntRepeat.classList.toggle('active', _this.isRepeat)
    }

    audio.onended = function() {
      if (!_this.isRepeat) {
        // _this.nextSong();
        // audio.play();
        bntNext.click();
      }
      else {
        audio.play();
      }
    }

    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          $('.song.active').classList.remove('active')
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
        }

        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };

    // $$('.song').forEach((song,index) => {
    //   song.onclick = function() {
    //     _this.currentIndex = index;
    //     $('.song.active').classList.remove('active')
    //     _this.loadCurrentSong();
    //     audio.play();
    //   }
    // });

    volume.onchange = function(e) {
      const vol = e.target.value / 100;
      audio.volume = vol;
      if (vol > 0.5) {
        iconVolume.classList.remove('volume-mute');
        iconVolume.classList.remove('volume-down');
        iconVolume.classList.add('volume-up');
      }
      else{
        iconVolume.classList.remove('volume-up');
        switch (vol){
          case 0.5 :
            iconVolume.classList.remove('volume-mute');
            iconVolume.classList.remove('volume-down');
            break;
          case 0 :
            iconVolume.classList.remove('volume-down');
            iconVolume.classList.add('volume-mute');
            break;
          default:
            iconVolume.classList.remove('volume-mute');
            iconVolume.classList.add('volume-down');
        }

      }
    };

    bntPlus.onclick = function() {
      modal.classList.add('open')
    }

    modalClose.addEventListener('click', hidenAddMusic)
    modal.addEventListener('click', hidenAddMusic)
    modalContaniner.addEventListener('click', function (event){
        event.stopPropagation();
    })

    function hidenAddMusic() {
      modal.classList.remove('open')
    }

    // bntAdd.onclick = function (e) {
    //   var path = $('#path').value;
    //   if (path) {
    //     var startIndex = (path.indexOf('\\') >= 0 ? path.lastIndexOf('\\') : path.lastIndexOf('/'));
    //     var filename = path.substring(startIndex);
    //     if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
    //         filename = filename.substring(1);
    //     }
    //     console.log(filename)
    //   }
    //   console.log($('#path').files);
    // }

    const thisForm = document.querySelector('.modal-body');
    
    thisForm.onsubmit = function(e) {
      e.preventDefault();
      var nameMusic = $('#name-music').value;
      var singer = $('#singer').value;
      var image = $('#image').value;
      const profile = this.querySelector('#path');
      var formData = new FormData(thisForm);
      formData.append("nameMusic", nameMusic);
      formData.append("singer", singer);
      formData.append("path", profile.files[0]);
      formData.append("image", image);
      console.log(formData[0])
      for (const [key, value] of formData) {
        console.log(`${key}: ${value}\n`);
      }
    }

  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 300);
  },

  loadCurrentSong: function() {
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.setAttribute('src',`${this.currentSong.path}`)
    heading.innerText = `${this.currentSong.name}`
    $$('.song')[this.currentIndex].classList.add('active')
  },

  nextSong: function() {
    if (!this.isRandom) {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
      $('.song.active').classList.remove('active')
      this.loadCurrentSong();
    }else {
      this.randomSong();
    }
  },

  prevSong: function() {
    if (!this.isRandom) {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length -1;
      }
      $('.song.active').classList.remove('active')
      this.loadCurrentSong();
    }else {
      this.randomSong();
    }
  },

  randomSong: function() {
    var newCurrentIndex = Math.floor(Math.random() * this.songs.length);
    while (this.currentIndex === newCurrentIndex) {
      newCurrentIndex = Math.floor(Math.random() * this.songs.length)
    }
    $('.song.active').classList.remove('active')
    this.currentIndex = newCurrentIndex;
    this.loadCurrentSong();
  },

  start: function() {

    this.render();
    
    this.objectProperties();
    
    this.handleEvents();
    
    this.loadCurrentSong();
    
  }
}

app.start();