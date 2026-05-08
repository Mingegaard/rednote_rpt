const STORAGE_KEYS = {
  tasks: "xh-ai-demo-tasks",
  draft: "xh-ai-demo-draft",
  route: "xh-ai-demo-route",
  currentTaskId: "xh-ai-demo-current-task-id",
};

const DEFAULT_VOLC = {
  apiKey: "ark-8bfc0fe0-c549-4f04-87d1-5c089fc1f556-4053d",
  baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
  imageModel: "doubao-seedream-5-0-lite-260128",
  textModel: "doubao-seed-2-0-lite-260428",
};

const TASK_FAILURE_TEXT = "生成暂时没有成功，请点击右侧“重试”再试一次。";
const TASK_FAILURE_TOAST = "生成暂时没有成功，已保留任务记录，可点击重试。";
const TITLE_FAILURE_TOAST = "标题生成暂时没有成功，请稍后重试。";
const DEFAULT_REVIEW_REASONS = ["注意避免夸张承诺", "请确认信息真实准确"];

const TEMPLATES = [
  {
    id: "streetwear",
    name: "街头休闲",
    badge: "+2",
    coverImage: "./assets/template-covers/streetwear.jpg",
    description: "清爽街拍感，适合通勤、穿搭、种草。",
    imagePrompt:
      "根据参考图，生成一组适合小红书图文发布的时尚街拍图片，保留主体特征，整体明亮清透，构图干净，适合封面和详情页。",
    textStyle:
      "请生成一篇小红书风格图文笔记，语气真实自然，像资深用户分享经验。输出 JSON，包含 title 和 content 两个字段。",
  },
  {
    id: "film",
    name: "复古胶片",
    badge: "+2",
    coverImage: "./assets/template-covers/film.jpg",
    description: "偏胶片感，适合生活方式、旅行记录。",
    imagePrompt:
      "根据参考图，生成一组带有胶片颗粒感和自然情绪的生活方式图片，保留主体一致性，画面松弛，有故事感。",
    textStyle:
      "请生成偏胶片生活记录风格的小红书笔记，标题克制高级，正文有氛围感但不空泛。输出 JSON，包含 title 和 content 两个字段。",
  },
  {
    id: "studio",
    name: "极简棚拍",
    badge: "+2",
    coverImage: "./assets/template-covers/studio.jpg",
    description: "干净棚拍风，适合美妆、单品、展示类内容。",
    imagePrompt:
      "根据参考图，生成极简棚拍风格的图文配图，背景简洁，光线柔和，突出主体细节和质感，适合商品或人物展示。",
    textStyle:
      "请生成一篇强调质感和细节描述的小红书笔记，结构清晰，适合展示型内容。输出 JSON，包含 title 和 content 两个字段。",
  },
  {
    id: "outdoor",
    name: "户外生活",
    badge: "+2",
    coverImage: "./assets/template-covers/outdoor.jpg",
    description: "自然户外感，适合露营、运动、日常记录。",
    imagePrompt:
      "根据参考图，生成自然户外风格图片，色调通透真实，人物或主体与环境有互动，适合小红书连续图文。",
    textStyle:
      "请生成户外生活方式笔记，语气有分享欲，像真诚推荐给朋友。输出 JSON，包含 title 和 content 两个字段。",
  },
  {
    id: "neo",
    name: "赛博霓虹",
    badge: "+2",
    coverImage: "./assets/template-covers/neo.jpg",
    description: "大胆视觉风格，适合创意内容与概念表达。",
    imagePrompt:
      "根据参考图，生成一组具有霓虹创意感的图文图片，保留参考图关键主体，增强视觉冲击力和潮流感。",
    textStyle:
      "请生成更有创意表达和记忆点的小红书文案，适合展示视觉概念。输出 JSON，包含 title 和 content 两个字段。",
  },
];

