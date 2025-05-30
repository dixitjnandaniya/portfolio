document.addEventListener('DOMContentLoaded', function () {
    // Get the project ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    // Fetch project data from JSON file
    fetch('./json_data/projects_info.json')
        .then(response => response.json())
        .then(data => {
            const project = data.projects.find(p => p.id === projectId);

            if (project) {
                // Set project title
                document.getElementById('projectTitle').innerHTML = project.title || 'Project Title';
                document.getElementById('projectName').innerHTML = project.title || 'Project Name';

                // Set subtitle if available
                const subtitleElem = document.getElementById('projectSubtitle');
                if (project.subtitle) {
                    subtitleElem.innerHTML = project.subtitle;
                } else {
                    subtitleElem.style.display = 'none'; // Hide subtitle section if not available
                }


                const githubLinkElem = document.getElementById('githubLink');
                if (project.github) {
                    githubLinkElem.href = project.github;
                    githubLinkElem.innerHTML = project.github; // Display only the URL in blue
                    document.getElementById('githubContainer').style.display = 'block'; // Ensure container is displayed
                } else {
                    document.getElementById('githubContainer').style.display = 'none'; // Hide if no GitHub link is available
                }


                // Set introduction if available
                const introElem = document.getElementById('projectIntroduction');
                if (project.introduction) {
                    introElem.innerHTML = project.introduction;
                } else {
                    introElem.parentElement.style.display = 'none'; // Hide the section
                }


                // <iframe src="https://1drv.ms/p/c/82e1d7f32278ddf7/IQSz6EhD3XzWTb41EGuFGu3_AXxqVASf3iG67-NeZm64ZS4?em=2&amp;wdAr=1.7777777777777777" width="476px" height="250px" frameborder="0">This is an embedded <a target="_blank" href="https://office.com">Microsoft Office</a> presentation, powered by <a target="_blank" href="https://office.com/webapps">Office</a>.</iframe>


                const mediaElem = document.getElementById('projectMedia');
                if (project.media) {
                    const { type, path } = project.media;

                    console.log("path: ", path)

                    let mediaHTML = '';

                    if (type === 'pdf') {
                        mediaHTML = `<iframe src="${path}" width="100%" height="600px" class="embed-responsive-item"></iframe>`;
                    } else if (type === 'ppt') {
                        const previewPath = path.replace('/edit', '/preview');
                        mediaHTML = `<iframe src="${previewPath}" width="100%" height="500px" class="embed-responsive-item"></iframe>`;
                    } else if (type === 'jpg' || type === 'png') {
                        mediaHTML = `<img src="${path}" alt="Project Image" class="img-fluid">`;
                    } else if (type === 'video') {
                        mediaHTML = `<video controls width="100%" class="embed-responsive-item">
                                         <source src="${path}" type="video/mp4">
                                         Your browser does not support the video tag.
                                     </video>`;
                    } else {
                        mediaHTML = `<p>Unsupported media type: ${type}</p>`;
                    }

                    mediaElem.innerHTML = mediaHTML;
                } else {
                    mediaElem.style.display = 'none'; // Hide if no media is available
                }



                // Set project background if available
                const backgroundElem = document.getElementById('projectBackground');
                if (project.background) {
                    backgroundElem.innerHTML = project.background;
                } else {
                    backgroundElem.parentElement.style.display = 'none';
                }

                // Populate features list if available
                const featuresList = document.getElementById('projectFeatures');
                if (project.features && project.features.length > 0) {
                    project.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.innerHTML = feature;
                        featuresList.appendChild(li);
                    });
                } else {
                    featuresList.parentElement.style.display = 'none'; // Hide if no features
                }

                // Populate tech stack if available
                const techStackElem = document.getElementById('projectTechStack');
                if (project.tech_stack) {
                    techStackElem.innerHTML = project.tech_stack;
                } else {
                    techStackElem.parentElement.style.display = 'none';
                }

                // Set development process if available
                const developmentElem = document.getElementById('projectDevelopment');
                if (project.development) {
                    developmentElem.innerHTML = project.development;
                } else {
                    developmentElem.parentElement.style.display = 'none';
                }

                // Set challenges faced if available
                const challengesElem = document.getElementById('projectChallenges');
                if (project.challenges) {
                    challengesElem.innerHTML = project.challenges;
                } else {
                    challengesElem.parentElement.style.display = 'none';
                }

                // Set results & impact if available
                const resultsElem = document.getElementById('projectResults');
                if (project.results) {
                    resultsElem.innerHTML = project.results;
                } else {
                    resultsElem.parentElement.style.display = 'none';
                }

                // Set user feedback if available
                const feedbackElem = document.getElementById('projectFeedback');
                if (project.feedback) {
                    feedbackElem.innerHTML = project.feedback;
                } else {
                    feedbackElem.parentElement.style.display = 'none';
                }

                // Set future improvements if available
                const improvementsElem = document.getElementById('projectImprovements');
                if (project.improvements) {
                    improvementsElem.innerHTML = project.improvements;
                } else {
                    improvementsElem.parentElement.style.display = 'none';
                }

                // Set conclusion if available
                const conclusionElem = document.getElementById('projectConclusion');
                if (project.conclusion) {
                    conclusionElem.innerHTML = project.conclusion;
                } else {
                    conclusionElem.parentElement.style.display = 'none';
                }

            } else {
                // If no project matches the ID, show an error message
                document.getElementById('projectName').innerHTML = 'Project Not Found';
            }
        })
        .catch(error => console.error('Error fetching project data:', error));
});
