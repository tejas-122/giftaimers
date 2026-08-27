# GiftAimers — Personalized Gifts E-Commerce Platform

*"aim to spread love through gifts"*

A full-stack e-commerce site for personalized/custom gifts: a 3D animated
hero and product viewer, mandatory customer sign-in before checkout, an
admin panel for products + orders with auto-generated PDF invoices, and
Cash-on-Delivery checkout. Built to run entirely on free/cheap hosting tiers.

```
giftaimers/
├── backend/     Node.js + Express + MongoDB API
└── frontend/    React + Vite + Tailwind + Three.js storefront & admin panel
```

---

## What's included

**Branding**
- Your logo is wired into the Navbar, Footer, browser favicon, and the
  Sign In / Sign Up / Admin Login screens.
- The whole site's color palette (backgrounds, buttons, accents, status
  badges) is built from your logo's magenta → deep-plum gradient, on a
  clean white canvas.

**Storefront**
- 3D animated gift-box hero (click it to "unwrap")
- Shop page with category, price sort, and search
- Product page with a tilt/3D image viewer (or a real rotating `.glb`
  model if you upload one) and a personalization form (engraving text,
  dates, etc.)
- **Customers must create an account and sign in before they can check
  out** — enforced both in the UI (checkout redirects to Sign In) and on
  the server (the order API rejects unauthenticated requests)
- Signed-in customers get an **Account page** with their order history
- Cart → Checkout (pre-filled from their account, Cash on Delivery) →
  Order confirmation
- Public order tracking by order number, no login needed (for anyone
  who was given the order number, e.g. the gift recipient)

**Admin panel** (`/admin` — separate login from customers)
- Dashboard: total orders, pending, delivered, revenue, low-stock &
  out-of-stock counts
- Products: add/edit/remove, image upload, price, discount %, offer
  tag/badge, out-of-stock toggle, minimum & maximum order quantity,
  stock count, SKU, featured toggle, personalization fields builder
- Orders: view every order the moment it's placed, update status
  (placed → confirmed → processing → shipped → delivered / cancelled),
  and generate + download a PDF invoice for any order
- 8 sample products included via a one-command seed script, so the shop
  isn't empty on day one

---

## 1. Tech stack (why this combo)

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind | Fast dev, tiny builds, huge community |
| 3D | three.js via `@react-three/fiber` | Industry-standard WebGL, works on mobile |
| Backend | Node.js + Express | Simple REST API, huge hosting support |
| Database | MongoDB (Atlas free tier) | Flexible schema, generous free tier |
| Auth | JWT, two separate tokens | Customers and admins are fully isolated — a customer token can never touch admin routes, and vice versa |
| Images | Cloudinary (free tier) | Free image hosting + automatic optimization |
| Invoices | PDFKit | Generates a real PDF invoice server-side |
| Hosting | Vercel (frontend) + Render (backend) | Both deploy straight from GitHub, solid free tiers |

---

## 2. Run it locally first

### 2.1 Backend
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and fill in at minimum `MONGO_URI` (see step 3 below) and
`JWT_SECRET` (any long random string — e.g. run `openssl rand -hex 32`).

```bash
npm run dev
```
API runs at `http://localhost:5000`. Confirm it's alive: open
`http://localhost:5000/api/health` in your browser.

### 2.2 Create your admin login
Still inside `backend/`, with `ADMIN_EMAIL` / `ADMIN_PASSWORD` set in `.env`:
```bash
npm run seed:admin
```
This is the account you'll use to log into `/admin` — separate from
customer accounts, which anyone can self-register for on the site.