const DEFAULT_TEMPLATE = {
  id: "default",
  name: "通用模板",
  imagePrompt:
    "根据参考图和用户要求，生成一组适合小红书图文发布的高级感图片，画面真实自然，构图干净，主体突出，适合封面和详情页。",
  textStyle:
    "请生成一篇小红书风格图文笔记，语气自然真诚，内容结构清晰，有真实分享感。输出 JSON，包含 title 和 content 两个字段。",
};

const appState = {
  route: localStorage.getItem(STORAGE_KEYS.route) || "create",
  selectedTemplateId: null,
  referenceImages: [],
  tasks: readJson(STORAGE_KEYS.tasks, []),
  currentTaskId: localStorage.getItem(STORAGE_KEYS.currentTaskId) || null,
  apiConfig: { ...DEFAULT_VOLC },
};

const els = {
  pages: {
    create: document.getElementById("route-create"),
    queue: document.getElementById("route-queue"),
    publish: document.getElementById("route-publish"),
  },
  templateRow: document.getElementById("template-row"),
  assetTipsToggle: document.getElementById("asset-tips-toggle"),
  assetTips: document.getElementById("asset-tips"),
  referenceUpload: document.getElementById("reference-upload"),
  referenceGallery: document.getElementById("reference-gallery"),
  extraPrompt: document.getElementById("extra-prompt"),
  promptCount: document.getElementById("prompt-count"),
  generateBtn: document.getElementById("generate-btn"),
  queueBody: document.getElementById("queue-body"),
  publishThumbs: document.getElementById("publish-thumbs"),
  publishUpload: document.getElementById("publish-upload"),
  publishCount: document.getElementById("publish-count"),
  titleInput: document.getElementById("title-input"),
  contentInput: document.getElementById("content-input"),
  contentCount: document.getElementById("content-count"),
  publishBtn: document.getElementById("publish-btn"),
  saveDraftBtn: document.getElementById("save-draft-btn"),
  regenTitleBtn: document.getElementById("regen-title-btn"),
  reviewLoadingModal: document.getElementById("review-loading-modal"),
  reviewModal: document.getElementById("review-modal"),
  reviewList: document.getElementById("review-list"),
  modalFeedback: document.getElementById("modal-feedback"),
  modalCancel: document.getElementById("modal-cancel"),
  modalConfirm: document.getElementById("modal-confirm"),
  toast: document.getElementById("toast"),
  phoneImage: document.getElementById("phone-image"),
  phoneTitle: document.getElementById("phone-title"),
  phoneContent: document.getElementById("phone-content"),
};

init();

function init() {
  migrateLegacyApiConfig();
  renderTemplates();
  bindEvents();
  renderReferenceGallery();
  hydrateDraft();
  syncCounts();
  renderQueue();
  renderPublishView();
  bindRouteButtons();
  switchRoute(appState.route);
  resumePendingTasks();
}

function migrateLegacyApiConfig() {
  try {
    localStorage.removeItem("xh-ai-demo-api-config");
  } catch (error) {
    console.warn("Failed to clear legacy API config", error);
  }
}

function bindEvents() {
  els.referenceUpload.addEventListener("change", onReferenceUpload);
  els.assetTipsToggle.addEventListener("click", toggleAssetTips);
  els.extraPrompt.addEventListener("input", () => {
    syncCounts();
    persistDraft();
  });
  els.generateBtn.addEventListener("click", onGenerate);
  els.publishUpload.addEventListener("change", onPublishUpload);
  els.titleInput.addEventListener("input", () => {
    syncCounts();
    syncPreview();
    persistDraft();
  });
  els.contentInput.addEventListener("input", () => {
    syncCounts();
    syncPreview();
    persistDraft();
  });
  els.publishBtn.addEventListener("click", onPublish);
  els.saveDraftBtn.addEventListener("click", () => {
    persistDraft();
    switchRoute("create");
    toast("已暂存并返回生成页");
  });
  els.regenTitleBtn.addEventListener("click", onRegenerateTitle);
  els.modalFeedback.addEventListener("click", () => {
    toast("已收到审核错误反馈，我们会继续优化审核结果");
  });
  els.modalCancel.addEventListener("click", () => {
    hideReviewModal();
    toast("内容已保留，可继续调整");
  });
  els.modalConfirm.addEventListener("click", () => {
    hideReviewModal();
    completePublishingFlow();
  });
}

