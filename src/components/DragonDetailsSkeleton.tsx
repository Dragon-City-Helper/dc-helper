import {
  SimpleGrid,
  Stack,
  Skeleton,
  Group,
  Box,
  Card,
  Grid,
} from "@mantine/core";

const DragonDetailsSkeleton = () => {
  return (
    <Card>
      <SimpleGrid cols={{ base: 1, sm: 2 }} my="md">
        {/* DragonProfile Skeleton */}
        <Box>
          <Group justify="center" mt="md">
            <Skeleton height={40} width={40} circle />
            <Skeleton height={40} width={40} circle />
            <Skeleton height={40} width={40} circle />
          </Group>
          <Skeleton height={300} width={300} mt="md" mx="auto" />
          <Group mt="md" gap="xs" justify="center">
            <Skeleton height={20} width={60} radius="sm" />
            <Skeleton height={20} width={60} radius="sm" />
            <Skeleton height={20} width={60} radius="sm" />
          </Group>
        </Box>

        <Stack>
          {/* DragonRatings Skeleton */}
          <Box>
            <Skeleton height={24} width="30%" mb="sm" />
            <Group justify="space-between" mt="md">
              <Skeleton height={20} width="30%" />
              <Skeleton height={20} width="20%" />
            </Group>
            <Skeleton height={20} width="40%" my="md" />
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {[...Array(4)].map((_, i) => (
                <Group key={i} justify="space-between">
                  <Skeleton height={20} width="60%" />
                  <Skeleton height={20} width="20%" />
                </Group>
              ))}
            </SimpleGrid>
          </Box>

          {/* DragonSkinChanges or DragonSkills Skeleton */}

          <Stack>
            <Skeleton height={24} width="40%" mb="sm" />
            <Grid align="center">
              <Grid.Col span={2}>
                <Skeleton height={48} width={48} radius="md" />
              </Grid.Col>
              <Grid.Col span={10}>
                <Skeleton height={20} width="50%" />
                <Skeleton height={16} width="80%" mt="sm" />
              </Grid.Col>
            </Grid>
            <Grid align="center">
              <Grid.Col span={2}>
                <Skeleton height={48} width={48} radius="md" />
              </Grid.Col>
              <Grid.Col span={10}>
                <Skeleton height={20} width="50%" />
                <Skeleton height={16} width="80%" mt="sm" />
              </Grid.Col>
            </Grid>
            <Grid align="center">
              <Grid.Col span={2}>
                <Skeleton height={48} width={48} radius="md" />
              </Grid.Col>
              <Grid.Col span={10}>
                <Skeleton height={20} width="50%" />
                <Skeleton height={16} width="80%" mt="sm" />
              </Grid.Col>
            </Grid>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Card>
  );
};

export default DragonDetailsSkeleton;
