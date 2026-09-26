/**
 * PrismMetrics - High-Precision Canvas Data Visualization Engine
 * Custom zero-dependency charting with Retina Hi-DPI, Cubic Bezier Splines,
 * Neon Glow Shaders, Confidence Bands & Interactive Tooltips.
 */

class PrismTrendChart {
  constructor(canvasId, tooltipId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = document.getElementById(tooltipId);
    this.pixelRatio = window.devicePixelRatio || 1;
    this.activePointIndex = -1;
    this.animProgress = 0;
    this.scenario = 'baseline'; // 'baseline', 'bull', 'bear'
    this.period = 'ytd'; // '7d', '30d', 'qtd', 'ytd'

    // Datasets
    this.datasets = {
      ytd: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (AI)', 'Nov (AI)', 'Dec (AI)'],
        actual: [820, 890, 940, 1020, 1110, 1190, 1280, 1360, 1428, null, null, null],
        target: [800, 850, 900, 980, 1050, 1150, 1220, 1300, 1380, 1480, 1580, 1700],
        forecast: [null, null, null, null, null, null, null, null, 1428, 1540, 1680, 1850],
        confidenceUpper: [null, null, null, null, null, null, null, null, 1428, 1590, 1750, 1940],
        confidenceLower: [null, null, null, null, null, null, null, null, 1428, 1490, 1610, 1760]
      },
      qtd: {
        labels: ['W1 Jul', 'W2 Jul', 'W3 Jul', 'W4 Jul', 'W1 Aug', 'W2 Aug', 'W3 Aug', 'W4 Aug', 'W1 Sep', 'W2 Sep (AI)', 'W3 Sep (AI)', 'W4 Sep (AI)'],
        actual: [290, 310, 340, 360, 390, 410, 440, 465, 495, null, null, null],
        target: [280, 300, 330, 350, 380, 400, 430, 450, 480, 510, 540, 580],
        forecast: [null, null, null, null, null, null, null, null, 495, 525, 560, 610],
        confidenceUpper: [null, null, null, null, null, null, null, null, 495, 540, 585, 640],
        confidenceLower: [null, null, null, null, null, null, null, null, 495, 510, 535, 580]
      },
      '30d': {
        labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30 (AI)'],
        actual: [95, 118, 142, 176, 210, 245, null],
        target: [90, 110, 135, 165, 200, 230, 260],
        forecast: [null, null, null, null, null, 245, 280],
        confidenceUpper: [null, null, null, null, null, 245, 295],
        confidenceLower: [null, null, null, null, null, 245, 265]
      },
      '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat (AI)', 'Sun (AI)'],
        actual: [38, 52, 64, 78, 92, null, null],
        target: [35, 48, 60, 72, 85, 96, 110],
        forecast: [null, null, null, null, 92, 105, 118],
        confidenceUpper: [null, null, null, null, 92, 110, 125],
        confidenceLower: [null, null, null, null, 92, 100, 111]
      }
    };

    this.initEvents();
    this.resize();
    this.animate();
  }

  setPeriod(periodKey) {
    if (this.datasets[periodKey]) {
      this.period = periodKey;
      this.animate();
    }
  }

  setScenario(scenarioKey) {
    this.scenario = scenarioKey;
    const base = this.datasets[this.period];
    if (!base) return;

    if (scenarioKey === 'bull') {
      // +32% acceleration
      base.forecast = base.forecast.map(v => v ? Math.round(v * 1.08) : null);
      base.confidenceUpper = base.confidenceUpper.map(v => v ? Math.round(v * 1.1) : null);
    } else if (scenarioKey === 'bear') {
      // Macro headwind
      base.forecast = base.forecast.map(v => v ? Math.round(v * 0.92) : null);
      base.confidenceLower = base.confidenceLower.map(v => v ? Math.round(v * 0.88) : null);
    }
    this.animate();
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });

    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  animate() {
    this.animProgress = 0;
    const startTime = performance.now();
    const duration = 600;

    const step = (now) => {
      const elapsed = now - startTime;
      this.animProgress = Math.min(1, elapsed / duration);
      // Ease out cubic
      this.animProgress = 1 - Math.pow(1 - this.animProgress, 3);
      this.render();
      if (this.animProgress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const currentData = this.datasets[this.period];
    const padding = { left: 50, right: 25, top: 30, bottom: 40 };
    const chartWidth = this.width - padding.left - padding.right;
    const stepX = chartWidth / (currentData.labels.length - 1);

    let closestIdx = Math.round((x - padding.left) / stepX);
    closestIdx = Math.max(0, Math.min(closestIdx, currentData.labels.length - 1));

    this.activePointIndex = closestIdx;
    this.render();
    this.showTooltip(closestIdx, padding.left + closestIdx * stepX, e.clientY - rect.top);
  }

  handleMouseLeave() {
    this.activePointIndex = -1;
    this.render();
    if (this.tooltip) {
      this.tooltip.style.opacity = '0';
    }
  }

  showTooltip(index, pointX, mouseY) {
    if (!this.tooltip) return;
    const currentData = this.datasets[this.period];
    const label = currentData.labels[index];
    const actual = currentData.actual[index];
    const target = currentData.target[index];
    const forecast = currentData.forecast[index];

    let html = `<div class="tooltip-date">${label} Revenue Telemetry</div>`;

    if (actual !== null && actual !== undefined) {
      const variance = ((actual - target) / target * 100).toFixed(1);
      const varClass = variance >= 0 ? 'color: var(--neon-mint)' : 'color: var(--neon-rose)';
      html += `
        <div class="tooltip-item">
          <span>Actual:</span>
          <span style="color: var(--neon-cyan)">$${(actual * 1000).toLocaleString()}</span>
        </div>
        <div class="tooltip-item">
          <span>Target Quota:</span>
          <span>$${(target * 1000).toLocaleString()}</span>
        </div>
        <div class="tooltip-item">
          <span>Variance:</span>
          <span style="${varClass}">${variance >= 0 ? '+' : ''}${variance}%</span>
        </div>
      `;
    } else if (forecast !== null && forecast !== undefined) {
      const upper = currentData.confidenceUpper[index];
      const lower = currentData.confidenceLower[index];
      html += `
        <div class="tooltip-item">
          <span>AI Forecast:</span>
          <span style="color: var(--neon-mint)">$${(forecast * 1000).toLocaleString()}</span>
        </div>
        <div class="tooltip-item">
          <span>Target Quota:</span>
          <span>$${(target * 1000).toLocaleString()}</span>
        </div>
        <div class="tooltip-item">
          <span>Confidence Range:</span>
          <span style="color: var(--neon-blue); font-size: 0.72rem;">$${lower}K - $${upper}K</span>
        </div>
      `;
    }

    this.tooltip.innerHTML = html;
    this.tooltip.style.opacity = '1';

    // Position tooltip
    const tooltipRect = this.tooltip.getBoundingClientRect();
    let left = pointX + 15;
    if (left + tooltipRect.width > this.width) {
      left = pointX - tooltipRect.width - 15;
    }
    this.tooltip.style.transform = `translate(${left}px, ${Math.max(10, mouseY - 50)}px)`;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const currentData = this.datasets[this.period];
    const padding = { left: 55, right: 30, top: 35, bottom: 40 };
    const chartWidth = this.width - padding.left - padding.right;
    const chartHeight = this.height - padding.top - padding.bottom;

    // Calculate max value for Y-axis
    let allVals = [];
    ['actual', 'target', 'forecast', 'confidenceUpper'].forEach(key => {
      if (currentData[key]) {
        currentData[key].forEach(v => { if (v !== null) allVals.push(v); });
      }
    });
    const maxY = Math.ceil((Math.max(...allVals) * 1.15) / 200) * 200;
    const minY = 0;

    const getX = (i) => padding.left + (i / (currentData.labels.length - 1)) * chartWidth;
    const getY = (val) => {
      if (val === null || val === undefined) return null;
      const progressVal = val * this.animProgress;
      return padding.top + chartHeight - ((progressVal - minY) / (maxY - minY)) * chartHeight;
    };

    // Draw horizontal grid lines & Y labels
    const gridSteps = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridSteps; i++) {
      const val = (maxY / gridSteps) * i;
      const y = padding.top + chartHeight - (i / gridSteps) * chartHeight;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(this.width - padding.right, y);
      ctx.stroke();

      ctx.fillText(`$${val}k`, padding.left - 10, y + 4);
    }

    // Draw X labels
    ctx.textAlign = 'center';
    currentData.labels.forEach((label, i) => {
      const x = getX(i);
      ctx.fillStyle = i === this.activePointIndex ? '#00f0ff' : '#64748b';
      ctx.fillText(label, x, this.height - 12);
    });

    // 1. Draw Confidence Band Ribbon (for Forecast)
    const forecastStartIdx = currentData.forecast.findIndex(v => v !== null);
    if (forecastStartIdx !== -1) {
      ctx.beginPath();
      // Upper curve
      for (let i = forecastStartIdx; i < currentData.labels.length; i++) {
        const x = getX(i);
        const y = getY(currentData.confidenceUpper[i]);
        if (i === forecastStartIdx) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // Lower curve in reverse
      for (let i = currentData.labels.length - 1; i >= forecastStartIdx; i--) {
        const x = getX(i);
        const y = getY(currentData.confidenceLower[i]);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      const ribbonGrad = ctx.createLinearGradient(0, padding.top, 0, this.height);
      ribbonGrad.addColorStop(0, 'rgba(0, 245, 160, 0.16)');
      ribbonGrad.addColorStop(1, 'rgba(0, 245, 160, 0.02)');
      ctx.fillStyle = ribbonGrad;
      ctx.fill();
    }

    // 2. Draw Target Quota Line (Violet Dotted)
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    for (let i = 0; i < currentData.labels.length; i++) {
      const x = getX(i);
      const y = getY(currentData.target[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // 3. Draw Actual Revenue Gradient Area & Curve (Cyan)
    const actualPoints = [];
    for (let i = 0; i < currentData.labels.length; i++) {
      if (currentData.actual[i] !== null) {
        actualPoints.push({ x: getX(i), y: getY(currentData.actual[i]), val: currentData.actual[i], idx: i });
      }
    }

    if (actualPoints.length > 1) {
      // Area Fill
      ctx.beginPath();
      ctx.moveTo(actualPoints[0].x, padding.top + chartHeight);
      actualPoints.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(actualPoints[actualPoints.length - 1].x, padding.top + chartHeight);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
      areaGrad.addColorStop(0, 'rgba(0, 240, 255, 0.28)');
      areaGrad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Stroke Line with Glow
      ctx.beginPath();
      ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;

      actualPoints.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset glow

      // Actual Data Points
      actualPoints.forEach(p => {
        const isHover = p.idx === this.activePointIndex;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHover ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = '#060913';
        ctx.fill();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = isHover ? 3 : 2;
        ctx.stroke();
      });
    }

    // 4. Draw Forecast Curve (Neon Mint)
    const forecastPoints = [];
    for (let i = 0; i < currentData.labels.length; i++) {
      if (currentData.forecast[i] !== null) {
        forecastPoints.push({ x: getX(i), y: getY(currentData.forecast[i]), val: currentData.forecast[i], idx: i });
      }
    }

    if (forecastPoints.length > 1) {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.shadowColor = 'rgba(0, 245, 160, 0.5)';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#00f5a0';
      ctx.lineWidth = 2.5;

      forecastPoints.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Forecast Points
      forecastPoints.forEach(p => {
        const isHover = p.idx === this.activePointIndex;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHover ? 6 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f5a0';
        ctx.fill();
      });
    }

    // 5. Active Hover Crosshair Line
    if (this.activePointIndex !== -1) {
      const activeX = getX(this.activePointIndex);
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.moveTo(activeX, padding.top);
      ctx.lineTo(activeX, padding.top + chartHeight);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

/**
 * PrismRegionalBarChart - Bar Chart for Global Sales Territories
 */
class PrismRegionalBarChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.pixelRatio = window.devicePixelRatio || 1;
    this.animProgress = 0;
    this.hoverIdx = -1;

    this.regions = [
      { name: 'North America', value: 680, quota: 610, pct: 112, color1: '#00f0ff', color2: '#3b82f6', reps: 18 },
      { name: 'EMEA', value: 410, quota: 420, pct: 98, color1: '#a855f7', color2: '#6366f1', reps: 12 },
      { name: 'APAC', value: 240, quota: 280, pct: 85, color1: '#00f5a0', color2: '#059669', reps: 8 },
      { name: 'LATAM', value: 98, quota: 105, pct: 93, color1: '#fbbf24', color2: '#ea580c', reps: 4 }
    ];

    this.initEvents();
    this.resize();
    this.animate();
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const rowHeight = this.height / this.regions.length;
      this.hoverIdx = Math.floor(y / rowHeight);
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverIdx = -1;
      this.render();
    });
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  animate() {
    this.animProgress = 0;
    const startTime = performance.now();
    const duration = 500;

    const step = (now) => {
      const elapsed = now - startTime;
      this.animProgress = Math.min(1, elapsed / duration);
      this.animProgress = 1 - Math.pow(1 - this.animProgress, 3);
      this.render();
      if (this.animProgress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const padding = { left: 110, right: 70, top: 25, bottom: 20 };
    const chartWidth = this.width - padding.left - padding.right;
    const maxVal = 750;
    const barHeight = 22;
    const rowGap = (this.height - padding.top - padding.bottom) / this.regions.length;

    this.regions.forEach((r, idx) => {
      const y = padding.top + idx * rowGap;
      const isHover = idx === this.hoverIdx;
      const barW = (r.value / maxVal) * chartWidth * this.animProgress;
      const quotaX = padding.left + (r.quota / maxVal) * chartWidth;

      // Region Label
      ctx.fillStyle = isHover ? '#ffffff' : '#94a3b8';
      ctx.font = isHover ? 'bold 12px Inter, sans-serif' : '12px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(r.name, padding.left - 14, y + barHeight / 2 + 4);

      // Background Bar Track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.roundRect(padding.left, y, chartWidth, barHeight, 6);
      ctx.fill();

      // Active Gradient Bar
      const grad = ctx.createLinearGradient(padding.left, 0, padding.left + barW, 0);
      grad.addColorStop(0, r.color2);
      grad.addColorStop(1, r.color1);
      ctx.fillStyle = grad;

      if (isHover) {
        ctx.shadowColor = r.color1;
        ctx.shadowBlur = 12;
      }

      ctx.beginPath();
      ctx.roundRect(padding.left, y, Math.max(8, barW), barHeight, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Quota Line Indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(quotaX, y - 3);
      ctx.lineTo(quotaX, y + barHeight + 3);
      ctx.stroke();
      ctx.setLineDash([]);

      // Value & Attainment Badge Text
      ctx.textAlign = 'left';
      ctx.fillStyle = isHover ? r.color1 : '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`$${r.value}k (${r.pct}%)`, padding.left + chartWidth + 10, y + barHeight / 2 + 4);
    });
  }
}

// Global Chart Initializer
window.initPrismCharts = () => {
  window.trendChart = new PrismTrendChart('revenueTrendCanvas', 'trendChartTooltip');
  window.regionalChart = new PrismRegionalBarChart('regionalBarCanvas');
};