function toggleAssetTips() {
  const isExpanded = els.assetTipsToggle.getAttribute("aria-expanded") === "true";
  const nextExpanded = !isExpanded;
  els.assetTipsToggle.setAttribute("aria-expanded", String(nextExpanded));
  els.assetTipsToggle.classList.toggle("expanded", nextExpanded);
  els.assetTips.classList.toggle("hidden", !nextExpanded);
  els.assetTipsToggle.querySelector(".accordion-muted").textContent = nextExpanded
    ? "收起素材案例"
    : "展开查看最佳的素材案例";
  els.assetTipsToggle.querySelector(".accordion-arrow").textContent = nextExpanded ? "⌃" : "⌄";
}

function bindRouteButtons() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => switchRoute(button.dataset.route));
  });
}

function switchRoute(route) {
  appState.route = route;
  localStorage.setItem(STORAGE_KEYS.route, route);
  Object.entries(els.pages).forEach(([key, page]) => {
    page.classList.toggle("hidden", key !== route);
  });
  document.querySelectorAll("[data-route]").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.route === route);
  });
}

function renderTemplates() {
  els.templateRow.innerHTML = TEMPLATES.map(
    (template) => `
      <button class="template-card ${template.id === appState.selectedTemplateId ? "selected" : ""}" data-template-id="${template.id}">
        <div class="template-cover" data-badge="${template.badge}">
          <img src="${template.coverImage}" alt="${template.name}" />
        </div>
        <div class="template-name">${template.name}</div>
        <div class="template-desc">${template.description}</div>
      </button>
    `,
  ).join("");

  els.templateRow.querySelectorAll("[data-template-id]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.selectedTemplateId =
        appState.selectedTemplateId === button.dataset.templateId ? null : button.dataset.templateId;
      renderTemplates();
      persistDraft();
    });
  });
}

async function onReferenceUpload(event) {
  const files = Array.from(event.target.files || []).slice(0, 8);
  const items = await Promise.all(files.map(fileToData));
  appState.referenceImages = items;
  renderReferenceGallery();
  persistDraft();
}

function renderReferenceGallery() {
  const cards = [];
  const merged = [...appState.referenceImages];
  const totalSlots = 10;
  for (let i = 0; i < totalSlots; i += 1) {
    const item = merged[i];
    if (item) {
      cards.push(`
        <div class="ref-card">
          <img src="${item.dataUrl}" alt="${escapeHtml(item.name)}" />
        </div>
      `);
    } else {
      cards.push('<div class="ref-card ref-empty"></div>');
    }
  }
  els.referenceGallery.innerHTML = cards.join("");
}

async function onGenerate() {
  const template = getSelectedTemplate();
  const prompt = els.extraPrompt.value.trim();
  if (!prompt) {
    toast("先补充一下你的生成要求");
    return;
  }

  const taskId = createId();
  const task = {
    id: taskId,
    templateId: template.id,
    templateName: template.name,
    prompt,
    status: "running",
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    referenceImages: [...appState.referenceImages],
    generatedImages: [],
    title: "",
    content: "",
    statusText: "生成任务会持续约 1-2 分钟，已进入队列。",
  };

  appState.tasks.unshift(task);
  appState.currentTaskId = taskId;
  saveTasks();
  renderQueue();
  switchRoute("queue");
  toast("任务已提交，正在生成中");

  try {
    const result = await generateTaskResult(task, template);
    updateTask(taskId, {
      status: "completed",
      statusText: "你的图文已生成完成，可以查看并发布。",
      generatedImages: result.images,
      title: result.title,
      content: result.content,
      completedAt: new Date().toISOString(),
    });
    populateDraftFromTask(getTask(taskId));
    renderQueue();
    toast("AI 图文生成完成");
  } catch (error) {
    console.error(error);
    updateTask(taskId, {
      status: "failed",
      statusText: TASK_FAILURE_TEXT,
      errorMessage: TASK_FAILURE_TEXT,
    });
    renderQueue();
    toast(TASK_FAILURE_TOAST);
  }
}

