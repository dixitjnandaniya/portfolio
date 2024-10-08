async function injectHTML(filePath,elem) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            return;
        }
        const text = await response.text();
        elem.innerHTML = text;
        elem.querySelectorAll("script").forEach(script => {
            const newScript = document.createElement("script");
            Array.from(script.attributes).forEach(attr =>
                newScript.setAttribute(attr.name, attr.value)
            );
            newScript.appendChild(
                document.createTextNode(script.innerHTML)
            )
            script.parentNode.replaceChild(newScript, script);
        })
    } catch (err) {
        console.error(err.message);
    }
}

// async function injectHTML(filePath,elem) {
//     try {
//         const response = await fetch(filePath);
//         if (!response.ok) {
//             return;
//         }
//         const text = await response.text();
//         elem.innerHTML = text;
//     } catch (err) {
//         console.error(err.message);
//     }
// }
// injectHTML("./about.html", document.querySelector(".about"));
    
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
      .then(html => {
        container.innerHTML = html;
        // Ensure carousel is initialized here if necessary, or wait for it to be ready
        $(container).find('.carousel').carousel(); // Bootstrap carousel initialization if needed
        loadProjectsByCategory('All'); // Load all projects initially
    })
    .catch(err => console.error('Failed to load the page: ', err));
}


document.addEventListener("DOMContentLoaded", function() {
    loadCategory('./projects/projects.html');
    setupCategoryButtons();
});







function setupCategoryButtons() {
    document.querySelectorAll(".category-btn").forEach(button => {
      button.addEventListener("click", function() {
        const category = this.getAttribute('data-category');
        loadProjectsByCategory(category);
      });
    });
}

function loadProjectsByCategory(category = "All") {
    fetch('./projects/projects_info.json')
      .then(response => response.json())
      .then(data => {
        const projects = category === "All"
          ? data.projects
          : data.projects.filter(project => project.categories.includes(category));
        updateCarousel(projects);
      })
      .catch(err => console.error('Error loading projects:', err));
}

  
function loadProjectsByCategory(category) {
    fetch('./projects/projects_info.json')
      .then(response => response.json())
      .then(data => {
        let projects;
        if (category === "All") {
            projects = data.projects; // Return all projects if the category is 'All'
        } else {
            projects = data.projects.filter(project => project.categories.includes(category));
        }
        updateCarousel(projects);
    });
}
  
  function updateCarousel(projects) {
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = ''; // Clear existing items
    let items = '';
    let itemActive = true;
  
    projects.forEach((project, index) => {
      if (index % 3 === 0) { // Start new carousel item every 3 projects
        if (items) {
          carouselInner.innerHTML += `<div class="carousel-item${itemActive ? ' active' : ''}"><div class="d-flex justify-content-around">${items}</div></div>`;
          items = '';
          itemActive = false;
        }
      }
      items += `
        <div class="card" id="${project.id}Card" style="width: 18rem;">
          <img class="card-img-top" src="${project.image}" alt="${project.title}">
          <div class="card-body">
            <h5 class="card-title">${project.title}</h5>
            <p class="card-text">${project.description}</p>
            <a href="${project.link}" class="btn btn-primary">View More</a>
          </div>
        </div>`;
    });
  
    // Add remaining items if any
    if (items) {
      carouselInner.innerHTML += `<div class="carousel-item${itemActive ? ' active' : ''}"><div class="d-flex justify-content-around">${items}</div></div>`;
    }
  }  

