function extractTable(root, rootSelector) {
  const stack = [rootSelector];
  const content = [];

  while (stack.length > 0) {
    const selector = stack.pop();
    const numOfChildren = root.querySelectorAll(selector + " > *").length;
    if (numOfChildren === 0) {
      const elText = root.querySelector(selector).innerText.trim();
      if (elText) content.push(elText);
    } else {
      for (let i = numOfChildren; i > 0; i--) {
        stack.push(selector + ` > *:nth-child(${i})`);
      }
    }
  }
  return content;
}

export default extractTable;
