import{j as t,q as U,u as z}from"./hooks.wIM4aime.js";import{r as u}from"./index.DLkBFFtG.js";/* empty css                       */const Y="attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}",$=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform vec2 uBuf;
uniform float uT;
uniform float uMotion;
uniform float uSmall;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
vec3 dither(vec3 c){vec2 f=gl_FragCoord.xy;float n=hash(f)+hash(f+vec2(37.1,11.7))-1.;return c+n/255.;}
float ease(float x){x=clamp(x,0.,1.);return x*x*(3.-2.*x);}
float expo(float x){x=clamp(x,0.,1.);return (1.-exp2(-10.*x))/(1.-exp2(-10.));}
vec2 px(){return vec2(gl_FragCoord.x,uBuf.y-gl_FragCoord.y)*uRes/uBuf;}
`,K=`
float erf_(float x){float x2=x*x;float t=exp(-x2*(1.2732395+.147*x2)/(1.+.147*x2));return sign(x)*sqrt(1.-t);}
float S(float d,float s){return .5+.5*erf_(d/(s*1.4142136));}
float band(float x,float a,float b,float s){return S(x-a,s)-S(x-b,s);}
float cloud(float t){
  float f=fract(t/17.);
  if(f<.20)return 1.;
  if(f<.36)return mix(1.,.56,ease((f-.20)/.16));
  if(f<.45)return mix(.56,.74,ease((f-.36)/.09));
  if(f<.58)return mix(.74,.5,ease((f-.45)/.13));
  if(f<.78)return mix(.5,1.,ease((f-.58)/.20));
  return 1.;
}
void main(){
  vec2 p=px();float W=uRes.x,H=uRes.y;bool sm=uSmall>.5;
  float run=max(0.,uT-2.6)*uMotion;
  float sp=run/19.;float f=fract(sp);if(mod(floor(sp),2.)>.5)f=1.-f;
  float sun=ease(f);
  float cl=cloud(run);
  float eWin=mix(1.,expo((uT-.16)/2.4),uMotion);
  float eB=mix(1.,ease((uT-.46)/1.9),uMotion);

  vec4 box=sm?vec4(-.26*W,-.04*H,1.5*W,.78*H):vec4(-.04*W,-.12*H,.72*W,1.18*H);
  vec2 q=p-box.xy-vec2(-.04*box.z,-.03*box.w)*(1.-eWin);
  float mask=1.-smoothstep(.28,.80,length((q-vec2(.22*box.z,.18*box.w))/vec2(.72*box.z,.70*box.w)));
  vec2 T=vec2(.05*W,.026*H)*sun;
  vec2 c;c.y=q.y-T.y;c.x=q.x-T.x-tan(radians(-3.5)*sun)*c.y;
  float pw=.40*box.z,ph=.54*box.w;
  vec2 m=c-vec2(.16*box.z,.12*box.w);
  vec2 u=vec2(m.x-tan(radians(17.))*m.y,m.y);
  vec2 r=vec2(u.x,u.y-tan(radians(-4.))*u.x);
  float X=band(r.x,0.,pw,6.3)-band(r.x,.306*pw,.347*pw,6.3)-band(r.x,.653*pw,.694*pw,6.3);
  float Y=band(r.y,0.,ph,6.)-band(r.y,.455*ph,.505*ph,6.);
  float cov=max(0.,X)*max(0.,Y);
  float g=clamp(dot(r-vec2(pw,ph)*.5,vec2(.30902,.95106))/(.30902*pw+.95106*ph)+.5,0.,1.);
  float ga=g<.3?mix(.16,.115,g/.3):g<.58?mix(.115,.085,(g-.3)/.28):mix(.085,.05,(g-.58)/.42);
  float wa=ga*cov*mask*cl*eWin;

  vec2 bc=sm?vec2(.30*W,.208*H):vec2(.24*W,.286*H);
  vec2 br=sm?vec2(.90*W,.52*H):vec2(.52*W,.572*H);
  float rb=length((p-bc)/br);
  float ba=.06*pow(max(0.,1.-rb/(sm?.74:.76)),1.3)*cl*eB;

  float v=18./255.;
  v=mix(v,236./255.,.018*(1.-smoothstep(0.,.9*H,p.y)));
  v=mix(v,232./255.,ba);
  v=mix(v,240./255.,wa);
  v*=1.-.34*smoothstep(.5,1.02,length((p-vec2(.36*W,.28*H))/vec2(1.3*W,.95*H)));
  gl_FragColor=vec4(dither(vec3(v)),1.);
}
`,O=`
float vn(vec2 x){vec2 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fall(float r,float e,float k){return pow(max(0.,1.-r/e),k);}
void main(){
  vec2 p=px();float W=uRes.x,H=uRes.y;bool sm=uSmall>.5;
  // 入场：细砂先在暗处显出，柔光箱从右上推入，地平线稍后升起；呼吸等入场走完才起步，14 秒一个来回
  float eP=mix(1.,ease((uT-.08)/1.8),uMotion);
  float eK=mix(1.,expo((uT-.14)/2.2),uMotion);
  float eF=mix(1.,expo((uT-.36)/2.),uMotion);
  float bo=mix(1.,.35+.65*(.5-.5*cos(3.1415927*max(0.,uT-2.4)/7.)),uMotion);
  vec3 lc=vec3(212.,218.,226.)/255.;
  vec3 v=vec3(17.,18.,20.)/255.;

  // 柔光箱：左侧自然落入暗部，右上一团冷白主光
  vec2 k=p-vec2(.05*W,-.048*H)*(1.-eK);
  float g=dot(k-vec2(.5*W,.6*H),vec2(.98481,.17365))/(.98481*W+.17365*1.2*H)+.5;
  v*=1.-.14*fall(g,sm?.52:.48,sm?1.33:1.3)*eK;
  float rk=length((k-vec2((sm?.86:.8)*W,0.))/(sm?vec2(.9*W,.528*H):vec2(.58*W,.768*H)));
  v=mix(v,lc,.1*fall(rk,.78,sm?1.28:1.25)*eK);
  // 呼吸：外圈更大更软的光晕
  float rb=length((p-vec2((sm?.84:.78)*W,0.))/(sm?vec2(1.2*W,.754*H):vec2(.76*W,1.066*H)));
  v=mix(v,lc,.05*fall(rb,.8,sm?1.12:1.1)*bo);

#ifdef SOFT_SWEEP
  // 合集总览：不画弯角那道横向明暗交界，墙面从视口中部起一路缓缓暗到下缘，没有可辨认的分界线
  v*=1.-.17*smoothstep(.26*H,1.12*H,p.y)*eF;
#else
  // 无缝背景纸的弯角：大椭圆弧，弧下压暗成地面，弧顶一层柔光，左右羽化
  float x0=(sm?-.76:-.34)*W,fw=(sm?2.6:1.8)*W,cx=x0+.5*fw,ry=(sm?.1:.18)*H;
  float top=(sm?.26:.34)*H+56.*(1.-eF);
  float xr=(p.x-cx)/(.5*fw);
  float edge=top+ry*(1.-sqrt(max(0.,1.-xr*xr)));
  float xf=(p.x-x0)/fw;
  float fm=smoothstep(.16,.34,xf)*(1.-smoothstep(.74,.9,xf))*smoothstep(-.8,.8,p.y-edge)*eF;
  float dy=(p.y-top)/H;
  v*=1.-(.06+.2*(1.-exp(-dy/.13)))*(1.-smoothstep(.8,1.3,dy))*fm;
  float rf=length((p-vec2(cx,top))/vec2(.3*fw,.2*H));
  v=mix(v,vec3(214.,220.,228.)/255.,.05*fall(rf,1.,1.25)*fm);
#endif

  // 涂料细砂：细颗粒六成、砂团四成，各两组频率；坐标轮流旋转，颗粒不沿像素网格排队
  vec2 q=mat2(.8,.6,-.6,.8)*p;
  float n=.6*(.8*vn(p*.7)+.2*vn(q*.95+vec2(17.,5.)))+.4*(.65*vn(q*.24+vec2(3.,11.))+.35*vn(p*.48+vec2(29.,7.)));
  v*=1.+.34*(n-.5)*eP;

  // 视口暗角；再补上 CSS 抖动层原有的约 2 个色阶的平均提亮
  v*=1.-.34*smoothstep(.5,1.02,length((p-vec2(.6*W,.24*H))/vec2(1.25*W,H)));
  v=mix(v,vec3(1.),.0078);
  gl_FragColor=vec4(dither(v),1.);
}
`,V=`
#define SOFT_SWEEP
`+O,X=`
void main(){
  vec2 p=px();float W=uRes.x,H=uRes.y;bool sm=uSmall>.5;float t=uT*uMotion;
  float yn=p.y/H;
  float eC=mix(1.,expo((uT-.12)/2.6),uMotion);
  float eL=mix(1.,expo((uT-.52)/2.2),uMotion);
  float lx=(sm?.46:.44)*W;
  float fw=H*(sm?.13:.17);
  float x=lx+(p.x-lx)/(1.+.045*(1.-eC));
  x=lx+(x-lx)/(.97+.06*yn);
  float u0=x/fw;
  // 顶部挂在轨道上也有一点余动，越往下摆幅越大
  float hang=.18+.82*pow(yn,1.2);
  float sway=(.6*sin(t*.72+u0*.42)+.4*sin(t*1.07-u0*.29+1.3))*hang*fw*.26;
  float gust=sin(u0*.21-t*.55);
  x+=sway+gust*hang*fw*.1;
  float u=x/fw;
  float ph=u+.16*sin(u*.61+1.7)+.09*sin(u*1.37+.4);
  ph+=.05*sin(yn*2.4+u*.9);
  float a=6.2831853*ph;
  float ca=cos(a),sa=sin(a);
  // 褶深沿横向缓慢起伏：深褶对比大、浅褶几乎平展，宽窄与深浅都不重复
  float depth=.62+.38*(.5+.5*sin(u*.37+.8)*sin(u*.23+2.));
  float crest=.5+.5*ca;
  crest=crest*crest*(3.-2.*crest);
  float valley=pow(.5-.5*ca,2.6);
  float side=2.*smoothstep(-1.,1.,(p.x-lx)/(.2*W))-1.;
  float lit=max(0.,-sa*side)*(.5+.5*ca+.3);
  float sheenY=.7+.3*sin(yn*2.6+u*1.1+t*.45);
  float breath=.92+.08*sin(t*.38);
  vec2 lr=vec2(p.x-lx,p.y)/vec2((sm?.9:.5)*W*(.36+.64*eL),(sm?.62:.8)*H);
  float L=exp(-2.*dot(lr,lr))*eL*breath;
  float illum=(.66+.44*L)*(1.-.16*exp(-p.y/(.06*H)))*(1.-.18*smoothstep(.5,1.1,yn));
  // 气流推到的褶微微鼓起、提亮，亮带缓缓从左向右走过
  float lift=1.+.16*gust*hang;
  vec3 base=vec3(19.,30.,36.)/255.,body=vec3(36.,55.,63.)/255.,sh=vec3(150.,174.,186.)/255.;
  vec3 col=mix(base,body,mix(.45,1.,crest)*(.4+.6*depth)+.25*(1.-depth));
  col=mix(col,sh,lit*.06*depth*sheenY);
  col*=1.-valley*.34*depth;
  col*=illum*lift;
  col+=vec3(206.,220.,228.)/255.*.03*L*(.4+.6*crest);
  float vig=1.-.32*smoothstep(.42,1.05,length((p-vec2(lx,.18*H))/vec2(1.2*W,.94*H)));
  col=mix(vec3(12.,17.,20.)/255.,col,eC)*vig;
  // 整体调色，色相与褶的明暗关系不变：两轮叠乘。第一轮色度 ×0.88、明度 ×0.92；第二轮色度 ×0.95、明度 ×0.80。
  // 合计色度 ×0.836（向亮度收拢）、明度 ×0.736。静态帷幕 .sf-still 的色值按第二轮同样换算
  col=mix(vec3(dot(col,vec3(.2126,.7152,.0722))),col,.836)*.736;
  gl_FragColor=vec4(dither(col),1.);
}
`;function q(s,a,o){const c=s.createShader(a);return c?(s.shaderSource(c,o),s.compileShader(c),s.getShaderParameter(c,s.COMPILE_STATUS)?c:(console.warn("[surface]",s.getShaderInfoLog(c)),null)):null}function k({frag:s,reduced:a,fps:o}){const c=u.useRef(null);return u.useLayoutEffect(()=>{const n=c.current,e=n?.getContext("webgl",{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,powerPreference:"low-power"});if(!n||!e)return;const m=q(e,e.VERTEX_SHADER,Y),f=q(e,e.FRAGMENT_SHADER,$+s),r=e.createProgram();if(!m||!f||!r||(e.attachShader(r,m),e.attachShader(r,f),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS)))return;e.useProgram(r);const d=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,d),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const v=e.getAttribLocation(r,"a");e.enableVertexAttribArray(v),e.vertexAttribPointer(v,2,e.FLOAT,!1,0,0);const H=e.getUniformLocation(r,"uRes"),M=e.getUniformLocation(r,"uBuf"),A=e.getUniformLocation(r,"uT"),W=e.getUniformLocation(r,"uMotion"),F=e.getUniformLocation(r,"uSmall"),_=window.matchMedia("(max-width: 760px)");let y=1,h=1;const T=()=>{y=Math.max(1,n.clientWidth),h=Math.max(1,n.clientHeight);const i=Math.min(window.devicePixelRatio||1,1,Math.sqrt(4e6/(y*h)));n.width=Math.max(1,Math.round(y*i)),n.height=Math.max(1,Math.round(h*i)),e.viewport(0,0,n.width,n.height)},l=performance.now();let w=l;const x=i=>{w=i,e.uniform2f(H,y,h),e.uniform2f(M,n.width,n.height),e.uniform1f(A,(i-l)/1e3),e.uniform1f(W,a?0:1),e.uniform1f(F,_.matches?1:0),e.drawArrays(e.TRIANGLES,0,3)};T(),x(l),n.dataset.live="";const S=()=>{delete n.dataset.live,cancelAnimationFrame(g)};n.addEventListener("webglcontextlost",S);const p=new ResizeObserver(()=>{T(),x(a?l:performance.now())});p.observe(n);let g=0;if(!a){const i=j=>{g=requestAnimationFrame(i),j-w>=1e3/o-2&&x(j)};g=requestAnimationFrame(i)}return()=>{cancelAnimationFrame(g),p.disconnect(),n.removeEventListener("webglcontextlost",S),delete n.dataset.live,e.getExtension("WEBGL_lose_context")?.loseContext()}},[s,a,o]),t.jsx("canvas",{ref:c,className:"sf-gl","aria-hidden":"true"})}const Z=["window","nocturne","studio","velvet","concrete"],L=s=>Z.includes(s);function J(s){const[a,o]=u.useState();return u.useEffect(()=>{const c=window.parent!==window?new URLSearchParams(location.search).get("editorSurface"):null;if(c==="default"||L(c)){document.documentElement.dataset.editorSurface="",o(L(c)?c:void 0);return}const n=getComputedStyle(document.documentElement).getPropertyValue(`--moorland-bg-${s}`).trim()||U[s];o(L(n)?n:void 0)},[s]),a}function be({page:s}){const a=J(s),o=z();return a?t.jsx(ve,{k:a,reduced:o}):null}const Q=1200,ee="cubic-bezier(.45, 0, .15, 1)",te="cubic-bezier(.16, 1, .3, 1)",I="cubic-bezier(.33, 0, .2, 1)",se={window:[],nocturne:[{sel:".sf-glow",frames:[{opacity:0},{opacity:1}],ms:2200,delay:120,easing:I},{sel:".sf-sky",frames:[{opacity:0},{opacity:1}],ms:3200,delay:220,easing:te}],studio:[],velvet:[],concrete:[{sel:".sf-cast",frames:[{opacity:0},{opacity:1}],ms:1600,delay:100,easing:I}]};function B(s){let a=s;return()=>{a=a+1831565813|0;let o=Math.imul(a^a>>>15,1|a);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}const E=26,ae=1200,oe=340,ne=(()=>{const s=B(20261118),a=[];for(let o=0;o<oe;o++){const c=40+Math.sqrt(s())*(ae-60),n=s()*360,e=s(),m=s();a.push({r:Math.round(c*10)/10,start:Math.round(n*100)/100,o:e>.96?.9:e>.8?.56:.15+s()*.26,w:e>.96?1.7:e>.8?1.2:.9,rgb:m>.9?"242,226,196":m>.74?"198,212,243":"227,232,242"})}return a})(),ce=-.2,b={ms:3200,delay:220,deg:12},re=30,C=Math.PI/180,R=3,ie=[[0,1],[R/360,1],[(R+E*.18)/360,.78],[(R+E*.45)/360,.4],[(R+E*.75)/360,.12],[(R+E)/360,0]];function le({reduced:s}){const a=u.useRef(null);return u.useLayoutEffect(()=>{const o=a.current,c=o?.getContext("2d");if(!o||!c)return;const n=o,e=c,m=window.matchMedia("(max-width: 760px)");let f=0,r=0,d=1,v=s?0:b.deg;const H=()=>{f=n.clientWidth,r=n.clientHeight,d=Math.min(window.devicePixelRatio||1,2,Math.sqrt(6e6/Math.max(1,f*r))),n.width=Math.round(f*d),n.height=Math.round(r*d)},M=l=>{v=l,e.setTransform(d,0,0,d,0,0),e.clearRect(0,0,f,r);const w=m.matches,x=f*(w?.82:.8),S=r*(w?.08:.05),p=r/800;e.lineCap="round";const g=typeof e.createConicGradient=="function";for(const i of ne){const j=(i.start+l)*C;if(e.beginPath(),e.arc(x,S,i.r*p,j,j+E*C),e.globalAlpha=i.o,g){const P=e.createConicGradient(j-R*C,x,S);for(const[D,G]of ie)P.addColorStop(D,`rgba(${i.rgb},${G})`);e.strokeStyle=P}else e.strokeStyle=`rgb(${i.rgb})`;e.lineWidth=i.w*p,e.stroke()}e.globalAlpha=1};H(),M(v);const A=new ResizeObserver(()=>{H(),M(v)});if(A.observe(n),s)return()=>A.disconnect();const W=performance.now();let F=0,_=W,y=-1/0,h=0;const T=l=>{h=requestAnimationFrame(T);const w=Math.min(Math.max(0,l-_),100);_=l;const x=l-W;if(x>b.delay&&(F+=ce*w/1e3),!(x<b.delay+b.ms)&&l-y<1e3/re-2)return;y=l;const p=Math.min(1,Math.max(0,(x-b.delay)/b.ms)),g=p>=1?1:1-Math.pow(2,-10*p);M(b.deg*(1-g)+F)};return h=requestAnimationFrame(T),()=>{cancelAnimationFrame(h),A.disconnect()}},[s]),t.jsx("canvas",{ref:a,className:"sf-trails","aria-hidden":"true"})}const fe=()=>`sf-${u.useId().replace(/[^A-Za-z0-9]/g,"")}-`,ue=u.memo(function(){const a=fe();return t.jsxs("svg",{className:"sf-svg","aria-hidden":"true",focusable:"false",children:[t.jsx("defs",{children:t.jsxs("filter",{id:`${a}p`,x:"0",y:"0",width:"100%",height:"100%",colorInterpolationFilters:"sRGB",children:[t.jsx("feTurbulence",{type:"fractalNoise",baseFrequency:"0.7",numOctaves:2,seed:4,result:"g0"}),t.jsx("feColorMatrix",{in:"g0",type:"matrix",values:"1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1",result:"fine"}),t.jsx("feTurbulence",{type:"fractalNoise",baseFrequency:"0.24",numOctaves:2,seed:9,result:"s0"}),t.jsx("feColorMatrix",{in:"s0",type:"matrix",values:"1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1",result:"sand"}),t.jsx("feComposite",{in:"fine",in2:"sand",operator:"arithmetic",k1:0,k2:.6,k3:.4,k4:0,result:"mix"}),t.jsx("feGaussianBlur",{in:"mix",stdDeviation:"0.55",result:"soft"}),t.jsx("feColorMatrix",{in:"soft",type:"matrix",values:"0.8 0 0 0 0.1  0.8 0 0 0 0.1  0.8 0 0 0 0.1  0 0 0 0 1"})]})}),t.jsx("rect",{width:"100%",height:"100%",filter:`url(#${a}p)`})]})});let N=null;function me(){if(N!==null)return N;N="";try{const a=document.createElement("canvas");a.width=128,a.height=128;const o=a.getContext("2d");if(!o)return N;const c=o.createImageData(128,128),n=B(20261121);for(let e=0;e<c.data.length;e+=4)c.data[e]=255,c.data[e+1]=255,c.data[e+2]=255,c.data[e+3]=Math.round((n()+n())/2*4);o.putImageData(c,0,0),N=`url(${a.toDataURL("image/png")})`}catch{}return N}const de=[0,1,2,3,4];function xe({k:s,reduced:a,soft:o=!1}){switch(s){case"window":return t.jsxs("div",{className:"sf-depth",children:[t.jsx(k,{frag:K,reduced:a,fps:30}),t.jsxs("div",{className:"sf-still",children:[t.jsx("div",{className:"sf-bounce"}),t.jsx("div",{className:"sf-win",children:t.jsx("div",{className:"sf-win-soft",children:t.jsx("div",{className:"sf-win-panes"})})}),t.jsx("div",{className:"sf-amb"}),t.jsx("div",{className:"sf-dither"})]})]});case"nocturne":return t.jsxs("div",{className:"sf-depth",children:[t.jsx("div",{className:"sf-glow"}),t.jsx("div",{className:"sf-sky",children:t.jsx(le,{reduced:a})})]});case"studio":return t.jsxs("div",{className:"sf-depth",children:[t.jsx(k,{frag:o?V:O,reduced:a,fps:30}),t.jsxs("div",{className:"sf-still",children:[t.jsx("div",{className:"sf-key"}),t.jsx("div",{className:"sf-breath"}),!o&&t.jsx("div",{className:"sf-floor"}),t.jsx("div",{className:"sf-paint",children:t.jsx(ue,{})}),t.jsx("div",{className:"sf-amb"}),t.jsx("div",{className:"sf-dither"})]})]});case"velvet":return t.jsxs("div",{className:"sf-depth",children:[t.jsx(k,{frag:X,reduced:a,fps:60}),t.jsxs("div",{className:"sf-still",children:[t.jsx("div",{className:"sf-folds"}),t.jsx("div",{className:"sf-vshade"}),t.jsx("div",{className:"sf-vlight"}),t.jsx("div",{className:"sf-amb"}),t.jsx("div",{className:"sf-dither"})]})]});case"concrete":return t.jsxs("div",{className:"sf-depth",children:[t.jsx("div",{className:"sf-cast"}),t.jsxs("div",{className:"sf-daylight",children:[t.jsx("div",{className:"sf-haze"}),de.map(c=>t.jsx("div",{className:"sf-ray","data-i":c},c))]})]})}}function ve({k:s,reduced:a,soft:o=!1}){const[c,n]=u.useState(!1);return u.useEffect(()=>{let e=!0;return(window.__portfolioEntry??Promise.resolve()).then(()=>e&&n(!0)),()=>{e=!1}},[]),c?t.jsx("div",{className:"sf","aria-hidden":"true",style:{"--sf-dither":me()||"none"},children:t.jsx(pe,{layer:{id:1,key:s},reduced:a,onShown:he,soft:o})}):null}const he=()=>{};function pe({layer:s,reduced:a,onShown:o,soft:c=!1}){const n=u.useRef(null);return u.useLayoutEffect(()=>{const e=n.current;if(!e||a||typeof e.animate!="function"){o(s.id);return}const m=[],f=e.animate([{opacity:0},{opacity:1}],{duration:Q,easing:ee,fill:"backwards"});for(const r of se[s.key])[...e.querySelectorAll(r.sel)].filter(d=>getComputedStyle(d).display!=="none").forEach((d,v)=>m.push(d.animate(r.frames,{duration:r.ms,delay:r.delay+v*(r.stagger??0),easing:r.easing,fill:"backwards"})));return f.onfinish=()=>o(s.id),()=>{f.onfinish=null,f.cancel(),m.forEach(r=>r.cancel())}},[]),t.jsxs("div",{ref:n,className:"sf-layer","data-k":s.key,children:[t.jsx(xe,{k:s.key,reduced:a,soft:c}),t.jsx("div",{className:"sf-amb"}),t.jsx("div",{className:"sf-dither"})]})}export{be as P,ve as S,J as u};
