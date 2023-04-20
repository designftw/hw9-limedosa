import Backend from "https://madata.dev/src/index.js";
let backend = Backend.from("https://github.com/limedosa/repo/data.json");


let $$ = (selector, container = document) =>
  Array.from(container.querySelectorAll(selector));
let $ = (selector, container = document) => container.querySelector(selector);

// Load data
let storedData = JSON.parse(data.innerHTML);

for (let entry of storedData) {
  addEntry(entry);
}

save_button.addEventListener("click", (event) => {
  let dataToSave = $$(".entry > form").map((form) => {
    let data = new FormData(form);
    return Object.fromEntries(data.entries());
  });

  data.innerHTML = JSON.stringify(dataToSave, null, "\t");
});

add_entry_button.addEventListener("click", (event) => {
  // Set current date and time as default
  let currentISODate = new Date().toISOString().substring(0, 19); // drop ms and timezone
  addEntry({ datetime: currentISODate });
});

function addEntry(data) {
  let entry = entry_template.content.cloneNode(true);

  for (let prop in data) {
    setFormElement(prop, data[prop], entry);
  }

  // Add new entry after "Add entry" button
  add_entry_button.after(entry);
}

function setFormElement(name, value, container) {
  let elements = $$(`[name="${name}"]`, container);

  for (let element of elements) {
    // only radios will have more than one, but can't hurt
    if (element.type === "checkbox") {
      element.checked = value;
    }
    if (element.type === "radio") {
      element.checked = element.value === value;
    } else {
      element.value = value;
    }
  }
}
let totalTasks = storedData.length;
let tasksDone = storedData.filter((entry) => entry.done).length;
let tasksNotDone = totalTasks - tasksDone;
document.getElementById("total_tasks").textContent = totalTasks;
document.getElementById("tasks_done").textContent = tasksDone;
document.getElementById("tasks_not_done").textContent = tasksNotDone;
$$('.entry input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    let entry = checkbox.closest(".entry");
    let index = $$(".entry").indexOf(entry);
    storedData[index].done = checkbox.checked;
    save_button.click(); // save changes to local storage
    updateSummary();
  });
});

const owner = "YOUR_GITHUB_USERNAME";
const repo = "YOUR_PRIVATE_REPO_NAME";
const branch = "main";

// Replace with your own GitHub access token
const accessToken = "YOUR_GITHUB_ACCESS_TOKEN";

const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/tracker/data.json`;

// Load data from the GitHub API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Parse the data from base64 encoding
    const decodedData = JSON.parse(atob(data.content));

    // Modify the data as needed
    decodedData.push({
      datetime: "2023-04-19T12:00:00",
      notes: "New task",
      priority: "low",
      done: false,
    });

    // Encode the updated data as base64
    const encodedData = btoa(JSON.stringify(decodedData, null, 2));

    // Create the commit payload
    const commitMessage = "Update data";
    const commitPayload = {
      message: commitMessage,
      content: encodedData,
      sha: data.sha,
      branch: branch,
    };

    // Create the commit using the GitHub API
    fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify(commitPayload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Commit created:", data);
      })
      .catch((error) => {
        console.error("Error creating commit:", error);
      });
  })
  .catch((error) => {
    console.error("Error loading data:", error);
  });
