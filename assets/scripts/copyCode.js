// Auto-add copy buttons to all code blocks
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach(function(codeBlock) {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    codeBlock.parentNode.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);

    // Create copy button with SVG icon
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.innerHTML = `
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    wrapper.appendChild(copyButton);

    // Copy functionality
    copyButton.addEventListener('click', function() {
      const code = codeBlock.innerText;
      navigator.clipboard.writeText(code).then(function() {
        copyButton.classList.add('copied');
        setTimeout(function() {
          copyButton.classList.remove('copied');
        }, 2000);
      });
    });
  });
});
