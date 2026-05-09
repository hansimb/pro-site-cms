import NextLink from "next/link";
import { Link, Text } from "@chakra-ui/react";

interface ArticleTopicEyebrowProps {
  linked?: boolean;
  topic: string;
}

export function ArticleTopicEyebrow({
  linked = true,
  topic,
}: ArticleTopicEyebrowProps) {
  const sharedProps = {
    alignSelf: "start" as const,
    color: "accent",
    fontSize: "sm",
    fontWeight: "700",
    letterSpacing: "0.04em",
  };

  if (!linked) {
    return <Text {...sharedProps}>{topic}</Text>;
  }

  return (
    <Link
      asChild
      textDecoration="none"
      {...sharedProps}
      _hover={{ color: "text", textDecoration: "none" }}
    >
      <NextLink href={`/writing/${encodeURIComponent(topic)}`}>{topic}</NextLink>
    </Link>
  );
}
