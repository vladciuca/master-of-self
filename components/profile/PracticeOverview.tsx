"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Reorder } from "framer-motion";
import { Accordion } from "@components/ui/accordion";
import { useUserProfile } from "@context/UserProfileContext";
import { usePracticeList } from "@hooks/user/usePracticeList";
import { DISCIPLINES, BASE_DISCIPLINE_ID } from "@lib/disciplines";
import { stepIconMap } from "@components/ui/constants";
import { SectionHeader } from "./practice-overview/SectionHeader";
import { CreatePracticeCard } from "./practice-overview/CreatePracticeCard";
import { BaseDisciplineCard } from "./practice-overview/BaseDisciplineCard";
import { PageCard } from "./practice-overview/PageCard";
import { PagesOverviewSkeleton } from "./practice-overview/PagesOverviewSkeleton";
import type { PracticePageItem, PracticePageSection } from "@models/types";
import type { User } from "@models/types";

function mergeSectionOrder(
  fullOrder: string[],
  sectionIds: string[]
): string[] {
  const sectionSet = new Set(sectionIds);
  let index = 0;
  return fullOrder.map((id) => (sectionSet.has(id) ? sectionIds[index++] : id));
}

export function PracticeOverview({
  showCreateCard = true,
}: {
  showCreateCard?: boolean;
}) {
  const { user } = useUser() as { user: User | null };
  const router = useRouter();
  const {
    userProfile,
    userProfileLoading,
    updateActivePractice,
    updatePracticeOrder,
    deletePracticeFromProfile,
  } = useUserProfile();
  const {
    learnedPracticeList,
    practicesConfigsLoading,
    practicesConfigsError,
  } = usePracticeList();

  const activePracticeIds = userProfile?.activePractices ?? [];
  const practiceOrder = userProfile?.practiceOrder ?? [];

  const [reorderingSection, setReorderingSection] = useState<string | null>(
    null
  );
  const [draftOrder, setDraftOrder] = useState<string[]>([]);

  const { baseDiscipline, sections } = useMemo(() => {
    const base =
      DISCIPLINES.find(
        (config) => String(config._id) === BASE_DISCIPLINE_ID
      ) ||
      learnedPracticeList.find(
        (page) => String(page._id) === BASE_DISCIPLINE_ID
      );

    const otherPages = learnedPracticeList.filter(
      (page) => String(page._id) !== BASE_DISCIPLINE_ID
    );

    const day = otherPages.filter((page) => page.type === "dayEntry");
    const night = otherPages.filter((page) => page.type === "nightEntry");

    const sections: PracticePageSection[] = [];
    if (day.length > 0)
      sections.push({ title: "Morning", icon: stepIconMap.day, pages: day });
    if (night.length > 0)
      sections.push({ title: "Evening", icon: stepIconMap.night, pages: night });

    return { baseDiscipline: base, sections };
  }, [learnedPracticeList]);

  const sectionActiveCount = (pages: PracticePageItem[]) =>
    pages.filter((page) => activePracticeIds.includes(String(page._id))).length;

  const buildFullOrder = () => {
    const allIds = learnedPracticeList.map((page) => String(page._id));
    const missing = allIds.filter((id) => !practiceOrder.includes(id));
    return [...practiceOrder, ...missing];
  };

  const handleToggleReorder = (sectionTitle: string) => {
    if (reorderingSection === sectionTitle) {
      setReorderingSection(null);
      setDraftOrder([]);
    } else {
      setDraftOrder(buildFullOrder());
      setReorderingSection(sectionTitle);
    }
  };

  const handleSectionReorder = (sectionIds: string[]) => {
    setDraftOrder((prev) => mergeSectionOrder(prev, sectionIds));
  };

  const handleDragEnd = () => {
    updatePracticeOrder(draftOrder);
  };

  const handleMoveCard = (
    sectionIds: string[],
    pageId: string,
    direction: "up" | "down"
  ) => {
    const index = sectionIds.indexOf(pageId);
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (index === -1 || targetIndex < 0 || targetIndex >= sectionIds.length) {
      return;
    }

    const nextSectionIds = [...sectionIds];
    [nextSectionIds[index], nextSectionIds[targetIndex]] = [
      nextSectionIds[targetIndex],
      nextSectionIds[index],
    ];

    const mergedOrder = mergeSectionOrder(draftOrder, nextSectionIds);
    setDraftOrder(mergedOrder);
    updatePracticeOrder(mergedOrder);
  };

  const handleCreatePage = () => {
    router.push("/create-practice");
  };

  const handleToggle = (pageId: string) => (checked: boolean) => {
    updateActivePractice(pageId, checked);
  };

  const handleEdit = (page: PracticePageItem) => {
    router.push(`/update-practice/${String(page._id)}`);
  };

  const handleDelete = async (page: PracticePageItem) => {
    const pageId = String(page._id);
    if (
      !confirm(
        `Are you sure you want to delete "${page.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deletePracticeFromProfile(pageId);
    } catch (error) {
      console.error("Error deleting practice:", error);
    }
  };

  if (practicesConfigsLoading || userProfileLoading) {
    return <PagesOverviewSkeleton />;
  }

  if (practicesConfigsError) {
    return (
      <div className="py-4 text-red-500">
        Error loading practices: {practicesConfigsError}
      </div>
    );
  }

  if (!baseDiscipline && sections.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        You don&apos;t have any practices in your book yet.
      </div>
    );
  }

  const renderPageCard = (
    page: PracticePageItem,
    reorderMode: boolean,
    sectionIds?: string[]
  ) => {
    const pageId = String(page._id);
    const isActive = activePracticeIds.includes(pageId);
    const cardIndex = sectionIds ? sectionIds.indexOf(pageId) : -1;

    return (
      <PageCard
        key={pageId}
        page={page}
        isActive={isActive}
        onToggle={handleToggle(pageId)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        userId={user?.id}
        reorderMode={reorderMode}
        onMoveUp={
          sectionIds
            ? () => handleMoveCard(sectionIds, pageId, "up")
            : undefined
        }
        onMoveDown={
          sectionIds
            ? () => handleMoveCard(sectionIds, pageId, "down")
            : undefined
        }
        disableMoveUp={cardIndex <= 0}
        disableMoveDown={
          sectionIds ? cardIndex === sectionIds.length - 1 : false
        }
      />
    );
  };

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {showCreateCard && <CreatePracticeCard onCreate={handleCreatePage} />}

      {baseDiscipline && (
        <BaseDisciplineCard page={baseDiscipline} />
      )}

      {sections.map((section) => {
        const isReordering = reorderingSection === section.title;
        const sectionIds = section.pages.map((page) => String(page._id));

        return (
          <div key={section.title} className="mt-4">
            <SectionHeader
              title={section.title}
              active={sectionActiveCount(section.pages)}
              total={section.pages.length}
              icon={section.icon}
              reordering={isReordering}
              onToggleReorder={() => handleToggleReorder(section.title)}
            />
            {isReordering ? (
              <Reorder.Group
                axis="y"
                values={sectionIds}
                onReorder={handleSectionReorder}
                className="space-y-4"
              >
                {section.pages.map((page) => (
                  <Reorder.Item
                    key={String(page._id)}
                    value={String(page._id)}
                    onDragEnd={handleDragEnd}
                  >
                    {renderPageCard(page, true, sectionIds)}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="space-y-4">
                {section.pages.map((page) => renderPageCard(page, false))}
              </div>
            )}
          </div>
        );
      })}
    </Accordion>
  );
}
