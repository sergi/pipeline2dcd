import picoModal from "picomodal";
import jsyaml from "js-yaml";

let SESSION, APP_NAME;

// Helper function to select all text in a node
function selectElementContents(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// JSON processing functions
function convert(config) {
  return {
    schema: "1",
    id: "generatedTemplate",
    metadata: {
      name: config.name || "I NEED A NAME",
      description: config.description || "I NEED A DESCRIPTION",
      owner: config.lastModifiedBy,
      scopes: []
    },
    protect: false,
    configuration: {
      concurrentExecutions: {
        parallel: config.parallel,
        limitConcurrent: config.limitConcurrent
      },
      triggers: convertTriggers(config.triggers || []),
      parameters: config.parameterConfig || [],
      notifications: convertNotifications(config.notifications || [])
    },
    variables: [],
    stages: convertStages(config.stages)
  };
}

// Munch some JSON to transform it to what we want
// #region json_transform
function convertStages(stages) {
  return stages.map(stage => {
    let stageObj = {
      id: getStageId(stage),
      type: stage.type,
      name: stage.name,
      config: scrubStageConfig(stage)
    };

    if (stage.requisiteStageRefIds && stage.requisiteStageRefIds.length > 0) {
      stage.dependsOn = stage.requisiteStageRefIds.map(refId =>
        getRefStageId(stages, refId)
      );
    }

    return stageObj;
  });
}

function getRefStageId(stages, refId) {
  let stage = stages.filter(s => s.refId === refId)[0];
  return getStageId(stage.type, stage.refId);
}

function getStageId(stage) {
  return stage.name
    ? stage.name.toLowerCase().replace(/\s/g, "_")
    : stage.type + "" + stage.refId;
}

function scrubStageConfig(stage) {
  const { type, name, refId, requisiteStageRefIds, ...rest } = stage;
  return rest;
}

function convertTriggers(triggers) {
  return triggers.map((t, i) => {
    t.name = "unnamed" + (i + 1);
    return t;
  });
}

function convertNotifications(notifications) {
  return notifications.map((n, i) => {
    n.name = n.type + "" + i;
    return n;
  });
}
// #endregion

async function getYaml(session, pipelineName) {
  const domain = await browser.storage.local.get("spinnakerDomain");
  if (!domain.spinnakerDomain) {
    return alert("Please configure the root domain in pipeline2YAML settings");
  }

  const url = `${domain.spinnakerDomain}/applications/${APP_NAME}/pipelineConfigs/${pipelineName}`;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  // xhr.setRequestHeader("Cookie", `SESSION=${session}`);
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const finalJSON = convert(JSON.parse(xhr.responseText));
      picoModal(
        `<pre class="yaml-box" contenteditable="true">${jsyaml.safeDump(
          finalJSON
        )}</pre>`
      )
        .afterCreate(modal => {
          const yamlBox = modal
            .modalElem()
            .getElementsByClassName("yaml-box")[0];

          yamlBox.focus();
          setTimeout(() => selectElementContents(yamlBox));
        })
        .show();
    }
  };
  xhr.send(null);
}

// Listen for background to give us the session ID
browser.runtime.onMessage.addListener(message => {
  if (message.session) {
    SESSION = message.session;
  }
});

// On [yaml] link click, start retrieving
function onClick(e) {
  getYaml(SESSION, e.target.getAttribute("data-pipeline-name"));
}

// Probably not the best way, but because Spinnaker has some considerable async
// delays, we keep trying until we know the elements we want are there.
const retry = setInterval(() => {
  const appNameElement = document.querySelectorAll(".application-name");
  const pipelineNodeList = document.querySelectorAll(".checkbox.sortable>div");

  if (appNameElement.length > 0 && pipelineNodeList.length > 0) {
    APP_NAME = appNameElement[0].textContent;
    pipelineNodeList.forEach(n => {
      const a = document.createElement("a");
      a.addEventListener("click", onClick);
      a.className = "yaml-link";
      a.style.cssText = "margin-left:5px; font-size: 10px; cursor: pointer;";
      a.textContent = "[yaml]";
      a.setAttribute("data-pipeline-name", n.firstChild.textContent.trim());
      n.appendChild(a);
    });
    clearInterval(retry);
  }
}, 500);
