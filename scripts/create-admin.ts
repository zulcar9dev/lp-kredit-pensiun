import { createClient } from "@insforge/sdk";

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

const email = process.env.ADMIN_EMAIL || "admin@kreditpensiun.com";
const name = process.env.ADMIN_NAME || "Admin";
const rawPassword = process.env.ADMIN_PASSWORD;

if (!rawPassword) {
  console.error(
    "ADMIN_PASSWORD env var is required. Example:\n" +
      'ADMIN_PASSWORD="your-secret-password" npx tsx scripts/create-admin.ts'
  );
  process.exit(1);
}

const password = rawPassword as string;

async function createAdmin() {
  const { data, error } = await insforge.auth.signUp({
    email,
    password,
    name,
  });

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Admin created successfully:", data?.user?.email ?? email);
  }
}

createAdmin();
