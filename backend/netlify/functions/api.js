const serverless = require("serverless-http");
const app = require("../../app");

const handle = serverless(app, { binary: ["application/pdf"] });

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Netlify supplies a verified client IP; use it for per-instance rate limits.
  const clientIp = event.headers && event.headers["x-nf-client-connection-ip"];
  if (clientIp) {
    event.requestContext = {
      ...event.requestContext,
      identity: { ...event.requestContext?.identity, sourceIp: clientIp },
    };
  }
  const path = event.path.replace(/^\/\.netlify\/functions\/api(?=\/|$)/, "/api");
  const headers = { ...event.headers };
  // The verified IP above is used instead of trusting a forwarded header chain.
  delete headers["x-forwarded-for"];
  return handle({ ...event, path, headers }, context);
};
