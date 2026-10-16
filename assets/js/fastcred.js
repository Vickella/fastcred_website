
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
  document.querySelectorAll('.footer-bottom > div:last-child').forEach(footerLinks=>{
    if(footerLinks.querySelector('.footer-credit')) return;
    const credit=document.createElement('a');
    credit.className='footer-credit';
    credit.href='https://veritycore.co.zw';
    credit.target='_blank';
    credit.rel='noopener noreferrer';
    credit.textContent='Designed by VerityCore Consultancy';
    footerLinks.appendChild(credit);
  });
  document.querySelectorAll('.hero:not(.hero-light)').forEach(hero=>{
    if(hero.querySelector('.hero-slideshow')) return;
    const slideshow=document.createElement('div');
    slideshow.className='hero-slideshow';
    ['assets/img/hero.png?v=original','assets/img/cash.webp?v=1','assets/img/herow.webp?v=1','assets/img/herox.webp?v=1','assets/img/heroy.webp?v=1','assets/img/heroz.webp?v=1'].forEach((source,index)=>{
      const slide=document.createElement('div');
      slide.className='hero-slide';
      slide.setAttribute('role','img');
      slide.setAttribute('aria-label',index===0 ? 'Cash being exchanged across a service counter' : 'Coins growing into a small investment');
      slide.style.backgroundImage=`url("${source}")`;
      slideshow.appendChild(slide);
    });
    hero.prepend(slideshow);
  });
  document.querySelectorAll('[data-loan-calculator]').forEach(calc=>{
    const product=calc.querySelector('[name="product"]');
    const amountRange=calc.querySelector('.qc-amount-range');
    const amountNumber=calc.querySelector('.qc-amount-number');
    const termRange=calc.querySelector('.qc-term-range');
    const termNumber=calc.querySelector('.qc-term-number');
    if(!product||!amountRange||!amountNumber||!termRange||!termNumber) return;
    const money=(value,decimals=true)=>`US$${Number(value).toLocaleString('en-US',{minimumFractionDigits:decimals?2:0,maximumFractionDigits:decimals?2:0})}`;
    const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
    const niceStep=span=>span<=100?1:span<=500?5:span<=2000?10:span<=10000?50:span<=50000?100:500;
    const quote=(amount,months,ratePct,type,feePct)=>{
      const rate=ratePct/100;
      const installment=type==='reducing'&&rate>0?amount*rate/(1-Math.pow(1+rate,-months)):(amount+(amount*rate*months))/months;
      return {installment,total:installment*months,fee:amount*feePct/100};
    };
    const setRangeFill=range=>{
      const span=(Number(range.max)-Number(range.min))||1;
      range.style.setProperty('--pct',`${((Number(range.value)-Number(range.min))/span)*100}%`);
    };
    const calculate=()=>{
      const data=product.options[product.selectedIndex].dataset;
      const amount=Number(amountRange.value);
      const months=Number(termRange.value);
      const result=quote(amount,months,Number(data.rate),data.type,Number(data.fee));
      const interest=Math.max(0,result.total-amount);
      const compositionTotal=amount+interest+result.fee||1;
      amountNumber.value=amount;
      termNumber.value=months;
      calc.querySelector('.qc-result-kicker').textContent=months===1?'Estimated repayment':'Estimated monthly repayment';
      calc.querySelector('.qc-installment').textContent=money(result.installment);
      calc.querySelector('.qc-per').textContent=months===1?'One repayment after 1 month':`per month for ${months} months`;
      calc.querySelector('.qc-rate').textContent=`${Number(data.rate)}% p.m. (${data.type==='reducing'?'reducing':'flat'})`;
      calc.querySelector('.qc-interest').textContent=money(interest);
      calc.querySelector('.qc-fee').textContent=money(result.fee);
      calc.querySelector('.qc-total').textContent=money(result.total);
      calc.querySelector('.qc-principal-bar').style.width=`${amount/compositionTotal*100}%`;
      calc.querySelector('.qc-interest-bar').style.width=`${interest/compositionTotal*100}%`;
      calc.querySelector('.qc-fee-bar').style.width=`${result.fee/compositionTotal*100}%`;
      setRangeFill(amountRange);
      setRangeFill(termRange);
      const apply=calc.querySelector('.qc-apply');
      apply.href=`apply.html?type=${encodeURIComponent(product.value)}&amount=${encodeURIComponent(amount)}&term=${encodeURIComponent(months)}`;
    };
    const setup=()=>{
      const data=product.options[product.selectedIndex].dataset;
      const min=Number(data.min),max=Number(data.max),step=niceStep(max-min);
      amountRange.min=min;amountRange.max=max;amountRange.step=step;
      amountRange.dataset.buttonStep=max-min<=100?5:step;
      amountRange.value=min+Math.round(((max-min)/4)/step)*step;
      termRange.min=Number(data.tmin);termRange.max=Number(data.tmax);termRange.value=clamp(6,Number(data.tmin),Number(data.tmax));
      amountNumber.min=min;amountNumber.max=max;termNumber.min=data.tmin;termNumber.max=data.tmax;
      calc.querySelector('[data-amount-min]').textContent=money(min,false);
      calc.querySelector('[data-amount-max]').textContent=money(max,false);
      calc.querySelector('[data-term-min]').textContent=`${data.tmin} mo`;
      calc.querySelector('[data-term-max]').textContent=`${data.tmax} mo`;
      const amountControl=calc.querySelector('[data-control="amount"]');
      const termControl=calc.querySelector('[data-control="term"]');
      amountControl.classList.toggle('is-fixed',min===max);
      termControl.classList.toggle('is-fixed',data.tmin===data.tmax);
      amountControl.querySelectorAll('button,input').forEach(el=>{if(el!==amountNumber)el.disabled=min===max;});
      termControl.querySelectorAll('button,input').forEach(el=>{if(el!==termNumber)el.disabled=data.tmin===data.tmax;});
      amountNumber.disabled=min===max;termNumber.disabled=data.tmin===data.tmax;
      const fixed=calc.querySelector('.qc-fixed-note');
      fixed.hidden=data.tmin!==data.tmax;
      fixed.textContent=data.tmin===data.tmax?`This product has a fixed ${data.tmin}-month term.`:'';
      const note=calc.querySelector('.qc-product-note');
      note.hidden=!data.note;note.textContent=data.note||'';
      calculate();
    };
    product.addEventListener('change',setup);
    [amountRange,termRange].forEach(range=>range.addEventListener('input',calculate));
    amountNumber.addEventListener('input',()=>{const value=Number(amountNumber.value);if(value>=Number(amountRange.min)&&value<=Number(amountRange.max)){amountRange.value=value;calculate();}});
    amountNumber.addEventListener('blur',()=>{amountRange.value=clamp(Number(amountNumber.value)||Number(amountRange.min),Number(amountRange.min),Number(amountRange.max));calculate();});
    termNumber.addEventListener('input',()=>{const value=Math.round(Number(termNumber.value));if(value>=Number(termRange.min)&&value<=Number(termRange.max)){termRange.value=value;calculate();}});
    termNumber.addEventListener('blur',()=>{termRange.value=clamp(Math.round(Number(termNumber.value))||Number(termRange.min),Number(termRange.min),Number(termRange.max));calculate();});
    calc.querySelectorAll('[data-step-target]').forEach(button=>button.addEventListener('click',()=>{
      const range=button.dataset.stepTarget==='amount'?amountRange:termRange;
      const step=button.dataset.stepTarget==='amount'?Number(range.dataset.buttonStep||range.step):Number(range.step);
      const value=clamp(Number(range.value)+(Number(button.dataset.direction)*step),Number(range.min),Number(range.max));
      range.value=value;calculate();
    }));
    setup();
  });
  const params=new URLSearchParams(window.location.search);
  const loanType=document.querySelector('select[name="loan_type"]');
  if(loanType && params.get('type')){
    const requested={'civil-servant':'Civil Servant Loan','civil-emergency':'Civil Servant Emergency Loan',sme:'SME Business Loan',personal:'Personal Loan',order:'Order Financing',invoice:'Invoice Discounting',asset:'Asset-Based Finance',salary:'Salary-Based / SSB Loan','employer-emergency':'Employer Emergency Loan',agriculture:'Agribusiness Loan',emergency:'Employer Emergency Loan',school:'School-Fee Loan'}[params.get('type')];
    if(requested && [...loanType.options].some(option=>option.value===requested)) loanType.value=requested;
  }
  const requestedAmount=document.querySelector('#amount');
  const requestedTerm=document.querySelector('#term');
  if(requestedAmount&&params.get('amount')) requestedAmount.value=params.get('amount');
  if(requestedTerm&&params.get('term')) requestedTerm.value=params.get('term');
  const contactSubject=document.querySelector('#c_subject');
  if(contactSubject && params.get('service')){
    const requested={advisory:'Business advisory enquiry',pos:'POS systems enquiry',accounting:'Bookkeeping and accounting enquiry',planning:'Financial planning enquiry'}[params.get('service')];
    if(requested) contactSubject.value=requested;
  }
  document.querySelectorAll('form[data-ajax-form]').forEach(form=>{
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      const status=form.querySelector('.form-status'); const btn=form.querySelector('button[type="submit"]');
      if(!form.checkValidity()){ form.reportValidity(); return; }
      const original=btn.textContent; btn.disabled=true; btn.textContent='Sending...';
      try{
        const res=await fetch(form.action,{method:'POST',body:new FormData(form)}); const text=await res.text();
        status.style.display='block';
        if(res.ok && text.trim().startsWith('OK')){status.textContent=form.dataset.success||'Thank you. Your request has been received. FastCred will contact you using the details provided.';status.style.background='#e8f7ec';status.style.color='#075c2d';form.reset();}
        else throw new Error(text);
      }catch(err){status.style.display='block';status.style.background='#fff3cd';status.style.color='#664d03';status.textContent='We could not send the form automatically. Please call +263 86 440 85732 or +263 77 477 9980 or email info@fastcred.co.zw.';}
      finally{btn.disabled=false;btn.textContent=original;}
    });
  });
})();
