const modal=document.getElementById('loginModal');
function showLogin(){modal.classList.add('open');modal.setAttribute('aria-hidden','false')}
function hideLogin(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
document.getElementById('loginOpen').addEventListener('click',showLogin);
document.getElementById('loginOpen2').addEventListener('click',showLogin);
document.getElementById('loginClose').addEventListener('click',hideLogin);
modal.addEventListener('click',e=>{if(e.target===modal)hideLogin()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideLogin()});
document.getElementById('demoLogin').addEventListener('click',()=>{
 document.getElementById('formHint').textContent='هذه معاينة فقط؛ لم يتم إعداد مصادقة أو حساب مدير بعد.';
});
document.getElementById('menuToggle').addEventListener('click',()=>document.querySelector('.topnav').classList.toggle('open'));
const notes={overview:'نظرة عامة على لوحة المدير — بيانات تجريبية.',services:'قسم الخدمات: ستتم إضافة الخدمات وتحريرها بعد ربط النظام بالخادم.',orders:'قسم الطلبات: ستظهر هنا الطلبات وحالاتها بعد إعداد قاعدة البيانات.',providers:'قسم مزودي API: إدارة الاتصالات ومفاتيح التكامل بشكل آمن.',reports:'قسم التقارير: عرض إحصائيات حقيقية بعد ربط مصادر البيانات.',settings:'قسم الإعدادات: تهيئة الموقع وحساب المدير.'};
document.querySelectorAll('.side-link').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('.side-link').forEach(x=>x.classList.remove('selected'));
 btn.classList.add('selected');
 document.getElementById('viewNote').textContent=notes[btn.dataset.view];
}));
