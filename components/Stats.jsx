import Link from "next/link";
import { FaHandFist, FaBrain, FaHeart } from "react-icons/fa6";

const Stats = ({ session }) => {
  const { name } = session.user;
  const nameInitials = name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <div className="flex items-center h-full">
      <div className="w-1/4 flex justify-center">
        <Link href="/settings">
          <div className="avatar text-xl font-semibold bg-primary text-primary-foreground rounded-full h-12 w-12 flex justify-center items-center">
            {nameInitials}
          </div>
        </Link>
      </div>
      <div className="flex grow">
        <div className="grid w-full grid-cols-3 px-2">
          <div className="flex items-center">
            <FaBrain className="mr-2 text-pink-400" size={"1.4rem"} />
            <span className="text-3xl uppercase font-bold">0</span>
          </div>
          <div className="flex items-center">
            <FaHandFist className="mr-2 text-yellow-400" size={"1.4rem"} />
            <span className="text-3xl uppercase font-bold">0</span>
          </div>
          <div className="flex items-center">
            <FaHeart className="mr-2 text-red-400" size={"1.4rem"} />
            <span className="text-3xl uppercase font-bold">0</span>
          </div>
          {/* <div className="flex flex-col">
            <div className="flex item-center">
              <FaBrain className="mr-2 text-pink-400" />
              <h4 className="text-xs uppercase text-muted-foreground">Mind</h4>
            </div>
            <span className="mt-1 text-3xl uppercase font-bold">0</span>
          </div>
          <div className="flex flex-col">
            <div className="flex item-center">
              <FaHandFist className="mr-2 text-yellow-400" />
              <h4 className="text-xs uppercase text-muted-foreground">Body</h4>
            </div>
            <div className="mt-1 text-3xl uppercase font-bold">0</div>
          </div>
          <div className="flex flex-col">
            <div className="flex item-center">
              <FaHeart className="mr-2 text-red-400" />
              <h4 className="text-xs uppercase text-muted-foreground">
                Spirit
              </h4>
            </div>
            <div className="mt-1 text-3xl uppercase font-bold">0</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Stats;