async function generateTaskResult(task, template) {
  const imagePrompt = `${template.imagePrompt}\n用户额外要求：${task.prompt}`;
  const textPrompt = [
    template.textStyle,
    "请结合以下信息生成适合发布页自动填充的标题和正文。",
    `模版：${template.name}`,
    `额外要求：${task.prompt}`,
    "请确保输出是合法 JSON，示例：{\"title\":\"...\",\"content\":\"...\"}。",
  ].join("\n");

  const [images, textData] = await Promise.all([
    requestImages(task.referenceImages, imagePrompt),
    requestPostCopy(textPrompt),
  ]);

  if (!images.length) {
    throw new Error("图片接口已返回成功，但没有拿到可用图片结果");
  }

  if (!textData.title || !textData.content) {
    throw new Error("文本接口已返回成功，但没有拿到合法的标题和正文 JSON");
  }

  return { images, title: textData.title, content: textData.content };
}

async function requestImages(referenceImages, prompt) {
  const config = appState.apiConfig;
  const payload = {
    model: config.imageModel,
    prompt,
    size: "2048x2048",
    response_format: "url",
    watermark: true,
    stream: false,
  };

  if (referenceImages.length) {
    payload.image = referenceImages.slice(0, 3).map((item) => item.dataUrl);
  }

  const response = await fetch(`${config.baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "图片生成失败"));
  }

  const data = await response.json();
  const imageUrls = parseImageResponse(data);
  return imageUrls.map((url, index) => ({
    id: `${createId()}-${index}`,
    url,
    source: "volc",
  }));
}

async function requestPostCopy(prompt) {
  const config = appState.apiConfig;
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.textModel,
      temperature: 0.8,
      max_completion_tokens: 4096,
      reasoning_effort: "medium",
      messages: [
        {
          role: "system",
          content:
            "你是小红书资深内容策划。请严格输出 JSON，不要输出代码块，不要补充解释。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "文案生成失败"));
  }

  const data = await response.json();
  return parseTextJson(data);
}

function parseImageResponse(payload) {
  const candidates = [];
  const dataList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.images)
      ? payload.images
      : Array.isArray(payload?.output)
        ? payload.output
        : [];

  dataList.forEach((item) => {
    if (typeof item === "string") {
      candidates.push(item);
      return;
    }
    if (item?.url) candidates.push(item.url);
    if (item?.image_url?.url) candidates.push(item.image_url.url);
    if (item?.b64_json) candidates.push(`data:image/png;base64,${item.b64_json}`);
  });

  return candidates.filter(Boolean);
}

function parseTextJson(payload) {
  const text =
    payload?.choices?.[0]?.message?.content ||
    payload?.data?.generated_answer ||
    payload?.output_text ||
    "";

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return {};
  }

  try {
    return JSON.parse(match[0]);
  } catch (error) {
    console.warn("JSON parse failed", error);
    return {};
  }
}

function renderQueue() {
  if (!appState.tasks.length) {
    els.queueBody.innerHTML = `
      <tr>
        <td colspan="4" class="status-text">还没有生成任务，去创作页提交一个新的 AI 图文吧。</td>
      </tr>
    `;
    return;
  }

  els.queueBody.innerHTML = appState.tasks
    .map((task) => {
      const imageCount = task.referenceImages.length;
      const previewThumbs = task.referenceImages.slice(0, 4);
      return `
        <tr>
          <td>
            <div class="queue-materials">
              ${previewThumbs
                .map(
                  (image) => `
                    <div class="mini-thumb"><img src="${image.dataUrl}" alt="${escapeHtml(image.name)}" /></div>
                  `,
                )
                .join("")}
              ${
                imageCount > 4
                  ? `<div class="queue-plus">+${imageCount - 4}</div>`
                  : `<div class="queue-plus">${imageCount || 0}</div>`
              }
            </div>
          </td>
          <td>
            <div class="status-pill ${task.status}">${statusLabel(task.status)}</div>
            <div class="status-text">${escapeHtml(getTaskStatusText(task))}</div>
          </td>
          <td>${formatDateTime(task.startedAt || task.createdAt)}</td>
          <td>
            ${
              task.status === "completed"
                ? `<button class="table-action" data-view-task="${task.id}">查看</button>`
                : task.status === "failed"
                  ? `<button class="table-action" data-retry-task="${task.id}">重试</button>`
                  : `<button class="table-action" disabled>处理中</button>`
            }
          </td>
        </tr>
      `;
    })
    .join("");

  document.querySelectorAll("[data-view-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = getTask(button.dataset.viewTask);
      if (!task) return;
      appState.currentTaskId = task.id;
      localStorage.setItem(STORAGE_KEYS.currentTaskId, task.id);
      populateDraftFromTask(task);
      switchRoute("publish");
      renderPublishView();
    });
  });

  document.querySelectorAll("[data-retry-task]").forEach((button) => {
    button.addEventListener("click", () => retryTask(button.dataset.retryTask));
  });
}

async function retryTask(taskId) {
  const task = getTask(taskId);
  if (!task) return;
  updateTask(taskId, {
    status: "running",
    statusText: "正在重新提交生成请求。",
    startedAt: new Date().toISOString(),
  });
  renderQueue();

  try {
    const result = await generateTaskResult(task, TEMPLATES.find((item) => item.id === task.templateId) || TEMPLATES[0]);
    updateTask(taskId, {
      status: "completed",
      statusText: "你的图文已生成完成，可以查看并发布。",
      generatedImages: result.images,
      title: result.title,
      content: result.content,
      completedAt: new Date().toISOString(),
    });
    renderQueue();
    toast("任务已重新生成完成");
  } catch (error) {
    console.error(error);
    updateTask(taskId, {
      status: "failed",
      statusText: TASK_FAILURE_TEXT,
      errorMessage: TASK_FAILURE_TEXT,
    });
    renderQueue();
    toast(TASK_FAILURE_TOAST);
  }
}

async function onPublishUpload(event) {
  const files = Array.from(event.target.files || []);
  const uploaded = await Promise.all(files.map(fileToData));
  const draft = readJson(STORAGE_KEYS.draft, {});
  draft.generatedImages = [...(draft.generatedImages || []), ...uploaded.map((item) => ({ id: createId(), url: item.dataUrl, source: "manual" }))].slice(0, 18);
  localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(draft));
  renderPublishView();
}

function renderPublishView() {
  const draft = readJson(STORAGE_KEYS.draft, {});
  const images = draft.generatedImages || [];
  els.publishThumbs.innerHTML = images
    .map(
      (image, index) => `
        <div class="publish-thumb">
          <img src="${image.url}" alt="生成图片 ${index + 1}" />
          <div class="publish-thumb-index">${index + 1}</div>
        </div>
      `,
    )
    .join("");

  els.publishCount.textContent = `${images.length}/18`;
  els.titleInput.value = draft.title || "";
  els.contentInput.value = draft.content || "";
  syncCounts();
  syncPreview();
}

async function onRegenerateTitle() {
  const draft = readJson(STORAGE_KEYS.draft, {});
  const prompt = `请基于以下正文生成 5 个适合小红书发布的标题，标题需自然、有点击欲、不过度夸张。正文：${draft.content || "这是一篇关于生活方式分享的图文笔记。"}`;
  const config = appState.apiConfig;

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.textModel,
        temperature: 0.9,
        max_completion_tokens: 1024,
        reasoning_effort: "medium",
        messages: [
          {
            role: "system",
            content: "你是小红书爆款标题助手。请仅输出 5 行标题，每行一个。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(await readApiError(response, "标题生成失败"));

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const lines = text
      .split("\n")
      .map((line) => line.replace(/^[\-\d\.\s]+/, "").trim())
      .filter(Boolean);
    if (lines[0]) {
      els.titleInput.value = lines[0].slice(0, 30);
      persistDraft();
      syncPreview();
      toast("已更新智能标题");
      return;
    }
  } catch (error) {
    console.warn(error);
    toast(TITLE_FAILURE_TOAST);
    return;
  }
}

async function onPublish() {
  persistDraft();
  const draft = readJson(STORAGE_KEYS.draft, {});
  const title = (draft.title || "").trim();
  const content = (draft.content || "").trim();

  if (!title || !content) {
    toast("发布前请确认标题和正文已生成");
    return;
  }

  showReviewLoading();
  try {
    const review = await preReviewPost(title, content);
    hideReviewLoading();
    showReviewModal(review.reasons);
  } catch (error) {
    hideReviewLoading();
    console.warn(error);
    const fallback = localRiskReview(title, content);
    showReviewModal(fallback.reasons);
  }
}

async function preReviewPost(title, content) {
  const config = appState.apiConfig;
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.textModel,
      temperature: 0.1,
      max_completion_tokens: 1024,
      reasoning_effort: "medium",
      messages: [
        {
          role: "system",
          content:
            '你是内容审核助手。请根据标题和正文识别发布风险，仅输出 JSON，格式为 {"risk":true,"reasons":["原因1","原因2"]}。',
        },
        {
          role: "user",
          content: `标题：${title}\n正文：${content}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "预审核失败"));
  }

  const data = await response.json();
  const parsed = parseTextJson(data);
  return {
    risk: Boolean(parsed.risk),
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
  };
}

