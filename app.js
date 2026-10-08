/**
 * MESHATTEND - INTERACTIVE ENGINE & SYSTEM CONTROLLER
 * Powering visualizations, simulators, architecture inspector, and documentation features.
 */

// --- 1. RESEARCH DATA & SYSTEM CONFIG ---
const SYSTEM_DATA = {
  howItWorksSteps: [
    {
      num: "01",
      title: "Teacher Starts Lecture",
      desc: "The instructor initiates the lecture period on their schedule. The classroom session timer and cryptographic challenge window begin.",
      input: "Instructor schedule / Lecture initiate command",
      output: "Lecture session token generated",
      tech: "Faculty App / Web Dashboard API",
      failure: "Lecture fallback to automatic timetable schedule trigger."
    },
    {
      num: "02",
      title: "Teacher's Phone Activates Bluetooth",
      desc: "The teacher's authenticated smartphone or classroom beacon broadcasts a master session advertisement with encrypted rolling epoch keys.",
      input: "Bluetooth Low Energy peripheral mode",
      output: "Master BLE Beacon advertisement (2.4 GHz)",
      tech: "BLE 5.0 Core Peripheral / ESP32 Hub handshake",
      failure: "Dedicated classroom wall ESP32 acts as backup master hub."
    },
    {
      num: "03",
      title: "Students Enter Classroom",
      desc: "Students carrying paired BLE devices (smartphones with background BLE service or low-cost wearable BLE iBeacon cards) enter physical radio range.",
      input: "Physical student entry into room radius (~8-12m)",
      output: "Periodic BLE advertisement packets broadcasted",
      tech: "iBeacon / Eddystone / BLE 4.2+ Advertisements",
      failure: "Passive beacon cards require zero app interaction."
    },
    {
      num: "04",
      title: "BLE Devices Detect Presence",
      desc: "Fixed ESP32 nodes placed in the classroom scan continuously for student advertisement UUIDs within the designated perimeter.",
      input: "Raw BLE 2.4 GHz RF advertising channels 37, 38, 39",
      output: "Discovered device identifiers & RSSI power levels",
      tech: "ESP32 BLE Scanning Engine (FreeRTOS)",
      failure: "Redundant node in adjacent corner covers blind spots."
    },
    {
      num: "05",
      title: "RSSI / Proximity Data Is Processed",
      desc: "Raw Received Signal Strength Indicator (RSSI) values undergo Kalman filtering and median sliding windows to filter multipath fading and human body absorption.",
      input: "Raw RSSI time series (-45 dBm to -95 dBm)",
      output: "Smoothed proximity probability index (0.0 to 1.0)",
      tech: "1D Kalman Filter / Path-Loss Log-Distance Model",
      failure: "Temporal outlier rejection ignores momentary signal dips."
    },
    {
      num: "06",
      title: "Mesh Network Transfers Data",
      desc: "Classroom ESP32 nodes relay verified presence telemetry across the multi-hop Bluetooth Mesh network without requiring Wi-Fi in each room.",
      input: "Localized presence packets",
      output: "Relayed mesh packets toward gateway",
      tech: "Bluetooth Mesh Protocol (Flooding / Relay Bearer)",
      failure: "Multi-path mesh flooding reroutes around disconnected nodes."
    },
    {
      num: "07",
      title: "Attendance Engine Verifies Presence",
      desc: "The central gateway checks student identity signatures against enrolled rosters and validates simultaneous proximity to the teacher's beacon.",
      input: "Relayed mesh telemetry + Master session token",
      output: "Presence confirmation match event",
      tech: "Embedded SQLite Rule Engine / HMAC Verification",
      failure: "Unrecognized beacons logged into anomaly audit buffer."
    },
    {
      num: "08",
      title: "Continuous Monitoring Begins",
      desc: "Unlike roll-call systems that check in once, MeshAttend performs periodic presence heartbeat sweeps every 3 to 5 minutes across the lecture duration.",
      input: "Periodic BLE heartbeat pulses",
      output: "Continuous classroom dwell timeline",
      tech: "Rolling Sliding Window Attendance State Machine",
      failure: "Students leaving midway are flagged as partial attendance."
    },
    {
      num: "09",
      title: "Teacher Presence Is Verified",
      desc: "Continuous mutual beacon tracking ensures the instructor remains physically present in the hall, validating class integrity.",
      input: "Instructor beacon signal continuity",
      output: "Instructor presence audit score (%)",
      tech: "Mutual RSSI Proximity Cross-Verification",
      failure: "Alert generated if teacher departs 15+ minutes prior to class end."
    },
    {
      num: "10",
      title: "Attendance Is Finalized",
      desc: "At class conclusion, attendance states are computed: Present (>=75% dwell), Uncertain/Partial (40-74% dwell), or Absent (<40% dwell).",
      input: "Full 60-minute presence bitmap",
      output: "Final lecture attendance register",
      tech: "Threshold Evaluation Engine",
      failure: "Manual instructor override allowed within 24h grace window."
    },
    {
      num: "11",
      title: "Dashboard Is Updated",
      desc: "Aggregated lecture statistics are transmitted to the campus management portal, district analytics dashboard, and student records.",
      input: "Final attendance register batch",
      output: "Web dashboard graphs & student ledger sync",
      tech: "REST / WebSockets / Cloud DB",
      failure: "Buffered locally if internet is unavailable."
    },
    {
      num: "12",
      title: "Notifications Are Sent If Required",
      desc: "Automated SMS alerts notify parents and designated guardians when consecutive absences or unexpected classroom departures occur.",
      input: "Absent / Truant event trigger",
      output: "Parent SMS notification / Mobile push alert",
      tech: "SMS Gateway API / Twilio / National SMS Portal",
      failure: "Queued and retried until SMS gateway confirms receipt."
    }
  ],

  archNodes: [
    {
      id: "student-device",
      title: "Student Device / Beacon",
      tech: "BLE 4.2 / 5.0 / iBeacon",
      purpose: "Transmits low-power cryptographic advertising packets identifying the enrolled student.",
      input: "Device internal timer / BLE peripheral broadcast",
      output: "Periodic BLE Adv packets (UUID, Major, Minor, TX Power)",
      failure: "Dead battery or disabled phone BLE triggers fallback to student ID beacon card."
    },
    {
      id: "ble-signal",
      title: "BLE 2.4 GHz RF Signal",
      tech: "Gaussian FSK Modulation",
      purpose: "Over-the-air wireless carrier frequency carrying advertising packets through classroom air.",
      input: "Transmitter antenna power output (-4 to +4 dBm)",
      output: "Received RF energy at node antenna (RSSI in dBm)",
      failure: "Radio interference or physical obstacles cause signal attenuation, handled by Kalman smoothing."
    },
    {
      id: "esp32-node",
      title: "ESP32 Classroom Node",
      tech: "ESP-WROOM-32 (₹350)",
      purpose: "Fixed low-cost microcontroller scanning RF channels and running local RSSI threshold checks.",
      input: "Incoming BLE packets from nearby student devices and teacher hub",
      output: "Filtered presence records dispatched to mesh relay",
      failure: "Power outage or hardware fault automatically bypassed by neighboring mesh node relay."
    },
    {
      id: "mesh-network",
      title: "BLE Mesh Network",
      tech: "Bluetooth SIG Mesh 1.0",
      purpose: "Interconnects classroom nodes across corridors and floors without Ethernet or Wi-Fi.",
      input: "Packets from individual room nodes",
      output: "Multi-hop relayed packets forwarded to centralized gateway",
      failure: "Self-healing topology recalculates routing if any node drops off."
    },
    {
      id: "gateway",
      title: "Classroom Gateway",
      tech: "ESP32-S3 / Linux Edge Hub",
      purpose: "Aggregates mesh packets, maintains offline flash buffer queue, and manages cloud synchronization.",
      input: "Consolidated mesh payload from all classroom nodes",
      output: "Structured JSON batches to backend / local flash queue",
      failure: "When internet drops, stores up to 30 days of attendance on local SPIFFS / SD storage."
    },
    {
      id: "attendance-engine",
      title: "Attendance Engine",
      tech: "Node.js / Python Rules Engine",
      purpose: "Evaluates continuous dwell time, runs cross-verification with teacher presence, and assigns final status.",
      input: "Raw timeline heartbeats (5-min intervals)",
      output: "Final Attendance states (Present, Uncertain, Absent)",
      failure: "Recovers state from database logs without losing session history."
    },
    {
      id: "database",
      title: "Database Ledger",
      tech: "PostgreSQL / SQLite Buffer",
      purpose: "Maintains tamper-resistant attendance ledgers, timetable rosters, and audit trails.",
      input: "Verified lecture attendance records",
      output: "Historic trend data and analytical queries",
      failure: "Automated daily replication to state education data centers."
    },
    {
      id: "notifications",
      title: "Dashboard & Alerts",
      tech: "React / SMS Gateway",
      purpose: "Presents live monitoring to principals and sends timely SMS alerts to parents.",
      input: "Truancy and absence alerts from database triggers",
      output: "SMS messages to parents & district intelligence summaries",
      failure: "SMS retry queue with exponential backoff."
    }
  ],

  researchPapers: [
    {
      cat: "applied",
      title: "Automated Student Attendance Management Using Bluetooth Low Energy (BLE)",
      year: "2023",
      area: "BLE Attendance Systems",
      insight: "Evaluated beacon signal broadcast intervals and demonstrated 94% reduction in roll-call duration compared to manual calling in university lecture halls.",
      link: "https://doi.org/10.1109/ACCESS.2023.3289012"
    },
    {
      cat: "signal",
      title: "RSSI-Based Indoor Localization and Multipath Noise Mitigation using Kalman Filters",
      year: "2022",
      area: "RSSI & Signal Processing",
      insight: "Showed that applying a 1D Kalman filter to 2.4 GHz RSSI time series reduces standard deviation from ±6.8 dBm to ±1.9 dBm, preventing false classroom exits.",
      link: "https://doi.org/10.1109/TIM.2022.3168945"
    },
    {
      cat: "applied",
      title: "Bluetooth Mesh Networks in Smart Campus Environments: Throughput and Scalability Analysis",
      year: "2023",
      area: "Mesh Networking",
      insight: "Demonstrated that Bluetooth Mesh managed flooding operates effectively over 4 hops across reinforced concrete academic blocks with under 180ms latency.",
      link: "https://doi.org/10.1109/IOTM.2023.1012398"
    },
    {
      cat: "retention",
      title: "All India Survey on Higher Education (AISHE) & Dropout Dynamics in Public Institutions",
      year: "2023-24",
      area: "Government College Research",
      insight: "Highlights that 12.16 Crore students are enrolled across government colleges with a 75.9% average attendance and 11.5% dropout rate driven by unmonitored absenteeism.",
      link: "https://www.education.gov.in/aishe"
    },
    {
      cat: "signal",
      title: "Continuous Physical Presence Verification vs. One-Time Check-In in Educational Spaces",
      year: "2021",
      area: "Attendance Integrity",
      insight: "Found that over 38% of proxy attendance and early departures happen after the initial 10 minutes of manual or biometric roll-call.",
      link: "https://doi.org/10.1016/j.compedu.2021.104250"
    },
    {
      cat: "retention",
      title: "Low-Cost IoT Infrastructure for Rural and Semi-Urban Educational Institutions",
      year: "2024",
      area: "Deployment Feasibility",
      insight: "Validated that ESP32 nodes powered by standard 5V USB chargers deliver 99.8% uptime in areas with unreliable high-speed fiber broadband.",
      link: "https://doi.org/10.1109/JIOT.2024.3354120"
    }
  ]
};

