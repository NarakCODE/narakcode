import Image from "next/image";

import { SimpleTooltip } from "@/components/ui/tooltip";
import { USER } from "@/data/user";
import { FlipSentences } from "@/registry/flip-sentences";

// import profileImage from "../../../data/profile.jpg";
import { NarakCODECover } from "./chanhdai-cover";
import { VerifiedIcon } from "./verified-icon";

export function Header() {
  return (
    <div className="relative mt-2">
      <div className="flex h-12" />

      <NarakCODECover />

      <div className="screen-line-after flex border-x border-edge">
        <div className="shrink-0 border-r border-edge">
          <div className="mx-[2px] my-[3px]">
            <Image
              className="size-32 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40"
              alt={`${USER.displayName}'s avatar`}
              // src={USER.avatar}
              src={
                "https://scontent.fpnh5-2.fna.fbcdn.net/v/t39.30808-6/508072332_1398708154505640_6721807897052859084_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEPmC84i5c2NyY4M-B1inhjqy-ewesK9aerL57B6wr1pyGZ8nJlwIoetNn9DHZg41ppzqHVE88niFVpb71qU-Ms&_nc_ohc=PWtSh4HqygAQ7kNvwGo_94S&_nc_oc=Adkd9Wm95LghAwtdcaATMQoqubvvMeSHy50b78MZl17Lu3rBIIT0Z4NsbdiYP4fFyHk&_nc_zt=23&_nc_ht=scontent.fpnh5-2.fna&_nc_gid=zM6lld8Iwi-40S_D3vtxBA&oh=00_AfN6Tn5MHbjDrVwTnnWWePswgnheEfqVE2mMVsCQS7UAEg&oe=685C7FAC"
              }
              width={512}
              height={512}
              quality={100}
              priority
            />
          </div>
          {/* Flag of Viet Nam */}
          {/* <svg
            className="absolute top-0 -left-px h-8 sm:h-9"
            viewBox="0 0 30 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="30" height="20" fill="#F00" />
            <polygon
              points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85"
              fill="#FFEB00"
            />
          </svg> */}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex grow items-end mask-r-from-60% pb-1 pl-4">
            <div className="line-clamp-1 font-mono text-xs text-zinc-300 select-none dark:text-zinc-800">
              {"text-3xl "}
              <span className="inline dark:hidden">text-zinc-950</span>
              <span className="hidden dark:inline">text-zinc-50</span>
              {" font-medium"}
            </div>
          </div>

          <div className="border-t border-edge">
            <h1 className="flex items-center pl-4 font-heading text-3xl font-medium">
              {USER.displayName}
              &nbsp;
              <SimpleTooltip content="Verified">
                <VerifiedIcon className="size-[0.6em] text-[oklch(0.67_0.17_244.98)]" />
              </SimpleTooltip>
            </h1>

            <div className="h-12 border-t border-edge py-1 pl-4 sm:h-auto">
              <FlipSentences sentences={[USER.bio, ...USER.flipSentences]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
