// https://github.com/TextAliveJp/textalive-app-basic
const { Player } = TextAliveApp;
let player = new Player({
  app: {
    token: "SCbJEML9pACmXLoh",
  },
  mediaElement: document.querySelector("#media"),
});
player.addListener({
  onAppReady,
  onVideoReady,
  onTimerReady,
  onThrottledTimeUpdate,
  onPlay,
  onPause,
  onStop,
});

/**
 * TextAlive App が初期化されたときに呼ばれる
 *
 * @param {IPlayerApp} app - https://developer.textalive.jp/packages/textalive-app-api/interfaces/iplayerapp.html
 */
function onAppReady(app) {
  if (!app.managed) {
    const urlParam = location.search
      .substring(1)
      .split("&")
      .find((p) => p.split("=")[0] == "song_url");
    if (urlParam) {
      player.createFromSongUrl(urlParam.substr(9)).catch(() => {
        // 真島ゆろ / 嘘も本当も君だから
        player.createFromSongUrl("https://piapro.jp/t/YW_d/20210206123357", {
          // YouTube: https://www.youtube.com/watch?v=Se89rQPp5tk
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121405/history
            beatId: 3953908,
            repetitiveSegmentId: 2099661,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FYW_d%2F20210206123357
            lyricId: 52061,
            lyricDiffId: 5123,
          },
        });
      });
    } else {
      // 真島ゆろ / 嘘も本当も君だから
      player.createFromSongUrl("https://piapro.jp/t/YW_d/20210206123357", {
        // YouTube: https://www.youtube.com/watch?v=Se89rQPp5tk
        video: {
          // 音楽地図訂正履歴: https://songle.jp/songs/2121405/history
          beatId: 3953908,
          repetitiveSegmentId: 2099661,
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FYW_d%2F20210206123357
          lyricId: 52061,
          lyricDiffId: 5123,
        },
      });
    }
    document.body.addEventListener("playMovie", (e) => {
      player.video && player.requestPlay();
    });
    document.body.addEventListener("stopMovie", (e) => {
      player.video && player.requestPause();
    });
  }
}

/**
 * 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
 *
 * @param {IVideo} v - https://developer.textalive.jp/packages/textalive-app-api/interfaces/ivideo.html
 */
function onVideoReady(v) {
  // 定期的に呼ばれる各単語の "animate" 関数をセットする
}

/**
 * 音源の再生準備が完了した時に呼ばれる
 *
 * @param {Timer} t - https://developer.textalive.jp/packages/textalive-app-api/interfaces/timer.html
 */
function onTimerReady(t) {
  // ボタンを有効化する
  if (!player.app.managed) {
  }
}

/**
 * 動画の再生位置が変更されたときに呼ばれる（あまりに頻繁な発火を防ぐため一定間隔に間引かれる）
 *
 * @param {number} position - https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html#onthrottledtimeupdate
 */
function onThrottledTimeUpdate(position) {
  // 再生位置を表示する
  // さらに精確な情報が必要な場合は `player.timer.position` でいつでも取得できますcd
}

function onPlay() {}

function onPause() {}
function onStop() {}
// const animateWord = function (now, unit) {
//     if (unit.contains(now)) {
//         currentLyric0 += unit.text;
//         console.log(unit.text);
//         currentLyric0 = currentLyric0.substr(currentLyric0.length - 4, 4);
//     }
// };
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

window.setup = setup;
window.preload = preload;
window.draw = draw;
window.windowResized = windowResized;
window.keyPressed = keyPressed;
window.mousePressed = mousePressed;
window.touchStarted = mousePressed;
// import dotsJSON from './assets/dots.json';
// import pngs from './img/*.png';
// import svgs from './img/*.svg';
let dotsJSON;
fetch("assets/dots.json")
  .then((response) => response.json())
  .then((data) => (dotsJSON = data));

const DARK_GRAY = "#373b3e",
  LIGHT_GRAY = "#bec8d1",
  BEIGE = "#fffeec",
  LIGHT_GREEN = "#c3e5e7",
  GREEN = "#86cecb",
  DEEP_GREEN = "#137a7f",
  MAGENTA = "#e12885";

let canvas,
  canvasX,
  canvasY,
  doms,
  ghost,
  width,
  height,
  stateNum = 3,
  currentState = 0,
  mouseSprite,
  playButtons,
  infoButtons,
  DISPLAY_RATIO,
  MARGIN_RATIO,
  STROKE_WEIGHT,
  uTextDiv1,
  dTextDiv1,
  screenDiv1,
  lightDiv1,
  infoTexts,
  infoTextElement,
  infoInd = 0,
  infoDiv,
  mapGraphics,
  overGraphics,
  lightGraphics,
  penlightGroup,
  dots,
  pinImg,
  penAnime,
  penStopImg,
  penImg,
  playImg1,
  playImg2,
  pauseImg1,
  pauseImg2,
  infoImg1,
  infoImg2,
  OriginIntercept,
  maxIntercept,
  dotsStart = [],
  beat,
  optMode = false;

