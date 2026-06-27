import { redirect } from "next/navigation";

/**
 * MEDULLA AI – Root Page Redirect
 * 
 * This Next.js app serves as a container for the static Medulla AI site.
 * The actual application is in /public/index.html for GitHub Pages compatibility.
 * 
 * For local development with Next.js, this redirects to the static version.
 * For GitHub Pages deployment, use only the /public folder contents.
 */
export default function HomePage() {
  // In production on Next.js, redirect to static site
  // For GitHub Pages, the public folder is deployed directly
  redirect("/index.html");
}
