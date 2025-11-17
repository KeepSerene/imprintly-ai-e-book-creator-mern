import { BookOpen, Download, Lightbulb, Library } from "lucide-react";

export const FEATURES = [
  {
    title: "AI Writing Assistant",
    description:
      "Generate ideas, outlines, and chapter drafts with smart AI support.",
    icon: Lightbulb,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "Live Reader Preview",
    description:
      "View your book in a distraction-free reader mode with adjustable fonts.",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    title: "Instant Export",
    description:
      "Download your book in DOCX or PDF with a single click—no setup required.",
    icon: Download,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Project Dashboard",
    description:
      "Manage drafts, track progress, and organize all your books in one place.",
    icon: Library,
    gradient: "from-pink-500 to-rose-600",
  },
];

export const TESTIMONIALS = [
  {
    username: "Aarav Sharma",
    title: "Aspiring Novelist",
    quote:
      "I never imagined writing a book could feel this accessible. This tool keeps me motivated.",
    avatarSrc: "/images/aarav-sharma.jpg",
    rating: 5,
  },
  {
    username: "Sarah Lee",
    title: "Self-published Author",
    quote:
      "I've published two eBooks in half the time it usually takes me. The AI assist is a game changer.",
    avatarSrc: "/images/sarah-lee.jpg",
    rating: 5,
  },
  {
    username: "Andrew Smith",
    title: "Content Strategist",
    quote:
      "The export feature and reader preview make editing feel effortless. It's now part of my workflow.",
    avatarSrc: "/images/andrew-smith.jpg",
    rating: 5,
  },
];
