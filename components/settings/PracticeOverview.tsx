"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { IconRenderer } from "@components/IconRenderer";
import { DisciplineSwitch } from "@components/disciplines/discipline-card/DisciplineSwitch";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { useUserProfile } from "@context/UserProfileContext";
import { useDisciplineList } from "@hooks/user/useDisciplineList";
import { DISCIPLINES } from "@lib/disciplines";
import { stepIconMap } from "@components/ui/constants";
import { TbChevronCompactDown } from "react-icons/tb";
import { Plus } from "lucide-react";
import type { User } from "@models/types";
import type { Discipline } from "@models/mongodb";
import type { JournalCustomStepConfig } from "@models/types";

const BASE_DISCIPLINE_ID = "discipline";

type PageItem = Discipline | JournalCustomStepConfig;

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
  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-2">
        {icon && <IconRenderer iconName={icon} size={18} className="text-primary" />}
        <h3 className="font-semibold text-primary">{title}</h3>
      </div>
      <div className="text-sm font-medium text-muted-foreground">
        {active} / {total}
      </div>
    </div>
  );
}

function CreatePageCard({ onCreate }: { onCreate: () => void }) {
  const CREATE_PAGE_ID = "create-new-page";

  return (
    <AccordionItem
      value={CREATE_PAGE_ID}
      className="border-none px-0 py-0 mb-3 bg-transparent"
    >
      <AccordionTrigger className="flex items-center gap-3 py-0 hover:no-underline [&[data-state=open]_.chevron]:rotate-180">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 border-2 rounded-xl p-2.5 border-primary">
            <IconRenderer
              iconName="FaCircleQuestion"
              className="text-primary"
              size={28}
            />
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="font-medium leading-snug">Create a New Page</div>
            <div className="flex justify-center mt-1">
              <TbChevronCompactDown className="chevron h-4 w-6 transition-transform duration-200 ease-in-out" />
            </div>
          </div>
        </div>

        <div
          className="flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onCreate();
          }}
        >
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            aria-label="Create a new page"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-0 pt-0">
        <div className="pl-[3.75rem] text-sm text-muted-foreground">
          <p>
            Build a custom page with your own prompt, discipline, and daily or
            nightly rhythm.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function PageCard({
  page,
  isActive,
  isBaseDiscipline,
  onToggle,
  onEdit,
  userId,
}: {
  page: PageItem;
  isActive: boolean;
  isBaseDiscipline: boolean;
  onToggle: (checked: boolean) => void;
  onEdit: (page: PageItem) => void;
  userId?: string;
}) {
  const pageId = String(page._id);
  const typeIcon =
    page.type === "dayEntry" ? stepIconMap.day : stepIconMap.night;
  const color = page.color ?? "primary";

  return (
    <AccordionItem
      value={pageId}
      className="border-none px-0 py-0 mb-3 bg-transparent"
    >
      <AccordionTrigger className="flex items-center gap-3 py-0 hover:no-underline [&[data-state=open]_.chevron]:rotate-180">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`flex-shrink-0 border-2 rounded-xl p-2.5 border-${color}`}
          >
            <IconRenderer
              iconName={page.icon}
              className={`text-${color}`}
              size={28}
            />
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground capitalize">
              <IconRenderer
                iconName={typeIcon}
                className="text-primary"
                size={14}
              />
              <span>{page.discipline}</span>
            </div>
            <div className="font-medium leading-snug">{page.title}</div>
            <div className="flex justify-center mt-1">
              <TbChevronCompactDown className="chevron h-4 w-6 transition-transform duration-200 ease-in-out" />
            </div>
          </div>
        </div>

        {!isBaseDiscipline && (
          <div
            className="flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DisciplineSwitch
              type={page.type}
              checked={isActive}
              onCheckedChange={onToggle}
              disabled={false}
            />
          </div>
        )}
      </AccordionTrigger>

      <AccordionContent className="pb-0 pt-0">
        <div className="pl-[3.75rem] text-sm text-muted-foreground">
          <p>{page.description}</p>
          {isOwnPage(page, userId) && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onEdit(page)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function PagesOverviewSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((section) => (
        <div key={section}>
          <div className="flex items-center justify-between py-3 px-1">
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
  const { userProfile, userProfileLoading, updateActiveDiscipline } =
    useUserProfile();
  const {
    learnedDisciplineList,
    disciplinesConfigsLoading,
    disciplinesConfigsError,
  } = useDisciplineList();

  const activeDisciplineIds = userProfile?.activeDisciplines ?? [];

  const { baseDiscipline, daySection, nightSection, sections } = useMemo(() => {
    const base =
      DISCIPLINES.find(
        (config) => String(config._id) === BASE_DISCIPLINE_ID
      ) ||
      learnedDisciplineList.find(
        (page) => String(page._id) === BASE_DISCIPLINE_ID
      );

    const otherPages = learnedDisciplineList.filter(
      (page) => String(page._id) !== BASE_DISCIPLINE_ID
    );

    const day = otherPages
      .filter((page) => page.type === "dayEntry")
      .sort((a, b) => {
        const aActive = activeDisciplineIds.includes(String(a._id));
        const bActive = activeDisciplineIds.includes(String(b._id));
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return a.discipline.localeCompare(b.discipline);
      });

    const night = otherPages
      .filter((page) => page.type === "nightEntry")
      .sort((a, b) => {
        const aActive = activeDisciplineIds.includes(String(a._id));
        const bActive = activeDisciplineIds.includes(String(b._id));
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return a.discipline.localeCompare(b.discipline);
      });

    const daySection: PageSection = {
      title: "Day",
      icon: stepIconMap.day,
      pages: day,
    };

    const nightSection: PageSection = {
      title: "Night",
      icon: stepIconMap.night,
      pages: night,
    };

    const sections: PageSection[] = [];
    if (day.length > 0) sections.push(daySection);
    if (night.length > 0) sections.push(nightSection);

    return { baseDiscipline: base, daySection, nightSection, sections };
  }, [learnedDisciplineList, activeDisciplineIds]);

  const sectionActiveCount = (pages: PageItem[]) =>
    pages.filter((page) => activeDisciplineIds.includes(String(page._id))).length;

  const handleCreatePage = () => {
    router.push("/create-discipline");
  };

  const handleToggle = (pageId: string) => (checked: boolean) => {
    updateActiveDiscipline(pageId, checked);
  };

  const handleEdit = (page: PageItem) => {
    router.push(`/update-discipline/${String(page._id)}`);
  };

  if (disciplinesConfigsLoading || userProfileLoading) {
    return <PagesOverviewSkeleton />;
  }

  if (disciplinesConfigsError) {
    return (
      <div className="py-4 text-red-500">
        Error loading pages: {disciplinesConfigsError}
      </div>
    );
  }

  if (!baseDiscipline && sections.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        You don&apos;t have any pages in your book yet.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-1">
      <CreatePageCard onCreate={handleCreatePage} />

      {baseDiscipline && (
        <PageCard
          page={baseDiscipline}
          isActive={true}
          isBaseDiscipline={true}
          onToggle={() => {}}
          onEdit={handleEdit}
          userId={user?.id}
        />
      )}

      {sections.map((section) => (
        <div key={section.title} className="mt-4">
          <SectionHeader
            title={section.title}
            active={sectionActiveCount(section.pages)}
            total={section.pages.length}
            icon={section.icon}
          />
          <div className="space-y-1">
            {section.pages.map((page) => {
              const pageId = String(page._id);
              const isActive = activeDisciplineIds.includes(pageId);

              return (
                <PageCard
                  key={pageId}
                  page={page}
                  isActive={isActive}
                  isBaseDiscipline={false}
                  onToggle={handleToggle(pageId)}
                  onEdit={handleEdit}
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
