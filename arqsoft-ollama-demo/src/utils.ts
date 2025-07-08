export const trimOllamaJson = (jsonString: string) => {
  const lines = jsonString.trim().split("\n");
  return lines
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        console.error("Failed to parse line:", line, e);
        return null;
      }
    })
    .filter((parsed) => parsed !== null);
};
