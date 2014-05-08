window.onload = function(){


    var isStatic = getParameterByName( 'static' ) === 'true';

    console.log( "isStatic", isStatic );


    // THE USUAL SUSPECTS
    var scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
        renderer = new THREE.WebGLRenderer(),
        controls = new THREE.OrbitControls( camera );

    camera.position.z = 600;
    renderer.autoClear = false;
    controls.noZoom = true;
    controls.noPan = true;

    document.querySelector( '#container' ).appendChild( renderer.domElement );


    function resize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        cubeCamera.aspect = window.innerWidth / window.innerHeight;
        cubeCamera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }




    // SKYBOX


    var cubeCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        cubeScene = new THREE.Scene();


    var path = "textures/cube/Park3Med/",
        format = '.jpg',
        urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial( {

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        side: THREE.BackSide,
        depthWrite: false

    } ),

    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
    cubeScene.add( mesh );


    var loader = new THREE.STLLoader();
    loader.addEventListener( 'load', function ( event ) {

        var geometry = event.content;
        geometry = QuickHull(geometry);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ envMap: textureCube, reflectivity: 0.9}));
        mesh.scale.set(10,10,10);
        scene.add(mesh);

    });
    loader.load('bool.stl');


    function animate(){

        controls.update();
        cubeCamera.rotation.copy( camera.rotation );

        renderer.clear();

        // Oooh, double render...
        renderer.render( cubeScene, cubeCamera );
        renderer.render( scene, camera );


        requestAnimationFrame( animate );

    }

    window.addEventListener( 'resize', resize )
    resize();
    animate();

}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}