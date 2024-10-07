// async function injectHTML(filePath,elem) {
//     try {
//         const response = await fetch(filePath);
//         if (!response.ok) {
//             return;
//         }
//         const text = await response.text();
//         elem.innerHTML = text;
//         elem.querySelectorAll("script").forEach(script => {
//             const newScript = document.createElement("script");
//             Array.from(script.attributes).forEach(attr =>
//                 newScript.setAttribute(attr.name, attr.value)
//             );
//             newScript.appendChild(
//                 document.createTextNode(script.innerHTML)
//             )
//             script.parentNode.replaceChild(newScript, script);
//         })
//     } catch (err) {
//         console.error(err.message);
//     }
// }

async function injectHTML(filePath,elem) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            return;
        }
        const text = await response.text();
        elem.innerHTML = text;
    } catch (err) {
        console.error(err.message);
    }
}
    
function injectAll() {
    document.querySelectorAll("div[include]")
            .forEach((elem) => {
                injectHTML(elem.getAttribute("include"),elem);
    })
}
    

injectAll();

function loadCategory(filePath) {
    const container = document.getElementById('project-content');
    fetch(filePath)
      .then(response => response.text())
      .then(html => container.innerHTML = html)
      .catch(err => console.error('Failed to load the page: ', err));
}
  
  // Automatically load default category on page load, for example:
document.addEventListener("DOMContentLoaded", function() {
    loadCategory('./projects/projects.html'); // Default category
});





// injectHTML("./about.html", document.querySelector(".about"));