/* ============================================================
   PASANG FOTO & VIDEO DI SINI
   - src  : nama file / path, mis. "media/ayah.jpg" atau "media/liburan.mp4"
   - Jenis (foto/video) dikenali otomatis dari ekstensi file:
     mp4, webm, mov, m4v, ogv = video; selain itu = foto.
     Kalau perlu, paksa dengan  type: "video"  atau  type: "foto".
   - poster : (opsional, khusus video) gambar sampul sebelum diputar.
   - Kosongkan src ("") kalau belum ada file.
   - Mau tambah item? Salin satu baris { ... }, lalu tempel di bawahnya.
   ============================================================ */
var FOTO_AYAH = "foto/pipi_sendiri.jpeg";  /* foto Ayah di sampul (kosongkan "" kalau tidak ada) */

/* LAGU LATAR: isi dengan path file lagu, mis. "media/lagu.mp3".
   Lagu otomatis diputar saat tombol "Mulai" diklik (diulang terus).
   Kosongkan ("") kalau tidak mau pakai lagu. */
var LAGU = "lagu/lagu2.aac";
/* LAGU_MULAI: detik ke berapa lagu mulai diputar (mis. awal reff).
   Contoh: reff mulai di menit 1:02 -> isi 62.  Isi 0 untuk dari awal.
   Setelah lagu habis, lagu mengulang dari titik ini lagi. */
var LAGU_MULAI = 125;

var GALERI = [
  { src: "foto/foto_gunung.jpeg", cap: "First time muncak bareng pipi" },
  { src: "foto/berdua.jpeg", cap: "Best Dad" },
  { src: "video/video.mp4", cap: "Rasanya waktu nyampe puncak seneng banget ya..", type: "video", poster: "" },
  { src: "foto/bertiga.jpeg", cap: "Family Matters" },
  { src: "video/video2.mp4", cap: "Momen pipi rela cape buat menuhin wishlist aku", type: "video", poster: "" },
  { src: "foto/bertiga_lagi.jpeg", cap: "Love you all" }
];
/* ============================================================ */