function preload() {
  pinImg = loadImage("img/pin.png");
  playImg1 = loadImage("img/replay1.svg");
  playImg2 = loadImage("img/replay2.svg");
  pauseImg1 = loadImage("img/pause1.svg");
  pauseImg2 = loadImage("img/pause2.svg");
  infoImg1 = loadImage("img/info1.svg");
  infoImg2 = loadImage("img/info2.svg");

  penImg = loadImage("img/pen.png");
}

// function addZImg(name, x, y) {
//     const span = createSpan(`
//     <span class="z-text-img"><img width="400" src="${pngs[name]}"/></span>`).position(
//         x,
//         y
//     );
//     return span;
// }

function setup() {
  const lightParam = location.search
    .substring(1)
    .split("&")
    .find((p) => p.split("=")[0] == "light_mode");
  if (lightParam && lightParam.substr(11) == "true") {
    optMode = true;
  }
  if (window.innerWidth * 0.8 >= window.innerHeight) {
    height = window.innerHeight;
    width = height * 1.25;
  } else {
    width = window.innerWidth;
    height = width * 0.8;
  }
  canvas = createCanvas(width, height);

  canvasX = canvas.canvas.getBoundingClientRect().x;
  canvasY = canvas.canvas.getBoundingClientRect().y;
  background("#FFF3E7");
  ghost = createSprite(width / 2, height / 2, 50, 100);
  uTextDiv1 = createDiv(`
    <svg>
    <g class="g-ants">
    <use href="#s-text1"
    class="text-copy"></use>     
    <use href="#s-text1"
    class="text-copy"></use>     
    <use href="#s-text1"
    class="text-copy"></use>     
    <use href="#s-text1"
    class="text-copy"></use>     
    <use href="#s-text1"
    class="text-copy"></use>     
    </g>
    
    </svg>`);
  dTextDiv1 = createDiv(`<svg><g class="g-ants">
    <use href="#s-text2"
    class="text-copy"></use>     
    <use href="#s-text2"
    class="text-copy"></use>     
    <use href="#s-text2"
    class="text-copy"></use>     
    <use href="#s-text2"
    class="text-copy"></use>     
    <use href="#s-text2"
    class="text-copy"></use>     
    </g></svg>`);
  uTextDiv1.attribute("class", ["svg-text"]);
  uTextDiv1.attribute("id", ["svg-up-text"]);
  dTextDiv1.attribute("class", ["svg-text"]);
  dTextDiv1.attribute("id", ["svg-down-text"]);

  new Ztextify(".svg-text", {
    depth: "10px",
    layers: 4,
    fade: false,
    direction: "both",
    event: "pointer",
    eventRotation: "5deg",
  });
  screenDiv1 = createDiv();
  screenDiv1.attribute("class", ["cover"]);
  lightDiv1 = createDiv();
  lightDiv1.attribute("class", ["light"]);
  doms = [uTextDiv1, dTextDiv1, screenDiv1, lightDiv1];
  spriteSetup();
  graphicsSetup();

  infoTexts = [
    `
    <h1>遊び方</h1>
    <ul>
    <li type="sqare">
    再生ボタン▶を押して曲を再生
    </li>
    <li type="sqare">
    ←→キー/左右にフリックでスライド切替
    </li>
    <li type="sqare">
    デフォルトの楽曲は
    <br>
    <strong>真島ゆろさん『嘘も本当も君だから / 初音ミク』</strong>
    <br>
    <a href="https://www.youtube.com/watch?v=Se89rQPp5tk">YouTube</a>
    <a href="https://piapro.jp/t/YW_d">piapro</a>
    <a href="${
      window.location.origin + window.location.pathname
    }">このアプリで再生</a>
    <br>
    となっています
    </li>
    <li type="sqare">
    画面のサイズ変更/縦横回転等により表示が崩れた場合は、ページを再読み込みしてください
    </li>
    <li>
    ${
      optMode
        ? "現在<strong>「軽量モード」</strong>です→"
        : "<strong>スマートフォン等で動作が重い場合はこちら</strong>→"
    }<a href=${window.location.origin + window.location.pathname}${
      optMode ? "" : "?light_mode=true"
    }>${optMode ? "通常モードへ" : "軽量モードへ"}</a>
    </li>
    <li type="sqare">
    曲を変更したい場合は↓にURLを入力
    <br>(TextAliveに登録されている楽曲のみ・デフォルト楽曲以外での動作確認はしていません)
    <div>
    <input type="text" name="url" id="song_url_form"
   placeholder="https://www.youtube.com/watch?v=Se89rQPp5tk"
   >
   <button id="reload_button">    
   変更
   </button>
   </div>
    </li>
    <li type="sqare">
    このアプリケーションの利用者は<a href="https://content.textalive.jp/documents/textalive_app_terms_of_use.pdf">TextAlive App ユーザ利用規約</a>に同意したものとみなされます
    </li>
    </ul>
    `,
  ];
  infoDiv = createDiv(`
    <div id=info-text>${infoTexts[infoInd]}</div></div>`);
  infoTextElement = document.getElementById("info-text");

  infoDiv.hide();
  infoDiv.addClass("info-modal");
  infoDiv.addClass("info-desappear");
  infoDiv.style("overflow", "overlay");
  infoDiv.style("font-size", `${width * 0.01}px`);
  document.getElementById("reload_button").addEventListener("click", () => {
    window.location.href = `${
      window.location.origin + window.location.pathname
    }?song_url=${document.getElementById("song_url_form").value}`;
  });
  var hammer = new Hammer(document.body, {
    preventDefault: true,
  });
  hammer.get("swipe").set({
    direction: Hammer.DIRECTION_HORIZONTAL,
  });

  hammer.on("swipe", swiped);
  frameRate(60);
}

