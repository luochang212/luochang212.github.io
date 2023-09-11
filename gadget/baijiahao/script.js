"use strict";

const defaultContent = "#是什么意思？#是什么%？这个%又是从何而来？为什么一瞬间就有好多人使用这个%？为什么大家都在#？相信不少同学都很想了解这个%，下面就让小编来为大家介绍一下#的详细内容。以上就是#的全部内容了，不知道有没有帮到您呢？"

function bullshitGenerater(theme, attribute) {
  let content = defaultContent;
  content = content.replace(/#/g, theme);
  content = content.replace(/%/g, attribute);
  return content;
}

function main() {
  document.getElementById('content').innerHTML = bullshitGenerater(document.getElementById('theme').value, document.getElementById('attribute').value);
}
