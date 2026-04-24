const nav=document.getElementById('nav');
if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20));
const hb=document.getElementById('hamburger'),nm=document.getElementById('nav-mobile');
if(hb&&nm){hb.onclick=()=>nm.classList.toggle('open');nm.querySelectorAll('a').forEach(a=>a.onclick=()=>nm.classList.remove('open'));}
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}}),{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i*0.08)+'s';obs.observe(el);});
