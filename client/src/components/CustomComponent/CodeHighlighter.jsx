import { useEffect } from "react";
// import PropTypes from "prop-types";
import Prism from "prismjs"; // Ensure Prism.js is installed and imported
import "prismjs/themes/prism-tomorrow.css"; // Add your preferred PrismJS theme

const CodeHighlighter = ({ post }) => {

  useEffect(() => {
    // Highlight code blocks after rendering
    Prism.highlightAll();

    // Attach copy functionality
    document.querySelectorAll("pre.ql-syntax").forEach((codeBlock) => {
      if (!codeBlock.nextSibling || !codeBlock.nextSibling.classList.contains("copy-btn")) {
        const copyButton = document.createElement("button");
        copyButton.innerText = "Copy";
        copyButton.className = "copy-btn";
        // copyButton.style.cssText = "position: absolute; right: 10px; top: 1px; padding: 5px; cursor: pointer; z-index:1";
        
        copyButton.onclick = () => {
          navigator.clipboard.writeText(codeBlock.innerText)
            .then(() => {
              const intervalID = setInterval(() => {
                copyButton.innerText = "Copied!";
              },0);
              setTimeout(() => {
                clearInterval(intervalID)
                copyButton.innerText = "Copy";

              }, 2000);
            })
            .catch((err) => console.error("Copy failed", err));
        };

        const wrapper = document.createElement("div");
        wrapper.style.cssText = "position: relative;";
        codeBlock.parentNode.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(copyButton);
        wrapper.appendChild(codeBlock);
      }
    });
  }, [post]);

};



export default CodeHighlighter;
