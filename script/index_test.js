let canvas = document.getElementById("renderCanvas");
let engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
    const scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 });
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.y = 2;
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);

    // Chargement de l'arbre
    let tree;
    BABYLON.SceneLoader.ImportMesh("", "", "models/tree.glb", scene, function (newMeshes) {
        tree = newMeshes[0];
        tree.position = new BABYLON.Vector3(0, 0, 3);
        let treePhysicsOptions = { mass: 0, restitution: 0.9 };
        let treeImpostorType = BABYLON.PhysicsImpostor.MeshImpostor;
        tree.physicsImpostor = new BABYLON.PhysicsImpostor(tree, treeImpostorType, treePhysicsOptions, scene);
    });

    // Contrôle de la boîte avec les touches du clavier
    window.addEventListener("keydown", function (evt) {
        evt.preventDefault();
        if (!box || !tree) return;

        let delta = 1; // La distance que la boîte se déplace par appui sur une touche
        let futurePosition = box.position.clone();
        
        switch (evt.key) {
            case "z":
                futurePosition.z += delta;
                break;
            case "s":
                futurePosition.z -= delta;
                break;
            case "d":
                futurePosition.x += delta;
                break;
            case "q":
                futurePosition.x -= delta;
                break;
        }

        // Vérification de collision prévue
        let futureBox = BABYLON.MeshBuilder.CreateBox("futureBox", {}, scene);
        futureBox.position = futurePosition;
        if (!futureBox.intersectsMesh(tree, false)) {
            // Pas de collision, mise à jour de la position
            box.position = futurePosition;
        }
        futureBox.dispose(); // Nettoyer l'objet temporaire
    });

    return scene;
};

let scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function () {
    engine.resize();
});
