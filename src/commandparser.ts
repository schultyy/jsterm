export function parse(argumentList: string): Array<string> {
  var splitted = argumentList.split(" ");
  if (splitted.length === 1){
    return splitted;
  }
  return splitted;
}
