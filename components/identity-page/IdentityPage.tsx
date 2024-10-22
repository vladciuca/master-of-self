import { ScrollArea } from "@components/ui/scroll-area";
import { X } from "lucide-react";

type IdentityPageProps = {
  isDrawerOpen: boolean;
  handleCloseDrawer: () => void;
};
export function IdentityPage({
  isDrawerOpen,
  handleCloseDrawer,
}: IdentityPageProps) {
  return (
    <div>
      <div
        className="absolute top-4 right-4 z-10 cursor-pointer"
        onClick={handleCloseDrawer}
      >
        <X />
      </div>

      <ScrollArea className="h-screen p-10 overflow-scroll">
        <h1 className="text-6xl my-24 text-center">
          Design Your
          <br />
          <span className="text-green-500">2.0</span> Self
        </h1>
        <div className="space-y-10">
          <div>
            <h1>IDENTITY</h1>
            <h3 className="text-3xl font-semibold">
              1. Visualize Your Ideal Self
            </h3>
            <p>
              Imagine your most empowered version.
              <br />
              Describe the appearance of your 2.0 self in vivid detail, from
              accessories to clothing and style, let your creativity shine as
              you craft the best version of you.
              <br /> We'll bring it to life through a custom avatar that
              reflects your ideal vision.
            </p>
          </div>
          <div>
            <h1>BELIEVES</h1>
            <h3 className="text-3xl font-semibold">
              2. Describe Your Ideal Self's Achievements
            </h3>
            <p>
              Envision your ideal self’s accomplishments and write them down as
              powerful affirmations in the present tense: "I earn...", "I
              make...", "I drive...".
              <br />
              By framing your goals this way, you tap into the mindset of
              success.
              <br />
              Select one goal, break it down into actionable steps, and map out
              your hero’s journey by setting clear milestones along the way.
              <br />
              Each milestone represents progress, and with each step, you’re
              closer to becoming your 2.0 self.
              <br />
              Build habits with actions that align to these milestones, ensuring
              steady growth towards your ultimate achievements.
            </p>
          </div>
          <div>
            <h1>BEHAVIOR</h1>
            <h3 className="text-3xl font-semibold">3. Define Key Habits</h3>
            <p>
              Success is built on consistent actions. To bridge the gap between
              who you are now and your 2.0 self, identify the essential habits
              that will drive your transformation.
              <br />
              These are the daily or weekly actions that, when repeated, lead to
              achieving your bigger goals.
              <br />
              Whether it's developing a morning routine, staying focused on deep
              work, or committing to lifelong learning, these habits will dive
              your progress and help you align with the version of yourself
              you're striving to become.
            </p>
          </div>
        </div>

        {/* <h3 className="text-3xl font-semibold">
          3. Unlock Unique Powers/Characteristics
        </h3>
        <p>
          Highlight the key traits and qualities that make your 2.0 self
          unstoppable. These are the strengths and attributes that will help you
          naturally overcome challenges and reach your goals with confidence.
        </p> */}
      </ScrollArea>
    </div>
  );
}
