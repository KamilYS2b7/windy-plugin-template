<script lang="ts">
// @ts-nocheck
/// <reference types="@windycom/plugin-devtools" />

import { onMount, onDestroy } from 'svelte';
import { map } from '@windy/map';
// @ts-ignore
declare const L: any;

/* ======= KONFIG ======= */
const zoomIconsOnly   = 10;   // daleki zoom: tylko ikonki
const minZoomToShow   = 12;   // średni zoom: etykiety
const faceOpacity     = 0.35; // przezroczystość tarczy
const collisionPadPx  = 2;    // bufor między rozetami (px)

// viewport/filter
const VIEWPORT_PAD_PX = 200;  // px bufora poza ekranem dla płynnego dociągania

/* łuki/animacje */
const GREEN_SW        = 10;
const RED_SW          = 5;
const GREEN_ANIM_MS   = 700;
const GREEN_PRE_LAG   = 140;
const RED_ANIM_MS     = 700;
const RED_START_SLACK = 60;

/* ======= LOKALIZACJE (prosty tekst) ======= */
const spotText = `
//
Big Colin
Location: 54.802333, -6.084265
Wind 145-180
Youtube: https://www.youtube.com/watch?v=K7tf7oSZNX8
Youtube: https://www.youtube.com/watch?v=USrytG5HsqY
Youtube: https://www.youtube.com/watch?v=bOvpQom5Z3Y
//
Dungiven
Location: 54.934995, -6.866763
Wind 220-290
Youtube: https://www.youtube.com/watch?v=XFIMLCErd-U
//
Dungiven NW
Location: 54.945514, -6.873402
Wind 300-340
Youtube:
//
Dungiven Boviel
Location: 54.919836, -6.850042
Wind 190-240
Youtube:https://www.youtube.com/watch?v=_dIO9i3QWGk
//
Mayobridge
Location: 54.170498, -6.192803
Wind 270-340
Youtube:https://www.youtube.com/watch?v=ThiWoi7RIxw
//
Slemish
Location: 54.881227, -6.097416
Wind 240-260
Youtube:https://www.youtube.com/watch?v=E8FT39Lmpjk
//
Skerrywhirry
Location: 54.834742, -5.998588
Wind 220-260
Youtube:https://www.youtube.com/watch?v=rrk76rOGhGY
//
Skeagh
Location: 54.886143, -5.971930
Wind 80-230
Youtube:
//
Agnews
Location: 54.844659, -5.932023
Wind 40-110
Youtube:https://www.youtube.com/watch?v=dSBLEpb9q6U
//
Robin Youngs
Location: 54.891851, -5.916308
Wind 0-60
Youtube:https://www.youtube.com/watch?v=Py5EDPiIZ1w
//
Shanes Hill
Location: 54.819792, -5.927578
Wind 60-120
Youtube:
//
Knockagh Monument
Location: 54.711187, -5.879283
Wind 110-180
Youtube:https://www.youtube.com/watch?v=TC1hpoydJ6Y
//
Divis
Location: 54.605172, -5.998758
Wind 40-120
Youtube:https://www.youtube.com/watch?v=bbJ7mJLHcqM
//
Mayobridge North
Location: 54.170883, -6.182196
Wind 340-20
Youtube:
//
Spelga
Location: 54.188606, -6.065619
Wind 290-340
Youtube:https://www.youtube.com/watch?v=ZtQLQRCCRFQ
//
Carlingford
Location: 54.032794, -6.205849
Wind 60-100
Youtube:https://www.youtube.com/watch?v=M8c4oCXRZ0U
//
Barnevave
Location: 54.025038, -6.204715
Wind 240-270
Youtube:https://www.youtube.com/watch?v=4340ALozBOo
//
Clermont Carn
Location: 54.078550, -6.319776
Wind 165-200
Youtube:https://www.youtube.com/watch?v=AotkCwwkYZo
//
Slieve Gullion
Location: 54.129181, -6.443139
Wind 230-280
Youtube:https://www.youtube.com/watch?v=FnOApdHAde4
//
Slieve Gullion S
Location: 54.121027, -6.434222
Wind 190-210
Youtube:https://www.youtube.com/watch?v=iQP6Q-KNC24
//
Slieveban
Location: 54.083209, -6.165797
Wind 195-245
Youtube:https://www.youtube.com/watch?v=ERI8Bu7wMAc&t=7s
//
Slieve Binnian East
Location: 54.140269, -5.972614
Wind 175-210
Youtube:https://www.youtube.com/watch?v=2YxPg1jXPRU
//
Slieve Meelmore
Location: 54.199431, -6.006449
Wind 350-45
Youtube:https://www.youtube.com/watch?v=XEufb-mxmf0
//
Hen mountain
Location: 54.182433, -6.097136
Wind 260-300
Youtube:
//
Ometh
Location: 54.085152, -6.301297
Wind 60-95
Youtube:
//
Castle Roche
Location: 54.045962, -6.487850
Wind 205-245
Youtube:https://www.youtube.com/watch?v=z9IoTej_4MQ&t=130s
//
White Mountain W
Location: 54.863579, -6.851828
Wind 260-330
Youtube:https://www.youtube.com/watch?v=Bbr_EOHZNVY
//
White Mountain S
Location: 54.848923, -6.849018
Wind 155-230
Youtube:
//
Craigagh Hill
Location: 54.831109, -6.884755
Wind 90-130
Youtube:
//
Coolnasillagh
Location: 54.849832, -6.785004
Wind 120-150
Youtube:https://www.youtube.com/watch?v=ePU5OCOZ8Hs
//
Magilligan Hells Hole
Location: 55.138244, -6.884943
Wind 270-330
Youtube:https://www.youtube.com/watch?v=oYMbucOBkrw
//
Magilligan N
Location: 55.153811, -6.872439
Wind 290-360
Youtube:https://www.youtube.com/watch?v=YhpfmynQlTg
//
Torr Head
Location: 55.199925, -6.095361
Wind 30-60
Youtube:https://www.youtube.com/watch?v=qxVZLUWeCPI
//
White Park Bay
Location: 55.229423, -6.394838
Wind 315-360
Youtube:
//
Lurigethan
Location: 55.058276, -6.090163
Wind 305-335
Youtube:
//
Slieve Croob
Location: 54.339965, -5.973334
Wind 1-360
Youtube:
//
Buncrana
Location: 55.096366, -7.468954
Wind 270-335
Youtube:https://www.youtube.com/watch?v=BVrlsPU9FIs
Youtube:https://www.youtube.com/watch?v=3vMtDM-sIVs
ss
//
Portsalon
Location: 55.182947, -7.593076
Wind 290-330
Youtube:https://www.youtube.com/watch?v=fkdph_G9HQ8
//
Leenakeel Bay Beach
Location: 55.241737, -7.519642
Wind 230-250
Youtube:
//
Tullagh Strand
Location: 55.281352, -7.443092
Wind 330-45
Youtube:
//
Five Finger Strand
Location: 55.320426, -7.331312
Wind 240-290
Youtube:https://www.youtube.com/watch?v=L7r0AVohGxE
//
Tramore
Location: 55.168727, -7.827578
Wind 260-310
Youtube:
//
Dooey Beach
Location: 54.870663, -8.384738
Wind 255-300
Youtube:
//
White Rock Beach
Location: 55.206472, -6.614547
Wind 350-45
Youtube:https://www.youtube.com/watch?v=1GdWi4vI5C0
//
Muckish N
Location: 55.106324, -7.993092
Wind 330-15
Youtube:https://www.youtube.com/watch?v=UnmAKvqail4
//
Ballinreavy Strand
Location: 54.801462, -8.469882
Wind 200-270
Youtube:https://www.youtube.com/watch?v=BKi3SUB5hus
//
Tullan Strand
Location: 54.497779, -8.265295
Wind 260-310
Youtube:https://www.youtube.com/watch?v=n1aliUOTjMA
//
Cliffony Bay Beach
Location: 54.439267, -8.467590
Wind 250-320
Youtube:https://www.youtube.com/watch?v=eyJ7STciBRs&t=100s
//
Ben Bulben
Location: 54.364021, -8.490841
Wind 310-350
Youtube:https://www.youtube.com/watch?v=xQ021km1hs4
//
Dunany Co. Louth Ireland
Location: 53.857195, -6.244373
Wind 90-140
Youtube:https://www.youtube.com/watch?v=zdIddTiBN9w&t=147s
//
Gormanston
Location: 53.644512, -6.218042
Wind 50-100
Youtube:https://www.youtube.com/watch?v=sncqGk1DEgU
//
Ardgillan Demesne Bay Beach
Location: 53.593771, -6.157086
Wind 35-90
Youtube:https://www.youtube.com/watch?v=AT-he6Wo0aA
//
Killiney Hill Park
Location: 53.265444, -6.111444
Wind 90-150
Youtube:https://www.youtube.com/watch?v=7cmeyWkw2SY&t=12s
//
Great Sugar Loaf
Location: 53.153975, -6.150266
Wind 150-270
Youtube:https://www.youtube.com/watch?v=E8b95uvg4dg
//
Lough Tay View Point
Location: 53.113555, -6.263583
Wind 200-250
Youtube:https://www.youtube.com/watch?v=C3JIJko9MXI
//
Lough Tay S
Location: 53.102881, -6.257138
Wind 270-330
Youtube:https://www.youtube.com/watch?v=ACu-Oz1yS3s
//
Tonelagee
Location: 53.047467, -6.391189
Wind 140-210
Youtube:https://www.youtube.com/watch?v=nZXAFIzD5FY
//
Lough Bray Upper
Location: 53.175377, -6.305293
Wind 30-90
Youtube:https://www.youtube.com/watch?v=v-AD3FtxDSw
//
Lough Bray Lower
Location: 53.189136, -6.307998
Wind 135-155
Youtube:https://www.youtube.com/watch?v=L2Q73KwdM6U
//
Kilbeg
Location: 53.129958, -6.446629
Wind 260-310
Youtube:https://www.youtube.com/watch?v=hxmeR_plTP0
//
Sorrel Hill
Location: 53.144645, -6.445282
Wind 190-220
Youtube:https://www.youtube.com/watch?v=9poWNaG34Rc
//
Croghan Mountain
Location: 52.793814, -6.332727
Wind 155-190
Youtube:https://www.youtube.com/watch?v=wU-79q1jqjs
//
Annagh Hill
Location: 52.752024, -6.370525
Wind 120-170
Youtube:https://www.youtube.com/watch?v=Hoj1Pxfn7-g
//
Slieve Bui
Location: 52.658136, -6.475468
Wind 110-170
Youtube:https://www.youtube.com/watch?v=qN-Pk9SMDSU
//
Mount Leinster
Location: 52.616587, -6.779473
Wind 180-270
Youtube:https://www.youtube.com/watch?v=42zWDHP3Jyg
//
Blackstairs
Location:52.532022, -6.842373
Wind 290-330
Youtube:https://www.youtube.com/watch?v=WHULL74xYfk
//
Blackwater
Location:52.463019, -6.296025
Wind 90-140
Youtube:https://www.youtube.com/watch?v=9aJ19osqRVk
//
Knocknasilloge Bay Beach
Location:52.450102, -6.307974
Wind 90-140
Youtube:https://www.youtube.com/watch?v=0rq_vsyj6C4
//
Old Head of Kinsale
Location:51.619034, -8.545797
Wind 210-240
Youtube:https://www.youtube.com/watch?v=ox1Bg-8J9C8&t=65s
//
Inchydoney Beach
Location:51.599029, -8.858881
Wind 140-180
Youtube:https://www.youtube.com/watch?v=OlnKeloOBBY
//
Knocknagantee
Location:51.894073, -9.935079
Wind 130-200
Youtube:https://www.youtube.com/watch?v=_1EW0QJJL8U
//
Rossbeigh Mountain
Location:52.047600, -9.981986
Wind 320-360
Youtube:https://www.youtube.com/watch?v=Hm1c3ZE6PKM
//
Binn Fhaiche
Location:52.238595, -10.223504
Wind 120-170
Youtube:https://www.youtube.com/watch?v=oVQLUvJux9c
Youtube:https://www.youtube.com/watch?v=Z1OFQowXKCc
//
Stradbally Beach
Location:52.254627, -10.071163
Wind 290-330
Youtube:https://www.youtube.com/watch?v=bCrE_fxpP34
//
Fanore
Location:53.113834, -9.273628
Wind 270-310
Youtube:https://www.youtube.com/watch?v=tgpD4n1k3_E&t=131
//
Atlantic Drive
Location:53.897575, -9.992084
Wind 190-230
Youtube:https://www.youtube.com/watch?v=97WZrBFQCIw
//
Minaun Heights
Location:53.954746, -10.025487
Wind 100-160
Youtube:https://www.youtube.com/watch?v=Z2GIbs178Pg
//
Keel Bay
Location:53.962694, -10.046897
Wind 230-260
Youtube:https://www.youtube.com/watch?v=eiS9Y9HaeyY
//
Cliffs of Magho
Location:54.467065, -7.909476
Wind 330-30
Youtube:https://www.youtube.com/watch?v=Eb_9LW0n9vw
//
Ballingarraun
Location:52.175008, -10.194766
Wind 160-210
Youtube:https://www.youtube.com/watch?v=OG_peDzN3AQ
//
Cave Hill
Location:54.648056, -5.948841
Wind 60-140
Youtube:https://www.youtube.com/watch?v=QTLmrnX6wiQ
//
Smerwick
Location:52.151989, -10.349716
Wind 290-330
Youtube:https://www.youtube.com/watch?v=QTLmrnX6wiQ
`;