function spriteSetup() {
  mouseSprite = createSprite(0, 0, 0, 0);
  playButtons = new Group();
  infoButtons = new Group();
  for (let i = 0; i < stateNum; i++) {
    const s = createSprite(0, 0, 20, 20);
    s.addImage("play1", playImg1);
    s.addImage("play2", playImg2);
    s.addImage("pause1", pauseImg1);
    s.addImage("pause2", pauseImg2);
    s.scale = width * 0.00013;
    playButtons.add(s);
  }
  for (let i = 0; i < stateNum; i++) {
    const s = createSprite(0, 0, 20, 20);
    s.addImage("info1", infoImg1);
    s.addImage("info2", infoImg2);
    s.scale = width * 0.00013;
    infoButtons.add(s);
  }
  playButtons.toArray().forEach((e) => {
    e.onMouseReleased = (tar) => {
      if (player.isPlaying) {
        stopMovie();
      } else {
        playMovie();
      }
    };
  });
  infoButtons.toArray().forEach((e) => (e.onMouseReleased = expandInfo));

  mikuSprite1 = createSprite(0, 0, 10, 10);
  mikuSprite1.addImage(loadImage("img/miku.png"));
  mikuSprite1.scale = (width / 96) * 0.2;
  mikuSprite1.position = { x: width * 2, y: height * 0.57 };

  penlightGroup = new Group();
  for (let i = 2; i < 7; i++) {
    penlightGroup.add(createSprite(width * (1.5 + i / 8), height * 0.84));
  }
  for (let i = 0; i < 2; i++) {
    penlightGroup.add(createSprite(width * 1.6, height * (0.84 - 0.12 * i)));
    penlightGroup.add(createSprite(width * 2.4, height * (0.84 - 0.12 * i)));
  }
  penlightGroup.toArray().forEach((penlight) => {
    penlight.default_rotation = (Math.random() - 0.5) * 20;
    // penlight.addImage('stop', penStopImg);
    // penAnime.looping = false;
    // penlight.addAnimation('swing', penAnime);
    // penlight.scale = width * 0.00025;
    penlight.addImage(penImg);
    penlight.scale = width * 0.0006;

    penlight.rotation = penlight.default_rotation;
  });
}
function graphicsSetup() {
  mapGraphics = createGraphics(width, height);
  overGraphics = createGraphics(width, height);
  lightGraphics = createGraphics(width, height, WEBGL);
  mapGraphics.stroke(GREEN);
  mapGraphics.strokeWeight(width * 0.0065);
  dots = dotsJSON.dots;
  dots.sort((a, b) => {
    return a[0] - a[1] - (b[0] - b[1]);
  });
  OriginIntercept = dots[0][0] - dots[0][1];
  for (let i = 0; i < dots.length; i++) dotsStart[i] = -1;
  dots.forEach((dot, ind) => {
    const intercept = (dot[0] - dot[1] - OriginIntercept) / 8;
    maxIntercept = intercept;
    if (dotsStart[intercept] < 0) dotsStart[intercept] = ind;
    mapGraphics.point(
      width * (dot[0] * 0.0009 + 0.085),
      width * (dot[1] * 0.0009 + 0.055)
    );
  });
  for (let i = maxIntercept; i < dotsStart.length; i++)
    dotsStart[i] = dots.length;
}

