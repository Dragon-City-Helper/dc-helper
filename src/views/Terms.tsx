"use client";
import { FC } from "react";
import { Container, Title, Text, List } from "@mantine/core";

const TermsAndConditionsPage: FC = () => {
  return (
    <Container size="md" my="xl">
      <Title order={1} mb="lg">
        Terms &amp; Conditions
      </Title>

      <Title order={2} mt="xl" mb="sm">
        1. Acceptance of Terms
      </Title>
      <Text>
        By accessing or using Dragon City Helper (the “App”), you agree to
        comply with and be bound by these Terms & Conditions. If you do not
        agree to these terms, please do not use the App. These terms may be
        updated periodically, and continued use of the App constitutes
        acceptance of any changes.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        2. Description of Service
      </Title>
      <Text>
        Dragon City Helper provides tools and utilities to help users track
        dragons, discover dragon abilities, and explore skins within the Dragon
        City universe. These features include:
      </Text>
      <List withPadding>
        <List.Item>Dragon tracking and management tools</List.Item>
        <List.Item>A professionally vetted dragon tier list</List.Item>
        <List.Item>Abilities, skills, and skin details</List.Item>
        <List.Item>
          Planned future features such as dragon animations, user ratings, arena
          team builder, alliance search, dragon trading hub, dragon empowerment
          tracking, and dragon collection book
        </List.Item>
      </List>

      <Title order={2} mt="xl" mb="sm">
        3. Data Sources
      </Title>
      <Text>
        The App utilizes data from dci-static-s1.socialpointgames.com to provide
        accurate and up-to-date information about dragons and their features.
        Dragon City Helper is not affiliated with Dragon City, SocialPoint SL,
        or any third-party entity.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        4. Account and Login
      </Title>
      <Text>
        The App offers a login with Discord and plans to integrate additional
        login options such as Reddit, Facebook, and Google. By logging in, you
        agree to provide accurate information and maintain the confidentiality
        of your account credentials.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        5. Analytics and Performance
      </Title>
      <Text>
        To improve the user experience, we use Google Analytics to track user
        activity and app performance. These tools help us understand usage
        patterns and enhance App responsiveness.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        6. Intellectual Property
      </Title>
      <Text>
        All content, including data, graphics, and assets used within the App,
        is the property of their respective owners. Dragon City Helper respects
        all copyright and trademark rights of third-party sources.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        7. Disclaimer of Warranties
      </Title>
      <Text>
        Dragon City Helper is provided “as is” without warranties of any kind,
        either express or implied. While we strive to ensure the accuracy of
        information, we do not guarantee the completeness, reliability, or
        availability of the data or the services provided by the App.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        8. Limitation of Liability
      </Title>
      <Text>
        Dragon City Helper shall not be liable for any direct, indirect,
        incidental, or consequential damages arising from your use of the App.
        This includes but is not limited to loss of data, account issues, or
        inaccuracies in dragon data.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        9. Monetization
      </Title>
      <Text>
        Dragon City Helper is transitioning to a freemium model, where most of
        the app’s features will remain free to use. However, we plan to offer
        enhanced features exclusively for paid users in the future.
      </Text>

      <Title order={2} mt="xl" mb="sm">
        10. Changes to Terms
      </Title>
      <Text>
        We reserve the right to modify these Terms & Conditions at any time. Any
        changes will be posted here, and it is your responsibility to review
        these terms periodically.
      </Text>
    </Container>
  );
};

export default TermsAndConditionsPage;
