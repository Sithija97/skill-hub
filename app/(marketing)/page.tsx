import Link from "next/link";
import {
  IconGitFork,
  IconVersions,
  IconSearch,
  IconDownload,
  IconWorld,
  IconBolt,
  IconHeart,
  IconBookmark,
  IconArrowRight,
} from "@tabler/icons-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TARGET_TOOLS } from "@/config/tools";
import { TargetTool } from "@/types/skill";
import { cn } from "@/lib/utils";
import { TargetToolBadge } from "@/components/skills/target-tool-badge";

const FEATURES = [
  {
    icon: IconGitFork,
    title: "Fork & remix",
    description:
      "Find a skill you like, fork it, and tailor it to your workflow. Every fork links back to the original.",
  },
  {
    icon: IconVersions,
    title: "Version history",
    description:
      "Every edit creates a new version. Roll back anytime. See exactly what changed and when.",
  },
  {
    icon: IconDownload,
    title: "One-click export",
    description:
      "Export directly to your tool — .mdc for Cursor, CLAUDE.md for Claude, .windsurfrules for Windsurf.",
  },
  {
    icon: IconSearch,
    title: "Discover & explore",
    description:
      "Browse skills by tool, tag, or popularity. Find exactly what you need in seconds.",
  },
  {
    icon: IconWorld,
    title: "Public or private",
    description:
      "Share skills with the community or keep them private. You control the visibility.",
  },
  {
    icon: IconBolt,
    title: "Built for speed",
    description:
      "Server-rendered, edge-cached, optimistic updates. Everything loads instantly.",
  },
];

const TOOLS = Object.values(TARGET_TOOLS).filter((t) => t.label !== "Other");

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-muted)_0%,transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-8 pt-28 text-center sm:pt-36">
          <h1 className="mx-auto mb-6 max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            The home for AI
            <span className="block bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              coding skills
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Create, version, fork, and share prompts for your favorite AI coding
            tools. Like GitHub, but for the instructions that make AI work for
            you.
          </p>

          <div className="mb-20 flex items-center gap-3">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 px-6 text-sm",
              )}
            >
              Get started
              <IconArrowRight size={16} />
            </Link>
            <Link
              href="/explore"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-6 text-sm",
              )}
            >
              Explore skills
            </Link>
          </div>

          {/* Product showcase */}
          <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/5 dark:shadow-black/30">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="ml-4 flex-1 rounded-md bg-background/80 px-3 py-1 text-center text-xs text-muted-foreground">
                skillhub.dev/explore
              </div>
            </div>

            {/* Mock skill cards */}
            <div className="grid grid-cols-3 gap-3 p-4">
              <MockSkillCard
                title="Git Commit Message Writer"
                tool={TargetTool.CLAUDE}
                description="Generates clear, conventional commit messages from diffs."
                tags={["Git", "Documentation"]}
                likes={148}
                forks={25}
              />
              <MockSkillCard
                title="React Component Architect"
                tool={TargetTool.CURSOR}
                description="Designs scalable React components with proper patterns."
                tags={["React", "Architecture"]}
                likes={112}
                forks={18}
              />
              <MockSkillCard
                title="Python Code Reviewer"
                tool={TargetTool.COPILOT}
                description="Reviews Python code for bugs, style, and performance."
                tags={["Python", "Code Review"]}
                likes={127}
                forks={31}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools strip */}
      <section className="py-10">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-6 text-center text-xs font-medium tracking-widest text-muted-foreground">
            EXPORT TO YOUR FAVORITE TOOLS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {TOOLS.map((tool) => (
              <span
                key={tool.label}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tool.brandText }}
                />
                {tool.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Everything you need to manage AI skills
        </h2>
        <p className="mx-auto mb-14 max-w-lg text-center text-sm text-muted-foreground">
          The workflows developers already know — fork, version, share — applied
          to AI prompts and instructions.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/60 transition-colors hover:border-border"
            >
              <CardContent className="flex flex-col gap-3 py-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/50">
                  <feature.icon size={18} className="text-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-lg px-6 text-center">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Start building your skill library
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            Join developers who are sharing and discovering the best AI coding
            prompts. Free to get started.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ size: "lg" }), "gap-2 px-8")}
            >
              Create your first skill
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="currentColor"
                className="text-muted-foreground/40"
              />
              <path
                d="M21 8L12 19.5H17.5L15 28L24 16H18.5L21 8Z"
                fill="currentColor"
                className="text-background"
              />
            </svg>
            <span>&copy; {new Date().getFullYear()} SkillHub</span>
          </div>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <Link
              href="/explore"
              className="no-underline transition-colors hover:text-foreground"
            >
              Explore
            </Link>
            <Link
              href="/sign-in"
              className="no-underline transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="no-underline transition-colors hover:text-foreground"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MockSkillCard({
  title,
  tool,
  description,
  tags,
  likes,
  forks,
}: {
  title: string;
  tool: TargetTool;
  description: string;
  tags: string[];
  likes: number;
  forks: number;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3 transition-colors hover:border-border/80">
      <div className="flex items-start justify-between gap-1">
        <span className="flex-1 text-xs font-semibold leading-snug text-foreground">
          {title}
        </span>
        <TargetToolBadge tool={tool} />
      </div>
      <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="px-1.5 py-0 text-[10px] font-normal"
          >
            {tag}
          </Badge>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-3 border-t border-border pt-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <IconHeart size={11} />
          {likes}
        </span>
        <span className="inline-flex items-center gap-1">
          <IconGitFork size={11} />
          {forks}
        </span>
        <span className="ml-auto inline-flex items-center gap-1">
          <IconBookmark size={11} />
        </span>
      </div>
    </div>
  );
}
