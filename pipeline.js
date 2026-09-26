/**
 * PrismMetrics - Instant Pipeline Visualizer (Interactive Kanban Engine)
 * Features HTML5 Drag-and-Drop, Touch/Click Fallback Controls, Real-time
 * Weighted Pipeline Calculations & Dynamic Stage Totals.
 */

class PrismPipelineManager {
  constructor() {
    this.deals = [
      { id: 'deal-1', company: 'CloudScale Networks', stage: 'discovery', amount: 145000, prob: 35, score: 92, rep: 'AR', repName: 'Alex R.' },
      { id: 'deal-2', company: 'Finova Global Bank', stage: 'discovery', amount: 185000, prob: 40, score: 74, rep: 'SM', repName: 'Sarah M.' },
      { id: 'deal-3', company: 'Aura Therapeutics', stage: 'qualified', amount: 98000, prob: 60, score: 88, rep: 'DK', repName: 'David K.' },
      { id: 'deal-4', company: 'Nexus Automations', stage: 'qualified', amount: 220000, prob: 65, score: 95, rep: 'EL', repName: 'Elena L.' },
      { id: 'deal-5', company: 'OmniData Tech', stage: 'proposal', amount: 310000, prob: 80, score: 85, rep: 'AR', repName: 'Alex R.' },
      { id: 'deal-6', company: 'Starlight Media', stage: 'proposal', amount: 76000, prob: 75, score: 64, rep: 'DK', repName: 'David K.' },
      { id: 'deal-7', company: 'Pulse Security Enterprise', stage: 'won', amount: 245000, prob: 100, score: 98, rep: 'EL', repName: 'Elena L.' },
      { id: 'deal-8', company: 'Veritas Health AI', stage: 'won', amount: 188950, prob: 100, score: 96, rep: 'SM', repName: 'Sarah M.' }
    ];

    this.stages = [
      { id: 'discovery', title: '1. Discovery & Qual', badgeClass: 'cyan' },
      { id: 'qualified', title: '2. Value Proposition', badgeClass: 'violet' },
      { id: 'proposal', title: '3. Proposal & Review', badgeClass: 'amber' },
      { id: 'won', title: '4. Closed Won', badgeClass: 'mint' }
    ];

    this.draggedDealId = null;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById('pipelineColumnsContainer');
    if (!container) return;

    let html = '';
    this.stages.forEach(stage => {
      const stageDeals = this.deals.filter(d => d.stage === stage.id);
      const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

      html += `
        <div class="pipeline-column" data-stage="${stage.id}" ondragover="pipelineManager.handleDragOver(event)" ondragleave="pipelineManager.handleDragLeave(event)" ondrop="pipelineManager.handleDrop(event, '${stage.id}')">
          <div class="column-header">
            <div class="column-title">
              <span>${stage.title}</span>
              <span class="column-count-badge">${stageDeals.length}</span>
            </div>
            <div class="column-total-val">$${(stageTotal / 1000).toFixed(0)}k</div>
          </div>
          <div class="deals-dropzone" id="zone-${stage.id}">
            ${stageDeals.map(deal => this.renderDealCard(deal)).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    this.updateHeaderStats();
    this.attachDragEvents();
  }

  renderDealCard(deal) {
    let scoreClass = 'score-high';
    if (deal.score < 70) scoreClass = 'score-low';
    else if (deal.score < 85) scoreClass = 'score-mid';

    return `
      <div class="deal-card" id="${deal.id}" draggable="true" ondragstart="pipelineManager.handleDragStart(event, '${deal.id}')" ondragend="pipelineManager.handleDragEnd(event)">
        <div class="deal-top">
          <div class="deal-company">${deal.company}</div>
          <span class="deal-score-pill ${scoreClass}">Health: ${deal.score}</span>
        </div>
        <div class="deal-amount-val">$${deal.amount.toLocaleString()}</div>
        <div class="deal-footer">
          <div class="deal-rep">
            <span class="rep-avatar">${deal.rep}</span>
            <span>${deal.repName} (${deal.prob}%)</span>
          </div>
          <div class="move-deal-actions">
            <button class="move-btn" title="Move Left" onclick="pipelineManager.moveDeal('${deal.id}', -1)">←</button>
            <button class="move-btn" title="Move Right" onclick="pipelineManager.moveDeal('${deal.id}', 1)">→</button>
          </div>
        </div>
      </div>
    `;
  }

  updateHeaderStats() {
    const totalPipeline = this.deals.reduce((acc, d) => acc + d.amount, 0);
    const weightedArr = this.deals.reduce((acc, d) => acc + (d.amount * (d.prob / 100)), 0);

    const totalEl = document.getElementById('pipelineTotalVal');
    const weightedEl = document.getElementById('pipelineWeightedVal');
    const activeDealsEl = document.getElementById('pipelineCountVal');

    if (totalEl) totalEl.textContent = `$${(totalPipeline / 1000000).toFixed(2)}M`;
    if (weightedEl) weightedEl.textContent = `$${(weightedArr / 1000000).toFixed(2)}M`;
    if (activeDealsEl) activeDealsEl.textContent = `${this.deals.length} Active Deals`;
  }

  attachDragEvents() {
    // Standard HTML5 drag handlers bound inline for zero friction
  }

  handleDragStart(e, dealId) {
    this.draggedDealId = dealId;
    e.dataTransfer.setData('text/plain', dealId);
    e.currentTarget.classList.add('dragging');
  }

  handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.pipeline-column').forEach(col => col.classList.remove('drag-over'));
  }

  handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }

  handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }

  handleDrop(e, targetStageId) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!this.draggedDealId) return;

    this.updateDealStage(this.draggedDealId, targetStageId);
    this.draggedDealId = null;
  }

  moveDeal(dealId, direction) {
    const deal = this.deals.find(d => d.id === dealId);
    if (!deal) return;

    const stageOrder = ['discovery', 'qualified', 'proposal', 'won'];
    const currentIdx = stageOrder.indexOf(deal.stage);
    const nextIdx = currentIdx + direction;

    if (nextIdx >= 0 && nextIdx < stageOrder.length) {
      this.updateDealStage(dealId, stageOrder[nextIdx]);
    }
  }

  updateDealStage(dealId, newStageId) {
    const deal = this.deals.find(d => d.id === dealId);
    if (!deal || deal.stage === newStageId) return;

    deal.stage = newStageId;
    // Adjust probability based on stage
    if (newStageId === 'discovery') deal.prob = 35;
    else if (newStageId === 'qualified') deal.prob = 65;
    else if (newStageId === 'proposal') deal.prob = 85;
    else if (newStageId === 'won') deal.prob = 100;

    this.render();
    if (window.showToastAlert) {
      const stageName = this.stages.find(s => s.id === newStageId)?.title || newStageId;
      window.showToastAlert(`⚡ Pipeline Updated: ${deal.company} moved to ${stageName}!`);
    }
  }
}

window.pipelineManager = new PrismPipelineManager();