function windowResized() {
  if (window.innerWidth * 0.8 >= window.innerHeight) {
    width = window.innerWidth * 1.25;
    height = window.innerHeight;
  } else {
    width = window.innerWidth;
    height = window.innerHeight * 0.8;
  }
  resizeCanvas(width, height);
}

function mousePressed() {
  penlightGroup.toArray().forEach((penlight) => {
    penlight.rotationSpeed = 6;
  });
}

function swiped(event) {
  if (event.direction == 2) {
    currentState = (currentState + 1) % stateNum;
  } else if (event.direction == 4) {
    currentState = (currentState - 1 + stateNum) % stateNum;
  }
}
function keyPressed() {
  if (keyCode === RIGHT_ARROW) currentState = (currentState + 1) % stateNum;
  if (keyCode === LEFT_ARROW)
    currentState = (currentState - 1 + stateNum) % stateNum;
}
function drawBack() {}
function drawDisplay(scene, origin = 0, fillColor = "white") {
  stroke("#7ACECE");
  fill(fillColor);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  DISPLAY_RATIO = 0.85;
  MARGIN_RATIO = 0.015;
  STROKE_WEIGHT = width * 0.05;
  strokeWeight(STROKE_WEIGHT);
  rect(
    origin + STROKE_WEIGHT / 2,
    STROKE_WEIGHT / 2,
    width - STROKE_WEIGHT,
    height * DISPLAY_RATIO,
    width * MARGIN_RATIO
  );
  fill("#7ACECE");
  strokeWeight(1);
  stroke("grey");
  quad(
    origin + width * 0.4,
    height * DISPLAY_RATIO * 1.071,
    origin + width * 0.6,
    height * DISPLAY_RATIO * 1.071,
    origin + width * 0.66,
    height,
    origin + width * 0.33,
    height
  );
  const playButton = playButtons.toArray()[scene],
    infoButton = infoButtons.toArray()[scene];
  playButton.position.x = origin + width * 0.77;
  infoButton.position.x = origin + width * 0.83;
  playButton.position.y = infoButton.position.y =
    height * DISPLAY_RATIO + STROKE_WEIGHT / 2;
}

function playMovie() {
  console.log("Play!");
  const playEvent = new CustomEvent("playMovie");
  document.body.dispatchEvent(playEvent);
}
function stopMovie() {
  console.log("Stop!");
  const stopEvent = new CustomEvent("stopMovie");
  document.body.dispatchEvent(stopEvent);
}
function expandInfo() {
  infoDiv.show();
  infoDiv.toggleClass("info-appear");
  infoDiv.toggleClass("info-desappear");
}
let t0 = [],
  aaSwitch = true,
  currentLyric0 = "",
  lastBeat0,
  currentFPS = 0,
  frameForFPS = 0;