function localRiskReview(title, content) {
  const text = `${title}\n${content}`.toLowerCase();
  const reasons = [];
  const riskyWords = [
    ["暴力", "涉及暴力或攻击性表达"],
    ["封禁", "可能出现极端或处罚导向表述"],
    ["最强", "存在夸大宣传风险"],
    ["保证", "存在绝对化承诺风险"],
    ["赚钱", "存在商业化误导风险"],
  ];

  riskyWords.forEach(([keyword, reason]) => {
    if (text.includes(keyword.toLowerCase())) reasons.push(reason);
  });

  return { risk: reasons.length > 0, reasons };
}

function showReviewModal(reasons) {
  els.reviewList.innerHTML = normalizeReviewReasons(reasons)
    .map((reason) => `<li>${escapeHtml(reason)}</li>`)
    .join("");
  els.reviewModal.classList.remove("hidden");
}

function hideReviewModal() {
  els.reviewModal.classList.add("hidden");
}

function normalizeReviewReasons(reasons) {
  const normalized = (Array.isArray(reasons) ? reasons : [])
    .map((reason) => String(reason).trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((reason) => (reason.length > 18 ? `${reason.slice(0, 18)}...` : reason));
  return normalized.length ? normalized : DEFAULT_REVIEW_REASONS;
}

function showReviewLoading() {
  els.reviewLoadingModal.classList.remove("hidden");
  els.publishBtn.disabled = true;
}

function hideReviewLoading() {
  els.reviewLoadingModal.classList.add("hidden");
  els.publishBtn.disabled = false;
}

function completePublishingFlow() {
  const task = getTask(appState.currentTaskId);
  if (task) {
    updateTask(task.id, {
      publishedAt: new Date().toISOString(),
      statusText: "内容已发布到演示链路，可继续查看或修改。",
    });
  }
  toast("发布成功，已通过演示链路完成投递");
}

function persistDraft() {
  const draft = readJson(STORAGE_KEYS.draft, {});
  draft.title = els.titleInput.value;
  draft.content = els.contentInput.value;
  draft.extraPrompt = els.extraPrompt.value;
  draft.selectedTemplateId = appState.selectedTemplateId;
  if (!draft.generatedImages) {
    const task = getTask(appState.currentTaskId);
    draft.generatedImages = task?.generatedImages || [];
  }
  localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(draft));
}

