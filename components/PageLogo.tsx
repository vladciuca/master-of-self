import {
  GiAllSeeingEye,
  // GiAura,
  // GiSuspicious,
  // GiMeditation,
  // GiLotus,
  // GiMonkFace,
  // GiThreeLeaves,
  // GiYinYang,
  // GiThirdEye,
  // GiEvilBook,
  // GiMagicGate,
  // GiCrystalBall,
  // GiMagicSwirl,
  // GiEyeOfHorus,
  // GiLouvrePyramid,
} from "react-icons/gi";

export function PageLogo() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <GiAllSeeingEye size={"20rem"} />
      {/* <p className="">Alpha v0.1</p> */}
    </div>
  );
}

// import Image from "next/image";

// export function PageLogo() {
//   return (
//     <div className="h-full flex items-center justify-center">
//       <Image src="/logo.svg" alt="Logo" width={320} height={320} />
//     </div>
//   );
// }
