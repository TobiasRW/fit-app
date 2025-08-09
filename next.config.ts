import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

export default withPWA({
  // Your Next.js config options go here
  // For example:
  // experimental: { ... },
  // images: { ... },
});
