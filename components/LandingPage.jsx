"use client";

import { useSession } from "next-auth/react";
import {
  GiAllSeeingEye,
  // GiAura,
  // GiBurningPassion,
  // GiGreatPyramid,
  // GiGuardedTower,
  // GiHealing,
  // GiIciclesAura,
  // GiInnerSelf,
  // GiInternalInjury,
  // GiJourney,
  // GiPlayerTime,
  // GiPerson,
  // GiAnatomy,
  // GiBackup,
  // GiTwoShadows,
  // GiSpikedHalo,
  // GiRearAura,
  // GiAngelWings,
  // GiAbstract049,
  // GiAbstract047,
  // GiAbstract082,
  // GiArtificialHive,
  // GiAtlas,
  // GiAtomCore,
} from "react-icons/gi";
// import { MdOutlineSelfImprovement } from "react-icons/md";

const LandingPage = ({ children }) => {
  const { data: session } = useSession();

  return (
    <section className="h-full w-full">
      {session?.user ? (
        <main>{children}</main>
      ) : (
        <div className="h-full flex items-center justify-center">
          <GiAllSeeingEye size={"20rem"} />
        </div>
      )}
    </section>
  );
};

export default LandingPage;
