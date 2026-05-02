"use server"
import { signIn } from "@/auth";

export async function handleOAuth(provider: "google" | "github") {
    await signIn(provider);
}