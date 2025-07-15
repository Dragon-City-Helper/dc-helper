"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Text,
  Title,
  Stack,
  Progress,
  Group,
  Image,
  Box,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

interface RedirectToDCMProps {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export default function RedirectToDCM({
  utmSource = "dragonhelper",
  utmMedium = "redirect",
  utmCampaign = "general",
}: RedirectToDCMProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress animation
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      if (newProgress < 100) {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Construct UTM parameters
        const utmParams = new URLSearchParams({
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }).toString();

        // Construct the full URL and redirect
        window.location.href = `https://dragoncitymeta.com?${utmParams}`;
      }
    };

    requestAnimationFrame(updateProgress);
  }, [utmSource, utmMedium, utmCampaign]);

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Stack spacing="xl" align="center">
          <Title order={2} align="center">
            Welcome to the New Dragon City Meta!
          </Title>

          {/* Logo Transition Group */}
          <Box py="md">
            <Group position="center" spacing={48}>
              <div style={{ width: 80, textAlign: "center" }}>
                <Image
                  src="/logo.png"
                  width={64}
                  height={64}
                  alt="Dragon City Helper Logo"
                  style={{ margin: "0 auto" }}
                />
                <Text size="sm" mt="xs" c="dimmed">
                  Dragon City Helper
                </Text>
              </div>

              <IconArrowRight
                size={48}
                stroke={1.5}
                style={{
                  color: "var(--mantine-color-blue-filled)",
                  marginTop: -10,
                }}
              />

              <div style={{ width: 80, textAlign: "center" }}>
                <Image
                  src="/dcmlogo.png"
                  width={64}
                  height={64}
                  alt="Dragon City Meta Logo"
                  style={{ margin: "0 auto" }}
                />
                <Text size="sm" mt="xs" c="dimmed">
                  Dragon City Meta
                </Text>
              </div>
            </Group>
          </Box>

          <Text size="lg" align="center" color="dimmed">
            Dragon City Helper has merged with Dragon City Meta to bring you
            even better ratings, guides, and brand trading hub!
          </Text>

          <Text size="md" align="center">
            Redirecting you to our new home in{" "}
            {Math.ceil((100 - progress) / 20)} seconds...
          </Text>

          <Progress
            value={progress}
            size="lg"
            radius="xl"
            animate
            w="100%"
            color="blue"
          />
        </Stack>
      </Paper>
    </Container>
  );
}