function drawScene0() {
  const Scene = 0,
    Origin = Scene * 1.5 * width,
    aaText = `
　　　　　　　　　　　　　　 　＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
　　　　　　　　　　　　　　　 |　　　　　　　　　　　　　　 |
　　　　　　　　　　　　　　　/ 　　　　　　　　　　　　　　 |
　　　　　　　　　　　　　　 /  　　　　　　　　　　　　　　 |
　　　　　　　　　　　　　　/　 　　　　　　　　　　　　　 　|
    　　　＿＿＿＿＿＿ 　　/　  　　　　　　　　　　　　　 　|
    　＿／            ＼＿ ￣￣|　　　　　　　　　　　　　 　|
    ／\\ \\　゛゛゛゛゛　/ /＼　 |　　　　　　　　　　　　　 　|
   ｜/ \\ \\/＼／＼／＼// / \\｜　|　　　　　　　　　　　　　 　|
   /　 / /|　－　－　|\\ \\ 　\\　￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
  / 　/ / |　〇　〇　| \\ \\ 　\\
 /  　丁　|＠　□　＠|　丁  　\\
｜    ｜　|　　　　　|  ｜    ｜
｜　|　\\　 ￣￣￣￣￣   /　|　｜
｜　\\ 　\\　　／　＼　  /　 /　｜
        `,
    aaText2 = `
　　　　　　　　　　　　　　 　＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
　　　　　　　　　　　　　　　 |　　　　　　　　　　　　　　 |
　　　　　　　　　　　　　　　/ 　　　　　　　　　　　　　　 |
　　　　　　　　　　　　　　 /  　　　　　　　　　　　　　　 |
　　　　　　　　　　　　　　/　 　　　　　　　　　　　　　 　|
    　　　＿＿＿＿＿＿ 　　/　  　　　　　　　　　　　　　 　|
    　＿／            ＼＿ ￣￣|　　　　　　　　　　　　　 　|
    ／\\ \\　゛゛゛゛゛　/ /＼　 |　　　　　　　　　　　　　 　|
   ｜/ \\ \\/＼／＼／＼// / \\｜　|　　　　　　　　　　　　　 　|
   /　 / /|　＿　＿　|\\ \\ 　\\　￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
  / 　/ / |　〇　〇　| \\ \\ 　\\
 /  　丁　|＠　－　＠|　丁  　\\
｜    ｜　|　　　　　|  ｜    ｜
｜　|　\\　 ￣￣￣￣￣   /　|　｜
｜　\\ 　\\　　／　＼　  /　 /　｜
        `;
  drawDisplay(Scene, Origin, "black");
  textAlign(LEFT);
  textFont("PixelMplus10");
  fill("#00FF33");
  textLeading(width * 0.029);
  textSize(width * 0.028);

  //////////////////////// ! after player loaded
  textSize(width * 0.025);
  if (frameForFPS % 10 === 0) currentFPS = frameRate().toFixed(3);
  text(`FPS: ${currentFPS}`, width * 0.77, height * 0.82);
  frameForFPS++;
  if (player.isLoading) {
    if (!t0[0]) t0[0] = millis();
    text(
      `[voc@loid/miku] > Now Loading...`.substr(0, 15 + (millis() - t0) / 30),
      width * 0.1,
      height * 0.15
    );
    return;
  }
  if (!player.data.song)
    window.location.href = window.location.origin + window.location.pathname;
  if (!t0[1]) t0[1] = millis();
  let consoleTexts = [
    `[voc@loid/miku] > Now Loading...`,
    "                > Loaded!",
    `                > Title: ${player.data.song.name}`,
    `                > Artist: ${player.data.song.artist.name}`,
    `                > Let's Play!`,
  ];

  text(
    consoleTexts.join("\n").substr(0, 32 + (millis() - t0[1]) / 15),
    width * 0.1,
    height * 0.15
  );

  if (32 + (millis() - t0[1]) / 15 >= consoleTexts.join("\n").length) {
    if (!t0[2]) t0[2] = millis();
    textSize(width * 0.038);
    textLeading(width * 0.028);
    textSize(width * 0.028);
    text(
      (aaSwitch ? aaText : aaText2).substr(0, (millis() - t0[2]) / 2),
      width * 0.075,
      height * 0.285
    );

    const beatChanged = beat != lastBeat0;
    lastBeat0 = beat;
    if (player.isPlaying) {
      let c = player.video.findChar(player.timer.position);
      if (c) currentLyric0 = "";
      while (c && currentLyric0.length < 12) {
        currentLyric0 = c.text + currentLyric0;
        c = c.previous;
      }
    }

    let renderLyric; // 行替えを入れるために一時変数を作る
    currentLyric0 = currentLyric0.slice(-12);
    if (currentLyric0.length >= 7) {
      renderLyric =
        currentLyric0.substr(0, 6) +
        "\n" +
        currentLyric0.substr(6, 6) +
        (aaSwitch ? "|" : "");
    } else {
      renderLyric = currentLyric0 + (aaSwitch ? "|" : "") + "\n";
    }
    textSize(width * 0.06);
    textLeading(width * 0.1);
    text(renderLyric, width * 0.54, height * 0.425);
    aaSwitch = beatChanged ^ aaSwitch;
  }
}

let mikuSprite1,
  nextPhrase1,
  renderLyric1 = "",
  renderLyric2 = "",
  vanishAnimated1 = false,
  appearAnimated1 = false;

function light(sx, sy, ex, ey, weight, startWeight = 0.01) {
  weight = 30;
  const len = Math.sqrt((sx - ex) * (sx - ex) + (sy - ey) * (sy - ey)),
    segment_Num = max(10, len / 1),
    segment_Len = len / segment_Num,
    weightUnit = (weight - startWeight) / segment_Num,
    c = (ex - sx) / len,
    s = (ey - sy) / len;
  for (let i = 0; i < segment_Num; i++) {
    strokeWeight(startWeight + weightUnit * i);
    line(sx, sy, sx + segment_Len * c, sy + segment_Len * s);
    sx += segment_Len * c;
    sy += segment_Len * s;
  }
}

