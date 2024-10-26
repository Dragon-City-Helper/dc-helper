"use client";
import { FC } from "react";
import { Container, Title, Text, List, Anchor } from "@mantine/core";

const PrivacyPolicyPage: FC = () => {
  return (
    <Container size="md" my="xl">
      <Title order={1} mb="lg">
        Privacy Policy
      </Title>
      <Title order={2} mt="xl" mb="sm">
        1. Introduction
      </Title>
      <Text>
        DC-Helper respects your privacy and is committed to protecting your
        personal information. This Privacy Policy outlines our practices for
        collecting, using, and safeguarding your data.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        2. Information We Collect
      </Title>
      <Text>When you use DC-Helper, we may collect:</Text>
      <List withPadding>
        <List.Item>
          <Text>
            <strong>Account Information:</strong> Data used to log in (e.g.,
            Discord ID, and potentially, Reddit, Facebook, or Google ID in the
            future).
          </Text>
        </List.Item>
        <List.Item>
          <Text>
            <strong>Usage Data:</strong> Information related to your activities
            within the App, collected through Vercel Analytics for performance
            improvement.
          </Text>
        </List.Item>
      </List>

      <Title order={2} mt="xl" mb="sm">
        3. How We Use Your Information
      </Title>
      <Text>We use your information to:</Text>
      <List withPadding>
        <List.Item>
          Provide access to dragon tracking, dragon discovery, and tier list
          features.
        </List.Item>
        <List.Item>
          Enhance user experience through performance insights.
        </List.Item>
        <List.Item>
          Ensure App security and address any technical issues.
        </List.Item>
        <List.Item>
          Prioritize potential features to provide in the future
        </List.Item>
      </List>

      <Title order={2} mt="xl" mb="sm">
        4. Data Sharing and Disclosure
      </Title>
      <Text>
        Your data is not shared with third parties except as necessary to:
      </Text>
      <List withPadding>
        <List.Item>Comply with legal obligations.</List.Item>
        <List.Item>
          Analyze user behavior and performance using Vercel Analytics and
          Vercel Speed Insights.
        </List.Item>
        <List.Item>
          Facilitate login with third-party platforms (Discord, and potentially
          Reddit, Facebook, and Google).
        </List.Item>
      </List>

      <Title order={2} mt="xl" mb="sm">
        5. Cookies and Tracking
      </Title>
      <Text>
        DC-Helper uses cookies and similar tracking technologies to collect data
        about App usage, enabling us to provide an optimized user experience.
        You may control cookie preferences via your browser settings.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        6. Data Security
      </Title>
      <Text>
        We prioritize the security of your data and use commercially acceptable
        measures to protect it. However, no method of transmission or storage is
        completely secure, and we cannot guarantee absolute security.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        7. Third-Party Links
      </Title>
      <Text>
        Our App may include links to third-party websites for additional
        resources. DC-Helper is not responsible for the privacy practices of
        these external sites.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        8. Changes to Privacy Policy
      </Title>
      <Text>
        This Privacy Policy may be updated periodically. Continued use of
        DC-Helper after any modifications indicates acceptance of the updated
        policy.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        9. Contact Us
      </Title>
      <Text>
        For questions about these Terms &amp; Conditions or the Privacy Policy,
        please contact us via the contact form on our website.
      </Text>
    </Container>
  );
};

export default PrivacyPolicyPage;
