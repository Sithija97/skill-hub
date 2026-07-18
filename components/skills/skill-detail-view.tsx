import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { rehypeHighlightConfigured } from "@/lib/rehype-highlight";
import { rehypeMermaid } from "@/lib/rehype-mermaid";
import { markdownComponents } from "@/components/shared/markdown-components";
import Link from "next/link";
import { GitFork } from "lucide-react";
import type { SkillWithRelations } from "@/types/skill";
import { TARGET_TOOLS } from "@/config/tools";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TargetToolBadge } from "./target-tool-badge";
import { PublicPrivateBadge } from "./public-private-badge";
import { SkillContentActions } from "./skill-content-actions";
import { SkillExportCard } from "./skill-export-card";
import { formatSkillForExport } from "@/lib/services/export.service";

const remarkPlugins = [remarkGfm];
// rehypeMermaid must run before the highlighter so it sees the pristine
// code text, not tokens the highlighter has already split it into.
const rehypePlugins = [rehypeMermaid, rehypeHighlightConfigured];

interface SkillDetailViewProps {
  skill: SkillWithRelations;
  sidebar: React.ReactNode;
  breadcrumb: React.ReactNode;
  forkedFrom?: { title: string; authorUsername: string } | null;
}

export function SkillDetailView({
  skill,
  sidebar,
  breadcrumb,
  forkedFrom,
}: SkillDetailViewProps) {
  const toolConfig = TARGET_TOOLS[skill.targetTool];
  const exportData = formatSkillForExport(skill);

  const createdDate = new Date(skill.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {breadcrumb}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Header */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="m-0 text-xl font-semibold text-foreground">
                {skill.title}
              </h1>
              <TargetToolBadge tool={skill.targetTool} size="md" />
              <PublicPrivateBadge isPublic={skill.isPublic} />
            </div>

            {/* Author row */}
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-5.5 w-5.5 text-xs">
                <AvatarFallback>
                  {skill.author.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Link
                href={`/${skill.author.username}`}
                className="font-semibold text-foreground no-underline hover:underline"
              >
                {skill.author.username}
              </Link>
              <span className="text-muted-foreground/60">·</span>
              <span>v{skill.version}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>{createdDate}</span>
            </div>

            {/* Fork attribution */}
            {skill.forkedFromId && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitFork size={13} />
                {forkedFrom ? (
                  <span>
                    Forked from{" "}
                    <Link
                      href={`/${forkedFrom.authorUsername}/${skill.forkedFromId}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {forkedFrom.title}
                    </Link>{" "}
                    by{" "}
                    <Link
                      href={`/${forkedFrom.authorUsername}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {forkedFrom.authorUsername}
                    </Link>
                  </span>
                ) : (
                  <span>Forked from another skill</span>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skill.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="px-1.5 py-0 text-xs font-normal"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="m-0 text-sm italic leading-relaxed text-muted-foreground">
            {skill.description}
          </p>

          {/* Content panel */}
          <Card className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between border-b bg-muted/50">
              <CardTitle className="text-sm">Skill content</CardTitle>
              <SkillContentActions
                content={skill.content}
                exportContent={exportData.content}
                exportFilename={exportData.filename}
                exportMimeType={exportData.mimeType}
              />
            </CardHeader>
            <CardContent className="p-5">
              <div className="prose">
                <ReactMarkdown
                  remarkPlugins={remarkPlugins}
                  rehypePlugins={rehypePlugins}
                  components={markdownComponents}
                >
                  {skill.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="sticky top-19 flex flex-col gap-4">
          {sidebar}

          {/* Stats card */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">
                STATS
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {[
                { label: "Likes", value: skill.likesCount },
                { label: "Saves", value: skill.savesCount },
                { label: "Forks", value: skill.forksCount },
                { label: "Version", value: `v${skill.version}` },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-foreground">
                    {stat.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Export card */}
          <SkillExportCard
            toolLabel={toolConfig.label}
            exportPath={toolConfig.exportPath}
            exportContent={exportData.content}
            exportFilename={exportData.filename}
            exportMimeType={exportData.mimeType}
          />
        </div>
      </div>
    </div>
  );
}