function drawScene1() {
  const Scene = 1,
    Origin = Scene * 1.5 * width;
  drawDisplay(Scene, Origin, "#1D2558");
  stroke("black");
  strokeWeight(width / 70);
  strokeJoin(ROUND);
  fill("#263759");
  rect(Origin + width * 0.1, height * 0.1, width * 0.8, height * 0.34);
  stroke("#313f4d");
  fill("#6a879e");
  strokeJoin(MITER);
  strokeWeight(width / 100);
  quad(
    Origin + width * 0.1,
    height * 0.46,
    Origin + width * 0.16,
    height * 0.73,
    Origin + width * 0.84,
    height * 0.73,
    Origin + width * 0.9,
    height * 0.46
  );
  // ellipse(Origin + width / 2, height * 0.65, width * 0.7, height * 0.25);

  uTextDiv1.positionData = {
    x: Origin + width * 0.15,
    y: height * 0.1,
    type: "fixed",
  };
  dTextDiv1.positionData = {
    x: Origin + width * 0.15,
    y: height * 0.27,
    type: "fixed",
  };
  screenDiv1.size(width * 0.8, height * 0.34);
  lightDiv1.size(
    width - 2 * STROKE_WEIGHT,
    height * DISPLAY_RATIO - STROKE_WEIGHT
  );
  screenDiv1.positionData = {
    x: Origin + width * 0.1,
    y: height * 0.1,
    type: "fixed",
  };
  lightDiv1.positionData = {
    x: Origin + STROKE_WEIGHT,
    y: STROKE_WEIGHT,
    type: "fixed",
  };
  [...document.getElementsByClassName("z-layers")].forEach((span) => {
    span.style.transformOrigin = `${width * 0.5}px center`;
  });

  //////////////////////// ! light
  // light(Origin + 100, 100, Origin + width - 100, height - 100, 20);

  //////////////////////// ! while player playing
  drawSprite(mikuSprite1);
  drawSprites(penlightGroup);
  penlightGroup.toArray().forEach((penlight) => {
    // if (penlight.animation.getFrame() == 5) {
    //     penlight.changeImage('stop');
    // }
    if (penlight.rotation > 25 + penlight.default_rotation)
      penlight.rotationSpeed = -6;
    else if (penlight.rotation < penlight.default_rotation)
      penlight.rotationSpeed = 0;
  });
  if (!player.isPlaying) {
    mikuSprite1.setVelocity(0, 0);
    mikuSprite1.setVelocity(0, 0);
    mikuSprite1.rotation = 0;

    return;
  }

  ///////// mikuSprite
  if (beat) {
    const t = player.timer.position - beat.startTime;
    mikuSprite1.rotation = -10;
    if (beat.position == 1 || beat.position == 4) {
      mikuSprite1.setVelocity(
        width / 170 + 0.01 * (width * 2 - mikuSprite1.position.x),
        (t * 2) / beat.duration -
          1 +
          0.01 * (height * 0.57 - mikuSprite1.position.y)
      );
      mikuSprite1.mirrorX(1);
    } else {
      mikuSprite1.setVelocity(
        -width / 170 + 0.01 * (width * 2 - mikuSprite1.position.x),
        (t * 2) / beat.duration -
          1 +
          0.01 * (height * 0.57 - mikuSprite1.position.y)
      );
      mikuSprite1.mirrorX(-1);
    }
  }
  if (mikuSprite1.position.x < Origin + width * 0.16) {
    mikuSprite1.velocity.x = Math.abs(mikuSprite1.velocity.x);
  }

  if (mikuSprite1.position.x > Origin + width * 0.84) {
    mikuSprite1.velocity.x = -Math.abs(mikuSprite1.velocity.x);
  }
  if (mikuSprite1.position.y < height * 0.46) {
    mikuSprite1.velocity.y = Math.abs(mikuSprite1.velocity.y);
  }
  if (mikuSprite1.position.y > height * 0.73) {
    mikuSprite1.velocity.y = -Math.abs(mikuSprite1.velocity.y);
  }
  /////////////////////////
  if (player.video.findPhrase(player.timer.position) == null) {
    if (!nextPhrase1) {
      return;
    }
  } else if (
    !nextPhrase1 ||
    nextPhrase1 != player.video.findPhrase(player.timer.position)
  ) {
    nextPhrase1 = player.video.findPhrase(player.timer.position);
    appearAnimated1 = false;
    vanishAnimated1 = false;
    [...document.getElementsByClassName("text-copy")].forEach((e) => {
      e.style.display = "none";
    });
  }

  /// ! making text
  let filledFlag = false;
  renderLyric1 = renderLyric2 = "";

  nextPhrase1.children.forEach((word) => {
    if (
      (!filledFlag &&
        (renderLyric1 + word.text).length <= nextPhrase1.text.length / 2) ||
      nextPhrase1.text.length <= 8
    )
      renderLyric1 += word.text;
    else {
      if (!filledFlag && (word.pos == "P" || word.pos == "M"))
        renderLyric1 += word.text;
      else renderLyric2 += word.text;
      filledFlag = true;
    }
  });

  const textLength = max(renderLyric1.length, renderLyric2.length);
  [...document.getElementsByClassName("svg-text")].forEach((e) => {
    e.style.fontSize = `${min((width * 0.7) / textLength, height * 0.12)}px`;
  });

  document.getElementById("live-lyric1").textContent = renderLyric1;
  document.getElementById("live-lyric2").textContent = renderLyric2;

  /// !control Animation
  if (optMode) {
    if (!appearAnimated1 && nextPhrase1.startTime <= player.timer.position) {
      appearAnimated1 = true;
      [...document.getElementsByClassName("text-copy")].forEach((e) => {
        e.style.display = "";
      });
    }
    if (
      !vanishAnimated1 &&
      ((!nextPhrase1.next &&
        nextPhrase1.endTime <= player.timer.position + 300) ||
        (nextPhrase1.next != null &&
          nextPhrase1.next.startTime <= player.timer.position + 300))
    ) {
      vanishAnimated1 = true;
      [...document.getElementsByClassName("text-copy")].forEach((e) => {
        e.style.display = "none";
      });
    }
  } else {
    if (!appearAnimated1 && nextPhrase1.startTime <= player.timer.position) {
      appearAnimated1 = true;
      [...document.getElementsByClassName("text-copy")].forEach((e) => {
        e.classList.remove("text-copy-vanish");
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            e.classList.add("text-copy-appear");
            e.style.display = "";
          });
        });
      });
    }
    if (
      !vanishAnimated1 &&
      ((!nextPhrase1.next &&
        nextPhrase1.endTime <= player.timer.position + 300) ||
        (nextPhrase1.next != null &&
          nextPhrase1.next.startTime <= player.timer.position + 300))
    ) {
      vanishAnimated1 = true;
      [...document.getElementsByClassName("text-copy")].forEach((e) => {
        e.classList.remove("text-copy-appear");
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            e.classList.add("text-copy-vanish");
          });
        });
      });
    }
  }
}

