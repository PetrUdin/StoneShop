
export default function(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
};
