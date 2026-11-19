'use strict';

/* Worm SMM Admin — Demo Dashboard Only */

(() => {
  const $ = (id) => document.getElementById(id);

  const STORAGE_KEY = 'worm_smm_admin_demo_v1';

  const seed = {
    users: [
      {id:1,name:'أحمد محمد',email:'ahmed@example.com',status:'نشط',balance:150},
      {id:2,name:'محمد علي',email:'mohamed@example.com',status:'نشط',balance:80},
      {id:3,name:'سارة أحمد',email:'sara@example.com',status:'معلق',balance:0}
    ],
    services: [
      {id:1,name:'متابعو Instagram',category:'Instagram',price:5,status:'نشط'},
      {id:2,name:'مشاهدات TikTok',category:'TikTok',price:3,status:'نشط'},
      {id:3,name:'مشاهدات YouTube',category:'YouTube',price:8,status:'متوقف'}
    ],
    orders: [
      {id:1001,user:'أحمد محمد',service:'متابعو Instagram',quantity:1000,status:'قيد التنفيذ',date:'2026-11-18'},
      {id:1002,user:'محمد علي',service:'مشاهدات TikTok',quantity:5000,status:'مكتمل',date:'2026-11-18'},
      {id:1003,user:'سارة أحمد',service:'مشاهدات YouTube',quantity:500,status:'قيد المراجعة',date:'2026-11-19'}
    ],
    payments: [
      {id:501,user:'أحمد محمد',amount:100,method:'تحويل بنكي',status:'معلق',date:'2026-11-19'},
      {id:502,user:'محمد علي',amount:50,method:'تحويل بنكي',status:'مقبول',date:'2026-11-18'}
    ],
    providers: [
      {id:1,name:'مزود تجريبي 1',url:'https://example.com',status:'غير متصل'},
      {id:2,name:'مزود تجريبي 2',url:'https://example.org',status:'غير متصل'}
    ],
    ledger: [
      {id:1,user:'أحمد محمد',type:'رصيد تجريبي',amount:150,date:'2026-11-18'}
    ],
    settings: {
      siteName:'Worm SMM',
      currency:'نقطة',
      notice:'هذه لوحة تجريبية وليست نظاماً مالياً حقيقياً.'
    }
  };

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? {...seed, ...JSON.parse(saved)} : structuredClone(seed);
    } catch {
      return structuredClone(seed);
    }
  }

  let data = loadData();
  let currentSection = 'overview';
  let editing = null;

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderAll();
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    })[char]);
  }

  function money(value) {
    return Number(value || 0).toLocaleString('ar');
  }

  function makeId(items) {
    return Math.max(0, ...items.map(item => Number(item.id) || 0)) + 1;
  }

  function table(headers, rows) {
    return `
      <div class="table-container">
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.length ? rows.join('') :
            `<tr><td colspan="${headers.length}">لا توجد بيانات حالياً</td></tr>`}
          </tbody>
        </table>
      </div>`;
  }

  function statusBadge(status) {
    return `<span class="status-badge">${escapeHTML(status)}</span>`;
  }

  function renderOverview() {
    $('statUsers').textContent = money(data.users.length);
    $('statOrders').textContent = money(data.orders.length);
    $('statServices').textContent = money(data.services.length);
    $('statPayments').textContent = money(
      data.payments.filter(p => p.status === 'معلق').length
    );

    $('recentOrders').innerHTML = table(
      ['رقم الطلب','المستخدم','الخدمة','الكمية','الحالة'],
      data.orders.slice(-5).reverse().map(o => `
        <tr>
          <td>#${escapeHTML(o.id)}</td>
          <td>${escapeHTML(o.user)}</td>
          <td>${escapeHTML(o.service)}</td>
          <td>${money(o.quantity)}</td>
          <td>${statusBadge(o.status)}</td>
        </tr>`)
    );
  }

  function renderUsers() {
    $('usersContent').innerHTML = table(
      ['الاسم','البريد','الرصيد التجريبي','الحالة','الإجراءات'],
      data.users.map(u => `
        <tr>
          <td>${escapeHTML(u.name)}</td>
          <td>${escapeHTML(u.email)}</td>
          <td>${money(u.balance)} نقطة</td>
          <td>${statusBadge(u.status)}</td>
          <td>
            <button data-action="edit" data-type="user" data-id="${u.id}">تعديل</button>
            <button data-action="delete" data-type="user" data-id="${u.id}">حذف</button>
          </td>
        </tr>`)
    );
  }

  function renderWallets() {
    $('walletsContent').innerHTML =
      '<p class="demo-notice">الأرصدة التالية تجريبية ولا تمثل أموالاً حقيقية.</p>' +
      table(
        ['المستخدم','الرصيد','الإجراء'],
        data.users.map(u => `
          <tr>
            <td>${escapeHTML(u.name)}</td>
            <td>${money(u.balance)} نقطة</td>
            <td><button data-action="wallet" data-id="${u.id}">تعديل رصيد تجريبي</button></td>
          </tr>`)
      );
  }

  function renderServices() {
    $('servicesContent').innerHTML = table(
      ['الخدمة','التصنيف','السعر بالنقاط','الحالة','الإجراءات'],
      data.services.map(s => `
        <tr>
          <td>${escapeHTML(s.name)}</td>
          <td>${escapeHTML(s.category)}</td>
          <td>${money(s.price)}</td>
          <td>${statusBadge(s.status)}</td>
          <td>
            <button data-action="edit" data-type="service" data-id="${s.id}">تعديل</button>
            <button data-action="delete" data-type="service" data-id="${s.id}">حذف</button>
          </td>
        </tr>`)
    );
  }

  function renderOrders() {
    $('ordersContent').innerHTML = table(
      ['رقم الطلب','المستخدم','الخدمة','الكمية','التاريخ','الحالة','الإجراء'],
      data.orders.map(o => `
        <tr>
          <td>#${escapeHTML(o.id)}</td>
          <td>${escapeHTML(o.user)}</td>
          <td>${escapeHTML(o.service)}</td>
          <td>${money(o.quantity)}</td>
          <td>${escapeHTML(o.date)}</td>
          <td>${statusBadge(o.status)}</td>
          <td>
            <select data-action="order-status" data-id="${o.id}">
              ${['قيد المراجعة','قيد التنفيذ','مكتمل','ملغي'].map(s =>
                `<option ${o.status === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </td>
        </tr>`)
    );
  }

  function renderPayments() {
    $('paymentsContent').innerHTML =
      '<p class="demo-notice">قبول الإيداع هنا يضيف نقاطاً تجريبية فقط.</p>' +
      table(
        ['رقم العملية','المستخدم','المبلغ','الطريقة','التاريخ','الحالة','الإجراء'],
        data.payments.map(p => `
          <tr>
            <td>#${escapeHTML(p.id)}</td>
            <td>${escapeHTML(p.user)}</td>
            <td>${money(p.amount)}</td>
            <td>${escapeHTML(p.method)}</td>
            <td>${escapeHTML(p.date)}</td>
            <td>${statusBadge(p.status)}</td>
            <td>
              ${p.status === 'معلق' ? `
                <button data-action="payment-approve" data-id="${p.id}">قبول تجريبي</button>
                <button data-action="payment-reject" data-id="${p.id}">رفض</button>
              ` : '—'}
            </td>
          </tr>`)
      );
  }

  function renderProviders() {
    $('providersContent').innerHTML =
      '<p class="demo-notice">هذه بيانات تعريفية فقط. لا يوجد اتصال فعلي بمزودي API.</p>' +
      table(
        ['اسم المزود','الرابط','الحالة','الإجراءات'],
        data.providers.map(p => `
          <tr>
            <td>${escapeHTML(p.name)}</td>
            <td>${escapeHTML(p.url)}</td>
            <td>${statusBadge(p.status)}</td>
            <td>
              <button data-action="edit" data-type="provider" data-id="${p.id}">تعديل</button>
              <button data-action="delete" data-type="provider" data-id="${p.id}">حذف</button>
            </td>
          </tr>`)
      );
  }

  function renderLedger() {
    $('ledgerContent').innerHTML =
      '<p class="demo-notice">السجل التالي تجريبي، وليس سجلاً مالياً معتمداً.</p>' +
      table(
        ['رقم الحركة','المستخدم','النوع','المبلغ بالنقاط','التاريخ'],
        data.ledger.map(item => `
          <tr>
            <td>#${escapeHTML(item.id)}</td>
            <td>${escapeHTML(item.user)}</td>
            <td>${escapeHTML(item.type)}</td>
            <td>${money(item.amount)}</td>
            <td>${escapeHTML(item.date)}</td>
          </tr>`)
      );
  }

  function renderReports() {
    const completed = data.orders.filter(o => o.status === 'مكتمل').length;
    const pending = data.orders.filter(o => o.status === 'قيد المراجعة').length;
    const approved = data.payments.filter(p => p.status === 'مقبول').length;

    $('reportsContent').innerHTML = `
      <div class="content-card">
        <h3>تقارير المعاينة</h3>
        <p>إجمالي المستخدمين: <strong>${money(data.users.length)}</strong></p>
        <p>إجمالي الطلبات: <strong>${money(data.orders.length)}</strong></p>
        <p>الطلبات المكتملة: <strong>${money(completed)}</strong></p>
        <p>الطلبات قيد المراجعة: <strong>${money(pending)}</strong></p>
        <p>الإيداعات المقبولة تجريبياً: <strong>${money(approved)}</strong></p>
        <p>إجمالي الخدمات: <strong>${money(data.services.length)}</strong></p>
      </div>`;
  }

  function renderSettings() {
    $('settingsContent').innerHTML = `
      <div class="content-card">
        <h3>إعدادات المعاينة</h3>
        <form id="settingsForm">
          <label>اسم الموقع</label>
          <input name="siteName" value="${escapeHTML(data.settings.siteName)}" required>
          <label>اسم وحدة الرصيد</label>
          <input name="currency" value="${escapeHTML(data.settings.currency)}" required>
          <label>رسالة التنبيه</label>
          <textarea name="notice">${escapeHTML(data.settings.notice)}</textarea>
          <button type="submit" class="primary-button">حفظ الإعدادات</button>
        </form>
        <hr>
        <button data-action="reset-demo">إعادة بيانات المعاينة الأصلية</button>
      </div>`;
  }

  function renderAll() {
    renderOverview();
    renderUsers();
    renderWallets();
    renderServices();
    renderOrders();
    renderPayments();
    renderProviders();
    renderLedger();
    renderReports();
    renderSettings();
  }

  const titles = {
    overview:'الرئيسية والإحصائيات',
    users:'إدارة المستخدمين',
    wallets:'المحافظ والأرصدة',
    services:'إدارة الخدمات',
    orders:'إدارة الطلبات',
    payments:'المدفوعات والإيداعات',
    providers:'مزودو API',
    ledger:'السجل المالي',
    reports:'التقارير',
    settings:'الإعدادات والأمان'
  };

  function showSection(section) {
    if (!titles[section]) return;
    currentSection = section;

    document.querySelectorAll('.dashboard-section').forEach(el =>
      el.classList.toggle('active', el.id === section)
    );

    document.querySelectorAll('.nav-link').forEach(el =>
      el.classList.toggle('active', el.dataset.section === section)
    );

    $('pageTitle').textContent = titles[section];
    $('sidebar')?.classList.remove('open');
  }

  function openDialog(type, item = null) {
    editing = item ? {type, id:item.id} : {type, id:null};

    const fields = {
      user: [
        ['name','اسم المستخدم','text'],
        ['email','البريد الإلكتروني','email'],
        ['balance','الرصيد التجريبي بالنقاط','number'],
        ['status','الحالة','text']
      ],
      service: [
        ['name','اسم الخدمة','text'],
        ['category','التصنيف','text'],
        ['price','السعر بالنقاط','number'],
        ['status','الحالة','text']
      ],
      provider: [
        ['name','اسم المزود','text'],
        ['url','رابط المزود','url'],
        ['status','الحالة','text']
      ]
    };

    if (type === 'wallet') {
      const user = data.users.find(u => u.id === item.id);
      $('dialogTitle').textContent = 'تعديل رصيد تجريبي';
      $('dialogForm').innerHTML = `
        <p>المستخدم: ${escapeHTML(user.name)}</p>
        <p>الرصيد الحالي: ${money(user.balance)} نقطة</p>
        <label>قيمة التغيير (موجب أو سالب)</label>
        <input name="amount" type="number" required>
        <button type="submit" class="primary-button">حفظ التغيير التجريبي</button>`;
      editing = {type:'wallet',id:item.id};
    } else {
      const labels = {user:'مستخدم',service:'خدمة',provider:'مزود'};
      $('dialogTitle').textContent = item ? 'تعديل ' + labels[type] : 'إضافة ' + labels[type];

      $('dialogForm').innerHTML = fields[type].map(([key,label,inputType]) => `
        <label>${label}</label>
        <input name="${key}" type="${inputType}"
          value="${escapeHTML(item?.[key] ?? (key === 'status' ? 'نشط' : ''))}"
          ${key === 'name' ? 'required' : ''}>
      `).join('') + '<button type="submit" class="primary-button">حفظ</button>';
    }

    $('dialog').classList.add('open');
    $('dialog').setAttribute('aria-hidden','false');
  }

  function closeDialog() {
    $('dialog').classList.remove('open');
    $('dialog').setAttribute('aria-hidden','true');
    editing = null;
  }

  document.querySelectorAll('.nav-link[data-section]').forEach(button => {
    button.addEventListener('click', () => showSection(button.dataset.section));
  });

  $('menuToggle')?.addEventListener('click', () =>
    $('sidebar')?.classList.toggle('open')
  );

  $('dialogClose')?.addEventListener('click', closeDialog);

  $('dialog')?.addEventListener('click', event => {
    if (event.target === $('dialog')) closeDialog();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeDialog();
  });

  document.querySelectorAll('[data-add]').forEach(button => {
    button.addEventListener('click', () => openDialog(button.dataset.add));
  });

  $('dialogForm')?.addEventListener('submit', event => {
    event.preventDefault();
    if (!editing) return;

    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());

    if (editing.type === 'wallet') {
      const user = data.users.find(u => u.id === editing.id);
      const amount = Number(values.amount);
      if (!user || !Number.isFinite(amount) || user.balance + amount < 0) {
        alert('قيمة الرصيد غير صالحة.');
        return;
      }
      user.balance += amount;
      data.ledger.push({
        id:makeId(data.ledger),
        user:user.name,
        type:'تعديل رصيد تجريبي',
        amount,
        date:new Date().toISOString().slice(0,10)
      });
    } else {
      const collection = data[editing.type + 's'];
      const numericFields = editing.type === 'user'
        ? ['balance'] : editing.type === 'service' ? ['price'] : [];

      numericFields.forEach(key => values[key] = Number(values[key] || 0));

      if (editing.id !== null) {
        const old = collection.find(x => x.id === editing.id);
        if (old) Object.assign(old, values);
      } else {
        collection.push({id:makeId(collection), ...values});
      }
    }

    save();
    closeDialog();
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === 'edit') {
      const type = button.dataset.type;
      const item = data[type + 's'].find(x => x.id === id);
      if (item) openDialog(type, item);
    }

    if (action === 'delete') {
      const type = button.dataset.type;
      if (!confirm('هل تريد حذف هذا العنصر من بيانات المعاينة؟')) return;
      data[type + 's'] = data[type + 's'].filter(x => x.id !== id);
      save();
    }

    if (action === 'wallet') {
      const user = data.users.find(x => x.id === id);
      if (user) openDialog('wallet', user);
    }

    if (action === 'payment-approve' || action === 'payment-reject') {
      const payment = data.payments.find(x => x.id === id);
      if (!payment || payment.status !== 'معلق') return;

      if (action === 'payment-approve') {
        if (!confirm('تأكيد القبول التجريبي؟ لن يتم تحصيل أو تحويل أي أموال.')) return;
        payment.status = 'مقبول';
        const user = data.users.find(u => u.name === payment.user);
        if (user) {
          user.balance += Number(payment.amount);
          data.ledger.push({
            id:makeId(data.ledger),
            user:user.name,
            type:'إيداع تجريبي مقبول',
            amount:Number(payment.amount),
            date:new Date().toISOString().slice(0,10)
          });
        }
      } else {
        payment.status = 'مرفوض';
      }
      save();
    }

    if (action === 'reset-demo') {
      if (!confirm('إعادة جميع بيانات المعاينة إلى حالتها الأصلية؟')) return;
      data = structuredClone(seed);
      save();
    }
  });

  document.addEventListener('change', event => {
    const select = event.target.closest('[data-action="order-status"]');
    if (!select) return;
    const order = data.orders.find(o => o.id === Number(select.dataset.id));
    if (order) {
      order.status = select.value;
      save();
    }
  });

  document.addEventListener('submit', event => {
    if (event.target.id !== 'settingsForm') return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target).entries());
    data.settings = values;
    save();
    alert('تم حفظ إعدادات المعاينة محلياً.');
  });

  $('exportButton')?.addEventListener('click', () => {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {type:'application/json;charset=utf-8'}
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'worm-smm-demo-data.json';
    link.click();
    URL.revokeObjectURL(url);
  });

  renderAll();
  showSection('overview');
})();

/* Worm SMM - new dashboard integration */
(() => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menuToggle');

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('show');
  }

  menuToggle?.addEventListener('click', () => {
    const opened = sidebar?.classList.contains('open');
    overlay?.classList.toggle('show', !!opened);
  });

  overlay?.addEventListener('click', closeSidebar);

  document.querySelectorAll('[data-section-link]').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.dataset.sectionLink;
      document.querySelector(`.nav-link[data-section="${section}"]`)?.click();
      closeSidebar();
    });
  });

  document.querySelectorAll('.quick [data-add="service"]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('#services [data-add="service"]')?.click();
    });
  });

  const search = document.querySelector('.search');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();

    document.querySelectorAll('.dashboard-section.active table tbody tr').forEach(row => {
      row.hidden = !row.textContent.toLocaleLowerCase().includes(query);
    });

    document.querySelectorAll('.dashboard-section.active table').forEach(table => {
      table.querySelectorAll('tbody tr').forEach(row => {
        if (!query) row.hidden = false;
      });
    });
  });

  const ordersStat = document.getElementById('statOrders');
  const chartOrders = document.getElementById('chartOrders');

  if (ordersStat && chartOrders) {
    const updateChartTotal = () => {
      chartOrders.textContent = ordersStat.textContent.trim() || '0';
    };

    updateChartTotal();

    new MutationObserver(updateChartTotal).observe(ordersStat, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
})();