/* ======= TYPY / STAN ======= */
type Spot = {
  id:string; name:string; lat:number; lon:number;
  sectorStart:number; sectorEnd:number;
  youtube: string[];
};
let spots: Spot[] = [];
let dialMarkers: any[] = [];       // rozety (niższy pane)
let uiMarkers: any[] = [];         // przyciski/menu (wyższy pane)
let labelTips: any[] = [];         // etykiety (najwyższy pane)
let ytOnlyMarkers: any[] = [];     // ikonki YT dla dalekiego zoomu

const paneDial   = 'windRosePane';
const paneUi     = 'windRoseUiPane';
const paneLabels = 'windRoseLabelsPane';

// „kto był rozetą w poprzednim renderze” — do sterowania animacją
let lastDialVisible = new Set<string>();

/* ======= PARSER ======= */
function parseSpots(txt:string): Spot[] {
  const lines = txt.split('\n').map(l => l.trim());
  const out: Spot[] = [];
  for (let i=0; i<lines.length; i++){
    if (lines[i] !== '//') continue;
    const block:string[] = [];
    let k = i+1;
    while (k < lines.length && lines[k] !== '//') {
      if (lines[k]) block.push(lines[k]);
      k++;
    }
    const name = block[0] || '';
    const locLine  = block.find(l => /^Location:/i.test(l)) || '';
    const windLine = block.find(l => /^Wind\b/i.test(l))     || '';
    const loc  = locLine.match(/Location:\s*([-\d.]+)\s*,\s*([-\d.]+)/i);
    const wind = windLine.match(/Wind\s+(\d+)\s*-\s*(\d+)/i);
    const ytAll = block
      .filter(l => /^Youtube\b/i.test(l))
      .map(l => l.match(/Youtube:\s*(\S+)/i)?.[1])
      .filter((u): u is string => !!u);
    if (name && loc && wind) {
      out.push({
        id: `${name}-${out.length}`,
        name,
        lat: parseFloat(loc[1]),
        lon: parseFloat(loc[2]),
        sectorStart: parseInt(wind[1],10),
        sectorEnd:   parseInt(wind[2],10),
        youtube: ytAll
      });
    }
    i = k-1;
  }
  return out;
}

