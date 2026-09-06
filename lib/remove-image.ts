import { getInsforgeAdmin } from "@/lib/insforge";

export async function removeStoredImage(key: string | null | undefined) {
  if (!key) return;
  try {
    const { error } = await getInsforgeAdmin().storage.from("images").remove(key);
    if (error) console.error("removeStoredImage error:", error);
  } catch (err) {
    console.error("removeStoredImage failed:", err);
  }
}
