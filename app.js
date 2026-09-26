/**
 * PrismMetrics - Core Application Controller
 * Handles UI Micro-interactions, Live Telemetry Stream, AI Scenario Simulator,
 * Integrations Hub, ROI Calculator, Modals & Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Charts
  if (window.initPrismCharts) {
    window.initPrismCharts();
  }

  // Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navCenterMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // Time Range Selector
  const periodTabs = document.querySelectorAll('.period-tab-btn');
  periodTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      periodTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.dataset.period;
      if (window.trendChart) {
        window.trendChart.setPeriod(period);
        showToastAlert(`Telemetry Period switched to: ${period.toUpperCase()}`);
      }
    });
  });

  // AI Forecast Scenario Buttons
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const narrativeEl = document.getElementById('aiNarrativeText');
  const predictionChip = document.getElementById('aiPredictionChip');

  const scenarioNarratives = {
    baseline: {
      prediction: 'Prediction: 24.2% Q3 Growth Expected',
      text: 'Based on 14,200 CRM signals across Salesforce and HubSpot, EMEA enterprise renewals are outperforming historical averages by 18%. Confidence band: 94.8%.'
    },
    bull: {
      prediction: 'Prediction: 32.6% Q3 Growth Expected (Bull Scenario)',
      text: '🚀 Aggressive expansion detected: Multi-year expansion deals in North America show a 42% win-rate acceleration. Net ARR projected to cross $1.94M.'
    },
    bear: {
      prediction: 'Prediction: 11.4% Q3 Growth Expected (Conservative)',
      text: '⚠️ Macro stress applied: Longer procurement cycles simulated for enterprise tier. AI recommends shifting 3 SDRs to high-velocity Mid-Market pipeline.'
    }
  };

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scenario = btn.dataset.scenario;
      if (window.trendChart) {
        window.trendChart.setScenario(scenario);
      }
      if (scenarioNarratives[scenario]) {
        if (narrativeEl) narrativeEl.textContent = scenarioNarratives[scenario].text;
        if (predictionChip) predictionChip.textContent = scenarioNarratives[scenario].prediction;
      }
      showToastAlert(`AI Copilot: Simulated ${scenario.toUpperCase()} scenario`);
    });
  });

  // Real-time Telemetry Stream Simulator
  let isStreamActive = true;
  const streamToggle = document.getElementById('streamToggleBtn');
  const revenueValEl = document.getElementById('metricRevenueVal');
  let currentRevenue = 1428950;

  if (streamToggle) {
    streamToggle.addEventListener('click', () => {
      isStreamActive = !isStreamActive;
      streamToggle.innerHTML = isStreamActive
        ? `<span class="pulse-dot"></span> Telemetry: Live`
        : `<span style="width:8px;height:8px;border-radius:50%;background:#64748b;"></span> Telemetry: Paused`;
      showToastAlert(isStreamActive ? 'Live Telemetry Resumed' : 'Live Telemetry Paused');
    });
  }

  // Periodic simulated micro-sales event
  setInterval(() => {
    if (!isStreamActive) return;
    const increment = Math.floor(Math.random() * 4500) + 1200;
    currentRevenue += increment;
    if (revenueValEl) {
      revenueValEl.textContent = `$${currentRevenue.toLocaleString()}`;
    }
  }, 4000);

  // 1-Click Integrations Toggles
  const integrationButtons = document.querySelectorAll('.toggle-switch-btn');
  integrationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isConnected = btn.classList.contains('connected');
      const card = btn.closest('.integration-card');
      const statusPill = card.querySelector('.status-pill');
      const integrationName = card.querySelector('h4').textContent;

      if (isConnected) {
        btn.classList.remove('connected');
        btn.textContent = 'Connect';
        if (statusPill) {
          statusPill.innerHTML = `<span style="color:#64748b">●</span> Disconnected`;
          statusPill.style.color = '#64748b';
        }
        showToastAlert(`Integration: ${integrationName} disconnected.`);
      } else {
        btn.classList.add('connected');
        btn.textContent = 'Active Sync';
        if (statusPill) {
          statusPill.innerHTML = `<span class="pulse-dot"></span> Synced 1m ago`;
          statusPill.style.color = 'var(--neon-mint)';
        }
        showToastAlert(`⚡ Bi-directional sync verified for ${integrationName}!`);
      }
    });
  });

  // Pricing Monthly/Annual Toggle
  const billingToggle = document.getElementById('billingSwitchBtn');
  const starterPrice = document.getElementById('starterPrice');
  const growthPrice = document.getElementById('growthPrice');
  const enterprisePrice = document.getElementById('enterprisePrice');
  let isAnnual = true;

  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      billingToggle.classList.toggle('active', isAnnual);
      document.getElementById('lblMonthly').classList.toggle('active', !isAnnual);
      document.getElementById('lblAnnual').classList.toggle('active', isAnnual);

      if (isAnnual) {
        if (starterPrice) starterPrice.textContent = '$39';
        if (growthPrice) growthPrice.textContent = '$119';
        if (enterprisePrice) enterprisePrice.textContent = '$319';
        showToastAlert('Annual Billing: 20% Discount + 2 Months Free Applied!');
      } else {
        if (starterPrice) starterPrice.textContent = '$49';
        if (growthPrice) growthPrice.textContent = '$149';
        if (enterprisePrice) enterprisePrice.textContent = '$399';
        showToastAlert('Monthly Billing selected');
      }
    });
  }

  // Interactive ROI Calculator
  const revenueSlider = document.getElementById('roiRevenueSlider');
  const sliderDisplay = document.getElementById('sliderDisplayVal');
  const roiSavedVal = document.getElementById('roiSavedVal');
  const roiHoursVal = document.getElementById('roiHoursVal');
  const roiNetVal = document.getElementById('roiNetVal');

  if (revenueSlider) {
    const updateRoi = () => {
      const millions = parseFloat(revenueSlider.value);
      if (sliderDisplay) sliderDisplay.textContent = `$${millions.toFixed(1)}M`;

      // Business logic: 5.8% avg recovered pipeline slippage & churn prevention
      const annualRev = millions * 1000000;
      const savedAmount = Math.round(annualRev * 0.058);
      const hoursGained = Math.round(millions * 320); // hours across team
      const netRoiPercent = Math.min(840, Math.round(280 + (millions * 12)));

      if (roiSavedVal) roiSavedVal.textContent = `$${savedAmount.toLocaleString()}`;
      if (roiHoursVal) roiHoursVal.textContent = `${hoursGained.toLocaleString()} hrs/yr`;
      if (roiNetVal) roiNetVal.textContent = `+${netRoiPercent}%`;
    };

    revenueSlider.addEventListener('input', updateRoi);
    updateRoi();
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Modal Management
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const openTrialBtns = document.querySelectorAll('.open-trial-btn');
  const openDemoBtns = document.querySelectorAll('.open-demo-btn');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  const trialModal = document.getElementById('trialModal');
  const demoModal = document.getElementById('demoModal');

  openTrialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (trialModal) trialModal.classList.add('active');
    });
  });

  openDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (demoModal) demoModal.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlays.forEach(m => m.classList.remove('active'));
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Form Submissions & Celebrations
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        showToastAlert(`🎉 Subscribed! Weekly revenue intelligence dispatched to ${input.value}`);
        input.value = '';
      }
    });
  }

  const trialForm = document.getElementById('trialForm');
  if (trialForm) {
    trialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (trialModal) trialModal.classList.remove('active');
      showToastAlert('🚀 Workspace Initialized! Welcome to PrismMetrics Enterprise.');
    });
  }

  // Account Health Filter
  const healthSearchInput = document.getElementById('healthAccountSearch');
  if (healthSearchInput) {
    healthSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('.health-table tbody tr');
      rows.forEach(row => {
        const name = row.querySelector('.account-name')?.textContent.toLowerCase() || '';
        row.style.display = name.includes(query) ? '' : 'none';
      });
    });
  }
});

/**
 * Global Toast Alert Notification System
 */
window.showToastAlert = (message) => {
  let container = document.getElementById('toastAlertContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastAlertContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-alert';
  toast.innerHTML = `
    <span style="color: var(--neon-cyan); font-size: 1.1rem;">✦</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};
