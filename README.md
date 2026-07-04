# Kortex Unified Website Setup (usekortex.com)

This folder contains the main landing page for **usekortex.com** displaying both **Kortex Contacts** and **Kortex Captions**.

## Cloudflare Recommended Setup

To keep the web-based functions of `Kortex Contacts` (e.g. web logins, CRM syncs) working perfectly without any package conflicts, set up subdomain routing in your Cloudflare Dashboard:

### 1. Main Landing Page (`usekortex.com`)
* Create a Cloudflare Pages project pointing to this `usekortex-website` directory.
* Bind the custom domain `usekortex.com` to this project.

### 2. Contacts Web App (`app.usekortex.com` or `contacts.usekortex.com`)
* Build the web version of Kortex Contacts inside the `Kortex Contacts` folder:
  ```bash
  npx expo export --platform web
  ```
* Create a second Cloudflare Pages project pointing to the resulting `dist` folder inside `Kortex Contacts`.
* Bind the custom subdomain `contacts.usekortex.com` (or `app.usekortex.com`) to this second project.
