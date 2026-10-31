/* rafi@terminal — vanilla JS, no dependencies */
(function () {
  "use strict";

  const output = document.getElementById("output");
  const screen = document.getElementById("screen");
  const form = document.getElementById("prompt-form");
  const input = document.getElementById("cmd");
  const tabs = document.querySelectorAll(".sections button");

  const LINKS = {
    github: "https://github.com/salehrafi",
    linkedin: "https://linkedin.com/in/salehrafi",
    codeforces: "https://codeforces.com/profile/wizz_rafi",
    kaggle: "https://www.kaggle.com/salehrafi",
    website: "https://salehrafi.github.io/salehrafi/",
    email: "mailto:saleh.rafi.01@gmail.com",
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
  const link = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text || href}</a>`;
  const tags = (list) => `<div class="tags">${list.map((t) => `<span class="tag">${t}</span>`).join("")}</div>`;
  const heading = (num, title) =>
    `<div class="h">${num ? `<span class="num">${num}</span>` : ""}<span>${title}</span><span class="rule"></span></div>`;

  const BANNER = String.raw`
 ____      _    _____ ___
|  _ \    / \  |  ___|_ _|
| |_) |  / _ \ | |_   | |
|  _ <  / ___ \|  _|  | |
|_| \_\/_/   \_\_|   |___|`;

  /* ---------- section content (01–05) ---------- */

  const sections = {
    whoami: () => `
      ${heading("01", "identity")}
      <dl class="kv">
        <dt>name</dt><dd class="b">Md. Saleh Rafi</dd>
        <dt>role</dt><dd>Software Engineer · Machine Learning Researcher · Full Stack Developer</dd>
        <dt>status</dt><dd>Final-Year CSE Student @ East West University, Bangladesh</dd>
        <dt>location</dt><dd>Dhaka, Bangladesh</dd>
        <dt>motto</dt><dd class="c-cyan">"Building intelligent systems that solve real-world problems."</dd>
      </dl>
      <p class="c-muted">→ try <span class="c-green">about</span> for the long version.</p>`,

    research: () => `
      ${heading("02", "research interests")}
      <p>Currently researching <span class="c-cyan b">Reliable AI for Medical Imaging</span>.</p>
      <ul class="list">
        <li>🧠 Machine Learning</li>
        <li>👁️ Computer Vision</li>
        <li>🏥 Medical AI</li>
        <li>🌐 Full-Stack Development</li>
        <li>🗄️ Database Systems</li>
        <li>⚙️ Software Engineering</li>
      </ul>
      <div class="card">
        <div class="title">Thesis · GATv2 for Medical Imaging <span class="c-green">[ongoing]</span></div>
        Hybrid ResNet18 → SLIC superpixel → GATv2Conv pipeline for chest X-ray classification, with a
        statistical analysis plan covering bootstrapped confidence intervals and paired significance testing.
        <div class="c-muted">Supervised by Dr. Ahmed Wasif Reza</div>
        ${tags(["GNNs", "PyTorch Geometric", "Medical Imaging"])}
      </div>`,

    projects: () => `
      ${heading("03", "projects")}
      <div class="card">
        <div class="title">GATv2 Chest X-Ray Classifier</div>
        Hybrid ResNet18 → SLIC superpixel → GATv2Conv pipeline classifying chest X-rays across five
        diagnostic classes, with a full statistical validation suite.
        ${tags(["PyTorch Geometric", "ResNet18", "SLIC", "GATv2"])}
      </div>
      <div class="card">
        <div class="title">RF-DETR vs. YOLO — Thermal Detection</div>
        Benchmark of object detection architectures on the FLIR thermal dataset, evaluating
        DINOv2-backed transformers against YOLO baselines.
        ${tags(["RF-DETR", "DINOv2", "YOLO", "Thermal Imaging"])}
      </div>
      <div class="card">
        <div class="title">Statistical Analysis Plan Toolkit</div>
        Reproducible SAP framework for GNN evaluation — bootstrapped CIs, Holm-corrected paired t-tests,
        DeLong's and McNemar's tests across k-fold splits.
        ${tags(["SciPy", "Bootstrapping", "Hypothesis Testing"])}
      </div>
      <div class="card">
        <div class="title">cxr_gnn — Modular GNN Package</div>
        Research notebook refactored into a Python package: config-driven training, calibration,
        ablation tooling and disk-cached graph construction.
        ${tags(["Python Packaging", "PyTorch", "CI-friendly"])}
      </div>
      <p class="c-muted">→ more on ${link(LINKS.github, "github.com/salehrafi")}</p>`,

    skills: () => {
      const bars = [
        ["Graph Neural Networks", 88],
        ["Computer Vision", 82],
        ["Applied Statistics", 78],
        ["Software Engineering", 74],
      ].map(([name, pct]) => `
        <div class="bar"><span class="label">${name}</span>
          <span class="track"><span class="fill" data-w="${pct}"></span></span>
          <span class="c-cyan">${pct}%</span></div>`).join("");
      return `
      ${heading("04", "technical skills")}
      <dl class="kv">
        <dt>languages</dt><dd>C · C++ · Python · JavaScript · PHP · Java · SQL · LaTeX</dd>
        <dt>web</dt><dd>HTML · CSS · Flask</dd>
        <dt>databases</dt><dd>MySQL · Oracle SQL · PL/SQL</dd>
        <dt>ml / dl</dt><dd>PyTorch · PyTorch Geometric · scikit-learn · NumPy / Pandas</dd>
        <dt>tools</dt><dd>Git · GitHub · Linux · VS Code · Jupyter · Kaggle</dd>
        <dt>core cs</dt><dd>Data Structures · Algorithms · OOP Design · Statistical Analysis</dd>
      </dl>
      <p class="c-muted" style="margin:10px 0 4px">focus areas</p>
      ${bars}`;
    },

    journey: () => `
      ${heading("05", "developer journey")}
      <div class="timeline">
        <div class="ev"><span class="c-blue">2014 — 2019</span> · <span class="b">SSC</span>, Kashira High School
          <div class="c-muted">Science Group · GPA 5.00 / 5.00</div></div>
        <div class="ev"><span class="c-blue">2019 — 2021</span> · <span class="b">HSC</span>, Police Lines School &amp; College, Bogura
          <div class="c-muted">Science Group · GPA 5.00 / 5.00</div></div>
        <div class="ev"><span class="c-blue">2022 — 2026</span> · <span class="b">B.Sc. in CSE</span>, East West University
          <div class="c-muted">Deep Learning · Computer Vision · Software Engineering</div></div>
        <div class="ev"><span class="c-blue">2024</span> · <span class="b c-yellow">🏆 Datathon Champion</span>
          <div class="c-muted">National Telco Warfare, Data War segment — #1 among 17 teams in the final round</div></div>
        <div class="ev"><span class="c-blue">2026</span> · <span class="b">CSE 445 Computer Vision</span>
          <div class="c-muted">RF-DETR vs. YOLO on thermal imaging · Harris corner detection</div></div>
        <div class="ev now"><span class="c-green">now</span> · <span class="b">Final Year Capstone</span>
          <div class="c-muted">GATv2 for medical imaging — data pipeline, ablations, statistical validation, writing</div></div>
      </div>`,
  };

  /* ---------- commands ---------- */

  const HELP = [
    ["whoami", "01 · who I am"],
    ["research", "02 · research interests"],
    ["projects", "03 · selected projects"],
    ["skills", "04 · technical skills"],
    ["journey", "05 · education & milestones"],
    ["about", "the about-me summary"],
    ["contact", "ways to reach me"],
    ["github", "open my GitHub profile"],
    ["social", "all profile links"],
    ["banner", "show the welcome banner"],
    ["history", "list previous commands"],
    ["clear", "clear the screen (or Ctrl+L)"],
    ["coffee", "☕"],
    ["sudo hire rafi", "you know you want to"],
  ];

  const commands = {
    help: () => `
      ${heading("", "available commands")}
      <div class="cmd-grid">
        ${HELP.map(([c, d]) => `<button type="button" data-run="${c}">${c}</button><span class="c-muted">${d}</span>`).join("")}
      </div>
      <p class="c-muted">Also: ls, echo, date, pwd, open &lt;linkedin|kaggle|codeforces|website&gt;</p>`,

    whoami: sections.whoami,
    research: sections.research,
    projects: sections.projects,
    skills: sections.skills,
    journey: sections.journey,

    about: () => `
      ${heading("", "about me")}
      <ul class="list">
        <li>🎓 Final-year <span class="b">Computer Science &amp; Engineering</span> student</li>
        <li>💻 Passionate about <span class="b">Software Engineering</span>, <span class="b">Machine Learning</span>, and <span class="b">Full-Stack Development</span></li>
        <li>🔬 Currently researching <span class="b">Reliable AI for Medical Imaging</span></li>
        <li>🌱 Exploring <span class="b">Computer Vision</span>, <span class="b">Deep Learning</span>, and <span class="b">Scalable Software Systems</span></li>
        <li>🤝 Open to collaboration on <span class="b">Open Source</span>, <span class="b">AI</span>, and <span class="b">Web Development</span> projects</li>
        <li>📫 Reach me at ${link(LINKS.website)}</li>
      </ul>`,

    contact: () => `
      ${heading("", "contact")}
      <dl class="kv">
        <dt>email</dt><dd>${link(LINKS.email, "saleh.rafi.01@gmail.com")}</dd>
        <dt>website</dt><dd>${link(LINKS.website, "salehrafi.github.io/salehrafi")}</dd>
        <dt>linkedin</dt><dd>${link(LINKS.linkedin, "linkedin.com/in/salehrafi")}</dd>
        <dt>github</dt><dd>${link(LINKS.github, "github.com/salehrafi")}</dd>
      </dl>
      <p class="c-muted">Open to research collaborations, internships and roles where ML meets real-world problems.</p>`,

    social: () => `
      ${heading("", "connect with me")}
      <dl class="kv">
        <dt>linkedin</dt><dd>${link(LINKS.linkedin)}</dd>
        <dt>github</dt><dd>${link(LINKS.github)}</dd>
        <dt>codeforces</dt><dd>${link(LINKS.codeforces)}</dd>
        <dt>kaggle</dt><dd>${link(LINKS.kaggle)}</dd>
      </dl>`,

    github: () => openLink("github"),

    open: (args) => {
      const key = (args[0] || "").toLowerCase();
      if (!LINKS[key]) return `<span class="c-yellow">usage:</span> open &lt;${Object.keys(LINKS).join("|")}&gt;`;
      return openLink(key);
    },

    banner: () => `
      <pre class="banner" aria-label="RAFI">${BANNER}</pre>
      <p>Welcome to <span class="c-cyan b">Md. Saleh Rafi</span>'s interactive terminal.
      <span class="c-muted">Software Engineer · ML Researcher · Full Stack Developer</span></p>
      <p>Type <span class="c-green">help</span> to list commands, or pick a section 01–05 above.</p>`,

    history: () => history.length
      ? `<pre>${history.map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`).join("\n")}</pre>`
      : `<span class="c-muted">no history yet</span>`,

    ls: () => `<span class="c-blue b">identity/  research/  projects/  skills/  journey/</span>  <span>README.md  resume.pdf</span>`,
    pwd: () => "/home/rafi",
    date: () => esc(new Date().toString()),
    echo: (args) => esc(args.join(" ")),

    cat: (args) => {
      const f = (args[0] || "").toLowerCase();
      if (f === "readme.md") return commands.about();
      if (f === "resume.pdf") return `<span class="c-red">cat: resume.pdf: binary file — try <span class="c-green">contact</span> and just ask 😉</span>`;
      return `<span class="c-red">cat: ${esc(args[0] || "")}: No such file or directory</span>`;
    },

    cd: (args) => {
      const dir = (args[0] || "").replace(/\/$/, "").toLowerCase();
      const map = { identity: "whoami", research: "research", projects: "projects", skills: "skills", journey: "journey" };
      if (map[dir]) return run(map[dir], { echo: false });
      if (!dir || dir === "~" || dir === "..") return "";
      return `<span class="c-red">cd: ${esc(args[0])}: No such file or directory</span>`;
    },

    coffee: () => `<pre class="c-yellow">
      ( (
       ) )
    ........
    |      |]
    \\      /
     \`----'</pre>
      <p>☕ Brewing… <span class="c-green">done.</span> Productivity +42%. Bugs −0 (sadly).</p>`,

    sudo: (args) => {
      if (args.join(" ").toLowerCase() === "hire rafi") {
        return `
        <p class="c-muted">[sudo] password for recruiter: ********</p>
        <p class="c-green">✔ Permission granted. Excellent decision.</p>
        <pre class="c-cyan">Installing rafi...
[██████████████████████████████] 100%
  + machine-learning   + computer-vision   + full-stack
  + research-rigour    + datathon-champion + good-coffee-taste</pre>
        <p>Next step → ${link(LINKS.email, "saleh.rafi.01@gmail.com")} or ${link(LINKS.linkedin, "LinkedIn")} 🚀</p>`;
      }
      return `<span class="c-red">${esc(["sudo", ...args].join(" "))}: permission denied.</span> <span class="c-muted">Nice try. Maybe <span class="c-green">sudo hire rafi</span>?</span>`;
    },

    rm: () => `<span class="c-red">rm: nice try — this portfolio is read-only 🙂</span>`,
    exit: () => `<span class="c-muted">There is no escape. Type <span class="c-green">help</span> instead. (or ${link("../", "go back to the portfolio")})</span>`,
    hello: () => "Hi there 👋 — type <span class=\"c-green\">help</span> to get started.",
  };
  commands.hi = commands.hello;
  commands["?"] = commands.help;
  commands.man = commands.help;
  commands.cls = () => commands.clear();
  commands.clear = () => { output.innerHTML = ""; return null; };

  function openLink(key) {
    const w = window.open(LINKS[key], "_blank", "noopener");
    return `Opening ${link(LINKS[key])} …${w ? "" : ' <span class="c-muted">(pop-up blocked — click the link)</span>'}`;
  }

  /* ---------- engine ---------- */

  const history = [];
  let histIndex = 0;
  const SECTION_CMDS = ["whoami", "research", "projects", "skills", "journey"];

  function print(html, cls) {
    const div = document.createElement("div");
    div.className = cls || "block";
    div.innerHTML = html;
    output.appendChild(div);
    // animate skill bars once they're in the DOM
    div.querySelectorAll(".fill[data-w]").forEach((el) => {
      requestAnimationFrame(() => { el.style.width = el.dataset.w + "%"; });
    });
    return div;
  }

  function echoPrompt(raw) {
    print(`<span class="user">rafi@ewu</span>:<span class="path">~</span>$ <span class="echo">${esc(raw)}</span>`, "line");
  }

  function setActive(name) {
    tabs.forEach((t) => t.setAttribute("aria-current", String(t.dataset.cmd === name)));
  }

  function run(raw, opts = {}) {
    const text = raw.trim();
    if (opts.echo !== false) echoPrompt(raw);
    if (!text) return "";

    const parts = text.split(/\s+/);
    const name = parts[0].toLowerCase();
    const fn = commands[name];

    if (!fn) {
      print(`<span class="c-red">command not found: ${esc(parts[0])}</span> — type <span class="c-green">help</span> for a list of commands.`);
      return "";
    }

    if (SECTION_CMDS.includes(name)) setActive(name);
    const result = fn(parts.slice(1));
    if (result) print(result);
    return "";
  }

  function submit(raw) {
    if (raw.trim()) {
      history.push(raw.trim());
      // jump the address bar to a shareable section, e.g. /terminal/#projects
      const n = raw.trim().split(/\s+/)[0].toLowerCase();
      if (SECTION_CMDS.includes(n)) {
        try { window.history.replaceState(null, "", "#" + n); } catch (e) { /* file:// */ }
      }
    }
    histIndex = history.length;
    run(raw);
    scrollDown();
  }

  function scrollDown() {
    screen.scrollTop = screen.scrollHeight;
  }

  function complete(value) {
    const v = value.toLowerCase();
    if (!v) return value;
    const names = Object.keys(commands).concat("sudo hire rafi");
    const matches = names.filter((n) => n.startsWith(v));
    if (matches.length === 1) return matches[0] + (matches[0].includes(" ") ? "" : " ");
    if (matches.length > 1) {
      echoPrompt(value);
      print(`<span class="c-muted">${matches.map(esc).join("   ")}</span>`, "line");
      scrollDown();
    }
    return value;
  }

  /* ---------- events ---------- */

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value;
    input.value = "";
    submit(raw);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      if (!history.length) return;
      e.preventDefault();
      histIndex = Math.max(0, histIndex - 1);
      input.value = history[histIndex];
      requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
    } else if (e.key === "ArrowDown") {
      if (!history.length) return;
      e.preventDefault();
      histIndex = Math.min(history.length, histIndex + 1);
      input.value = history[histIndex] || "";
    } else if (e.key === "Tab") {
      if (!input.value) return; // let Tab move focus when the line is empty
      e.preventDefault();
      input.value = complete(input.value);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    } else if (e.key === "c" && e.ctrlKey && !window.getSelection().toString()) {
      e.preventDefault();
      echoPrompt(input.value + "^C");
      input.value = "";
      scrollDown();
    }
  });

  // Section tabs, quick chips and clickable commands inside `help`
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cmd], [data-run]");
    if (!btn) return;
    submit(btn.dataset.cmd || btn.dataset.run);
    if (window.matchMedia("(pointer: fine)").matches) input.focus();
  });

  // Click anywhere in the terminal to focus the prompt (unless selecting text / clicking a link)
  screen.addEventListener("click", (e) => {
    if (e.target.closest("a, button") || window.getSelection().toString()) return;
    input.focus();
  });

  /* ---------- boot ---------- */

  print(commands.banner());
  const start = location.hash.slice(1).toLowerCase();
  if (SECTION_CMDS.includes(start) || ["about", "contact", "help"].includes(start)) {
    submit(start);
  } else {
    submit("whoami");
  }
})();
