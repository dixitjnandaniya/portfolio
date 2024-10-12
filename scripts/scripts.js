async function injectHTML(filePath, elem, callback) {
  try {
      const response = await fetch(filePath);
      if (!response.ok) {
          return;
      }
      const text = await response.text();
      elem.innerHTML = text;
      
      // Ensure that all scripts within the loaded HTML are executed
      elem.querySelectorAll("script").forEach(script => {
          const newScript = document.createElement("script");
          Array.from(script.attributes).forEach(attr =>
              newScript.setAttribute(attr.name, attr.value)
          );
          newScript.appendChild(
              document.createTextNode(script.innerHTML)
          )
          script.parentNode.replaceChild(newScript, script);
      });
      
      // Run callback if provided (e.g., load skills after injection)
      if (typeof callback === 'function') {
          callback();
      }

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
  document.querySelectorAll("div[include]").forEach((elem) => {
      const filePath = elem.getAttribute("include");
      injectHTML(filePath, elem, () => {
          // This will run after the HTML is injected
          if (elem.id === "skills") {
              loadSkills(); // Load skills if the section is "skills"
          }
      });
  });
}





function loadSkills() {
  const skillsContainer = document.getElementById('skills-container');

  if (skillsContainer) {
    fetch('./json_data/skills_info.json')  // Update the path to your JSON file
      .then(response => response.json())
      .then(data => {
        data.skills.forEach(skill => {
          const skillHTML = `
            <div class="col-md-3 mb-4">
              <img src="${skill.image}" alt="${skill.name} Logo" class="img-fluid skill-logo mb-2">
              <h6>${skill.name}</h6>
            </div>
          `;
          skillsContainer.innerHTML += skillHTML;
        });
      })
      .catch(error => console.error('Error loading JSON:', error));
  } else {
    console.error('The skills-container element was not found.');
  }
}


    

injectAll();









function loadCategory(filePath) {
    const container = document.getElementById('projectsCarousel');
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
    loadCategory('./projects.html');
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
    fetch('./json_data/projects_info.json')
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
    fetch('./json_data/projects_info.json')
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
  const carouselIndicators = document.querySelector('.carousel-indicators'); // Get the indicators container
  carouselInner.innerHTML = ''; // Clear existing items
  carouselIndicators.innerHTML = ''; // Clear existing indicators

  let items = '';
  let itemActive = true;
  let slideIndex = 0; // Keep track of slide index

  const totalSlides = Math.ceil(projects.length / 3); // Calculate number of slides based on number of projects (max 3 per slide)

  // Loop through the projects and create slides
  projects.forEach((project, index) => {
      if (index % 3 === 0) { // Start a new carousel item every 3 projects
          if (items) {
              const justifyClass = projects.length <= 2 ? 'justify-content-center' : 'justify-content-around';
              carouselInner.innerHTML += `<div class="carousel-item${itemActive ? ' active' : ''}">
                                            <div class="row ${justifyClass}">${items}</div>
                                          </div>`;
              items = '';
              itemActive = false;
          }

          // Dynamically create carousel indicators
          if (slideIndex < totalSlides) {
              carouselIndicators.innerHTML += `<li data-target="#projectsCarousel" data-slide-to="${slideIndex}" class="${slideIndex === 0 ? 'active' : ''}"></li>`;
          }
          slideIndex++;
      }

      // Create individual cards for each project
      skillItems = project.skills.map(skill => `<li>${skill.trim()}</li>`).join('');
      items += `
      <div class="col-md-4">
        <div class="card mb-4" id="${project.id}Card" style="width: 100%;">
          <img class="card-img-top" src="${project.image}" alt="${project.title}">
          <div class="card-body">
            <h5 class="card-title">${project.title}</h5>
            <ul class="card-text">${skillItems}</ul>
            <a href="./project_details.html?projectId=${project.id}" class="btn btn-primary">View More</a>
          </div>
        </div>
      </div>`;
  });

  // Add remaining items if any
  if (items) {
      const justifyClass = projects.length < 3 ? 'justify-content-center' : 'justify-content-around';
      carouselInner.innerHTML += `<div class="carousel-item${itemActive ? ' active' : ''}">
                                    <div class="row ${justifyClass}">${items}</div>
                                  </div>`;
      // Add an indicator for the last slide if needed
      if (slideIndex < totalSlides) {
          carouselIndicators.innerHTML += `<li data-target="#projectsCarousel" data-slide-to="${slideIndex}" class="${slideIndex === 0 ? 'active' : ''}"></li>`;
      }
  }
}
