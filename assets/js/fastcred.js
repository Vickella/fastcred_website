
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    let lastFocused = null;
    const focusables = () => [...nav.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')];
    const close = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); document.body.style.overflow=''; if(lastFocused) lastFocused.focus(); };
    const open = () => { lastFocused=document.activeElement; nav.classList.add('open'); toggle.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; setTimeout(()=>focusables()[0]?.focus(),0); };
    toggle.addEventListener('click', () => nav.classList.contains('open') ? close() : open());
    nav.addEventListener('click', e => { if(e.target.closest('a')) close(); });
    document.addEventListener('click', e => { if(nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) close(); });
    document.addEventListener('keydown', e => {
      if(!nav.classList.contains('open')) return;
      if(e.key==='Escape') { e.preventDefault(); close(); return; }
      if(e.key==='Tab') {
        const f=focusables(); if(!f.length) return; const first=f[0], last=f[f.length-1];
        if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    window.addEventListener('resize',()=>{if(window.innerWidth>860 && nav.classList.contains('open')) close();});
  }
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  document.querySelectorAll('form[data-ajax-form]').forEach(form=>{
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      const status=form.querySelector('.form-status'); const btn=form.querySelector('button[type="submit"]');
      if(!form.checkValidity()){ form.reportValidity(); return; }
      const original=btn.textContent; btn.disabled=true; btn.textContent='Sending…';
      try{
        const res=await fetch(form.action,{method:'POST',body:new FormData(form)}); const text=await res.text();
        status.style.display='block';
        if(res.ok && text.trim().startsWith('OK')){status.textContent='Thank you. Your request has been received. FastCred will contact you using the details provided.';status.style.background='#e8f7ec';status.style.color='#075c2d';form.reset();}
        else throw new Error(text);
      }catch(err){status.style.display='block';status.style.background='#fff3cd';status.style.color='#664d03';status.textContent='We could not send the form automatically. Please call +263 86 77007437 or email info@fastcred.co.zw.';}
      finally{btn.disabled=false;btn.textContent=original;}
    });
  });
})();