let durationSum = 0,
  durationCnt = 0;
function scaleEase(t) {
  const x = t / 10;
  let ret = 0;

  if (0 < x && x <= 1)
    ret = pow(4, -x) * sin(((x * 3 - 1) * Math.PI) / 2) + 1 + 0.001;
  else if (beat && !optMode) {
    durationSum += beat.duration;
    durationCnt++;
    ret =
      1 + cos((millis() / (durationSum / durationCnt)) * 2 * Math.PI) * 0.05;
  } else ret = 1;
  return ret;
}

let dotsMap = new Map(),
  paintedDots = [],
  lastChar2 = null,
  id = -1,
  currentIntercept = 0,
  mapcolorID = -1,
  beatInd;
//kaito 8794de, ruka F7CEE1
const mapColors = ["#7985c7", "#cb213c", GREEN, "#ffd430", "#ecafc9"];
function drawScene2() {
  const Scene = 2,
    Origin = Scene * 1.5 * width;
  drawDisplay(Scene, Origin, "#000000");
  if (
    ////////! while playing
    player.isPlaying
  ) {
    if (beat && beat.position == beat.length) {
      const stepIntercept =
        Math.ceil(maxIntercept / ((beat.duration * 60) / 1000)) + 1;
      if (beatInd != beat.index) {
        beatInd = beat.index;
        currentIntercept = 0;
        mapcolorID++;
        mapcolorID %= mapColors.length;
      }
      for (
        let i = dotsStart[currentIntercept];
        i < dotsStart[currentIntercept + stepIntercept];
        i++
      ) {
        const dot = dots[i];
        mapGraphics.stroke(mapColors[mapcolorID]);
        mapGraphics.point(
          width * (dot[0] * 0.0009 + 0.085),
          width * (dot[1] * 0.0009 + 0.055)
        );
      }

      if (currentIntercept < maxIntercept) currentIntercept += stepIntercept;
    }

    const checkC = player.video.findChar(player.timer.position);
    let c = checkC ? checkC : lastChar2;
    paintedDots = [];
    lastChar2 = c;
    while (c && paintedDots.length < 18) {
      if (!dotsMap.has(c.startTime)) {
        dotsMap.set(c.startTime, {
          pos: dots[floor(Math.random() * dots.length)],
          scale: 0,
          id: ++id,
        });
      }
      const dotData = dotsMap.get(c.startTime);
      paintedDots.push({
        pos: dotData.pos,
        text: c.text,
        scale: scaleEase(dotData.scale++),
        id: dotsMap.size - paintedDots.length - 1,
      });
      dotsMap.set(c.startTime, dotData);
      c = c.previous;
    }
    paintedDots.sort((a, b) => {
      return a.pos[1] - b.pos[1];
    });
    // reverse paintedDots[]

    overGraphics.clear();
    overGraphics.textAlign(CENTER);
    // overGraphics.textStyle(BOLD);
    overGraphics.textFont("Kaisei Decol");
    paintedDots.forEach((dot, ind) => {
      overGraphics.strokeWeight(width * 0.0065);
      overGraphics.imageMode(CORNER);
      overGraphics.stroke("white");
      overGraphics.point(
        width * (dot.pos[0] * 0.0009 + 0.085),
        width * (dot.pos[1] * 0.0009 + 0.055)
      );
    });
    paintedDots.forEach((dot, ind) => {
      overGraphics.imageMode(CENTER);
      overGraphics.image(
        pinImg,
        width * (dot.pos[0] * 0.0009 + 0.085),
        width * (dot.pos[1] * 0.0009 + 0.05),
        width / 13 / max(0.5, dot.scale),
        (width / 6.5) * dot.scale
      );
      overGraphics.image(
        // lyrics below the map
        pinImg,
        width * (0.11 + 0.045 * (dot.id % 18)),
        width * 0.65,
        (width * 0.1) / max(0.5, dot.scale),
        width * 0.2 * dot.scale
      );
      overGraphics.fill("black");
      overGraphics.noStroke();
      overGraphics.textSize((width / 40) * dot.scale);
      overGraphics.text(
        //texts over the map
        dot.text,
        width * (dot.pos[0] * 0.0009 + 0.085),
        width * (dot.pos[1] * 0.0009 + 0.056 * (2 - dot.scale) - 0.0471)
      );
      overGraphics.textSize((width / 30) * dot.scale);
      overGraphics.text(
        //texts below the map
        dot.text,
        width * (0.11 + 0.045 * (dot.id % 18)),
        width * (0.595 + 0.056 * (2 - dot.scale) - 0.05)
      );
    });
  }
  image(mapGraphics, Origin, 0);
  image(overGraphics, Origin, 0);
}

