let canvas = document.getElementById("renderCanvas");
let engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // Activer le moteur de physique avec la gravité
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10});
    //ground.rotation.z = Math.PI / 8;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const box = BABYLON.MeshBuilder.CreateBox("box", {});

    box.position.y = 2;
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);

    window.addEventListener("keydown", function (evt) {
        evt.preventDefault();
        if (box) {
            switch (evt.key) {
                case "z":
                    box.position.z = box.position.z + 1;
                    break;
                case "s":
                    box.position.z = box.position.z - 1;
                    break;
                case "d":
                    box.position.x = box.position.x + 1;
                    break;
                case "q":
                    box.position.x = box.position.x - 1;
                    break;
            }
        }
    });

    BABYLON.SceneLoader.ImportMesh("", "", "models/tree.glb", scene, function (newMeshes) {
        const model = newMeshes[0];
        model.position = new BABYLON.Vector3(0, 0, 3);
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
