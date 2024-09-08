// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.7 / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Add lighting
const light = new THREE.AmbientLight(0x404040);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Create platforms and facilities
const platforms = [];
const facilities = [];

// Function to create platforms
function createPlatform(x, y, z) {
    const geometry = new THREE.BoxGeometry(10, 0.5, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const platform = new THREE.Mesh(geometry, material);
    platform.position.set(x, y, z);
    platform.name = `Platform ${x}`;
    platforms.push(platform);
    return platform;
}

// Add platforms
scene.add(createPlatform(-20, 0, 0)); // Platform 1
scene.add(createPlatform(-10, 0, 0)); // Platform 2
scene.add(createPlatform(0, 0, 0));   // Platform 3
scene.add(createPlatform(10, 0, 0));  // Platform 4
scene.add(createPlatform(20, 0, 0));  // Platform 5

// Function to create station facilities
function createFacility(name, x, y, z, color, platformIndex) {
    const geometry = new THREE.BoxGeometry(3, 2, 3);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const facility = new THREE.Mesh(geometry, material);
    facility.position.set(x, y, z);
    facility.name = name;
    facility.platformIndex = platformIndex;
    facilities.push(facility);
    scene.add(facility);
}

// Add facilities to specific platforms
createFacility('cloakroom', -22, 1, -5, 0xff0000, 1);
createFacility('waiting-hall', -18, 1, -5, 0x00ff00, 1);
createFacility('food-court', -22, 1, 5, 0x0000ff, 1);
createFacility('washroom', -18, 1, 5, 0xffff00, 1);
createFacility('entrance', -20, 1, 0, 0xff00ff, 1);

createFacility('washroom', -12, 1, 5, 0xffff00, 2);
createFacility('washroom', -2, 1, 5, 0xffff00, 3);

createFacility('cloakroom', 18, 1, -5, 0xff0000, 5);
createFacility('waiting-hall', 22, 1, -5, 0x00ff00, 5);
createFacility('food-court', 18, 1, 5, 0x0000ff, 5);
createFacility('washroom', 22, 1, 5, 0xffff00, 5);
createFacility('exit', 20, 1, 0, 0xff00ff, 5);

// Set initial camera position
camera.position.set(0, 5, 30);
camera.lookAt(0, 0, 0);

// Function to show facilities for a selected platform
function showPlatform(platformIndex) {
    facilities.forEach(facility => {
        facility.visible = facility.platformIndex === platformIndex;
    });

    // Update subsection buttons based on the selected platform
    updateSubsectionButtons(platformIndex);

    // Center camera view on selected platform
    switch(platformIndex) {
        case 1:
            camera.position.set(-20, 5, 30);
            camera.lookAt(-20, 0, 0);
            break;
        case 2:
            camera.position.set(-10, 5, 30);
            camera.lookAt(-10, 0, 0);
            break;
        case 3:
            camera.position.set(0, 5, 30);
            camera.lookAt(0, 0, 0);
            break;
        case 4:
            camera.position.set(10, 5, 30);
            camera.lookAt(10, 0, 0);
            break;
        case 5:
            camera.position.set(20, 5, 30);
            camera.lookAt(20, 0, 0);
            break;
        default:
            camera.position.set(0, 5, 30);
            camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
}

// Function to update subsection buttons based on the selected platform
function updateSubsectionButtons(platformIndex) {
    document.getElementById('cloakroom-btn').style.display = platformIndex === 1 || platformIndex === 5 ? 'block' : 'none';
    document.getElementById('waiting-hall-btn').style.display = platformIndex === 1 || platformIndex === 5 ? 'block' : 'none';
    document.getElementById('food-court-btn').style.display = platformIndex === 1 || platformIndex === 5 ? 'block' : 'none';
    document.getElementById('washroom-btn').style.display = platformIndex === 1 || platformIndex === 2 || platformIndex === 3 || platformIndex === 4 || platformIndex === 5 ? 'block' : 'none';
    document.getElementById('entrance-btn').style.display = platformIndex === 1 ? 'block' : 'none';
    document.getElementById('exit-btn').style.display = platformIndex === 5 ? 'block' : 'none';
}

// Function to navigate to a facility
function navigateTo(facilityName) {
    const facility = facilities.find(f => f.name === facilityName);
    if (facility) {
        camera.position.set(facility.position.x, 5, facility.position.z + 10);
        camera.lookAt(facility.position);
        renderer.render(scene, camera);

        // Update directions
        const directionsText = document.getElementById('directions-text');
        if (directionsText) {
            switch (facilityName) {
                case 'cloakroom':
                    directionsText.textContent = 'Directions to Cloakroom: Follow the signs to Platform 1.';
                    break;
                case 'waiting-hall':
                    directionsText.textContent = 'Directions to Waiting Hall: Proceed to Platform 1 and look for the hall.';
                    break;
                case 'food-court':
                    directionsText.textContent = 'Directions to Food Court: Located near the entrance of Platform 1.';
                    break;
                case 'washroom':
                    directionsText.textContent = 'Directions to Washroom: Available on all platforms.';
                    break;
                case 'entrance':
                    directionsText.textContent = 'Directions to Entrance: Main entrance is located at the start of Platform 1.';
                    break;
                case 'exit':
                    directionsText.textContent = 'Directions to Exit: Proceed to the far end of Platform 5.';
                    break;
                default:
                    directionsText.textContent = 'Click on a location to get directions.';
            }
        }
    }
}

// Function to handle station name submission
function submitStationName() {
    const stationName = document.getElementById('station-name').value;
    if (stationName) {
        document.getElementById('station-input').style.display = 'none';
        document.getElementById('container').style.display = 'block';
        document.getElementById('platform-buttons').style.display = 'block';
        document.getElementById('subsection-buttons').style.display = 'block';
        document.getElementById('directions-panel').style.display = 'block';
        animate(); // Start animation after station name is entered
    } else {
        alert('Please enter a valid station name.');
    }
}

// Function to toggle emergency contacts visibility
function toggleEmergencyContacts() {
    const emergencyContacts = document.getElementById('emergency-contacts');
    if (emergencyContacts.style.display === 'none' || emergencyContacts.style.display === '') {
        emergencyContacts.style.display = 'block';
    } else {
        emergencyContacts.style.display = 'none';
    }
}

// Function to handle emergency call for women
function callEmergency() {
    alert('Emergency call feature for women is activated.');
    // Implement actual call functionality if needed
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Initial setup
document.getElementById('station-input').style.display = 'block';
document.getElementById('container').style.display = 'none';
