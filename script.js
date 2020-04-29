// ページの読み込みを待つ
window.addEventListener('load', init);
 
function init() {
    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#title-canvas')
    });
    renderer.setClearColor(new THREE.Color(0x111111));

    // シーンを作成
    const scene = new THREE.Scene();

    // 平行投影カメラを作成
    camera = new THREE.OrthographicCamera(window.innerWidth / -4, window.innerWidth / 4, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
    // 球体が小さいのでズームインする
    camera.zoom = 1.5;
    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);

    // AmbientLightの追加
    const ambiColor = '#ee82ee';  // violet
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    // PointLightを左右に配置
    const pointLightColor = '#00ffff';  // cyan
    const leftPointLight = new THREE.PointLight(pointLightColor, 0.5, 0, 1);
    leftPointLight.position.set(-300, 0, 0);
    
    const rightPointLight = new THREE.PointLight(pointLightColor, 0.5, 0, 1);
    rightPointLight.position.set(300, 0, 0);

    scene.add(leftPointLight);
    scene.add(rightPointLight);

    // 球体を3個作成
    const leftGeometry = new THREE.SphereGeometry(25, 30, 30);
    const leftMaterial = new THREE.MeshStandardMaterial({color: 0xff6347});
    const leftMesh = new THREE.Mesh(leftGeometry, leftMaterial);
    leftMesh.position.set(-100, 0, 0);
    scene.add(leftMesh);

    const middleGeometry = new THREE.SphereGeometry(25, 30, 30);
    const middleMaterial = new THREE.MeshStandardMaterial({color: 0x4169e1});
    const middleMesh = new THREE.Mesh(middleGeometry, middleMaterial);
    scene.add(middleMesh);

    const rightGeometry = new THREE.SphereGeometry(25, 30, 30);
    const rightMaterial = new THREE.MeshStandardMaterial({color: 0x228b22});
    const rightMesh = new THREE.Mesh(rightGeometry, rightMaterial);
    rightMesh.position.set(100, 0, 0);
    scene.add(rightMesh);

    // 地面を作成
    const plane = new THREE.GridHelper(500, 10, 0xff00ff, 0xff00ff);
    plane.rotation.set(Math.PI / 2, 0, 0);
    scene.add(plane);

    // デバッグ用の座標軸を表示
    // var axis = new THREE.AxisHelper(50);
    // scene.add(axis);

    // ポストプロセッシングの適用
    let renderPass = new THREE.RenderPass(scene, camera);
    let effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);
    effectFilm.renderToScreen = true;

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(effectFilm);

    let clock = new THREE.Clock();

    tick();
    // ループイベント
    function tick() {
        let delta = clock.getDelta();

        // renderer.render(scene, camera); // レンダリング
        requestAnimationFrame(tick);
        composer.render(delta);
    }

    // 初期化のために実行
    onResize();
    // リサイズイベント発生時に実行
    window.addEventListener('resize', onResize);

    function onResize() {
        // サイズを取得
        const width = window.innerWidth;
        const height = window.innerHeight / 4;

        // レンダラーのサイズを調整する
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        // カメラのアスペクト比を正す
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}