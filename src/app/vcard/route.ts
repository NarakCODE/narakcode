import { NextResponse } from "next/server";
import VCard from "vcard-creator";

import { USER } from "@/data/user";
import { decodeEmail, decodePhoneNumber } from "@/utils/string";

async function getVCardPhoto(url: string) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) {
      return null;
    }

    const image = buffer.toString("base64");

    const contentType = res.headers.get("Content-Type") || "";
    if (!contentType.startsWith("image/")) {
      return null;
    }

    return {
      image,
      mine: contentType.split("/")[1],
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const card = new VCard();

  card
    .addName({ familyName: USER.lastName, givenName: USER.firstName })
    .addPhoneNumber({
      number: decodePhoneNumber(USER.phoneNumber),
      type: ["cell"],
    })
    .addAddress({ street: USER.address })
    .addEmail({ address: decodeEmail(USER.email) })
    .addUrl({ url: USER.website });

  const photo = await getVCardPhoto(USER.avatar);
  if (photo) {
    card.addPhoto({ url: USER.avatar });
  }

  if (USER.jobs.length > 0) {
    const company = USER.jobs[0];
    card.addCompany({ name: company.company }).addJobtitle(company.title);
  }

  return new NextResponse(card.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/x-vcard",
      "Content-Disposition": `attachment; filename=${USER.username}-vcard.vcf`,
    },
  });
}
