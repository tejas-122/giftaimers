# Deploy the backend to Netlify

Import the existing Git repository as a new Netlify project. The root netlify.toml sets base directory backend, functions netlify/functions, and publish directory public. No frontend build is needed for this backend project. Keep the storefront on its current host.

Set these environment variables in Netlify with Functions scope (never upload .env):
- MONGO_URI: existing Atlas database connection string
- JWT_SECRET: existing secret, to retain current token validity
- JWT_EXPIRES_IN: existing value
- CLIENT_URL: exact frontend origin, without a trailing slash; comma-separated for multiple origins
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- STORE_NAME, STORE_ADDRESS, STORE_EMAIL, STORE_PHONE
- NODE_ENV: production

Keep existing MongoDB data and Cloudinary assets. Do not run seed scripts. Admin seed credentials are not needed at runtime. Ensure Atlas network access permits the new function environment.

After deployment:
1. Open https://YOUR-SITE.netlify.app/api/health (checks the function, not database readiness).
2. Check /api/products to verify database connectivity.
3. Set VITE_API_URL=https://YOUR-SITE.netlify.app/api on the frontend host and redeploy the frontend.
4. Verify customer/admin login, an order, image upload, and PDF invoice download.
5. Keep Render available until these checks pass. Roll back by restoring the old frontend VITE_API_URL and rebuilding.

Netlify functions can still cold-start. MongoDB connections are reused within warm instances, not shared across instances. The current in-memory rate limiter is per instance, not a global quota. Image uploads are limited to 4 MiB to leave room for multipart/base64 overhead. PDF responses use binary encoding and PDFKit stays external so its font assets are packaged. Large responses and long-running requests remain subject to Netlify function limits.

Local development remains npm run dev from backend. Secrets and real data are not needed for the offline adapter tests.
