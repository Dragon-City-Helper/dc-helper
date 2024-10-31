import { Group, Image, Text } from "@mantine/core";
import Link from "next/link";

export default function Logo() {
  return (
    <Link className="text-xl" href="/">
      <Group>
        <Image src="/logo.png" w={32} h={32} alt="Dragon City Helper Logo" />
        <Text>Dragon City Helper</Text>
      </Group>
    </Link>
  );
}
