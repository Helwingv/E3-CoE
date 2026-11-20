// Sends every <form data-e3-form> to Netlify Forms without leaving the page.
// Submissions show up in Netlify under Forms, and Netlify can email them.
import { site } from "../config/site";

const ENDPOINT = "/__forms.html";

function message(form: HTMLFormElement, text: string, ok: boolean) {
  let box = form.querySelector<HTMLElement>("[data-form-status]");
  if (!box) {
    box = document.createElement("p");
    box.setAttribute("data-form-status", "");
    box.setAttribute("role", "status");
    form.appendChild(box);
  }
  box.className = ok
    ? "rounded-lg bg-e3-50 text-e3-900 px-4 py-3 text-sm font-medium"
    : "rounded-lg bg-red-50 text-red-800 px-4 py-3 text-sm font-medium";
  box.textContent = text;
}

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-e3-form")) return;
  event.preventDefault();

  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (button) button.disabled = true;

  const body = new URLSearchParams();
  new FormData(form).forEach((value, key) => body.append(key, String(value)));
  if (!body.has("form-name")) body.set("form-name", form.getAttribute("name") ?? "contact");

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    if (!res.ok) throw new Error(String(res.status));
    form.reset();
    message(form, "Thank you. Your message has been sent, and our team will be in touch.", true);
  } catch {
    message(form, `Sorry, that didn't go through. Please email us at ${site.email}.`, false);
  } finally {
    if (button) button.disabled = false;
  }
});
