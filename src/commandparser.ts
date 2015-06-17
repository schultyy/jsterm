export function parse(argumentList: string): Array<string> {
  if (argumentList === '') {
    return [];
  }
  var splitted = argumentList.split(" ");
  if (splitted.length === 1){
    return splitted;
  }
  return splitted;
}