(function(){
  var FLW='<use href="#flower" width="100" height="100"/>';
  var stage=document.getElementById('stage'),pages=[].slice.call(stage.querySelectorAll('.page'));
  /* bunga dikurangi: hanya 2 per halaman */
  var POS=[['top:12%;left:7%',38],['bottom:20%;right:9%',34]];
  function fl(cls,st,k){return '<svg class="fl '+cls+'" viewBox="0 0 100 100" style="'+st+';--k:'+k+'">'+FLW+'</svg>'}
  function bird(top,w,t,dl){return '<div class="bird" style="top:'+top+'%;width:'+w+'px;--t:'+t+'s;--dl:-'+dl+'s"><svg viewBox="0 0 64 32"><use href="#bird" width="64" height="32"/></svg></div>'}

  pages.forEach(function(s,i){
    var d=document.createElement('div');d.className='deco';
    var h='<svg class="br bl" viewBox="0 0 200 200"><use href="#branch" width="200" height="200"/></svg><svg class="br tr" viewBox="0 0 200 200"><use href="#branch" width="200" height="200"/></svg>';
    POS.forEach(function(p,k){h+=fl('c'+(((k+i)%3)+1),p[0]+';width:'+p[1]+'px',k)});
    h+=bird(12+i*5,34+(i%3)*6,26+i*3,3+i*5);
    if(i===0)h+=bird(30,28,36,20);
    d.innerHTML=h;s.prepend(d);
    var hd=s.querySelector('h2');
    if(hd)hd.insertAdjacentHTML('afterend','<div class="orn"><svg viewBox="0 0 100 100">'+FLW+'</svg></div>');
    s.querySelectorAll('.wrap>*').forEach(function(e,j){e.style.setProperty('--i',j)});
  });

  /* karangan bunga di bingkai sampul: 5 saja */
  var fr=document.getElementById('frame'),G=[[50,-2],[5,34],[95,34],[22,101],[78,101]],gh='';
  G.forEach(function(p,k){gh+=fl('g c'+((k%3)+1),'left:'+p[0]+'%;top:'+p[1]+'%;width:'+(k%2?24:30)+'px',k)});
  fr.insertAdjacentHTML('beforeend',gh);

  /* rasio bingkai mengikuti ukuran asli media (dibatasi agar tidak terlalu panjang/lebar) */
  function R(w,h){return w&&h?Math.min(Math.max(w/h,.5),2.2):.8}
  /* pasang rasio ke bingkai */
  function fit(p,w,h){p.style.aspectRatio=R(w,h)}

  /* foto Ayah (dari kode) */
  if(FOTO_AYAH){
    var in0=document.getElementById('in0');in0.textContent='';
    var im=document.createElement('img');im.alt='Foto Ayah';
    im.onload=function(){fr.style.setProperty('--r',R(im.naturalWidth,im.naturalHeight))};
    im.src=FOTO_AYAH;in0.appendChild(im);
  }

  /* kelopak jatuh */
  var P=document.getElementById('petals'),cols=['var(--p1)','var(--p2)','var(--p3)'];
  for(var n=0;n<9;n++){
    var t=document.createElement('i');t.className='pt';
    t.style.cssText='--x:'+(Math.random()*100)+'%;--s:'+(8+Math.random()*8)+'px;--c:'+cols[n%3]+';--d:'+(14+Math.random()*12)+'s;--dl:-'+(Math.random()*20)+'s;--dx:'+(Math.random()*160-80)+'px';
    P.appendChild(t);
  }

  /* galeri: foto & video (dari kode) */
  var gal=document.getElementById('gal'),VID=/\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;
  GALERI.forEach(function(g,i){
    var f=document.createElement('figure');f.className='ph';f.style.setProperty('--i',i);
    var p=document.createElement('div');p.className='pic';
    var isVid=g.type?g.type==='video':VID.test(g.src||'');
    if(g.src&&isVid){
      var v=document.createElement('video');v.src=g.src;v.controls=true;v.playsInline=true;v.preload='metadata';
      if(g.poster)v.poster=g.poster;
      v.onloadedmetadata=function(){fit(p,v.videoWidth,v.videoHeight)};
      v.onplay=musicDuck;v.onpause=v.onended=musicRestore; /* musik berhenti sementara saat video diputar */
      v.setAttribute('aria-label',g.cap);p.appendChild(v);
    }else if(g.src){
      var im=document.createElement('img');im.alt=g.cap;
      im.onload=function(){fit(p,im.naturalWidth,im.naturalHeight)};
      im.src=g.src;p.appendChild(im);
    }else p.textContent=isVid?'Video belum dipasang':'Foto belum dipasang';
    var c=document.createElement('figcaption');c.textContent=g.cap;
    f.appendChild(p);f.appendChild(c);gal.appendChild(f);
  });

  /* lagu latar */
  var mbtn=document.getElementById('music'),bgm=null,wantMusic=true,ducked=false;
  if(LAGU){bgm=new Audio(LAGU);bgm.preload='auto';bgm.volume=.7;
    bgm.addEventListener('ended',function(){seekStart();bgm.play().catch(function(){})}) /* ulang dari reff */}
  function seekStart(){if(LAGU_MULAI>0){try{bgm.currentTime=LAGU_MULAI}catch(e){}}}
  function fadeIn(){bgm.volume=0;var v=0,t=setInterval(function(){v+=.05;if(v>=.7){v=.7;clearInterval(t)}bgm.volume=v},120)}
  function musicUI(){mbtn.classList.toggle('off',!bgm||bgm.paused)}
  function musicStart(){
    if(!bgm)return;
    mbtn.hidden=false;requestAnimationFrame(function(){mbtn.classList.add('show')});
    wantMusic=true;
    if(bgm.readyState>=1)seekStart();else bgm.addEventListener('loadedmetadata',seekStart,{once:true});
    fadeIn();
    var pr=bgm.play();if(pr&&pr.catch)pr.catch(function(){});
    musicUI();
  }
  function musicDuck(){if(bgm&&!bgm.paused){bgm.pause();ducked=true;musicUI()}}
  function musicRestore(){if(bgm&&ducked){ducked=false;if(wantMusic)bgm.play().catch(function(){});musicUI()}}
  mbtn.onclick=function(){
    if(!bgm)return;
    if(bgm.paused){wantMusic=true;ducked=false;bgm.play().catch(function(){})}else{wantMusic=false;bgm.pause()}
    musicUI();
  };
  if(bgm){bgm.addEventListener('play',musicUI);bgm.addEventListener('pause',musicUI)}

  /* navigasi */
  var cur=0,lock=false,dots=document.getElementById('dots'),prev=document.getElementById('prev'),next=document.getElementById('next');
  pages.forEach(function(_,i){
    var b=document.createElement('button');b.setAttribute('aria-label','Halaman '+(i+1));
    b.onclick=function(){go(i)};dots.appendChild(b);
  });
  function ui(){
    [].forEach.call(dots.children,function(b,i){b.classList.toggle('on',i===cur)});
    prev.disabled=cur===0;next.disabled=cur===pages.length-1;
  }
  function burst(){
    var cs=['var(--p1)','var(--p2)','var(--p3)'];
    for(var i=0;i<10;i++){
      var a=Math.random()*6.283,r=30+Math.random()*30,b=document.createElement('i');b.className='burst';
      b.style.cssText='--c:'+cs[i%3]+';--bx:'+(Math.cos(a)*r)+'vmax;--by:'+(Math.sin(a)*r)+'vmax';
      stage.appendChild(b);(function(x){setTimeout(function(){x.remove()},1300)})(b);
    }
  }
  function go(n){
    if(lock||n<0||n>=pages.length||n===cur)return;
    lock=true;stage.dataset.dir=n>cur?'next':'prev';
    var o=pages[cur],w=pages[n];
    [].forEach.call(o.querySelectorAll('video'),function(v){v.pause()}); /* hentikan video saat pindah halaman */
    w.scrollTop=0;w.classList.add('act','in');o.classList.add('out');
    burst();cur=n;ui();
    setTimeout(function(){o.classList.remove('act','out');w.classList.remove('in');lock=false},1000);
  }
  prev.onclick=function(){go(cur-1)};next.onclick=function(){go(cur+1)};
  document.getElementById('start').onclick=function(){musicStart();go(1)};
  ui();

  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='VIDEO')return; /* biarkan kontrol video memakai tombol panah */
    if(['ArrowRight','ArrowDown','PageDown'].indexOf(e.key)>-1)go(cur+1);
    if(['ArrowLeft','ArrowUp','PageUp'].indexOf(e.key)>-1)go(cur-1);
  });
  var sx=0,sy=0,onVid=false;
  stage.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;onVid=e.target.tagName==='VIDEO'},{passive:true});
  stage.addEventListener('touchend',function(e){
    if(onVid)return; /* geser di video = atur durasi, bukan pindah halaman */
    var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)go(cur+(dx<0?1:-1));
  },{passive:true});
  stage.addEventListener('wheel',function(e){
    var p=pages[cur];if(lock||Math.abs(e.deltaY)<25||p.scrollHeight>p.clientHeight+4)return;
    go(cur+(e.deltaY>0?1:-1));
  },{passive:true});
})();