import { AvatarLights } from "@/features/portfolio/components/avatar-lights"
import { USER } from "@/features/portfolio/data/user"

import { AvatarLightsToggle } from "./avatar-lights-toggle"
import { ChanhDaiMarkIsometric } from "./chanhdai-mark-isometric"
import { DiameterDimension } from "./diameter-dimension"
import { ProfileTaglines } from "./profile-taglines"
import { PronounceMyName } from "./pronounce-my-name"
import { VerifiedIcon } from "./verified-icon"

export function ProfileHeader() {
  return (
    <div className="screen-line-top screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x border-x-line after:z-1">
      <figure className="relative col-span-2 flex items-center justify-center p-2 sm:col-span-1 sm:col-start-2 sm:p-4">
        <ChanhDaiMarkIsometric className="h-44 w-auto max-w-full sm:h-64" />
        <figcaption className="pointer-events-none absolute right-2 bottom-2 font-mono text-body-mini-regular text-zinc-400 select-none sm:right-4 dark:text-zinc-700">
          FIG_001
        </figcaption>
      </figure>

      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line">
          <div className="-mx-px my-0 flex outline-none">
            <div className="relative z-10 size-30 rounded-full min-[24rem]:size-32 sm:size-40">
              <AvatarLightsToggle className="group/avatar-lights-toggle block size-full rounded-full outline-none">
                <AvatarLights
                  className="size-full ring-border ring-offset-background group-focus-visible/avatar-lights-toggle:ring-1 group-focus-visible/avatar-lights-toggle:ring-offset-2"
                  variants={USER.avatarVariants}
                />
              </AvatarLightsToggle>

              {/* The label assumes size-40 (sm+); the gutter fits it from lg. */}
              <DiameterDimension
                className="-z-1 hidden lg:block"
                diameter={160}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="z-1 mt-auto border-t border-line">
          <div className="flex -translate-x-px items-center gap-2 pl-4">
            <h1 className="-translate-y-px text-title-regular text-text-primary">
              {USER.displayName}
            </h1>

            <VerifiedIcon className="size-4.5 select-none" aria-hidden />

            {USER.namePronunciationUrl && (
              <PronounceMyName
                namePronunciationUrl={USER.namePronunciationUrl}
              />
            )}
          </div>

          <ProfileTaglines className="h-12.5 border-t border-line py-1 pl-4 sm:h-9">
            {USER.flipSentences}
          </ProfileTaglines>
        </div>
      </div>
    </div>
  )
}