/* ======= GEOMETRIA ======= */
function normDeg(d:number){ return ((d%360)+360)%360; }
function sweepDeg(start:number, end:number){
  let s=normDeg(start), e=normDeg(end);
  let sw = e - s; if (sw <= 0) sw += 360;
  return { s, e, sw };
}
function arcPath(r:number, startDeg:number, endDeg:number){
  const { s, sw } = sweepDeg(startDeg, endDeg);
  const large = sw > 180 ? 1 : 0;
  const p = (deg:number)=> {
    const rad = (deg - 90)*Math.PI/180;
    return { x: r*Math.cos(rad), y: r*Math.sin(rad) };
  };
  const p0 = p(s), p1 = p(s+sw);
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`;
}
function complementArcPath(r:number, startDeg:number, endDeg:number){
  const { s, e } = sweepDeg(startDeg, endDeg);
  return arcPath(r, e, s); // łuk uzupełniający
}
function sizeForZoom(z:number){
  const zz = Math.max(7, Math.min(16, z || 10));
  return Math.round(160 + (zz - 10) * 18);
}
function buildCollisionComponentsAtZoom(spots: Spot[], targetZoom: number, diameterPx: number, paddingPx: number){
  const n = spots.length;
  const thresh = diameterPx + paddingPx;
  const pts = spots.map(s => map.project(L.latLng(s.lat, s.lon), targetZoom));
  const adj: number[][] = Array.from({length:n}, ()=>[]);
  for (let i=0;i<n;i++){
    for (let j=i+1;j<n;j++){
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      if (Math.hypot(dx,dy) < thresh) { adj[i].push(j); adj[j].push(i); }
    }
  }
  const seen = Array(n).fill(false);
  const comps: number[][] = [];
  for (let i=0;i<n;i++){
    if (seen[i]) continue;
    const q=[i]; seen[i]=true; const comp=[i];
    while (q.length){
      const v=q.shift()!;
      for (const w of adj[v]) if (!seen[w]){ seen[w]=true; q.push(w); comp.push(w); }
    }
    comps.push(comp);
  }
  return { comps };
}

/* ======= STAGGER ======= */
function staggerDelayMs(spot: Spot){
  const v = Math.abs(Math.sin(spot.lat*12.9898 + spot.lon*78.233)) % 1;
  const steps = Math.round(v * 5); // 0..5
  return steps * 40;               // 0–200ms
}

/* ======= GOOGLE MAPS LINK ======= */
function gmapsDirectionsUrl(spot: Spot){
  const dest = `${spot.lat},${spot.lon}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving`;
}

/* ======= ROZETA (HTML) ======= */
function buildDialHTML(spot:Spot, D:number, animate:boolean){
  const R = D/2, cx = R, cy = R;
  const ringR = R*0.985, faceR = R*0.975;
  const arcGapPx = 2;
  const arcR = ringR - (GREEN_SW/2) - arcGapPx;

  const tickOuter = R*0.97, tick10 = R*0.89, tick2 = R*0.94, tick30 = R*0.85;
  const labelR = R*0.74, cardR = R*0.58;

  const okArc   = arcPath(arcR, spot.sectorStart, spot.sectorEnd);           // zielony
  const restArc = complementArcPath(arcR, spot.sectorStart, spot.sectorEnd); // czerwony

  const ticks2  = Array.from({length:180},(_,i)=>i*2);
  const ticks10 = Array.from({length:36}, (_,i)=>i*10);
  const ticks30 = Array.from({length:12}, (_,i)=>i*30);

  const mkTick = (deg:number, inner:number, outer:number, cls:string)=>{
    const a=(deg-90)*Math.PI/180;
    const x1=cx+inner*Math.cos(a), y1=cy+inner*Math.sin(a);
    const x2=cx+outer*Math.cos(a), y2=cy+outer*Math.sin(a);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  };
  const t2  = ticks2 .map(d=> d%10? mkTick(d,tick2 ,tickOuter,'tick2'): '').join('');
  const t10 = ticks10.map(d=> d%30? mkTick(d,tick10,tickOuter,'tick10'): '').join('');
  const t30 = ticks30.map(d=> mkTick(d,tick30,tickOuter,'tick30')).join('');
  const labels30 = ticks30.map(d=>{
    const a=(d-90)*Math.PI/180, lx=cx+labelR*Math.cos(a), ly=cy+labelR*Math.sin(a);
    const extra = d===270 ? 'W' : d===90 ? 'E' : '';
    return `<text x="${lx}" y="${ly}" transform="rotate(${d} ${lx} ${ly})" text-anchor="middle" dominant-baseline="central" class="deg">${d}${extra}</text>`;
  }).join('');

  const cross = `
    <line x1="${cx}" y1="${cy - R*0.85}" x2="${cx}" y2="${cy + R*0.85}" class="axis"/>
    <line x1="${cx - R*0.85}" y1="${cy}" x2="${cx + R*0.85}" y2="${cy}" class="axis"/>
  `;
  const cards = `
    <text x="${cx}" y="${cy - cardR}"  text-anchor="middle" class="card">N</text>
    <text x="${cx + cardR}" y="${cy}"  text-anchor="middle" dominant-baseline="middle" class="card">E</text>
    <text x="${cx}" y="${cy + cardR}"  text-anchor="middle" class="card">S</text>
    <text x="${cx - cardR}" y="${cy}"  text-anchor="middle" dominant-baseline="middle" class="card">W</text>
  `;

  const animClasses = animate ? ' animate-pre animate-arm' : '';

  return `
  <div class="wr wr-dial${animClasses}" data-spot-id="${spot.id}">
    <svg width="${D}" height="${D}" viewBox="0 0 ${D} ${D}" class="dial">
      <circle cx="${cx}" cy="${cy}" r="${ringR}" class="ring"/>
      <circle cx="${cx}" cy="${cy}" r="${faceR}" class="face" style="fill-opacity:${faceOpacity}"/>

      <!-- CZERWONY łuk (uzupełnienie) — animowany, cieńszy -->
      <g transform="translate(${cx},${cy})">
        <path d="${restArc}" class="rest-arc draw-arc-red" style="stroke-width:${RED_SW}px"/>
      </g>

      <!-- ZIELONY łuk (zakres OK) — animowany -->
      <g transform="translate(${cx},${cy})">
        <path d="${okArc}" class="use-arc draw-arc" style="stroke-width:${GREEN_SW}px"/>
      </g>

      ${cross}
      ${t2}${t10}${t30}
      ${labels30}
      ${cards}

      <circle cx="${cx}" cy="${cy}" r="${Math.max(3, D*0.02)}" class="center"/>
    </svg>
    <div class="title">${spot.name}</div>
  </div>`;
}

/* ======= MENU YT + MAPS + (NOWE) INFO ======= */
function buildMenuHTML(spot:Spot, D:number){
  const R = D/2, cx = R, cy = R;
  const BTN_SIZE = 26;
  const GAP_PX   = 8;

  // YouTube – 45°
  const ytAngleDeg   = 45;
  const ytRadius     = R * 0.46;
  const ytRad        = (ytAngleDeg - 90) * Math.PI / 180;
  const ytX          = cx + ytRadius * Math.cos(ytRad) - BTN_SIZE/2;
  const ytY          = cy + ytRadius * Math.sin(ytRad) - BTN_SIZE/2;

  // Google Maps – 315°
  const mapAngleDeg  = 315;
  const mapRadius    = R * 0.46;
  const mapRad       = (mapAngleDeg - 90) * Math.PI / 180;
  const mapX         = cx + mapRadius * Math.cos(mapRad) - BTN_SIZE/2;
  const mapY         = cy + mapRadius * Math.sin(mapRad) - BTN_SIZE/2;

  // (NOWE) INFO – 225° (3. ćwiartka)
  const infoAngleDeg = 225;
  const infoRadius   = R * 0.46;
  const infoRad      = (infoAngleDeg - 90) * Math.PI / 180;
  const infoX        = cx + infoRadius * Math.cos(infoRad) - BTN_SIZE/2;
  const infoY        = cy + infoRadius * Math.sin(infoRad) - BTN_SIZE/2;

  const hasMenu   = (spot.youtube?.length || 0) > 1;
  const urlsMain  = spot.youtube?.[0];
  const urlsRest  = (spot.youtube || []).slice(1, 8);

  const submenu = hasMenu ? `
    <div class="yt-sub" role="menu" aria-label="Więcej filmów">
      ${urlsRest.map((u, i)=>`
        <a class="yt-btn yt-subitem" role="menuitem"
           href="${u}" target="_blank" rel="noopener noreferrer"
           title="YouTube #${i+2}: ${spot.name}">
          <svg viewBox="0 0 24 24" width="calc(var(--yt-size) - 6px)" height="calc(var(--yt-size) - 6px)" aria-hidden="true">
            <rect x="2" y="6" width="20" height="12" rx="3" ry="3"></rect>
            <polygon points="10,9 16,12 10,15"></polygon>
          </svg>
        </a>
      `).join('')}
    </div>
  ` : '';

  const ytMenu = urlsMain ? `
    <div class="yt-menu"
         style="left:${ytX}px; top:${ytY}px; --yt-size:${BTN_SIZE}px; --yt-gap:${GAP_PX}px"
         data-spot-id="${spot.id}">
      <a class="yt-btn yt-main" href="${urlsMain}" target="_blank" rel="noopener noreferrer"
         title="Otwórz YouTube: ${spot.name}" aria-haspopup="${hasMenu?'menu':'false'}" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="calc(var(--yt-size) - 2px)" height="calc(var(--yt-size) - 2px)" aria-hidden="true">
          <rect x="2" y="6" width="20" height="12" rx="3" ry="3"></rect>
          <polygon points="10,9 16,12 10,15"></polygon>
        </svg>
        ${hasMenu ? '<span class="caret" aria-hidden="true"></span>' : ''}
      </a>
      ${submenu}
    </div>
  ` : '';

  const mapsUrl = gmapsDirectionsUrl(spot);
  const mapsMenu = `
    <div class="gmaps-menu"
         style="left:${mapX}px; top:${mapY}px; --gm-size:${BTN_SIZE}px"
         data-spot-id="${spot.id}">
      <a class="gmaps-btn gmaps-main"
         href="${mapsUrl}" target="_blank" rel="noopener noreferrer"
         title="Nawiguj do: ${spot.name}">
        <svg viewBox="0 0 24 24" width="calc(var(--gm-size) - 2px)" height="calc(var(--gm-size) - 2px)" aria-hidden="true">
          <path d="M12 2c-3.3 0-6 2.65-6 5.92 0 4.43 6 13.16 6 13.16s6-8.73 6-13.16C18 4.65 15.3 2 12 2zm0 8.3a2.38 2.38 0 1 1 0-4.76 2.38 2.38 0 0 1 0 4.76z"/>
        </svg>
      </a>
    </div>
  `;

  /* (NOWE) — zwykły przycisk Info, na razie bez działania */
  const infoMenu = `
    <div class="info-menu"
         style="left:${infoX}px; top:${infoY}px; --info-size:${BTN_SIZE}px"
         data-spot-id="${spot.id}">
      <button class="info-btn info-main" type="button" title="Info: ${spot.name}">
        <svg viewBox="0 0 24 24" width="calc(var(--info-size) - 2px)" height="calc(var(--info-size) - 2px)" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <rect x="11" y="10" width="2" height="7" rx="1"></rect>
          <rect x="11" y="6"  width="2" height="2" rx="1"></rect>
        </svg>
      </button>
    </div>
  `;

  return `
    <div class="wr wr-ui" style="width:${D}px; height:${D + 24}px" data-spot-id="${spot.id}">
      ${ytMenu || '' }
      ${mapsMenu}
      ${infoMenu}
    </div>
  `;
}

/* ======= ANIMACJE ======= */
function runDialAnimation(marker:any, delay:number, spotId:string){
  const root = marker.getElement?.() as HTMLElement;
  if (!root) return;

  const dialWrap = root.querySelector('.wr-dial') as HTMLElement;
  if (!dialWrap || !dialWrap.classList.contains('animate-pre')) return;

  // wejście wrappera
  dialWrap.getBoundingClientRect();
  requestAnimationFrame(() => {
    setTimeout(() => dialWrap.classList.remove('animate-pre'), delay);
  });

  const green = root.querySelector('.draw-arc') as SVGPathElement;
  const red   = root.querySelector('.draw-arc-red') as SVGPathElement;

  const prepDash = (el: SVGPathElement | null) => {
    if (!el || typeof el.getTotalLength !== 'function') return null;
    const len = el.getTotalLength();
    el.style.transition = 'none';
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    return len;
  };

  const lenG = prepDash(green);
  const lenR = prepDash(red);

  const greenStartAt = delay + GREEN_PRE_LAG;
  if (lenG !== null){
    setTimeout(() => {
      requestAnimationFrame(() => {
        green!.style.transition = `stroke-dashoffset ${GREEN_ANIM_MS}ms ease`;
        green!.style.strokeDashoffset = '0';
      });
    }, greenStartAt);
  }

  const startRed = () => {
    if (lenR === null) return;
    requestAnimationFrame(() => {
      red!.style.transition = `stroke-dashoffset ${RED_ANIM_MS}ms ease`;
      red!.style.strokeDashoffset = '0';
    });
  };

  if (green){
    let redLaunched = false;
    const onEnd = (ev: TransitionEvent) => {
      if (ev.propertyName === 'stroke-dashoffset' && !redLaunched){
        redLaunched = true;
        green.removeEventListener('transitionend', onEnd);
        startRed();
      }
    };
    green.addEventListener('transitionend', onEnd);

    // Fallback
    setTimeout(() => {
      if (!redLaunched){
        redLaunched = true;
        green.removeEventListener('transitionend', onEnd);
        startRed();
      }
    }, greenStartAt + GREEN_ANIM_MS + RED_START_SLACK);
  }
}

function triggerYoutubePop(spotId:string){
  const root = document.querySelector(`[data-spot-id="${spotId}"]`) as HTMLElement | null;
  if (!root) return;
  const btns = root.querySelectorAll('.yt-main, .gmaps-main') as NodeListOf<HTMLElement>;
  btns.forEach(btn => {
    btn.classList.remove('pop-spin'); void btn.offsetWidth; btn.classList.add('pop-spin');
  });
}

/* ======= „Wynoszenie” etykiety ======= */
function elevateTooltip(tip:any){
  const el = tip.getElement?.();
  if (!el) return;
  el.style.pointerEvents = 'auto';
  const toTop = () => {
    const parent = el.parentElement;
    if (parent && parent.lastElementChild !== el) parent.appendChild(el);
    el.classList.add('is-top');
    el.style.zIndex = '999999';
  };
  const toNormal = () => {
    el.classList.remove('is-top');
    el.style.zIndex = '';
  };
  el.addEventListener('mouseenter', toTop);
  el.addEventListener('mouseleave', toNormal);
  el.addEventListener('focusin',   toTop);
  el.addEventListener('focusout',  toNormal);
}

/* ======= ETYKIETA ======= */
function labelHTML(spot: Spot){
  const count = spot.youtube?.length || 0;
  const first = spot.youtube?.[0];
  const badge = count > 1
    ? `<span class="yt-badge" title="${count} linki/ów">${count}</span>`
    : '';
  const yt = first ? `
    <a class="yt-btn yt-on-label"
       href="${first}" target="_blank" rel="noopener noreferrer"
       title="YouTube: ${spot.name}">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="2" y="6" width="20" height="12" rx="3" ry="3"></rect>
        <polygon points="10,9 16,12 10,15"></polygon>
      </svg>
    </a>` : '';
  return `
    <div class="spot-label">
      <div class="text">
        <div class="name">${spot.name}</div>
        <div class="range">${spot.sectorStart}°–${spot.sectorEnd}°</div>
      </div>
      <div class="yt-row">${yt}${badge}</div>
    </div>
  `;
}

/* ======= SPRZĄTANIE ======= */
function clearDials(){ dialMarkers.forEach(m=>m.remove()); dialMarkers=[]; }
function clearUi(){ uiMarkers.forEach(m=>m.remove()); uiMarkers=[]; }
function clearLabels(){ labelTips.forEach(t=>t.remove()); labelTips=[]; }
function clearYtOnly(){ ytOnlyMarkers.forEach(m=>m.remove()); ytOnlyMarkers=[]; }

/* ======= PANE ======= */
function ensurePanes(){
  if (!map.getPane(paneDial)) {
    const p = map.createPane(paneDial);
    p.style.zIndex = '900';
    p.style.pointerEvents = 'none';
  }
  if (!map.getPane(paneUi)) {
    const p = map.createPane(paneUi);
    p.style.zIndex = '901';
    p.style.pointerEvents = 'auto';
  }
  if (!map.getPane(paneLabels)) {
    const p = map.createPane(paneLabels);
    p.style.zIndex = '902';
    p.style.pointerEvents = 'auto';
  }
}

/* ======= WIDOCZNE GRANICE MAPY (z buforem px) ======= */
function getPaddedLatLngBounds(padPx:number){
  const pb = map.getPixelBounds();
  const min = L.point(pb.min.x - padPx, pb.min.y - padPx);
  const max = L.point(pb.max.x + padPx, pb.max.y + padPx);
  const sw = map.unproject(min, map.getZoom());
  const ne = map.unproject(max, map.getZoom());
  return L.latLngBounds(sw, ne);
}

/* ======= DODAWANIE MARKERÓW ======= */
function addDial(s: Spot, D: number, animate:boolean){
  const html = buildDialHTML(s, D, animate);
  const icon = L.divIcon({
    className: 'wind-rose-icon dial-icon',
    html,
    iconSize: [D, D + 24],
    iconAnchor: [D/2, D/2],
  });
  const m = L.marker([s.lat, s.lon], { icon, interactive:false, pane:paneDial }).addTo(map);
  dialMarkers.push(m);
  if (animate){
    const delay = staggerDelayMs(s);
    setTimeout(() => runDialAnimation(m, delay, s.id), 0);
  }
}
function addUiMenu(s: Spot, D: number){
  const html = buildMenuHTML(s, D);
  const icon = L.divIcon({
    className: 'wind-rose-icon ui-icon',
    html,
    iconSize: [D, D + 24],
    iconAnchor: [D/2, D/2],
  });
  const m = L.marker([s.lat, s.lon], { icon, interactive:true, pane:paneUi }).addTo(map);
  uiMarkers.push(m);
}
function addYtOnlyIcon(s: Spot){
  const first = s.youtube?.[0];
  if (!first) return;
  const html = `
    <a class="yt-btn yt-alone" href="${first}" target="_blank" rel="noopener noreferrer" title="YouTube: ${s.name}">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <rect x="2" y="6" width="20" height="12" rx="3" ry="3"></rect>
        <polygon points="10,9 16,12 10,15"></polygon>
      </svg>
    </a>`;
  const icon = L.divIcon({
    className: 'wind-rose-icon ui-icon',
    html,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
  const m = L.marker([s.lat, s.lon], { icon, interactive:true, pane:paneUi }).addTo(map);
  ytOnlyMarkers.push(m);
}

/* ======= TWORZENIE ETYKIETY ======= */
function makeLabel(spot:Spot){
  const tip = L.tooltip({
    permanent: true,
    direction: 'top',
    offset: [0, 0],
    className: 'spot-tooltip',
    interactive: true,
    pane: paneLabels,
  })
    .setLatLng([spot.lat, spot.lon])
    .setContent(labelHTML(spot))
    .addTo(map);

  elevateTooltip(tip);
  labelTips.push(tip);
}

/* ======= RENDER GŁÓWNY (widoczne + kolizje) ======= */
function renderAll(){
  const z = map.getZoom();
  const D = sizeForZoom(z);
  ensurePanes();

  // 1) granice ekranu z buforem
  const padded = getPaddedLatLngBounds(VIEWPORT_PAD_PX);
  // 2) odfiltruj tylko widoczne spoty (+ pad)
  const visibleSpots = spots.filter(s => padded.contains([s.lat, s.lon]));

  const currentDialVisible = new Set<string>();

  // tylko ikonki (daleki zoom)
  if (z < zoomIconsOnly) {
    lastDialVisible = new Set();
    clearDials(); clearUi(); clearLabels(); clearYtOnly();
    for (const s of visibleSpots) addYtOnlyIcon(s);
    return;
  }

  // etykiety
  if (z < minZoomToShow) {
    lastDialVisible = new Set();
    clearDials(); clearUi(); clearYtOnly(); clearLabels();
    for (const s of visibleSpots) makeLabel(s);
    return;
  }

  // rozety + kolizje, ale tylko dla widocznych spotów
  clearLabels(); clearYtOnly(); clearDials(); clearUi();

  const { comps } = buildCollisionComponentsAtZoom(visibleSpots, z, D, collisionPadPx);
  for (const comp of comps){
    if (comp.length === 1){
      const s = visibleSpots[comp[0]];
      currentDialVisible.add(s.id);
      const shouldAnimate = !lastDialVisible.has(s.id); // pojawia się teraz
      addDial(s, D, shouldAnimate);
      addUiMenu(s, D);
    } else {
      for (const idx of comp) makeLabel(visibleSpots[idx]); // kolidujące → etykiety
    }
  }

  lastDialVisible = currentDialVisible;
}

/* ======= DEBOUNCE RENDER ======= */
let _renderT: any = null;
function scheduleRender(delay=80){
  if (_renderT) clearTimeout(_renderT);
  _renderT = setTimeout(() => {
    _renderT = null;
    renderAll();
  }, delay);
}

/* ======= SUBSKRYPCJE ======= */
function onZoomEnd(){ scheduleRender(60); }
function onMoveEnd(){ scheduleRender(80); }

/* ======= START ======= */
onMount(() => {
  spots = parseSpots(spotText);
  if (!spots.length) return;

  // ustaw widok, ale nie renderuj od razu — animacje będą ładne po pierwszym moveend
  map.setView([spots[0].lat, spots[0].lon], Math.max(map.getZoom()||0, zoomIconsOnly));

  const boot = () => {
    renderAll();                        // tu odpala się animacja
    map.on('zoomend', onZoomEnd);
    map.on('moveend', onMoveEnd);
  };

  // normalny przypadek
  map.once('moveend', boot);

  // awaryjnie, gdyby moveend nie przyszedł (ta sama pozycja itp.)
  setTimeout(() => {
    if (!_renderT && dialMarkers.length === 0 && uiMarkers.length === 0 && labelTips.length === 0){
      boot();
    }
  }, 100);
});

onDestroy(() => {
  clearLabels(); clearDials(); clearUi(); clearYtOnly();
  map.off('zoomend', onZoomEnd);
  map.off('moveend', onMoveEnd);
});
</script>

<style>
/* ——— Ogólne ——— */
:global(.wind-rose-icon){ opacity: 1 !important; }
:global(.wr){ position: relative; background: transparent; }
:global(.wr-dial){ pointer-events: none; isolation: isolate; display:flex; flex-direction:column; align-items:center; }
:global(.wr-ui){ pointer-events: auto; isolation: isolate; }
:global(.title){ margin-top:6px; color:#000; font:12px/1.2 system-ui, sans-serif; pointer-events:none; }

/* ——— Rozeta ——— */
:global(.dial){
  position: relative;
  z-index: 1;
  background:transparent; user-select:none;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,.25));
}
:global(.ring){  fill:none; stroke:#000; stroke-width:1.5; }
:global(.face){  fill:#e6e6e6; stroke:#000; stroke-width:0.8; }
:global(.axis){  stroke:#7a7a7a; stroke-width:1.2; }
:global(.tick2){ stroke:#000; stroke-width:0.8; opacity:.75; }
:global(.tick10){stroke:#000; stroke-width:1.2; }
:global(.tick30){stroke:#000; stroke-width:1.8; }
:global(.deg){   fill:#000; font:12px/1.1 system-ui, sans-serif; }
:global(.card){  fill:#000; font:14px/1.2 system-ui, sans-serif; font-weight:700; }
:global(.center){fill:#2ea4ff; stroke:#003a66; stroke-width:1.5; }

/* ——— Łuki ——— */
:global(.use-arc){  fill:none; stroke:#26c34a; stroke-linecap:round; }
:global(.rest-arc){ fill:none; stroke:rgba(255, 64, 64, .38); stroke-linecap:round; }

/* ——— ENTER ——— */
:global(.wr-dial){
  transition: opacity 420ms cubic-bezier(.19,.87,.32,1.12),
              transform 420ms cubic-bezier(.19,.87,.32,1.12);
}
:global(.wr-dial.animate-pre){
  opacity: 0;
  transform: translateY(6px) scale(.96) rotate(-1deg);
}
:global(.wr-dial.animate-arm .ring){
  filter: drop-shadow(0 0 8px rgba(46,164,255,.35));
  animation: ring-fade 520ms ease 420ms forwards;
}
@keyframes ring-fade{ to { filter: drop-shadow(0 0 0 rgba(46,164,255,0)); } }

/* ——— UI YouTube ——— */
:global(.yt-btn){
  display:grid; place-items:center;
  background: rgba(255,255,255,0.98);
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
  transition: transform .16s ease, box-shadow .2s ease, opacity .2s ease;
  width: var(--yt-size, 26px);
  height: var(--yt-size, 26px);
  box-sizing: border-box;
}
:global(.yt-btn:hover){ transform: translateY(-2px) scale(1.03); box-shadow: 0 4px 14px rgba(0,0,0,.35); }
:global(.yt-btn svg rect){ fill:#FF0000; }
:global(.yt-btn svg polygon){ fill:#FFFFFF; }

:global(.yt-menu){
  position:absolute;
  z-index: 10;
  pointer-events:auto;
  --yt-size: 26px;
  --yt-gap: 8px;
  width: var(--yt-size);
  height: var(--yt-size);
}
:global(.yt-menu)::after{
  content:""; position:absolute; left:0; right:0; top:100%; height: var(--yt-gap);
}
:global(.yt-main){ width:100%; height:100%; position: relative; }

/* POP-SPIN */
@keyframes pop-spin {
  0%   { transform: translateY(0) scale(1) rotate(0deg); }
  25%  { transform: translateY(-6px) scale(1.08) rotate(90deg); }
  50%  { transform: translateY(-2px) scale(1.04) rotate(180deg); }
  75%  { transform: translateY(-1px) scale(1.02) rotate(270deg); }
  100% { transform: translateY(0) scale(1) rotate(360deg); }
}
:global(.yt-main.pop-spin),
:global(.gmaps-main.pop-spin){
  animation: pop-spin 520ms cubic-bezier(.2,.8,.2,1) 1;
}

:global(.caret){
  position: absolute; right: -6px; top: -6px;
  width: 0; height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid rgba(0,0,0,.25);
  transform: rotate(180deg);
}
:global(.yt-sub){
  position: absolute;
  top: calc(100% + var(--yt-gap)); left: 0;
  display:flex; flex-direction:column; gap: var(--yt-gap);
  pointer-events:none;
}
:global(.yt-subitem){
  opacity:0; transform: translateY(-4px) scale(.98);
  pointer-events:none;
  transition: opacity .18s ease, transform .18s ease;
  width: var(--yt-size); height: var(--yt-size);
}
:global(.yt-menu:hover .yt-sub),
:global(.yt-menu:focus-within .yt-sub){ pointer-events:auto; }
:global(.yt-menu:hover .yt-subitem),
:global(.yt-menu:focus-within .yt-subitem){
  opacity:1; transform: translateY(0) scale(1); pointer-events:auto;
}
:global(.yt-subitem:nth-child(1)){ transition-delay:30ms; }
:global(.yt-subitem:nth-child(2)){ transition-delay:70ms; }
:global(.yt-subitem:nth-child(3)){ transition-delay:110ms; }
:global(.yt-subitem:nth-child(4)){ transition-delay:150ms; }
:global(.yt-subitem:nth-child(5)){ transition-delay:190ms; }
:global(.yt-subitem:nth-child(6)){ transition-delay:230ms; }
:global(.yt-subitem:nth-child(7)){ transition-delay:270ms; }

/* — etykiety — */
:global(.spot-tooltip){
  background: transparent;
  border: none;
  box-shadow: none;
  pointer-events: auto;
  transform: translateY(-6px);
  position: absolute;
}
:global(.spot-tooltip .leaflet-tooltip-tip){ display:none; }
:global(.spot-tooltip.is-top){ z-index: 999999 !important; }
:global(.spot-label){
  display:inline-flex; align-items:center; gap:8px;
  background: rgba(255,255,200,0.9);
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 10px;
  padding: 4px 6px;
  color:#000; font: 12px/1.2 system-ui, sans-serif;
}
:global(.spot-label .text){ display:flex; flex-direction:column; pointer-events:none; }
:global(.spot-label .name){ font-weight:700; }
:global(.spot-label .range){ opacity:.9; }
:global(.yt-row){ display:flex; align-items:center; gap:6px; }
:global(.yt-badge){
  display:inline-flex; align-items:center; justify-content:center;
  min-width: 18px; height: 18px; padding: 0 6px;
  border-radius: 9px;
  background:#ffeded;
  color:#b00000;
  border:1px solid rgba(0,0,0,.12);
  font: 11px/18px system-ui, sans-serif;
  font-weight: 700;
  user-select:none;
}

/* — daleki zoom — */
:global(.ui-icon .yt-alone){ width:26px; height:26px; border-radius:6px; }

/* ——— Google Maps ——— */
:global(.gmaps-menu){
  position:absolute;
  z-index: 10;
  pointer-events:auto;
  --gm-size: 26px;
  width: var(--gm-size);
  height: var(--gm-size);
}
:global(.gmaps-btn){
  display:grid; place-items:center;
  background: rgba(255,255,255,0.98);
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
  transition: transform .16s ease, box-shadow .2s ease, opacity .2s ease;
  width: var(--gm-size);
  height: var(--gm-size);
  box-sizing: border-box;
}
:global(.gmaps-btn:hover){ transform: translateY(-2px) scale(1.03); box-shadow: 0 4px 14px rgba(0,0,0,.35); }
:global(.gmaps-btn svg path){ fill:#1a73e8; }

/* ——— (NOWE) Info button ——— */
:global(.info-menu){
  position:absolute;
  z-index: 10;
  pointer-events:auto;
  --info-size: 26px;
  width: var(--info-size);
  height: var(--info-size);
}
:global(.info-btn){
  display:grid; place-items:center;
  background: #ffffff;
  border-radius: 7px;
  border: 1px solid rgba(0,0,0,.12);
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
  width: 100%; height: 100%;
  cursor: default; /* na razie bez akcji */
  transition: transform .16s ease, box-shadow .2s ease;
}
:global(.info-btn:hover){ transform: translateY(-2px) scale(1.03); box-shadow: 0 4px 14px rgba(0,0,0,.35); }
:global(.info-btn svg circle){ fill:#1e88e5; }
:global(.info-btn svg rect){ fill:#ffffff; }
</style>
