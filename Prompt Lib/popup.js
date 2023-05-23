document.addEventListener("DOMContentLoaded", function () {
  const newPromptTab = document.getElementById("new-tab");
  const savedPromptTab = document.getElementById("saved-tab");
  const newPromptCard = document.getElementById("new-prompt-card");
  const savedPromptsCard = document.getElementById("saved-prompts-card");
  const saveButton = document.getElementById("save-btn");
  const savedList = document.getElementById("saved-list");

  // Load saved prompts on page load
  updateSavedPromptList();

// Function to update the saved prompts list
function updateSavedPromptList() {
  savedList.innerHTML = "";

  // Retrieve saved prompts from storage
  chrome.storage.local.get(["prompts"], function (result) {
    const prompts = result.prompts || [];

    prompts.forEach(function (prompt) {
      // Create list item for each prompt
      const listItem = document.createElement("li");
      listItem.classList.add("saved-prompt");

      // Create div for the prompt details
      const promptDetails = document.createElement("div");
      promptDetails.classList.add("prompt-details");

      // Create title element
      const titleElement = document.createElement("div");
      titleElement.classList.add("prompt-title");
      titleElement.textContent = prompt.title;
      promptDetails.appendChild(titleElement);

      // Create model element
      const modelElement = document.createElement("div");
      modelElement.classList.add("model");
      modelElement.textContent = prompt.model;
      promptDetails.appendChild(modelElement);

      // Create copy button element
      const copyButton = document.createElement("button");
      copyButton.classList.add("copy-btn");
      const copyIcon = document.createElement("i");
      copyIcon.classList.add("fas", "fa-copy");
      copyButton.appendChild(copyIcon);

      // Create prompt element
      const promptElement = document.createElement("div");
      promptElement.classList.add("prompt", "hidden");
      const promptText = document.createElement("p")
      promptText.textContent = prompt.prompt;
      promptElement.appendChild(copyButton);
      promptElement.appendChild(promptText);
      promptDetails.appendChild(promptElement);

    

      // Append the prompt details to the list item
      listItem.appendChild(promptDetails);

      // Create delete button element
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-btn");
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fas", "fa-trash");
      deleteButton.appendChild(deleteIcon);
      listItem.appendChild(deleteButton);

      // Append the list item to the saved list
      savedList.appendChild(listItem);

      // Add event listener for the saved prompt div
      promptDetails.addEventListener("click", function () {
        togglePromptVisibility(promptElement);
      });

      // Add event listener for the delete button
      deleteButton.addEventListener("click", function () {
        deleteSavedPrompt(prompt);
      });

      copyButton.addEventListener("click", function (event) {
        event.stopPropagation();
        copyIcon.classList.remove("fa-copy");
        copyIcon.classList.add("fa-check");
        copyPrompt(prompt.prompt)
        setTimeout(() => {
          copyIcon.classList.remove("fa-check");
          copyIcon.classList.add("fa-copy");
        }, 1000);
      });
    });
  });
}

function copyPrompt(prompt){
  navigator.clipboard.writeText(prompt);
}

// Function to toggle the visibility of the prompt element
function togglePromptVisibility(promptElement) {
  promptElement.classList.toggle("hidden");
}

// Function to delete a saved prompt
function deleteSavedPrompt(prompt) {
  // Retrieve saved prompts from storage
  chrome.storage.local.get(["prompts"], function (result) {
    const prompts = result.prompts || [];

    // Find index of the prompt to be deleted
    const index = prompts.findIndex(function (p) {
      return p.title === prompt.title && p.model === prompt.model && p.prompt === prompt.prompt;
    });

    if (index !== -1) {
      // Remove the prompt from the array
      prompts.splice(index, 1);

      // Update the prompts in storage
      chrome.storage.local.set({ prompts: prompts }, function () {
        // Update the saved prompts list
        updateSavedPromptList();
      });
    }
  });
}


  // Function to switch to the new prompt card
  function switchToNewPromptCard() {
    newPromptTab.classList.add("active");
    savedPromptTab.classList.remove("active");
    newPromptCard.style.display = "block";
    savedPromptsCard.style.display = "none";
  }

  // Function to switch to the saved prompts card
  function switchToSavedPromptsCard() {
    newPromptTab.classList.remove("active");
    savedPromptTab.classList.add("active");
    newPromptCard.style.display = "none";
    savedPromptsCard.style.display = "block";
  }

  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();

    // Retrieve input values
    const title = document.getElementById("title").value.trim();
    const model = document.getElementById("model").value.trim();
    const prompt = document.getElementById("prompt").value.trim();

    // Validate input values
    if (title === "" || model === "" || prompt === "") {
      alert("Please fill in all fields");
      return;
    }

    // Create new prompt object
    const newPrompt = {
      title: title,
      model: model,
      prompt: prompt,
    };

    // Save the new prompt to storage
    chrome.storage.local.get(["prompts"], function (result) {
      const prompts = result.prompts || [];
      prompts.push(newPrompt);

      chrome.storage.local.set({ prompts: prompts }, function () {
        // Clear form inputs
        document.getElementById("title").value = "";
        document.getElementById("model").value = "";
        document.getElementById("prompt").value = "";

        // Update the saved prompts list
        updateSavedPromptList();
      });
    });
  }

  // Add event listeners for tab switching and form submission
  if (newPromptTab) {
    newPromptTab.addEventListener("click", switchToNewPromptCard);
  }
  if (savedPromptTab) {
    savedPromptTab.addEventListener("click", switchToSavedPromptsCard);
  }
  if (saveButton) {
    saveButton.addEventListener("click", handleFormSubmit);
  }

  // Set the initial active card
  switchToNewPromptCard();

});