function populateDraftFromTask(task) {
  localStorage.setItem(
    STORAGE_KEYS.draft,
    JSON.stringify({
      title: task.title,
      content: task.content,
      extraPrompt: task.prompt,
      selectedTemplateId: task.templateId,
      generatedImages: task.generatedImages,
    }),
  );
  renderPublishView();
}

function hydrateDraft() {
  const draft = readJson(STORAGE_KEYS.draft, {});
  appState.selectedTemplateId = TEMPLATES.some((template) => template.id === draft.selectedTemplateId)
    ? draft.selectedTemplateId
    : null;
  els.extraPrompt.value = draft.extraPrompt || "";
  renderTemplates();
}

function syncCounts() {
  els.promptCount.textContent = `${els.extraPrompt.value.length}/2000`;
  els.contentCount.textContent = `${els.contentInput.value.length}/1000`;
}

function syncPreview() {
  const draft = readJson(STORAGE_KEYS.draft, {});
  const title = els.titleInput.value || draft.title || "标题预览";
  const content = els.contentInput.value || draft.content || "正文预览";
  const images = draft.generatedImages || [];
  els.phoneTitle.textContent = title;
  els.phoneContent.textContent = content;
  els.phoneImage.innerHTML = images[0] ? `<img src="${images[0].url}" alt="预览图" />` : "";
}

