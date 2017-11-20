const cdForm = document.querySelector("#custom-domain");
const cdInput = document.querySelector("#custom-domain-origin");

cdForm.addEventListener("submit", async event => {
  event.preventDefault();

  const spinnakerDomain = new URL(cdInput.value).origin;

  if (origin) {
    browser.storage.local.set({
      spinnakerDomain
    });
  }
});

