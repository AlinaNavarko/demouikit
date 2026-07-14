(function () {
  'use strict';

  const PLATFORMS = {
    servers: { id: 'servers', title: 'Сервер', pageTitle: 'Серверы', icon: 'server' },
    storage: { id: 'storage', title: 'Система хранения данных (СХД)', pageTitle: 'Системы хранения данных', icon: 'storage' }
  };

  const BRANDS = {
    servers: ['HPE', 'Dell', 'IBM', 'Lenovo', 'H3C', 'xFusion', 'Supermicro', 'Fujitsu'],
    storage: ['HPE', 'Dell', 'IBM', 'Lenovo', 'Huawei', 'Fujitsu', 'QSAN', 'Infortrend']
  };

  const BRAND_ASSETS = 'images/brands_configurator/svg/';

  const BRAND_LOGOS = {
    HPE: 'Hewlett_Packard_Enterprise_logo 1.svg',
    Dell: 'dell.svg',
    IBM: 'ibm-3 2.svg',
    Lenovo: 'lenovo-2 1.svg',
    H3C: 'h3c 1.svg',
    xFusion: 'xfusion.svg',
    Supermicro: 'supermicro.svg',
    Fujitsu: 'fujitsu-logo 1.svg',
    Huawei: 'huawei.svg',
    QSAN: 'QSAN_Logo-01 2.svg',
    Infortrend: 'infortrend.png'
  };

  function brandLogoSrc(brand) {
    const file = BRAND_LOGOS[brand];
    return file ? BRAND_ASSETS + encodeURI(file) : null;
  }

  function renderBrandLogoMarkup(brand) {
    const src = brandLogoSrc(brand);
    if (!src) {
      return `<div class="cfg-brand-logo">${brand}</div>`;
    }
    return `<span class="cfg-brand-logo"><img class="cfg-brand-logo-img" src="${src}" alt=""></span>`;
  }

  const COUNT_OPTS = [...Array(24)].map((_, i) => String(i + 1)).concat(['>24']);

  const HDD_CAPACITY = [
    '300 GB SAS', '600 GB SAS', '900 GB SAS', '1 TB SATA', '1 TB SAS', '1.2 TB SAS', '1.8 TB SAS',
    '2 TB SATA', '2 TB SAS', '2.4 TB SAS', '4 TB SATA', '4 TB SAS', '6 TB SATA', '6 TB SAS',
    '8 TB SATA', '8 TB SAS', '10 TB SATA', '10 TB SAS', '>10 TB SATA', '>10 TB SAS'
  ];

  const SSD_CAPACITY = [
    '240 GB SATA', '480 GB SAS', '960 GB NVMe', '1.92 TB SAS',
    '3.84 TB NVMe', '7.68 TB NVMe', '15.36 TB NVMe'
  ];

  const SERVER_SCHEMA = [
    {
      title: 'Основная информация',
      fields: [
        { id: 'serverCount', label: 'Количество серверов', type: 'select', options: COUNT_OPTS.slice(0, 5).concat(['>5']) },
        { id: 'formFactor', label: 'Форм-фактор', type: 'radio', options: [
          { value: 'rack', label: 'Rack (стоечный)' },
          { value: 'tower', label: 'Tower (башенный)' },
          { value: 'blade', label: 'Blade-шасси' },
          { value: 'edge', label: 'Edge' }
        ]},
        { id: 'formFactorSize', label: 'Размер в U', type: 'radio', options: ['1U', '2U', '4U'],
          showIf: (v) => v.formFactor === 'rack' || v.formFactor === 'tower' },
        { id: 'drivePlatform', label: 'Платформа для дисков', type: 'select', options: [
          '4×3.5"', '8×3.5"', '10×3.5"', '12×3.5"', '>12×3.5"',
          '8×2.5"', '10×2.5"', '16×2.5"', '24×2.5"', '>24×2.5"'
        ]},
        { id: 'serverPurpose', label: 'Назначение сервера', type: 'checkbox', options: [
          'файловый сервер', 'вычислительный сервер', 'сервер БД', 'веб-сервер', 'виртуализация'
        ]}
      ]
    },
    {
      title: 'Процессор (CPU)',
      fields: [
        { id: 'cpuCount', label: 'Количество CPU', type: 'radio', options: ['1', '2', '4', '8'] },
        { id: 'cpuVendor', label: 'Производитель CPU', type: 'radio', options: ['Intel', 'AMD'] }
      ]
    },
    {
      title: 'Память (RAM)',
      fields: [
        { id: 'ramSize', label: 'Объем ОЗУ', type: 'select', options: [
          '16 GB', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB и более'
        ]},
        { id: 'ramType', label: 'Тип памяти', type: 'radio', options: ['DDR3', 'DDR4', 'DDR5'] }
      ]
    },
    {
      title: 'RAID-контроллер',
      fields: [
        { id: 'raidController', label: 'RAID-контроллер', type: 'radio', options: [
          'нет', '2 GB cache', '4 GB cache', '8 GB cache'
        ]}
      ]
    },
    {
      title: 'Хранилище HDD',
      fields: [
        { id: 'hddFormFactor', label: 'Форм-фактор HDD', type: 'radio', options: ['2.5"', '3.5"'] },
        { id: 'hddCount', label: 'Количество HDD', type: 'select', options: COUNT_OPTS },
        { id: 'hddCapacity', label: 'Объём одного HDD', type: 'select', options: HDD_CAPACITY }
      ]
    },
    {
      title: 'Хранилище SSD',
      fields: [
        { id: 'ssdFormFactor', label: 'Форм-фактор SSD', type: 'radio', options: ['2.5"', '3.5"', 'M.2'] },
        { id: 'ssdCount', label: 'Количество SSD', type: 'select', options: COUNT_OPTS },
        { id: 'ssdCapacity', label: 'Объём одного SSD', type: 'select', options: SSD_CAPACITY }
      ]
    },
    {
      title: 'Сеть и расширения',
      fields: [
        { id: 'ethernet', label: 'Ethernet', type: 'select', options: [
          '2×1GE RJ45', '4×1GE', '2×10GE SFP+', '4×10GE', '2×25GE', '2×40GE', '2×100GE'
        ]},
        { id: 'pcieAdapters', label: 'Другие PCIe-адаптеры', type: 'radio', options: ['да', 'нет'] }
      ]
    },
    {
      title: 'Питание (PSU)',
      fields: [
        { id: 'psuCount', label: 'Количество блоков питания', type: 'radio', options: ['1', '2', '4'] },
        { id: 'psuPower', label: 'Мощность блока питания', type: 'radio', options: [
          'до 500 Вт', '500–750 Вт', '750–1000 Вт', 'более 1000 Вт'
        ]}
      ]
    },
    {
      title: 'GPU (опционально)',
      fields: [
        { id: 'gpuCount', label: 'Количество GPU', type: 'radio', options: ['нет', '1', '2', '4', '8', 'более 8'] },
        { id: 'gpuMemory', label: 'Объем памяти GPU', type: 'radio', options: ['8', '12', '16', '24', '32', '48', '64', '80 ГБ'],
          showIf: (v) => v.gpuCount && v.gpuCount !== 'нет' }
      ]
    },
    {
      title: 'Работы / услуги',
      fields: [
        { id: 'services', label: 'Дополнительные услуги', type: 'checkbox', options: [
          'установка и настройка', 'монтаж в стойку', 'конфигурация RAID',
          'установка ОС', 'техническая поддержка', 'расширенная гарантия'
        ]}
      ]
    }
  ];

  const STORAGE_SCHEMA = [
    {
      title: 'Основное',
      fields: [
        { id: 'storageCount', label: 'Количество СХД', type: 'select', options: COUNT_OPTS.slice(0, 5).concat(['>5']) },
        { id: 'storageType', label: 'Тип системы хранения', type: 'checkbox', options: [
          'SAN (Block level)', 'NAS (File level)', 'Unified (Block + File)', 'S3 Object Storage'
        ]},
        { id: 'storageFormFactor', label: 'Форм-фактор', type: 'radio', options: ['2U', '3U', '4U', '5U+'] }
      ]
    },
    {
      title: 'Контроллеры',
      fields: [
        { id: 'controllerCount', label: 'Количество контроллеров', type: 'radio', options: ['1', '2', '2+'] },
        { id: 'controllerCache', label: 'Объём кэша на контроллер', type: 'radio', options: [
          '8', '16', '32', '64', '128', '256 ГБ'
        ]}
      ]
    },
    {
      title: 'Хранилище',
      fields: [
        { id: 'mediaType', label: 'Тип носителей', type: 'radio', options: [
          'Hybrid storage', 'All-flash storage', 'All-flash NVMe storage'
        ]},
        { id: 'driveBays', label: 'Количество отсеков', type: 'checkbox', options: [
          '12 LFF', '24 SFF', '25 SFF', '36 SFF', 'NVMe expansion shelf', 'SAS expansion shelf'
        ]},
        { id: 'driveTypes', label: 'Тип накопителей', type: 'checkbox', options: [
          'NL-SAS (HDD)', 'SAS HDD', 'SAS SSD', 'NVMe SSD'
        ]}
      ]
    },
    {
      title: 'Производительность',
      fields: [
        { id: 'connectionTypes', label: 'Тип подключений', type: 'checkbox', options: [
          'FC 16/32 Gb', 'iSCSI', 'NVMe-oF'
        ]},
        { id: 'raidProfiles', label: 'RAID-профили', type: 'checkbox', options: [
          'RAID 0', 'RAID 1', 'RAID 5', 'RAID 6', 'RAID 10', 'RAID 50', 'RAID 60'
        ]}
      ]
    }
  ];

  const ICONS = {
    server: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="6" rx="1"/><rect x="2" y="11" width="20" height="6" rx="1"/><circle cx="6" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="6" cy="14" r="1" fill="currentColor" stroke="none"/></svg>',
    storage: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    summary: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>',
    panelClose: '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>'
  };

  const state = {
    step: 1,
    platform: null,
    brand: null,
    values: {},
    sidebarCollapsed: false,
    modalOpen: false,
    submitted: false
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const app = $('#app');
  const stepper = $('#stepper');
  const hero = $('#hero');
  const overlay = $('#modal-overlay');

  function getSchema() {
    return state.platform === 'servers' ? SERVER_SCHEMA : STORAGE_SCHEMA;
  }

  function getAllFields() {
    return getSchema().flatMap((b) => b.fields);
  }

  function fieldVisible(field) {
    return !field.showIf || field.showIf(state.values);
  }

  function getValue(field) {
    const v = state.values[field.id];
    if (field.type === 'checkbox') return Array.isArray(v) ? v : [];
    return v || '';
  }

  function displayValue(field) {
    const v = getValue(field);
    if (field.type === 'checkbox') return v.length ? v.join(', ') : '';
    if (field.type === 'radio' && field.options[0]?.value) {
      const opt = field.options.find((o) => o.value === v);
      return opt ? opt.label : v;
    }
    return v;
  }

  function setValue(id, value) {
    if (value === '' || (Array.isArray(value) && !value.length)) {
      delete state.values[id];
    } else {
      state.values[id] = value;
    }
    refreshConditionalFields();
    updateSidebarOnly();
  }

  function resetAll(skipConfirm) {
    if (!skipConfirm && !confirm('Начать заново? Все выбранные опции будут сброшены.')) return;
    state.step = 1;
    state.platform = null;
    state.brand = null;
    state.values = {};
    state.submitted = false;
    state.sidebarCollapsed = false;
    render();
  }

  function goStep(n) {
    state.step = n;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderStepper() {
    const steps = [
      { n: 1, label: 'Платформа' },
      { n: 2, label: 'Производитель' },
      { n: 3, label: 'Требования' }
    ];
    stepper.innerHTML = steps.map((s, i) => {
      const cls = s.n === state.step ? 'is-active' : s.n < state.step ? 'is-done' : '';
      const line = i < steps.length - 1
        ? `<div class="cfg-step-line${s.n < state.step ? ' is-done' : ''}"></div>` : '';
      return `
        <div class="cfg-step ${cls}">
          <span class="cfg-step-num">${s.n < state.step ? '✓' : s.n}</span>
          <span class="cfg-step-label">${s.label}</span>
        </div>${line}`;
    }).join('');
  }

  function renderHero() {
    if (state.step === 1 && !state.submitted) {
      hero.hidden = false;
      hero.innerHTML = `
        <h1>Соберите требования — <em>мы соберем решение</em></h1>
        <p>Опишите задачу, выберите параметры — менеджер подготовит коммерческое предложение</p>`;
    } else {
      hero.hidden = true;
    }
  }

  function renderStep1() {
    return `
      <div class="cfg-step-view">
        <h2 class="cfg-step-title">Выберите платформу</h2>
        <p class="cfg-step-desc">Что вы планируете закупить?</p>
        <div class="cfg-cards">
          ${Object.values(PLATFORMS).map((p) => `
            <button type="button" class="cfg-card" data-platform="${p.id}">
              <div class="cfg-card-icon">${ICONS[p.icon]}</div>
              <h3>${p.title}</h3>
              <p>${p.id === 'servers' ? 'Стоечные, башенные, blade и edge-серверы' : 'SAN, NAS, unified и object storage'}</p>
            </button>
          `).join('')}
        </div>
      </div>`;
  }

  function renderStep2() {
    const brands = BRANDS[state.platform] || [];
    const platform = PLATFORMS[state.platform];
    return `
      <div class="cfg-step-view cfg-step-view--brands">
        <header class="cfg-brands-header">
          <div class="cfg-brands-meta">
            <span class="cfg-brands-badge">${platform.pageTitle}</span>
            <span class="cfg-brands-step">Шаг 2 из 3</span>
          </div>
          <h2 class="cfg-brands-title">Выберите производителя</h2>
          <p class="cfg-brands-desc">Укажите предпочтительный бренд оборудования</p>
        </header>

        <div class="cfg-brands-grid">
          ${brands.map((b) => `
            <button type="button" class="cfg-brand-card" data-brand="${b}" aria-label="${b}">
              ${renderBrandLogoMarkup(b)}
            </button>
          `).join('')}
        </div>

        <div class="cfg-brands-skip">
          <button type="button" class="cfg-brand-skip" data-brand="__none__">
            Не выбрано
          </button>
        </div>

        <div class="cfg-actions cfg-actions--brands">
          <button type="button" class="btn-secondary" data-action="back">← Назад</button>
        </div>
      </div>`;
  }

  function renderField(field) {
    const hidden = fieldVisible(field) ? '' : ' is-hidden';
    const val = getValue(field);

    if (field.type === 'select') {
      return `
        <div class="cfg-field${hidden}" data-field="${field.id}">
          <label class="cfg-label">${field.label}</label>
          <select class="cfg-select" data-id="${field.id}">
            <option value="">— Не выбрано —</option>
            ${field.options.map((o) => `<option value="${o}"${val === o ? ' selected' : ''}>${o}</option>`).join('')}
          </select>
        </div>`;
    }

    if (field.type === 'radio') {
      const opts = field.options.map((o) =>
        typeof o === 'string' ? { value: o, label: o } : o
      );
      return `
        <div class="cfg-field${hidden}" data-field="${field.id}">
          <span class="cfg-label">${field.label}</span>
          <div class="cfg-options">
            ${opts.map((o) => `
              <div class="cfg-option">
                <input type="radio" name="${field.id}" id="${field.id}-${o.value}" value="${o.value}"${val === o.value ? ' checked' : ''}>
                <label for="${field.id}-${o.value}">${o.label}</label>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    if (field.type === 'checkbox') {
      return `
        <div class="cfg-field${hidden}" data-field="${field.id}">
          <span class="cfg-label">${field.label}</span>
          <div class="cfg-options">
            ${field.options.map((o, i) => `
              <div class="cfg-option">
                <input type="checkbox" id="${field.id}-${i}" data-field-id="${field.id}" value="${o}"${val.includes(o) ? ' checked' : ''}>
                <label for="${field.id}-${i}">${o}</label>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    return '';
  }

  function collectSummaryItems({ onlySelected = false } = {}) {
    const items = [];

    if (state.platform) {
      items.push({ label: 'Платформа', value: PLATFORMS[state.platform].title });
    }

    if (state.brand && state.brand !== 'Не выбрано') {
      items.push({ label: 'Производитель', value: state.brand });
    }

    getAllFields().forEach((field) => {
      if (!fieldVisible(field)) return;
      const text = displayValue(field);
      if (onlySelected && !text) return;
      items.push({ label: field.label, value: text });
    });

    return items;
  }

  function getSelectedOptionCount() {
    return collectSummaryItems({ onlySelected: true }).length;
  }

  function renderSummaryItems() {
    const contextItems = collectSummaryItems({ onlySelected: false }).filter(
      (item) => item.label === 'Платформа' || item.label === 'Производитель'
    );
    const selectedFields = collectSummaryItems({ onlySelected: true }).filter(
      (item) => item.label !== 'Платформа' && item.label !== 'Производитель'
    );

    const renderSummaryLine = (item) => `
      <div class="cfg-summary-item">
        <span class="cfg-summary-label">${item.label}:</span> <span class="cfg-summary-value">${item.value}</span>
      </div>`;

    const contextHtml = contextItems.map(renderSummaryLine).join('');

    if (!selectedFields.length) {
      return `${contextHtml}
        <p class="cfg-sidebar-empty">Выберите параметры — они появятся здесь</p>`;
    }

    const fieldsHtml = selectedFields.map(renderSummaryLine).join('');

    return contextHtml + fieldsHtml;
  }

  function renderStep3() {
    const platform = PLATFORMS[state.platform];
    const brandLabel = state.brand || 'Не выбрано';
    const collapsed = state.sidebarCollapsed ? ' is-collapsed' : '';
    const layoutCollapsed = state.sidebarCollapsed ? ' cfg-form-layout--sidebar-collapsed' : '';
    const selectedCount = getSelectedOptionCount();

    return `
      <div class="cfg-step-view cfg-form-layout${layoutCollapsed}">
        <div class="cfg-context-bar">
          <span class="cfg-tag">${platform.pageTitle}</span>
          <span>Производитель: <strong>${brandLabel}</strong></span>
        </div>

        <div class="cfg-blocks">
          ${getSchema().map((block) => `
            <section class="cfg-block">
              <h3 class="cfg-block-title">${block.title}</h3>
              ${block.fields.map(renderField).join('')}
            </section>
          `).join('')}
          <div class="cfg-actions">
            <button type="button" class="btn-secondary" data-action="back">← Назад</button>
            <button type="button" class="btn-primary" data-action="continue">Продолжить</button>
            <button type="button" class="cfg-reset" data-action="reset">Начать заново</button>
          </div>
        </div>

        <aside class="cfg-sidebar${collapsed}" id="sidebar">
          <button
            type="button"
            class="cfg-sidebar-fab"
            data-action="toggle-sidebar"
            aria-expanded="${!state.sidebarCollapsed}"
            aria-label="Развернуть выбранные опции"
            title="Выбранные опции"
          >
            <span class="cfg-sidebar-fab-icon" aria-hidden="true">${ICONS.summary}</span>
            <span class="cfg-sidebar-dot" id="sidebar-dot"${selectedCount ? '' : ' hidden'} aria-hidden="true"></span>
          </button>
          <div class="cfg-sidebar-panel">
            <div class="cfg-sidebar-head">
              <h3>Выбранные опции</h3>
              <button
                type="button"
                class="cfg-sidebar-toggle"
                data-action="toggle-sidebar"
                aria-expanded="true"
                aria-label="Свернуть панель"
                title="Свернуть"
              >
                <span aria-hidden="true">${ICONS.panelClose}</span>
              </button>
            </div>
            <div class="cfg-sidebar-body" id="sidebar-body">
              ${renderSummaryItems()}
            </div>
          </div>
        </aside>
      </div>`;
  }

  function renderSuccess() {
    return `
      <div class="cfg-success cfg-step-view">
        <div class="cfg-success-icon">${ICONS.check}</div>
        <h2>Заявка отправлена</h2>
        <p>Менеджер Forte SYSTEM свяжется с вами для подготовки коммерческого предложения.</p>
        <button type="button" class="btn-primary" data-action="new">Новая заявка</button>
      </div>`;
  }

  function collectUnselectedLabels() {
    const labels = [];

    if (!state.brand || state.brand === 'Не выбрано') {
      labels.push('Производитель');
    }

    getAllFields().forEach((field) => {
      if (!fieldVisible(field)) return;
      if (!displayValue(field)) labels.push(field.label);
    });

    return labels;
  }

  function renderModalUnselectedList() {
    const labels = collectUnselectedLabels();
    if (!labels.length) return '';

    return `
      <div class="cfg-modal-unselected">
        <h4 class="cfg-modal-unselected-title">Не указано</h4>
        <div class="cfg-modal-summary cfg-modal-summary--unselected">
          ${labels.map((label) => `
            <div class="cfg-modal-summary-item cfg-modal-summary-item--empty">
              <span class="cfg-modal-summary-label">${label}:</span> <span class="cfg-modal-summary-value">Не выбрано</span>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function renderModalSummary() {
    const items = collectSummaryItems({ onlySelected: true });
    if (!items.length) {
      return '<p class="cfg-modal-summary-empty">Выбранные параметры отсутствуют</p>';
    }
    return items.map((item) => `
      <div class="cfg-modal-summary-item">
        <span class="cfg-modal-summary-label">${item.label}:</span> <span class="cfg-modal-summary-value">${item.value}</span>
      </div>
    `).join('');
  }

  function render() {
    renderStepper();
    renderHero();

    if (state.submitted) {
      app.innerHTML = renderSuccess();
      bindEvents();
      return;
    }

    if (state.step === 1) app.innerHTML = renderStep1();
    else if (state.step === 2) app.innerHTML = renderStep2();
    else app.innerHTML = renderStep3();

    bindEvents();
  }

  function syncSidebarCollapsed() {
    const collapsed = state.sidebarCollapsed;
    const sb = $('#sidebar');
    const layout = app.querySelector('.cfg-form-layout');
    if (sb) sb.classList.toggle('is-collapsed', collapsed);
    if (layout) layout.classList.toggle('cfg-form-layout--sidebar-collapsed', collapsed);
    app.querySelectorAll('[data-action="toggle-sidebar"]').forEach((el) => {
      el.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  function updateSidebarOnly() {
    const body = $('#sidebar-body');
    if (body) body.innerHTML = renderSummaryItems();

    const dot = $('#sidebar-dot');
    if (dot) dot.hidden = getSelectedOptionCount() === 0;
  }

  function bindEvents() {
    app.querySelectorAll('[data-platform]').forEach((el) => {
      el.addEventListener('click', () => {
        state.platform = el.dataset.platform;
        state.values = {};
        goStep(2);
      });
    });

    app.querySelectorAll('[data-brand]').forEach((el) => {
      el.addEventListener('click', () => {
        state.brand = el.dataset.brand === '__none__' ? 'Не выбрано' : el.dataset.brand;
        goStep(3);
      });
    });

    app.querySelectorAll('[data-action="back"]').forEach((el) => {
      el.addEventListener('click', () => goStep(state.step - 1));
    });

    app.querySelectorAll('[data-action="reset"]').forEach((el) => {
      el.addEventListener('click', () => resetAll(false));
    });

    app.querySelectorAll('[data-action="new"]').forEach((el) => {
      el.addEventListener('click', () => resetAll(true));
    });

    app.querySelectorAll('[data-action="continue"]').forEach((el) => {
      el.addEventListener('click', openModal);
    });

    app.querySelectorAll('[data-action="toggle-sidebar"]').forEach((el) => {
      el.addEventListener('click', () => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        syncSidebarCollapsed();
      });
    });

    app.querySelectorAll('.cfg-select').forEach((el) => {
      el.addEventListener('change', () => setValue(el.dataset.id, el.value));
    });

    app.querySelectorAll('.cfg-option').forEach((option) => {
      const input = option.querySelector('input[type="radio"]');
      if (!input) return;

      const label = option.querySelector('label');
      if (!label) return;

      label.addEventListener('mousedown', (e) => {
        if (state.values[input.name] === input.value) e.preventDefault();
      });

      label.addEventListener('click', (e) => {
        const id = input.name;
        if (state.values[id] === input.value) {
          e.preventDefault();
          delete state.values[id];
          syncRadioGroup(id);
          refreshConditionalFields();
          updateSidebarOnly();
          return;
        }
        state.values[id] = input.value;
        syncRadioGroup(id);
        refreshConditionalFields();
        updateSidebarOnly();
      });
    });

    app.querySelectorAll('.cfg-option input[type="checkbox"]').forEach((el) => {
      el.addEventListener('change', () => {
        const fieldId = el.dataset.fieldId;
        const field = getAllFields().find((f) => f.id === fieldId);
        if (!field) return;
        const current = getValue(field);
        if (el.checked) setValue(fieldId, [...current, el.value]);
        else setValue(fieldId, current.filter((x) => x !== el.value));
      });
    });
  }

  function syncRadioGroup(fieldId) {
    const selected = state.values[fieldId];
    app.querySelectorAll(`input[type="radio"][name="${fieldId}"]`).forEach((input) => {
      input.checked = selected === input.value;
    });
  }

  function refreshConditionalFields() {
    if (state.step !== 3) return;
    getAllFields().forEach((field) => {
      if (!field.showIf) return;
      const el = app.querySelector(`[data-field="${field.id}"]`);
      if (el) el.classList.toggle('is-hidden', !fieldVisible(field));
    });
  }

  function openModal() {
    overlay.innerHTML = `
      <div class="cfg-modal" role="dialog" aria-labelledby="modal-title">
        <div class="cfg-modal-head">
          <h2 id="modal-title">Отправка запроса</h2>
          <button type="button" class="cfg-modal-close" data-action="close-modal" aria-label="Закрыть">×</button>
        </div>
        <div class="cfg-modal-body">
          <div class="cfg-modal-layout">
            <section class="cfg-modal-summary-section" aria-labelledby="modal-summary-title">
              <h3 class="cfg-modal-section-title" id="modal-summary-title">Выбранные опции</h3>
              <div class="cfg-modal-summary">${renderModalSummary()}</div>
              ${renderModalUnselectedList()}
            </section>
            <section class="cfg-modal-form-section" aria-labelledby="modal-form-title">
              <h3 class="cfg-modal-section-title" id="modal-form-title">Контактные данные</h3>
              <form id="contact-form" novalidate>
                <div class="cfg-form-grid">
                  <div class="cfg-form-row">
                    <label>Имя <span class="req">*</span></label>
                    <input class="cfg-input" name="name" required>
                  </div>
                  <div class="cfg-form-row">
                    <label>Компания <span class="req">*</span></label>
                    <input class="cfg-input" name="company" required>
                  </div>
                  <div class="cfg-form-row">
                    <label>Email <span class="req">*</span></label>
                    <input class="cfg-input" type="email" name="email" required>
                  </div>
                  <div class="cfg-form-row">
                    <label>Телефон <span class="req">*</span></label>
                    <input class="cfg-input" type="tel" name="phone" required>
                  </div>
                </div>
                <div class="cfg-form-row">
                  <label>Комментарий</label>
                  <textarea class="cfg-textarea" name="comment"></textarea>
                </div>
                <label class="cfg-checkbox-row">
                  <input type="checkbox" name="copy">
                  <span>Отправить мне копию</span>
                </label>
                <label class="cfg-checkbox-row">
                  <input type="checkbox" name="consent" required>
                  <span>Согласие на обработку персональных данных <span class="req">*</span></span>
                </label>
                <div class="cfg-form-error" id="form-error" hidden></div>
              </form>
            </section>
          </div>
        </div>
        <div class="cfg-modal-foot">
          <button type="button" class="btn-secondary" data-action="close-modal">Отмена</button>
          <button type="button" class="btn-primary" data-action="submit">Отправить запрос</button>
        </div>
      </div>`;

    overlay.classList.add('is-open');

    overlay.querySelectorAll('[data-action="close-modal"]').forEach((b) => b.addEventListener('click', closeModal));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    overlay.querySelector('[data-action="submit"]').addEventListener('click', submitRequest);
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.innerHTML = '';
  }

  function submitRequest() {
    const form = $('#contact-form', overlay);
    const err = $('#form-error', overlay);
    const data = Object.fromEntries(new FormData(form));

    if (!data.name?.trim() || !data.company?.trim() || !data.email?.trim() || !data.phone?.trim()) {
      err.hidden = false;
      err.textContent = 'Заполните все обязательные поля.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      err.hidden = false;
      err.textContent = 'Укажите корректный email.';
      return;
    }
    if (!form.querySelector('[name="consent"]').checked) {
      err.hidden = false;
      err.textContent = 'Необходимо согласие на обработку персональных данных.';
      return;
    }

    const request = {
      platform: state.platform,
      brand: state.brand,
      requirements: { ...state.values },
      contact: {
        name: data.name.trim(),
        company: data.company.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        comment: data.comment?.trim() || '',
        sendCopy: !!form.copy.checked,
        consent: true
      },
      meta: {
        date: new Date().toISOString(),
        source: 'configurator_demo'
      }
    };

    const stored = JSON.parse(localStorage.getItem('forte_requests') || localStorage.getItem('integra_requests') || '[]');
    stored.push(request);
    localStorage.setItem('forte_requests', JSON.stringify(stored));

    closeModal();
    state.submitted = true;
    render();
    alert('Заявка сохранена (демо). Данные записаны в localStorage.');
  }

  render();
})();
