let canvas = document.getElementById("renderCanvas");
let engine = new BABYLON.Engine(canvas, true);
let ghost; // Declare 'ghost' in a broader scope

const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // Camera setup
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

/*
    // Camera fixe (ne fonctionne pas)
    const followCamera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, -10), scene, targetMesh);
    followCamera.attachControl(canvas, true);
*/

    // Function to create the ghost model and set its position
    const createGhost = function () {
        BABYLON.SceneLoader.ImportMesh("", "", "models/test2.glb", scene, function (newMeshes) {
            ghost = newMeshes[0];
            ghost.position = new BABYLON.Vector3(0, 0, 0);

            // Create the follow camera after the ghost is loaded
            followCamera = new BABYLON.FollowCamera("followCamera", new BABYLON.Vector3(0, 5, -10), scene);
            followCamera.radius = 5; // How far from the object to follow
            followCamera.heightOffset = 4; // How high above the object to place the camera
            followCamera.attachControl(canvas, true);
            followCamera.lockedTarget = ghost; // Target the ghost
        });
    };

    // Charge le modele 3D du fantome
    // createGhost();

    BABYLON.SceneLoader.ImportMesh("", "", "models/room.glb", scene, function (newMeshes) {
        const model = newMeshes[0];
        model.position = new BABYLON.Vector3(0, -1, -10);
    });

    BABYLON.SceneLoader.ImportMesh("", "", "models/tree.glb", scene, function (newMeshes) {
        const model = newMeshes[0];
        model.position = new BABYLON.Vector3(0, -1, -10);
    });

    BABYLON.SceneLoader.ImportMesh("", "", "models/skier.glb", scene, function (newMeshes) {
        const model = newMeshes[0];
        model.position = new BABYLON.Vector3(0, -1, 10);
        var scaleFactor = 10;
        model.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
    });

    //const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10});
    
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    //const box = BABYLON.MeshBuilder.CreateBox("box", {});

    var ghostSpeed = 0.01;

    window.addEventListener("keydown", function (evt) {
        evt.preventDefault();
        if (ghost) {
            switch (evt.key) {
                case "z":
                    ghost.position.z = ghost.position.z + 1;
                    break;
                case "s":
                    ghost.position.z = ghost.position.z - 1;
                    break;
                case "d":
                    ghost.position.x = ghost.position.x + 1;
                    break;
                case "q":
                    ghost.position.x = ghost.position.x - 1;
                    break;
            }
        }
    });

    return scene;
};

let scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});
