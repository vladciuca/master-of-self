"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { PracticeCard } from "@components/practices/PracticeCard";
import { PracticeSwitch } from "@components/practices/PracticeSwitch";
import { IconRenderer } from "@components/IconRenderer";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Accordion } from "@components/ui/accordion";
import { useUserProfile } from "@context/UserProfileContext";
import { usePracticeList } from "@hooks/user/usePracticeList";
import { DISCIPLINES, BASE_DISCIPLINE_ID } from "@lib/disciplines";
import { JOURNAL_COLORS } from "@lib/colors";
import { stepIconMap } from "@components/ui/constants";
import { Plus, Trash2 } from "lucide-react";
import type { User } from "@models/types";
import type { Practice } from "@models/mongodb";
import type { JournalCustomStepConfig } from "@models/types";

type PageItem = Practice | JournalCustomStepConfig;

function isOwnPage(page: PageItem, userId?: string): boolean {
  if (!("creatorId" in page) || !page.creatorId || !userId) return false;
  return page.creatorId.toString() === userId;
}

type PageSection = {
  title: string;
  icon?: string;
  pages: PageItem[];
};

function SectionHeader({
  title,
  active,
  total,
  icon,
}: {
  title: string;
  active: number;
  total: number;
  icon?: string;
}) {
  const isMorning = title === "Morning";
  const iconColor =
    active === 0
      ? "text-muted-foreground"
      : isMorning
        ? `text-${JOURNAL_COLORS.day}`
        : `text-${JOURNAL_COLORS.night}`;
  const textColor = active === 0 ? "text-muted-foreground" : "text-primary";

  return (
    <div className="flex items-center justify-between my-4 bg-muted/30 rounded-md p-2 px-3">
      <div className={`font-semibold tracking-tight ${textColor}`}>
        {title}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-semibold tracking-tight flex items-center">
          {active}
          <span className="font-thin mx-1 text-muted-foreground">/</span>
          <span className="text-muted-foreground">{total}</span>
          <span className="ml-2">
            {icon && (
              <IconRenderer iconName={icon} size={20} className={iconColor} />
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

function CreatePageCard({ onCreate }: { onCreate: () => void }) {
  return (
    <PracticeCard
      value="create-new-page"
      icon="GiSpellBook"
      title="Create a New Practice"
      color="primary"
      hideIconBorder
      iconSize={70}
      className="mt-2"
      triggerClassName="bg-muted/30 rounded-md pb-2"
      action={
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-8 w-8 mr-3"
          aria-label="Create a new practice"
          onClick={(e) => {
            e.stopPropagation();
            onCreate();
          }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      }
      expandedContent={
        <div className="px-2 mt-2 text-sm text-muted-foreground">
          <p>
            Build a custom practice with your own prompt, discipline, and daily
            or nightly rhythm.
          </p>
        </div>
      }
      showDescription={false}
    />
  );
}

function BaseDisciplineCard({ page }: { page: PageItem }) {
  return (
    <PracticeCard
      step={page}
      title="Commit & Review"
      expandedContent={
        <div className="px-2 mt-2 text-sm text-muted-foreground space-y-3">
          <p>
            Write your commitments each morning, then check them off as you go. In
            the evening, reflect on what you completed and choose what to carry
            forward into tomorrow.
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IconRenderer
                iconName={stepIconMap.day}
                size={16}
                className={`text-${JOURNAL_COLORS.day}`}
              />
              <span>How will I make today great?</span>
            </div>
            <div className="flex items-center gap-2">
              <IconRenderer
                iconName={stepIconMap.night}
                size={16}
                className={`text-${JOURNAL_COLORS.night}`}
              />
              <span>How great was today?</span>
            </div>
          </div>
        </div>
      }
      showDescription={false}
    />
  );
}

function PageCard({
  page,
  isActive,
  onToggle,
  onEdit,
  onDelete,
  userId,
}: {
  page: PageItem;
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  onEdit: (page: PageItem) => void;
  onDelete: (page: PageItem) => void;
  userId?: string;
}) {
  return (
    <PracticeCard
      step={page}
      action={
        <PracticeSwitch
          type={page.type}
          checked={isActive}
          onCheckedChange={onToggle}
          disabled={false}
        />
      }
      footer={
        isOwnPage(page, userId) ? (
          <div className="px-2 mt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(page)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(page)}
              aria-label="Delete practice"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : undefined
      }
    />
  );
}

function PagesOverviewSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((section) => (
        <div key={section}>
          <div className="flex items-center justify-between my-4 bg-muted/30 rounded-md p-2 px-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-10" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 mb-3">
              <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-6 w-10 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

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

  const { baseDiscipline, daySection, nightSection, sections } = useMemo(() => {
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

    const day = otherPages
      .filter((page) => page.type === "dayEntry")
      .sort((a, b) => {
        const aActive = activePracticeIds.includes(String(a._id));
        const bActive = activePracticeIds.includes(String(b._id));
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return a.discipline.localeCompare(b.discipline);
      });

    const night = otherPages
      .filter((page) => page.type === "nightEntry")
      .sort((a, b) => {
        const aActive = activePracticeIds.includes(String(a._id));
        const bActive = activePracticeIds.includes(String(b._id));
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return a.discipline.localeCompare(b.discipline);
      });

    const daySection: PageSection = {
      title: "Morning",
      icon: stepIconMap.day,
      pages: day,
    };

    const nightSection: PageSection = {
      title: "Evening",
      icon: stepIconMap.night,
      pages: night,
    };

    const sections: PageSection[] = [];
    if (day.length > 0) sections.push(daySection);
    if (night.length > 0) sections.push(nightSection);

    return { baseDiscipline: base, daySection, nightSection, sections };
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