function drawCamera() {
  const deff = (currentState * 1.5 + 0.5) * width - ghost.position.x;
  if (abs(deff) > 0 && optMode) {
    if (abs(deff) - width * 0.2 < 0) {
      ghost.position.x = (currentState * 1.5 + 0.5) * width;
      ghost.velocity.x = 0;
    } else {
      ghost.velocity.x = width * 0.2 * (deff / abs(deff));
    }
  } else {
    ghost.velocity.x = deff / 20;
  }
  camera.position.x = ghost.position.x;
  canvasX = canvas.canvas.getBoundingClientRect().x;
  canvasY = canvas.canvas.getBoundingClientRect().y;
}
function drawTextAlive() {
  beat = player.findBeat(player.timer.position);
}
function draw() {
  mouseSprite.position.x = mouseX;
  mouseSprite.position.y = mouseY;
  drawTextAlive();
  background("#FFF3E7");
  drawScene0();
  drawScene1();
  drawScene2();

  if (!navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    playButtons.toArray().forEach((button) => {
      if (!player.isPlaying)
        button.changeImage(button.mouseIsOver ? "play2" : "play1");
      else button.changeImage(button.mouseIsOver ? "pause2" : "pause1");
    });
    infoButtons.toArray().forEach((button) => {
      button.changeImage(button.mouseIsOver ? "info2" : "info1");
    });
  } else {
    playButtons.toArray().forEach((button) => {
      if (!player.isPlaying) button.changeImage("play1");
      else button.changeImage("pause1");
    });
    infoButtons.toArray().forEach((button) => {
      button.changeImage(infoDiv.hasClass("info-appear") ? "info2" : "info1");
    });
  }

  drawSprites(playButtons);
  drawSprites(infoButtons);
  drawCamera();
  doms.forEach((elm) => {
    if (!elm) return;
    elm.position(
      canvasX -
        (camera.position.x - width / 2) +
        (elm.positionData ? elm.positionData.x : 0),
      canvasY + (elm.positionData ? elm.positionData.y : 0),
      elm.positionData ? elm.positionData.type : "fixed"
    );
  });
  infoDiv.size(width * 0.7, height * 0.65);
  infoDiv.position(canvasX + width * 0.15, canvasY + width * 0.1);
  if (width * 1.9 <= camera.position.x && camera.position.x <= width * 2.1) {
    [...document.querySelectorAll(".svg-text svg")].forEach(
      (e) => (e.style.opacity = "")
    );
    doms.forEach((e) => e.show());
  } else {
    [...document.querySelectorAll(".svg-text svg")].forEach(
      (e) => (e.style.opacity = "0")
    );
    doms.forEach((e) => e.hide());
  }
  textSize(20);
}
