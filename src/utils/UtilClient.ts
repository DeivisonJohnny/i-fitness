export class UtilClient {
  static formatWeight(value: string): string {
    let onlyNums = value.replace(/\D/g, "");

    if (!onlyNums) {
      return "";
    }

    if (onlyNums.length > 4) {
      onlyNums = onlyNums.slice(0, 4);
    }

    if (onlyNums.length > 2) {
      return (
        onlyNums.slice(0, onlyNums.length - 2) +
        "," +
        onlyNums.slice(onlyNums.length - 2)
      );
    }
    return onlyNums;
  }

  static formatHeight(value: string): string {
    let onlyNums = value.replace(/\D/g, "");

    if (!onlyNums) {
      return "";
    }

    if (onlyNums.length > 5) {
      onlyNums = onlyNums.slice(0, 5);
    }

    if (onlyNums.length <= 2) {
      return onlyNums;
    }

    const commaPosition = onlyNums.length - 2;
    const inteiros = onlyNums.slice(0, commaPosition);
    const decimais = onlyNums.slice(commaPosition);

    return `${inteiros},${decimais}`;
  }
}
