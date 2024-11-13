import { FC } from "react";
import { PerkNames } from "@/constants/Dragon";
import Select from "./Select";
import { Button, Paper, Text } from "@mantine/core";
import { Perk } from "@prisma/client";
import PerkImage from "./PerkImage";
import { IPerkSuggestion } from "@/types/perkSuggestions";

interface PerkCombination {
  perk1?: Perk;
  perk2?: Perk;
}

const options = Object.values(Perk).map((perk) => ({
  value: perk,
  label: PerkNames[perk],
}));

const PerkSelector: FC<{
  combinations: IPerkSuggestion[];
  onPerksChange: (perkCombinations: PerkCombination[]) => void;
  maxCombinations?: number;
}> = ({ combinations, onPerksChange, maxCombinations = 3 }) => {
  const handlePerkChange = (
    index: number,
    perk: "perk1" | "perk2",
    value: Perk | null,
  ) => {
    const newCombinations = combinations?.map((combo, i) =>
      i === index ? { ...combo, [perk]: value || undefined } : combo,
    );
    onPerksChange(newCombinations);
  };

  const addCombination = () => {
    if (combinations.length < maxCombinations) {
      onPerksChange([...combinations, {}]);
    }
  };

  const deleteCombination = (index: number) => {
    onPerksChange(combinations.filter((_, i) => i !== index));
  };

  const getFilteredOptions = (selectedPerk?: Perk) => {
    return options.filter(({ value }) => value !== selectedPerk);
  };

  return (
    <Paper>
      <Text fw="bold" mt="sm">
        Perk Recommendations
      </Text>
      {combinations?.map((combo, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <Text>Recommendation {index + 1}</Text>
          <Select
            label={`Perk 1`}
            placeholder="Select Perk 1"
            data={getFilteredOptions(combo.perk2)}
            value={combo.perk1 || null}
            onChange={(value) =>
              handlePerkChange(index, "perk1", value as Perk | null)
            }
            icon={(option) => <PerkImage perk={option.value} />}
          />
          <Select
            label={`Perk 2`}
            placeholder="Select Perk 2"
            data={getFilteredOptions(combo.perk1)}
            value={combo.perk2 || null}
            onChange={(value) =>
              handlePerkChange(index, "perk2", value as Perk | null)
            }
            icon={(option) => <PerkImage perk={option.value} />}
          />
          <Button onClick={() => deleteCombination(index)} bg="red" mt="md">
            Delete
          </Button>
        </div>
      ))}
      {combinations?.length < maxCombinations && (
        <Button onClick={addCombination} mt="md">
          Add
        </Button>
      )}
    </Paper>
  );
};

export default PerkSelector;
