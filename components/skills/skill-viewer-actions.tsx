"use client";

import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, GitFork, FolderPlus } from "lucide-react";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { ShareButton } from "@/components/skills/share-button";
import { buildSkillShareUrl } from "@/lib/share";

interface SkillViewerActionsProps {
  skillId: string;
  initialLiked: boolean;
  initialSaved: boolean;
  initialCounts: { likes: number; saves: number; forks: number };
  isPublic: boolean;
  title: string;
  authorUsername: string;
}

export const SkillViewerActions = memo(function SkillViewerActions({
  skillId,
  initialLiked,
  initialSaved,
  initialCounts,
  isPublic,
  title,
  authorUsername,
}: SkillViewerActionsProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likeCount, setLikeCount] = useState(initialCounts.likes);
  const [saveCount, setSaveCount] = useState(initialCounts.saves);
  const [forksCount, setForksCount] = useState(initialCounts.forks);
  const [isPending, setIsPending] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);

  const handleToggleLike = useCallback(async () => {
    if (isPending) return;
    setIsPending(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      const res = await fetch(`/api/skills/${skillId}/like`, {
        method: wasLiked ? "DELETE" : "POST",
      });
      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }
      if (!res.ok) throw new Error();
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
      toast.error("Could not update like. Please try again.");
    } finally {
      setIsPending(false);
    }
  }, [skillId, liked, isPending, router]);

  const handleToggleSave = useCallback(async () => {
    if (isPending) return;
    setIsPending(true);
    const wasSaved = saved;
    setSaved(!wasSaved);
    setSaveCount((c) => (wasSaved ? c - 1 : c + 1));
    try {
      const res = await fetch(`/api/skills/${skillId}/save`, {
        method: wasSaved ? "DELETE" : "POST",
      });
      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }
      if (!res.ok) throw new Error();
    } catch {
      setSaved(wasSaved);
      setSaveCount((c) => (wasSaved ? c + 1 : c - 1));
      toast.error("Could not update save. Please try again.");
    } finally {
      setIsPending(false);
    }
  }, [skillId, saved, isPending, router]);

  const handleFork = useCallback(async () => {
    if (isPending) return;
    setIsPending(true);
    setForksCount((c) => c + 1);
    try {
      const res = await fetch(`/api/skills/${skillId}/fork`, {
        method: "POST",
      });
      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }
      if (!res.ok) throw new Error();
      const forkedSkill = await res.json();
      toast.success("Skill forked successfully");
      router.push(`/skills/${forkedSkill.id}/edit`);
    } catch {
      setForksCount((c) => c - 1);
      toast.error("Could not fork this skill. Please try again.");
    } finally {
      setIsPending(false);
    }
  }, [skillId, isPending, router]);

  return (
    <>
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground">
            ACTIONS
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`justify-start gap-2 ${liked ? "text-red-500" : ""}`}
            onClick={handleToggleLike}
            disabled={isPending}
          >
            <Heart size={15} {...(liked ? { fill: "currentColor" } : {})} />
            {liked ? "Liked" : "Like"}
            <span className="ml-auto text-xs text-muted-foreground">
              {likeCount}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`justify-start gap-2 ${saved ? "text-ring" : ""}`}
            onClick={handleToggleSave}
            disabled={isPending}
          >
            <Bookmark size={15} {...(saved ? { fill: "currentColor" } : {})} />
            {saved ? "Saved" : "Save"}
            <span className="ml-auto text-xs text-muted-foreground">
              {saveCount}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={handleFork}
            disabled={isPending}
          >
            <GitFork size={15} />
            Fork
            <span className="ml-auto text-xs text-muted-foreground">
              {forksCount}
            </span>
          </Button>
          {isPublic && (
            <ShareButton
              url={buildSkillShareUrl(authorUsername, skillId)}
              title={title}
            />
          )}
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={() => setShowCollectionDialog(true)}
          >
            <FolderPlus size={15} />
            Add to collection
          </Button>
        </CardContent>
      </Card>
      <AddToCollectionDialog
        skillId={skillId}
        open={showCollectionDialog}
        onOpenChange={setShowCollectionDialog}
      />
    </>
  );
});