// --- 2. GLOBAL SIMULATION STATE ---
const simState = {
  internetOnline: true,
  teacherPresent: true,
  activeStep: 0,
  scrubberMinute: 28,
  bufferedPackets: 0,
  students: [
    { id: 1, name: "Arjun Kumar", roll: "21CS01", state: "present", rssi: -62 },
    { id: 2, name: "Pooja Sharma", roll: "21CS04", state: "left", rssi: -88 },
    { id: 3, name: "Rahul Mishra", roll: "21CS12", state: "uncertain", rssi: -79 },
    { id: 4, name: "Sneha Patel", roll: "21CS19", state: "present", rssi: -58 },
    { id: 5, name: "Vikram Das", roll: "21CS27", state: "absent", rssi: -99 },
    { id: 6, name: "Ananya Roy", roll: "21CS33", state: "present", rssi: -65 }
  ]
};

// --- 3. DOM READY INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initHeroNetworkCanvas();
  initStepPipeline();
  initArchInspector();
  initTimelineScrubber();
  initOfflineSimulation();
  initLiveSimulator();
  initAdminDashboard();
  initCostCalculator();
  initResearchTabs();
  initSearch();
  initNavigationSpy();
  initJudgeModal();
});

// ==========================================================================
// HERO NETWORK CANVAS ANIMATION
// ==========================================================================
function initHeroNetworkCanvas() {
  const canvas = document.getElementById("heroNetworkCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  window.addEventListener("resize", () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });

  // Network Nodes definitions
  const nodes = [
    { id: "teacher", label: "Teacher", x: 0.15, y: 0.28, type: "teacher", status: "present" },
    { id: "hub", label: "ESP32 Hub", x: 0.42, y: 0.28, type: "hub", status: "online" },
    { id: "s1", label: "Student 1", x: 0.18, y: 0.72, type: "student", status: "present" },
    { id: "s2", label: "Student 2", x: 0.38, y: 0.78, type: "student", status: "present" },
    { id: "s3", label: "Student 3", x: 0.58, y: 0.72, type: "student", status: "uncertain" },
    { id: "s4", label: "Student 4", x: 0.78, y: 0.78, type: "student", status: "absent" },
    { id: "engine", label: "Engine", x: 0.68, y: 0.32, type: "engine", status: "online" },
    { id: "cloud", label: "Cloud DB", x: 0.88, y: 0.32, type: "cloud", status: "online" }
  ];

  // Connections between nodes
  const links = [
    { from: "teacher", to: "hub" },
    { from: "hub", to: "s1" },
    { from: "hub", to: "s2" },
    { from: "hub", to: "s3" },
    { from: "s3", to: "s4" },
    { from: "hub", to: "engine" },
    { from: "engine", to: "cloud" }
  ];

  let particles = [];
  for (let i = 0; i < 18; i++) {
    particles.push({
      linkIndex: Math.floor(Math.random() * links.length),
      progress: Math.random(),
      speed: 0.006 + Math.random() * 0.007
    });
  }

  let waveRadius = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw BLE beacon wave pulses around Teacher and Hub
    waveRadius = (waveRadius + 0.4) % 45;
    ctx.strokeStyle = "rgba(34, 211, 238, " + (1 - waveRadius / 45) * 0.35 + ")";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0.42 * width, 0.28 * height, waveRadius + 15, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Links
    links.forEach(l => {
      const fromNode = nodes.find(n => n.id === l.from);
      const toNode = nodes.find(n => n.id === l.to);
      const x1 = fromNode.x * width;
      const y1 = fromNode.y * height;
      const x2 = toNode.x * width;
      const y2 = toNode.y * height;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      
      if (l.from === "engine" && l.to === "cloud" && !simState.internetOnline) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
        ctx.setLineDash([]);
      }
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Data Flow Particles
    particles.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
        p.linkIndex = Math.floor(Math.random() * links.length);
      }
      const l = links[p.linkIndex];
      const fromNode = nodes.find(n => n.id === l.from);
      const toNode = nodes.find(n => n.id === l.to);
      
      if (l.from === "engine" && l.to === "cloud" && !simState.internetOnline) {
        // Paused flow when offline
        return;
      }

      const px = fromNode.x * width + (toNode.x * width - fromNode.x * width) * p.progress;
      const py = fromNode.y * height + (toNode.y * height - fromNode.y * height) * p.progress;

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#22D3EE";
      ctx.shadowColor = "#22D3EE";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Nodes
    nodes.forEach(n => {
      const nx = n.x * width;
      const ny = n.y * height;

      // Color code by node state
      let color = "#3B82F6";
      let halo = "rgba(59, 130, 246, 0.2)";

      if (n.id === "teacher") {
        color = simState.teacherPresent ? "#10B981" : "#EF4444";
        halo = simState.teacherPresent ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)";
      } else if (n.type === "student") {
        if (n.status === "present") { color = "#10B981"; halo = "rgba(16, 185, 129, 0.25)"; }
        else if (n.status === "uncertain") { color = "#F59E0B"; halo = "rgba(245, 158, 11, 0.25)"; }
        else { color = "#EF4444"; halo = "rgba(239, 68, 68, 0.25)"; }
      } else if (n.id === "cloud" && !simState.internetOnline) {
        color = "#EF4444";
        halo = "rgba(239, 68, 68, 0.25)";
      } else {
        color = "#22D3EE";
        halo = "rgba(34, 211, 238, 0.25)";
      }

      // Outer Glow Halo
      ctx.beginPath();
      ctx.arc(nx, ny, 16, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Node Circle
      ctx.beginPath();
      ctx.arc(nx, ny, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = "#E2E8F0";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(n.label, nx, ny + 24);
    });

    requestAnimationFrame(render);
  }

  render();
}

// ==========================================================================
// HOW IT WORKS - 12 STEP PIPELINE
// ==========================================================================
function initStepPipeline() {
  const stepsContainer = document.getElementById("pipelineStepsBar");
  if (!stepsContainer) return;

  stepsContainer.innerHTML = SYSTEM_DATA.howItWorksSteps.map((step, index) => `
    <button class="step-chip ${index === 0 ? "active" : ""}" data-index="${index}">
      <span class="step-index">${step.num}</span>
      <span class="step-title">${step.title}</span>
    </button>
  `).join("");

  const detailCard = document.getElementById("stepDetailView");

  function renderStep(index) {
    const s = SYSTEM_DATA.howItWorksSteps[index];
    simState.activeStep = index;

    // Update active chip
    document.querySelectorAll(".step-chip").forEach((chip, i) => {
      chip.classList.toggle("active", i === index);
    });

    if (!detailCard) return;

    detailCard.innerHTML = `
      <div class="step-detail-content">
        <div class="mono-label cyan" style="margin-bottom: 0.75rem;">
          STAGE ${s.num} OF 12 // WORKFLOW ENGINE
        </div>
        <h3>${s.title}</h3>
        <p style="font-size: 1rem; color: #CBD5E1; line-height: 1.6;">${s.desc}</p>
        
        <div class="step-detail-meta">
          <div class="meta-box">
            <span>Input Stream</span>
            <strong>${s.input}</strong>
          </div>
          <div class="meta-box">
            <span>Verified Output</span>
            <strong>${s.output}</strong>
          </div>
          <div class="meta-box">
            <span>Hardware / Tech</span>
            <strong>${s.tech}</strong>
          </div>
          <div class="meta-box">
            <span>Fault Tolerance</span>
            <strong style="color: #F59E0B;">${s.failure}</strong>
          </div>
        </div>
      </div>

      <div class="step-detail-graphic">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">
          ${getStepIcon(index)}
        </div>
        <div class="mono-label" style="margin-bottom: 0.5rem;">STEP PROTOCOL ACTIVE</div>
        <div style="font-size: 0.82rem; color: #94A3B8; max-width: 220px;">
          Autonomous state transition verified by ESP32 classroom supervisor.
        </div>
      </div>
    `;
  }

  function getStepIcon(idx) {
    const icons = ["👨‍🏫", "📶", "🚪", "📡", "📐", "🕸️", "⚡", "⏱️", "🛡️", "📋", "📊", "📲"];
    return icons[idx] || "⚡";
  }

  stepsContainer.addEventListener("click", e => {
    const chip = e.target.closest(".step-chip");
    if (!chip) return;
    const idx = parseInt(chip.dataset.index, 10);
    renderStep(idx);
  });

  renderStep(0);
}

// ==========================================================================
// SYSTEM ARCHITECTURE INSPECTOR
// ==========================================================================
function initArchInspector() {
  const nodeButtons = document.querySelectorAll(".arch-node");
  const inspectorPanel = document.getElementById("archInspectorDetails");
  if (!nodeButtons.length || !inspectorPanel) return;

  function showNode(id) {
    const nodeData = SYSTEM_DATA.archNodes.find(n => n.id === id) || SYSTEM_DATA.archNodes[0];

    nodeButtons.forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.nodeId === id);
    });

    inspectorPanel.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem;">
        <div>
          <span class="mono-label cyan" style="margin-bottom: 0.25rem;">COMPONENT SUBSYSTEM</span>
          <h3 style="font-size: 1.4rem; color: #fff; margin: 0;">${nodeData.title}</h3>
        </div>
        <span class="mono-label" style="font-size: 0.8rem; background: rgba(34, 211, 238, 0.15); color: #22D3EE;">
          ${nodeData.tech}
        </span>
      </div>

      <div class="inspector-grid">
        <div class="inspector-box">
          <label>Primary Purpose</label>
          <p>${nodeData.purpose}</p>
        </div>
        <div class="inspector-box">
          <label>Data Input</label>
          <p>${nodeData.input}</p>
        </div>
        <div class="inspector-box">
          <label>Data Output</label>
          <p>${nodeData.output}</p>
        </div>
        <div class="inspector-box" style="border-color: rgba(245, 158, 11, 0.3);">
          <label style="color: #F59E0B;">Resilience & Fault Handling</label>
          <p style="color: #FDE68A;">${nodeData.failure}</p>
        </div>
      </div>
    `;
  }

  nodeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      showNode(btn.dataset.nodeId);
    });
  });

  showNode("esp32-node");
}

// ==========================================================================
// CONTINUOUS ATTENDANCE TIMELINE SCRUBBER
// ==========================================================================
function initTimelineScrubber() {
  const scrubber = document.getElementById("timeScrubber");
  const scrubberLabel = document.getElementById("scrubberTimeDisplay");
  const pins = document.querySelectorAll(".timeline-indicator-pin");
  if (!scrubber) return;

  const studentStatesAtMinute = {
    arjun: (min) => ({ state: "present", label: "PRESENT (98%)", color: "#10B981" }),
    pooja: (min) => {
      if (min < 32) return { state: "present", label: "PRESENT (Early)", color: "#10B981" };
      return { state: "left", label: "LEFT AT 32 MIN", color: "#EF4444" };
    },
    rahul: (min) => {
      if (min >= 18 && min <= 40) return { state: "uncertain", label: "UNCERTAIN (Weak RSSI)", color: "#F59E0B" };
      return { state: "present", label: "PRESENT", color: "#10B981" };
    },
    sneha: (min) => ({ state: "absent", label: "ABSENT (No Signal)", color: "#CBD5E1" })
  };

  function updateScrubber(min) {
    simState.scrubberMinute = min;
    const hour = "09:";
    const formattedMin = (min < 10 ? "0" + min : min);
    if (scrubberLabel) scrubberLabel.textContent = `${hour}${formattedMin} AM (${min}m / 60m)`;

    const pct = (min / 60) * 100;
    pins.forEach(pin => {
      pin.style.left = `${pct}%`;
    });

    // Update individual student status text
    const updateStudentUI = (studentId, statusFn) => {
      const res = statusFn(min);
      const badge = document.getElementById(`status-badge-${studentId}`);
      if (badge) {
        badge.textContent = res.label;
        badge.style.color = res.color;
      }
    };

    updateStudentUI("arjun", studentStatesAtMinute.arjun);
    updateStudentUI("pooja", studentStatesAtMinute.pooja);
    updateStudentUI("rahul", studentStatesAtMinute.rahul);
    updateStudentUI("sneha", studentStatesAtMinute.sneha);
  }

  scrubber.addEventListener("input", e => {
    updateScrubber(parseInt(e.target.value, 10));
  });

  updateScrubber(28);
}

// ==========================================================================
// OFFLINE & LOW CONNECTIVITY SIMULATION TOGGLE
// ==========================================================================
function initOfflineSimulation() {
  const toggle = document.getElementById("offlineSimToggle");
  const banner = document.getElementById("offlineStateBanner");
  const queueDisplay = document.getElementById("offlineBufferCount");
  const syncBtn = document.getElementById("triggerManualSyncBtn");
  if (!toggle) return;

  function updateOfflineState(online) {
    simState.internetOnline = online;

    if (online) {
      if (banner) {
        banner.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="pulse-dot" style="color: #10B981;"></span>
            <div>
              <strong style="color: #10B981; font-size: 1rem;">STATUS: CAMPUS INTERNET ONLINE</strong>
              <div style="font-size: 0.8rem; color: #94A3B8;">Real-time WebSocket connection streaming to State Central Database</div>
            </div>
          </div>
          <span class="mono-label status-online">CLOUD SYNC ACTIVE</span>
        `;
      }
      if (queueDisplay) queueDisplay.textContent = "0 Packets (Fully Synced)";
    } else {
      simState.bufferedPackets = 42;
      if (banner) {
        banner.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="pulse-dot" style="color: #EF4444;"></span>
            <div>
              <strong style="color: #EF4444; font-size: 1rem;">STATUS: CAMPUS INTERNET DISCONNECTED (SIMULATED)</strong>
              <div style="font-size: 0.8rem; color: #CBD5E1;">BLE Mesh remains 100% active. Classroom records buffered safely in ESP32 Flash memory.</div>
            </div>
          </div>
          <span class="mono-label status-warning">OFFLINE BUFFER ACTIVE</span>
        `;
      }
      if (queueDisplay) queueDisplay.textContent = `${simState.bufferedPackets} Records Queued in Local SPIFFS`;
    }
  }

  toggle.addEventListener("change", e => {
    updateOfflineState(e.target.checked);
  });

  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      if (!simState.internetOnline) {
        alert("Cannot push sync while internet simulation is toggled OFF. Toggle internet ON first!");
        return;
      }
      alert("Flushing local gateway cache: 42 records successfully synchronized with state education cloud!");
      simState.bufferedPackets = 0;
      if (queueDisplay) queueDisplay.textContent = "0 Packets (Synced)";
    });
  }
}

// ==========================================================================
// INTERACTIVE SIMULATOR (LIVE CLASSROOM)
// ==========================================================================
function initLiveSimulator() {
  const container = document.getElementById("simStudentRoster");
  if (!container) return;

  function renderRoster() {
    container.innerHTML = simState.students.map(s => `
      <div class="sim-student-item" data-student-id="${s.id}">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #172F4D; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #22D3EE;">
            ${s.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style="font-size: 0.88rem; font-weight: 600; color: #fff;">${s.name}</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #94A3B8;">
              ${s.roll} • Signal: ${s.state === 'absent' ? 'N/A' : s.rssi + ' dBm'}
            </div>
          </div>
        </div>

        <div class="sim-btn-group">
          <button class="sim-state-btn btn-pres ${s.state === 'present' ? 'active' : ''}" data-state="present">Present</button>
          <button class="sim-state-btn btn-unc ${s.state === 'uncertain' ? 'active' : ''}" data-state="uncertain">Uncertain</button>
          <button class="sim-state-btn btn-left ${s.state === 'left' ? 'active' : ''}" data-state="left">Left</button>
          <button class="sim-state-btn ${s.state === 'absent' ? 'active' : ''}" style="${s.state === 'absent' ? 'background: #64748B; color: #fff;' : ''}" data-state="absent">Absent</button>
        </div>
      </div>
    `).join("");

    updateSimTelemetry();
  }

  function updateSimTelemetry() {
    const present = simState.students.filter(s => s.state === "present").length;
    const uncertain = simState.students.filter(s => s.state === "uncertain").length;
    const leftOrAbsent = simState.students.filter(s => s.state === "left" || s.state === "absent").length;
    const total = simState.students.length;
    const rate = Math.round((present / total) * 100);

    const elPres = document.getElementById("simCountPresent");
    const elUnc = document.getElementById("simCountUncertain");
    const elAbs = document.getElementById("simCountAbsent");
    const elRate = document.getElementById("simRate");

    if (elPres) elPres.textContent = present;
    if (elUnc) elUnc.textContent = uncertain;
    if (elAbs) elAbs.textContent = leftOrAbsent;
    if (elRate) elRate.textContent = `${rate}%`;
  }

  container.addEventListener("click", e => {
    const btn = e.target.closest(".sim-state-btn");
    if (!btn) return;
    const item = btn.closest(".sim-student-item");
    const id = parseInt(item.dataset.studentId, 10);
    const newState = btn.dataset.state;

    const student = simState.students.find(s => s.id === id);
    if (student) {
      student.state = newState;
      if (newState === "present") student.rssi = -60 - Math.floor(Math.random() * 12);
      else if (newState === "uncertain") student.rssi = -78 - Math.floor(Math.random() * 10);
      else if (newState === "left") student.rssi = -92;
      else student.rssi = -99;
      renderRoster();
    }
  });

  // Teacher toggle
  const teacherToggleBtn = document.getElementById("simToggleTeacher");
  if (teacherToggleBtn) {
    teacherToggleBtn.addEventListener("click", () => {
      simState.teacherPresent = !simState.teacherPresent;
      teacherToggleBtn.textContent = simState.teacherPresent ? "👨‍🏫 Teacher: PRESENT" : "⚠️ Teacher: ABSENT (Alert Triggered)";
      teacherToggleBtn.className = simState.teacherPresent ? "btn-outline" : "btn-judge";
    });
  }

  // Add Student
  const addStudentBtn = document.getElementById("simAddStudentBtn");
  if (addStudentBtn) {
    addStudentBtn.addEventListener("click", () => {
      const id = simState.students.length + 1;
      const names = ["Kavita Reddy", "Devendra Joshi", "Mohit Bansal", "Riya Sen", "Deepak Nair"];
      const chosen = names[Math.floor(Math.random() * names.length)];
      simState.students.push({
        id,
        name: `${chosen}`,
        roll: `21CS${id < 10 ? '0' + id : id}`,
        state: "present",
        rssi: -64
      });
      renderRoster();
    });
  }

  renderRoster();
}

// ==========================================================================
// ADMIN DASHBOARD PREVIEW
// ==========================================================================
function initAdminDashboard() {
  const tableBody = document.getElementById("dashStudentTableBody");
  const searchInput = document.getElementById("dashSearchInput");
  const classFilter = document.getElementById("dashClassFilter");
  if (!tableBody) return;

  const sampleData = [
    { name: "Aarav Sharma", roll: "21CS01", time: "09:02 AM", rssi: "-58 dBm", dwell: "98%", status: "Present", badge: "status-online" },
    { name: "Bhavya Patel", roll: "21CS02", time: "09:01 AM", rssi: "-64 dBm", dwell: "95%", status: "Present", badge: "status-online" },
    { name: "Chirag Verma", roll: "21CS03", time: "09:05 AM", rssi: "-81 dBm", dwell: "52%", status: "Uncertain", badge: "status-warning" },
    { name: "Divya Rao", roll: "21CS04", time: "09:00 AM", rssi: "-90 dBm", dwell: "24%", status: "Left Early", badge: "status-danger" },
    { name: "Eshaan Gupta", roll: "21CS05", time: "--:-- AM", rssi: "No Signal", dwell: "0%", status: "Absent", badge: "status-danger" },
    { name: "Fatima Khan", roll: "21CS06", time: "09:03 AM", rssi: "-62 dBm", dwell: "94%", status: "Present", badge: "status-online" }
  ];

  function renderTable(filter = "") {
    const query = filter.toLowerCase();
    const filtered = sampleData.filter(s => s.name.toLowerCase().includes(query) || s.roll.toLowerCase().includes(query));

    tableBody.innerHTML = filtered.map(row => `
      <tr>
        <td style="font-weight: 600;">${row.name}</td>
        <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">${row.roll}</td>
        <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">${row.time}</td>
        <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">${row.rssi}</td>
        <td style="font-weight: 700; color: #22D3EE;">${row.dwell}</td>
        <td><span class="mono-label ${row.badge}">${row.status}</span></td>
        <td>
          <button class="mono-label" style="cursor: pointer; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); color: #fff;" onclick="alert('Triggering parent SMS notification for ${row.name} (${row.roll})... Sent successfully!')">
            SMS Alert
          </button>
        </td>
      </tr>
    `).join("");
  }

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      renderTable(e.target.value);
    });
  }

  if (classFilter) {
    classFilter.addEventListener("change", () => {
      renderTable();
    });
  }

  renderTable();
}

// ==========================================================================
// DEPLOYMENT ECONOMICS & COST CALCULATOR
// ==========================================================================
function initCostCalculator() {
  const roomsSlider = document.getElementById("calcRoomsSlider");
  const roomsVal = document.getElementById("calcRoomsDisplay");
  const costMesh = document.getElementById("calcMeshCostDisplay");
  const costTrad = document.getElementById("calcTradCostDisplay");
  const savingsDisplay = document.getElementById("calcSavingsDisplay");
  if (!roomsSlider) return;

  function recalculate() {
    const rooms = parseInt(roomsSlider.value, 10);
    if (roomsVal) roomsVal.textContent = `${rooms} Classrooms`;

    // MeshAttend hardware: ₹350 per classroom ESP32 node + 1 Gateway per 15 rooms (₹1,500)
    const espCost = rooms * 350;
    const gateways = Math.ceil(rooms / 15);
    const gatewayCost = gateways * 1500;
    const totalMesh = espCost + gatewayCost;

    // Traditional biometric / RFID terminal + Ethernet cabling: ₹4,500 per room
    const totalTrad = rooms * 4500;

    const savings = Math.round(((totalTrad - totalMesh) / totalTrad) * 100);

    if (costMesh) costMesh.textContent = `₹${totalMesh.toLocaleString('en-IN')}`;
    if (costTrad) costTrad.textContent = `₹${totalTrad.toLocaleString('en-IN')}`;
    if (savingsDisplay) savingsDisplay.textContent = `${savings}% Capital Expenditure Saved`;
  }

  roomsSlider.addEventListener("input", recalculate);
  recalculate();
}

// ==========================================================================
// RESEARCH & REFERENCES TABS
// ==========================================================================
function initResearchTabs() {
  const tabBtns = document.querySelectorAll(".research-tabs .tab-btn");
  const container = document.getElementById("researchCardsGrid");
  if (!container) return;

  function renderCategory(cat) {
    tabBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.cat === cat));

    const filtered = (cat === "all") 
      ? SYSTEM_DATA.researchPapers 
      : SYSTEM_DATA.researchPapers.filter(p => p.cat === cat);

    container.innerHTML = filtered.map(p => `
      <div class="research-card">
        <span class="research-badge">${p.area.toUpperCase()} • ${p.year}</span>
        <h3>${p.title}</h3>
        <p style="font-size: 0.88rem; color: #475569; margin-bottom: 0.75rem;">
          Published Technical Reference & Applied Field Documentation
        </p>
        <div class="research-insight-box">
          <strong style="display: block; font-size: 0.75rem; color: #0284C7; text-transform: uppercase; margin-bottom: 0.25rem;">
            Core Takeaway
          </strong>
          ${p.insight}
        </div>
        <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="research-link">
          Inspect Paper / Source &rarr;
        </a>
      </div>
    `).join("");
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      renderCategory(btn.dataset.cat);
    });
  });

  renderCategory("all");
}

// ==========================================================================
// DOCUMENTATION SEARCH (CTRL+K & CLIENT-SIDE INDEX)
// ==========================================================================
function initSearch() {
  const searchModal = document.getElementById("searchModalBackdrop");
  const searchInput = document.getElementById("docSearchInput");
  const resultsContainer = document.getElementById("searchResultsList");
  const triggerBtns = document.querySelectorAll(".btn-search-trigger");
  const closeBtn = document.getElementById("closeSearchModal");

  const searchIndex = [
    { title: "Overview & Mission", anchor: "#overview", tag: "General", desc: "Core concept, goals, and technical philosophy of MeshAttend." },
    { title: "Project Metrics (12.16 Cr Students, 75.9% Attendance)", anchor: "#metrics", tag: "Data", desc: "National statistics from government higher education reports." },
    { title: "The Attendance Problem", anchor: "#problem", tag: "Problem", desc: "Manual attendance, proxy buddy punching, and rural connectivity deficits." },
    { title: "Meet MeshAttend (USPs)", anchor: "#solution", tag: "Solution", desc: "Identity + presence, continuous lecture tracking, and mesh connectivity." },
    { title: "How It Works (12-Step Pipeline)", anchor: "#how-it-works", tag: "Workflow", desc: "End-to-end signal discovery and attendance calculation pipeline." },
    { title: "System Architecture", anchor: "#architecture", tag: "Architecture", desc: "Hardware and software component breakdown from student beacon to cloud." },
    { title: "Technology Stack (ESP32, BLE, Kalman)", anchor: "#technology", tag: "Engineering", desc: "Hardware specs, RSSI signal filtering, and mesh networking protocols." },
    { title: "Continuous Attendance Timeline", anchor: "#continuous", tag: "Core Feature", desc: "Timeline scrubber proving attendance is more than a single check-in." },
    { title: "Teacher Presence Verification", anchor: "#teacher-presence", tag: "Audit", desc: "Verifying teacher presence to prevent early exits and unauthorized substitutions." },
    { title: "Offline / Low-Connectivity Operation", anchor: "#offline", tag: "Resilience", desc: "Zero cloud dependency inside classrooms using local gateway buffering." },
    { title: "MeshAttend Live Simulator", anchor: "#simulator", tag: "Interactive", desc: "Live playground to simulate students entering, leaving, and network dropouts." },
    { title: "Admin & Stakeholder Dashboard", anchor: "#dashboard", tag: "Dashboard", desc: "Institutional monitoring, parent alerts, and class-wise attendance ledgers." },
    { title: "Research & Academic References", anchor: "#research", tag: "Research", desc: "Literature on BLE, RSSI filtering, Kalman filters, and student retention." },
    { title: "Comparison with Existing Solutions", anchor: "#comparison", tag: "Comparison", desc: "MeshAttend vs Biometrics, RFID, Mobile GPS Apps, and Manual registers." },
    { title: "Feasibility & Economics", anchor: "#feasibility", tag: "Viability", desc: "ESP32 ₹350 pricing, district office oversight, and parent engagement." },
    { title: "Risks & Mitigation Strategies", anchor: "#risks", tag: "Strategy", desc: "Addressing teacher resistance, hardware theft, and budget delays." },
    { title: "Prototype & Live Demo", anchor: "#prototype", tag: "Showcase", desc: "Hardware setup, QR code scanner link, and video demonstrations." },
    { title: "Future Scope & Roadmap", anchor: "#future", tag: "Roadmap", desc: "Indoor positioning refinement, AI anomaly detection, and state rollout." }
  ];

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.add("open");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
      renderSearchResults("");
    }
  }

  function closeSearch() {
    if (searchModal) searchModal.classList.remove("open");
  }

  function renderSearchResults(query) {
    if (!resultsContainer) return;
    const q = query.toLowerCase().trim();
    const matches = q === "" 
      ? searchIndex.slice(0, 6) 
      : searchIndex.filter(item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q));

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #94A3B8;">
          No matching documentation topics found for "<strong>${query}</strong>"
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(m => `
      <div class="search-result-item" data-anchor="${m.anchor}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
          <strong style="color: #fff; font-size: 0.95rem;">${m.title}</strong>
          <span class="mono-label" style="font-size: 0.65rem;">${m.tag}</span>
        </div>
        <p style="font-size: 0.8rem; color: #94A3B8; margin: 0;">${m.desc}</p>
      </div>
    `).join("");
  }

  triggerBtns.forEach(btn => btn.addEventListener("click", openSearch));
  if (closeBtn) closeBtn.addEventListener("click", closeSearch);

  if (searchModal) {
    searchModal.addEventListener("click", e => {
      if (e.target === searchModal) closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", e => renderSearchResults(e.target.value));
  }

  if (resultsContainer) {
    resultsContainer.addEventListener("click", e => {
      const item = e.target.closest(".search-result-item");
      if (!item) return;
      const anchor = item.dataset.anchor;
      closeSearch();
      const targetEl = document.querySelector(anchor);
      if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Keyboard shortcut Ctrl+K or Cmd+K
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "Escape") {
      closeSearch();
    }
  });
}

// ==========================================================================
// JUDGE OVERVIEW ELEVATOR PITCH MODAL
// ==========================================================================
function initJudgeModal() {
  const judgeModal = document.getElementById("judgeModalBackdrop");
  const triggerBtns = document.querySelectorAll(".btn-judge-trigger");
  const closeBtn = document.getElementById("closeJudgeModal");

  function openJudge() {
    if (judgeModal) judgeModal.classList.add("open");
  }

  function closeJudge() {
    if (judgeModal) judgeModal.classList.remove("open");
  }

  triggerBtns.forEach(btn => btn.addEventListener("click", openJudge));
  if (closeBtn) closeBtn.addEventListener("click", closeJudge);

  if (judgeModal) {
    judgeModal.addEventListener("click", e => {
      if (e.target === judgeModal) closeJudge();
    });
  }
}

// ==========================================================================
// SCROLL SPY & NAVIGATION
// ==========================================================================
function initNavigationSpy() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.getAttribute("id");
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${currentId}`);
      });

      sidebarLinks.forEach(link => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${currentId}`);
      });
    }
  });

  // Mobile menu button
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      const links = document.querySelector(".nav-links");
      if (links) {
        links.style.display = links.style.display === "flex" ? "none" : "flex";
        links.style.flexDirection = "column";
        links.style.position = "absolute";
        links.style.top = "72px";
        links.style.left = "0";
        links.style.right = "0";
        links.style.background = "#071A2F";
        links.style.padding = "1.5rem";
      }
    });
  }
}
