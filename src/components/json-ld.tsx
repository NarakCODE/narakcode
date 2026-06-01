import Script from "next/script";

type JsonLdProps = {
  id: string;
  data: object;
};

/** Structured data without inline `<script>` in the React tree (React 19). */
export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
