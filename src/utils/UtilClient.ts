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
}