### 2.3 Add sample products (optional but recommended)
```bash
npm run seed:products
```
Adds 8 demo personalized gifts (jewelry, wall art, kids' items, etc.) so
the Shop page isn't empty. Safe to run more than once — it skips
products that already exist.

### 2.4 Frontend
```bash
cd frontend
npm install
cp .env.example .env
```
Make sure `.env` has:
```
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```
Site runs at `http://localhost:5173`.
- Storefront: `http://localhost:5173`
- Customer sign up: `http://localhost:5173/signup`
- Admin panel: `http://localhost:5173/admin/login`

### 2.5 Try the full flow locally
1. Go to `/shop`, open a product, add it to your cart.
2. Go to `/cart` → **Proceed to Checkout** — you'll be sent to `/signin`
   since checkout requires an account.
3. Click **Create an account**, sign up, and you'll land right back on
   checkout with your name/email/phone pre-filled.
4. Place the order (Cash on Delivery) — you'll get an order number.
5. Log into `/admin` with your seeded admin account — the order appears
   in **Orders** immediately. Open it and click **Download Invoice**.

---

## 3. Deploy the database — MongoDB Atlas (free)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free M0 cluster** (pick a region close to your customers, e.g. Mumbai for India).
3. **Database Access** → Add a database user (username + strong password) — save these.
4. **Network Access** → Add IP Address → for now choose **Allow access from anywhere** (`0.0.0.0/0`) so Render can connect.
5. **Database → Connect → Drivers** → copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add `/giftaimers` before the `?` so it points at a database named `giftaimers`:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/giftaimers?retryWrites=true&w=majority
   ```
   This is your `MONGO_URI`.

---

## 4. Set up image hosting — Cloudinary (free)

1. Sign up at https://cloudinary.com/users/register/free.
2. On your Dashboard, copy **Cloud Name**, **API Key**, **API Secret**.
3. You'll paste these into the backend's environment variables in step 5.

(You don't need this just to see the sample products — those use
hotlinked demo images. You'll need it the moment you want to upload your
own product photos from the admin panel.)

---

## 5. Deploy the backend — Render (free/cheap)

1. Push the whole `giftaimers/` folder to a GitHub repository (see step 7).
2. Go to https://render.com → New → **Web Service** → connect your GitHub repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or Starter, $7/mo, once you have real traffic — the free tier sleeps after 15 min idle)
4. Add Environment Variables (Render dashboard → Environment):
   ```
   MONGO_URI=<from step 3>
   JWT_SECRET=<any long random string>
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL=you@yourdomain.com
   ADMIN_PASSWORD=<strong password>
   CLOUDINARY_CLOUD_NAME=<from step 4>
   CLOUDINARY_API_KEY=<from step 4>
   CLOUDINARY_API_SECRET=<from step 4>
   CLIENT_URL=https://giftaimers.vercel.app   (update after step 6)
   STORE_NAME=GiftAimers
   STORE_ADDRESS=Your business address
   STORE_EMAIL=support@yourdomain.com
   STORE_PHONE=+91-xxxxxxxxxx
   NODE_ENV=production
   ```
5. Deploy. Render gives you a URL like `https://giftaimers-api.onrender.com`.
6. From Render's **Shell** tab (or locally, pointed at the same `MONGO_URI`), run once each:
   ```bash
   npm run seed:admin
   npm run seed:products
   ```
7. Confirm it's live: visit `https://giftaimers-api.onrender.com/api/health`.

---

## 6. Deploy the frontend — Vercel (free)

1. Go to https://vercel.com → New Project → import the same GitHub repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Environment Variable:
   ```
   VITE_API_URL=https://giftaimers-api.onrender.com/api
   ```
4. Deploy. Vercel gives you `https://giftaimers.vercel.app` (or similar).
5. Go back to Render and update `CLIENT_URL` to this exact URL, then
   redeploy the backend so CORS allows requests from it.

---

## 7. Push your code to GitHub (needed for steps 5 & 6)

From the folder containing both `backend/` and `frontend/`:
```bash
git init
git add .
git commit -m "Initial GiftAimers site"
git branch -M main
git remote add origin https://github.com/<your-username>/giftaimers.git
git push -u origin main
```
Create the empty GitHub repo first at https://github.com/new.
`.env` files are never committed — only `.env.example` is. Enter your
real secrets directly into Render/Vercel's dashboards, not into git.

---

## 8. Point your own domain at it

1. Buy a domain (e.g. `giftaimers.com`) from Namecheap, GoDaddy, or Google Domains.
2. **Frontend (main site):** Vercel → Project → Settings → Domains → add
   `giftaimers.com` and `www.giftaimers.com`. Add the DNS records Vercel
   gives you at your domain registrar. Free SSL is issued automatically.
3. **Backend (API):** Render → your service → Settings → Custom Domain →
   add `api.giftaimers.com` and its `CNAME` record.
4. Update `VITE_API_URL` in Vercel to `https://api.giftaimers.com/api`
   and `CLIENT_URL` in Render to `https://giftaimers.com`. Redeploy both.
5. DNS changes can take up to a few hours to propagate.

---

## 9. Make it feel like a big company's site (production checklist)

- **Real product photography** — clean, consistent lighting per category; swap out the sample Unsplash images via the admin panel.
- **Google Analytics / Meta Pixel** — add tracking scripts in `frontend/index.html`.
- **SEO basics** — unique meta titles/descriptions per product, a `sitemap.xml`, submit to Google Search Console.
- **Legal pages** — Privacy Policy, Terms, Shipping & Returns policy.
- **Backups** — Atlas free tier has no automated backups; run `mongodump` periodically, or upgrade once you have real orders.
- **Order emails/SMS** — hook an email provider (Resend, SendGrid) or SMS gateway (MSG91, Twilio) into `orderController.js`'s `placeOrder`/`updateOrderStatus`, and into `customerAuthController.js`'s `register`, to send confirmations automatically.
- **Password reset for customers** — not included yet (out of scope for this pass); when you're ready, add a `/api/customers/forgot-password` flow using a signed reset token emailed to the customer.
- **Online payments later** — checkout is COD-only right now, by design. Add Razorpay or Stripe by creating a `/api/payments` route, confirming client-side, then calling the existing `placeOrder` endpoint with `paymentMethod: "ONLINE"`.
- **Security & scale** — `helmet` and basic rate limiting are already on; put the API behind Cloudflare (free tier) once live for DDoS protection and caching.
- **Monitoring** — add a free tier of Sentry (errors) or use Render's built-in logs/metrics.
- **Staging environment** — duplicate the Render + Vercel setup with a second Atlas database (`giftaimers-staging`) to test changes safely.

---

## 10. Day-to-day usage

**Adding a product:** Admin panel → Products → Add Product → fill in
images, price, discount %, offer tag, stock, min/max order qty, and any
personalization fields (e.g. "Name to Engrave", required, max 20
characters).

**Marking something out of stock:** Products list → click the stock
badge to toggle instantly, or set Stock to 0 (it auto-flips).

**When a customer signs up:** their account is created instantly — no
approval needed. They'll show up if you ever add a customer list to the
admin panel (not included yet, but the `Customer` collection in MongoDB
already has everyone).

**When a customer orders:** it appears immediately in Admin → Orders.
Click into it, click **Download Invoice** for a PDF, and move its status
along as you pack/ship it — this also updates the order in the
customer's own **Account → Orders** page and in public order tracking.

**Customers track their own order** at `/track-order` with just their
order number — useful for gift recipients who don't have an account.

---

## API reference (quick)

```
GET    /api/products                    Storefront product list (filters: category, search, sort, minPrice, maxPrice)
GET    /api/products/:slug              Single product
GET    /api/products/categories/list    Distinct categories

# Admin auth (separate token from customers)
POST   /api/auth/login                  Admin login -> { token }
GET    /api/auth/me                     Current admin (auth required)

# Customer accounts (required before ordering)
POST   /api/customers/register          Create a customer account -> { token }
POST   /api/customers/login             Customer login -> { token }
GET    /api/customers/me                Current customer (auth required)
GET    /api/customers/orders            Signed-in customer's order history (auth required)

GET    /api/products/admin/all          All products incl. hidden (admin auth)
POST   /api/products                    Create product (admin auth)
PUT    /api/products/:id                Update product (admin auth)
PATCH  /api/products/:id/stock          Quick stock / out-of-stock toggle (admin auth)
DELETE /api/products/:id                Soft-remove from store (admin auth); ?hard=true to permanently delete

POST   /api/orders                      Place an order (customer auth required)
GET    /api/orders/track/:orderNumber   Public order tracking, no login needed
GET    /api/orders                      All orders (admin auth, filter by ?status=)
GET    /api/orders/:id                  Single order (admin auth)
PATCH  /api/orders/:id/status           Update order status (admin auth)
GET    /api/orders/:id/invoice          Generate & download PDF invoice (admin auth)
GET    /api/orders/stats/summary        Dashboard numbers (admin auth)

POST   /api/upload                      Upload a product image to Cloudinary (admin auth)
```

---

## Costs at this stage

| Service | Free tier limit | When you'd pay |
|---|---|---|
| Vercel | Generous free tier for personal/small projects | High traffic → Pro plan ~$20/mo |
| Render | Free web service (sleeps when idle) | $7/mo Starter to stay always-on |
| MongoDB Atlas | 512MB free (M0) | ~$9/mo once you outgrow 512MB |
| Cloudinary | 25 credits/mo free (~thousands of images) | Pay-as-you-go after that |
| Domain | N/A | ~$10–15/year |

You can genuinely run this at low/no cost until you have real order volume.
#   g i f t a i m e r s  
 #   g i f t a i m e r s  
 