function resumePendingTasks() {
  const pendingTask = appState.tasks.find((task) => task.status === "running");
  if (pendingTask) {
    updateTask(pendingTask.id, {
      status: "failed",
      statusText: "页面刷新后中断了演示中的异步任务，可点击重试继续。",
    });
    renderQueue();
  }
}

function updateTask(taskId, patch) {
  appState.tasks = appState.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task));
  saveTasks();
}

function getTask(taskId) {
  return appState.tasks.find((task) => task.id === taskId);
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(appState.tasks));
  if (appState.currentTaskId) {
    localStorage.setItem(STORAGE_KEYS.currentTaskId, appState.currentTaskId);
  }
}

function fileToData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: createId(),
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: reader.result,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => els.toast.classList.add("hidden"), 2200);
}

function getSelectedTemplate() {
  return TEMPLATES.find((template) => template.id === appState.selectedTemplateId) || DEFAULT_TEMPLATE;
}

function statusLabel(status) {
  return (
    {
      pending: "排队中",
      running: "生成中",
      completed: "已完成",
      failed: "失败",
    }[status] || "未知"
  );
}

function getTaskStatusText(task) {
  if (task.status === "failed") {
    return TASK_FAILURE_TEXT;
  }
  return task.statusText || "";
}

function formatDateTime(value) {
  const date = new Date(value);
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  const hh = `${date.getHours()}`.padStart(2, "0");
  const mm = `${date.getMinutes()}`.padStart(2, "0");
  const ss = `${date.getSeconds()}`.padStart(2, "0");
  return `${y}/${m}/${d}<br />${hh}:${mm}:${ss}`;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readApiError(response, prefix) {
  try {
    const payload = await response.json();
    const message = payload?.error?.message || payload?.message || `${prefix}: ${response.status}`;
    return `${prefix}: ${message}`;
  } catch (error) {
    return `${prefix}: ${response.status}`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
