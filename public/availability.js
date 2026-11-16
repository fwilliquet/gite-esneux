(() => {
  const root = document.querySelector('#disponibilites');
  if (!root) return;
  const language = document.documentElement.lang || 'fr';
  const locale = { fr:'fr-BE', nl:'nl-BE', de:'de-DE', en:'en-GB' }[language] || 'fr-BE';
  const messages = {
    fr: {available:'Ces dates ne sont pas bloquées dans le dernier calendrier importé. Airbnb confirmera la disponibilité et le tarif.',unavailable:'Séjour indisponible dans le calendrier importé, ou dates invalides. Choisissez une autre arrivée ou durée.',loaded:'Calendrier Airbnb consulté le ',select:' Sélectionnez votre arrivée et votre durée.',error:'Le calendrier n’est pas encore connecté ou est temporairement indisponible. Consultez Airbnb pour vérifier les dates.',pick:'Choisir cette date d’arrivée',blocked:'Indisponible',notLoaded:'Calendrier non chargé'},
    nl: {available:'Deze data zijn niet geblokkeerd in de laatst geïmporteerde kalender. Airbnb bevestigt de beschikbaarheid en prijs.',unavailable:'Dit verblijf is niet beschikbaar of de data zijn ongeldig. Kies een andere aankomstdatum of verblijfsduur.',loaded:'Airbnb-kalender geraadpleegd op ',select:' Kies je aankomstdatum en verblijfsduur.',error:'De kalender is nog niet verbonden of tijdelijk onbeschikbaar. Controleer de data op Airbnb.',pick:'Kies deze aankomstdatum',blocked:'Niet beschikbaar',notLoaded:'Kalender niet geladen'},
    de: {available:'Diese Daten sind im zuletzt importierten Kalender nicht gesperrt. Airbnb bestätigt Verfügbarkeit und Preis.',unavailable:'Aufenthalt nicht verfügbar oder Daten ungültig. Wählen Sie eine andere Anreise oder Aufenthaltsdauer.',loaded:'Airbnb-Kalender abgerufen am ',select:' Wählen Sie Anreise und Aufenthaltsdauer.',error:'Der Kalender ist noch nicht verbunden oder vorübergehend nicht verfügbar. Bitte prüfen Sie die Daten auf Airbnb.',pick:'Dieses Anreisedatum wählen',blocked:'Nicht verfügbar',notLoaded:'Kalender nicht geladen'},
    en: {available:'These dates are not blocked in the latest imported calendar. Airbnb will confirm availability and pricing.',unavailable:'Stay unavailable in the imported calendar, or invalid dates. Choose a different arrival date or length of stay.',loaded:'Airbnb calendar checked on ',select:' Choose your arrival date and length of stay.',error:'The calendar is not connected yet or is temporarily unavailable. Please check dates on Airbnb.',pick:'Choose this arrival date',blocked:'Unavailable',notLoaded:'Calendar not loaded'}
  };
  const msg = messages[language] || messages.fr;
  const calendar = root.querySelector('[data-calendar]');
  const status = root.querySelector('[data-calendar-status]');
  const arrival = root.querySelector('[name=checkin]');
  const departure = root.querySelector('[name=checkout]');
  const nights = root.querySelector('[name=nights]');
  const link = root.querySelector('[data-airbnb-dates]');
  const prev = root.querySelector('[data-prev-month]');
  const next = root.querySelector('[data-next-month]');
  const title = root.querySelector('[data-month-title]');
  const today = new Date(); today.setHours(12,0,0,0);
  let month = new Date(today.getFullYear(),today.getMonth(),1);
  let blocked = []; let loaded = false;
  const iso = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  const plus = (date,days) => { const d = new Date(date+'T12:00:00'); d.setDate(d.getDate()+days); return iso(d); };
  const isBlocked = day => blocked.some(b => day >= b.start && day < b.end);
  const rangeFree = (start,end) => { for(let d=start;d<end;d=plus(d,1)) if(isBlocked(d)) return false; return true; };
  const update = () => {
    const n = Math.max(1, Math.min(365, Number(nights.value) || 2));
    nights.value = n;
    if (arrival.value) departure.value = plus(arrival.value,n);
    const valid = loaded && arrival.value && departure.value && arrival.value >= iso(today) && rangeFree(arrival.value,departure.value);
    link.hidden = !valid;
    if (valid) {
      const url = new URL('https://fr.airbnb.be/rooms/1450634688033262798');
      url.searchParams.set('check_in',arrival.value);
      url.searchParams.set('check_out',departure.value);
      url.searchParams.set('adults','4');
      link.href = url.toString();
      status.textContent = msg.available;
    } else if (arrival.value && loaded) status.textContent = msg.unavailable;
  };
  const render = () => {
    title.textContent = new Intl.DateTimeFormat(locale,{month:'long',year:'numeric'}).format(month);
    prev.disabled = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
    calendar.replaceChildren();
    ['L','M','M','J','V','S','D'].forEach(label => { const el=document.createElement('span');el.className='cal-weekday';el.textContent=label;calendar.append(el); });
    const offset=(month.getDay()+6)%7;
    for(let i=0;i<offset;i++) calendar.append(document.createElement('span'));
    const count=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    for(let i=1;i<=count;i++){
      const d=iso(new Date(month.getFullYear(),month.getMonth(),i));
      const button=document.createElement('button');button.type='button';button.textContent=i;button.className='cal-day';
      const unavailable=!loaded || d<iso(today) || isBlocked(d);
      button.disabled=unavailable;
      button.title=!loaded?msg.notLoaded:unavailable?msg.blocked:msg.pick;
      if(unavailable)button.classList.add('cal-unavailable');
      if(d===arrival.value)button.classList.add('cal-selected');
      button.addEventListener('click',()=>{arrival.value=d;update();render();});
      calendar.append(button);
    }
  };
  prev.addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);render();});
  next.addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);render();});
  arrival.min=iso(today); arrival.addEventListener('change',()=>{update();render();});
  nights.addEventListener('change',update);
  render();
  fetch('/api/availability').then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error);blocked=data.blocked;loaded=true;status.textContent=msg.loaded+new Date(data.updatedAt).toLocaleString(locale)+'.'+msg.select;render();update();}).catch(()=>{loaded=false;status.textContent=msg.error;render();});
})();
