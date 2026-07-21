"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Accordion } from "@components/ui/accordion";
import { useUserProfile } from "@context/UserProfileContext";
import { usePracticeList } from "@hooks/user/usePracticeList";
import { DISCIPLINES, BASE_DISCIPLINE_ID } from "@lib/disciplines";
import { stepIconMap } from "@components/ui/constants";
import { SectionHeader } from "./practice-overview/SectionHeader";
import { CreatePageCard } from "./practice-overview/CreatePageCard";
import { BaseDisciplineCard } from "./practice-overview/BaseDisciplineCard";
import { PageCard } from "./practice-overview/PageCard";
import { PagesOverviewSkeleton } from "./practice-overview/PagesOverviewSkeleton";
import type { PageItem, PageSection } from "./practice-overview/types";
import type { User } from "@models/types";

export function PracticeOverview() {
  const { user } = useUser() as { user: User | null };
  const router = useRouter();
  const { userProfile, userProfileLoading, updateActivePractice, deletePracticeFromProfile } =
    useUserProfile();
  const {
    learnedPracticeList,
    practicesConfigsLoading,
    practicesConfigsError,
  } = usePracticeList();

  const activePracticeIds = userProfile?.activePractices ?? [];

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

    const byActiveThenDiscipline = (a: PageItem, b: PageItem) => {
      const aActive = activePracticeIds.includes(String(a._id));
      const bActive = activePracticeIds.includes(String(b._id));
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return a.discipline.localeCompare(b.discipline);
    };

    const day = otherPages
      .filter((page) => page.type === "dayEntry")
      .sort(byActiveThenDiscipline);

    const night = otherPages
      .filter((page) => page.type === "nightEntry")
      .sort(byActiveThenDiscipline);

    const sections: PageSection[] = [];
    if (day.length > 0)
      sections.push({ title: "Morning", icon: stepIconMap.day, pages: day });
    if (night.length > 0)
      sections.push({ title: "Evening", icon: stepIconMap.night, pages: night });

    return { baseDiscipline: base, sections };
  }, [learnedPracticeList, activePracticeIds]);

  const sectionActiveCount = (pages: PageItem[]) =>
    pages.filter((page) => activePracticeIds.includes(String(page._id))).length;

  const handleCreatePage = () => {
    router.push("/create-practice");
  };

  const handleToggle = (pageId: string) => (checked: boolean) => {
    updateActivePractice(pageId, checked);
  };

  const handleEdit = (page: PageItem) => {
    router.push(`/update-practice/${String(page._id)}`);
  };

  const handleDelete = async (page: PageItem) => {
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

  return (
    <Accordion type="single" collapsible className="space-y-4">
      <CreatePageCard onCreate={handleCreatePage} />

      {baseDiscipline && (
        <BaseDisciplineCard page={baseDiscipline} />
      )}

      {sections.map((section) => (
        <div key={section.title} className="mt-4">
          <SectionHeader
            title={section.title}
            active={sectionActiveCount(section.pages)}
            total={section.pages.length}
            icon={section.icon}
          />
          <div className="space-y-4">
            {section.pages.map((page) => {
              const pageId = String(page._id);
              const isActive = activePracticeIds.includes(pageId);

              return (
                <PageCard
                  key={pageId}
                  page={page}
                  isActive={isActive}
                  onToggle={handleToggle(pageId)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  userId={user?.id}
                />
              );
            })}
          </div>
        </div>
      ))}
    </Accordion>
  );
}
