/* This File contains: OBJ Loader, MTL Loader, and Orbit Controls */ THREE.MTLLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager},THREE.MTLLoader.prototype={constructor:THREE.MTLLoader,load:function(e,t,n,a){var o=this,r=new THREE.FileLoader(this.manager);r.setPath(this.path),r.load(e,function(e){t(o.parse(e))},n,a)},setPath:function(e){this.path=e},setTexturePath:function(e){this.texturePath=e},setBaseUrl:function(e){console.warn("THREE.MTLLoader: .setBaseUrl() is deprecated. Use .setTexturePath( path ) for texture path or .setPath( path ) for general base path instead."),this.setTexturePath(e)},setCrossOrigin:function(e){this.crossOrigin=e},setMaterialOptions:function(e){this.materialOptions=e},parse:function(e){for(var t=e.split("\n"),n={},a=/\s+/,o={},r=0;r<t.length;r++){var i=t[r];if(0!==(i=i.trim()).length&&"#"!==i.charAt(0)){var s=i.indexOf(" "),c=s>=0?i.substring(0,s):i;c=c.toLowerCase();var h=s>=0?i.substring(s+1):"";if(h=h.trim(),"newmtl"===c)n={name:h},o[h]=n;else if(n)if("ka"===c||"kd"===c||"ks"===c){var l=h.split(a,3);n[c]=[parseFloat(l[0]),parseFloat(l[1]),parseFloat(l[2])]}else n[c]=h}}var u=new THREE.MTLLoader.MaterialCreator(this.texturePath||this.path,this.materialOptions);return u.setCrossOrigin(this.crossOrigin),u.setManager(this.manager),u.setMaterials(o),u}},THREE.MTLLoader.MaterialCreator=function(e,t){this.baseUrl=e||"",this.options=t,this.materialsInfo={},this.materials={},this.materialsArray=[],this.nameLookup={},this.side=this.options&&this.options.side?this.options.side:THREE.FrontSide,this.wrap=this.options&&this.options.wrap?this.options.wrap:THREE.RepeatWrapping},THREE.MTLLoader.MaterialCreator.prototype={constructor:THREE.MTLLoader.MaterialCreator,setCrossOrigin:function(e){this.crossOrigin=e},setManager:function(e){this.manager=e},setMaterials:function(e){this.materialsInfo=this.convert(e),this.materials={},this.materialsArray=[],this.nameLookup={}},convert:function(e){if(!this.options)return e;var t={};for(var n in e){var a=e[n],o={};t[n]=o;for(var r in a){var i=!0,s=a[r],c=r.toLowerCase();switch(c){case"kd":case"ka":case"ks":this.options&&this.options.normalizeRGB&&(s=[s[0]/255,s[1]/255,s[2]/255]),this.options&&this.options.ignoreZeroRGBs&&0===s[0]&&0===s[1]&&0===s[2]&&(i=!1)}i&&(o[c]=s)}}return t},preload:function(){for(var e in this.materialsInfo)this.create(e)},getIndex:function(e){return this.nameLookup[e]},getAsArray:function(){var e=0;for(var t in this.materialsInfo)this.materialsArray[e]=this.create(t),this.nameLookup[t]=e,e++;return this.materialsArray},create:function(e){return void 0===this.materials[e]&&this.createMaterial_(e),this.materials[e]},createMaterial_:function(e){function t(e,t){return"string"!=typeof t||""===t?"":/^https?:\/\//i.test(t)?t:e+t}function n(e,n){if(!r[e]){var o=a.getTextureParams(n,r),i=a.loadTexture(t(a.baseUrl,o.url));i.repeat.copy(o.scale),i.offset.copy(o.offset),i.wrapS=a.wrap,i.wrapT=a.wrap,r[e]=i}}var a=this,o=this.materialsInfo[e],r={name:e,side:this.side};for(var i in o){var s=o[i];if(""!==s)switch(i.toLowerCase()){case"kd":r.color=(new THREE.Color).fromArray(s);break;case"ks":r.specular=(new THREE.Color).fromArray(s);break;case"map_kd":n("map",s);break;case"map_ks":n("specularMap",s);break;case"map_bump":case"bump":n("bumpMap",s);break;case"ns":r.shininess=parseFloat(s);break;case"d":s<1&&(r.opacity=s,r.transparent=!0);break;case"Tr":s>0&&(r.opacity=1-s,r.transparent=!0)}}return this.materials[e]=new THREE.MeshPhongMaterial(r),this.materials[e]},getTextureParams:function(e,t){var n,a={scale:new THREE.Vector2(1,1),offset:new THREE.Vector2(0,0)},o=e.split(/\s+/);return(n=o.indexOf("-bm"))>=0&&(t.bumpScale=parseFloat(o[n+1]),o.splice(n,2)),(n=o.indexOf("-s"))>=0&&(a.scale.set(parseFloat(o[n+1]),parseFloat(o[n+2])),o.splice(n,4)),(n=o.indexOf("-o"))>=0&&(a.offset.set(parseFloat(o[n+1]),parseFloat(o[n+2])),o.splice(n,4)),a.url=o.join(" ").trim(),a},loadTexture:function(e,t,n,a,o){var r,i=THREE.Loader.Handlers.get(e),s=void 0!==this.manager?this.manager:THREE.DefaultLoadingManager;return null===i&&(i=new THREE.TextureLoader(s)),i.setCrossOrigin&&i.setCrossOrigin(this.crossOrigin),r=i.load(e,n,a,o),void 0!==t&&(r.mapping=t),r}},THREE.OBJLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager,this.materials=null,this.regexp={vertex_pattern:/^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,normal_pattern:/^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,uv_pattern:/^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,face_vertex:/^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,face_vertex_uv:/^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,face_vertex_uv_normal:/^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,face_vertex_normal:/^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,object_pattern:/^[og]\s*(.+)?/,smoothing_pattern:/^s\s+(\d+|on|off)/,material_library_pattern:/^mtllib /,material_use_pattern:/^usemtl /}},THREE.OBJLoader.prototype={constructor:THREE.OBJLoader,load:function(e,t,n,a){var o=this,r=new THREE.FileLoader(o.manager);r.setPath(this.path),r.load(e,function(e){t(o.parse(e))},n,a)},setPath:function(e){this.path=e},setMaterials:function(e){this.materials=e},_createParserState:function(){var e={objects:[],object:{},vertices:[],normals:[],uvs:[],materialLibraries:[],startObject:function(e,t){if(this.object&&!1===this.object.fromDeclaration)return this.object.name=e,void(this.object.fromDeclaration=!1!==t);var n=this.object&&"function"==typeof this.object.currentMaterial?this.object.currentMaterial():void 0;if(this.object&&"function"==typeof this.object._finalize&&this.object._finalize(!0),this.object={name:e||"",fromDeclaration:!1!==t,geometry:{vertices:[],normals:[],uvs:[]},materials:[],smooth:!0,startMaterial:function(e,t){var n=this._finalize(!1);n&&(n.inherited||n.groupCount<=0)&&this.materials.splice(n.index,1);var a={index:this.materials.length,name:e||"",mtllib:Array.isArray(t)&&t.length>0?t[t.length-1]:"",smooth:void 0!==n?n.smooth:this.smooth,groupStart:void 0!==n?n.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(e){var t={index:"number"==typeof e?e:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return t.clone=this.clone.bind(t),t}};return this.materials.push(a),a},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(e){var t=this.currentMaterial();if(t&&-1===t.groupEnd&&(t.groupEnd=this.geometry.vertices.length/3,t.groupCount=t.groupEnd-t.groupStart,t.inherited=!1),e&&this.materials.length>1)for(var n=this.materials.length-1;n>=0;n--)this.materials[n].groupCount<=0&&this.materials.splice(n,1);return e&&0===this.materials.length&&this.materials.push({name:"",smooth:this.smooth}),t}},n&&n.name&&"function"==typeof n.clone){var a=n.clone(0);a.inherited=!0,this.object.materials.push(a)}this.objects.push(this.object)},finalize:function(){this.object&&"function"==typeof this.object._finalize&&this.object._finalize(!0)},parseVertexIndex:function(e,t){var n=parseInt(e,10);return 3*(n>=0?n-1:n+t/3)},parseNormalIndex:function(e,t){var n=parseInt(e,10);return 3*(n>=0?n-1:n+t/3)},parseUVIndex:function(e,t){var n=parseInt(e,10);return 2*(n>=0?n-1:n+t/2)},addVertex:function(e,t,n){var a=this.vertices,o=this.object.geometry.vertices;o.push(a[e+0]),o.push(a[e+1]),o.push(a[e+2]),o.push(a[t+0]),o.push(a[t+1]),o.push(a[t+2]),o.push(a[n+0]),o.push(a[n+1]),o.push(a[n+2])},addVertexLine:function(e){var t=this.vertices,n=this.object.geometry.vertices;n.push(t[e+0]),n.push(t[e+1]),n.push(t[e+2])},addNormal:function(e,t,n){var a=this.normals,o=this.object.geometry.normals;o.push(a[e+0]),o.push(a[e+1]),o.push(a[e+2]),o.push(a[t+0]),o.push(a[t+1]),o.push(a[t+2]),o.push(a[n+0]),o.push(a[n+1]),o.push(a[n+2])},addUV:function(e,t,n){var a=this.uvs,o=this.object.geometry.uvs;o.push(a[e+0]),o.push(a[e+1]),o.push(a[t+0]),o.push(a[t+1]),o.push(a[n+0]),o.push(a[n+1])},addUVLine:function(e){var t=this.uvs,n=this.object.geometry.uvs;n.push(t[e+0]),n.push(t[e+1])},addFace:function(e,t,n,a,o,r,i,s,c,h,l,u){var d,p=this.vertices.length,m=this.parseVertexIndex(e,p),E=this.parseVertexIndex(t,p),f=this.parseVertexIndex(n,p);if(void 0===a?this.addVertex(m,E,f):(d=this.parseVertexIndex(a,p),this.addVertex(m,E,d),this.addVertex(E,f,d)),void 0!==o){var b=this.uvs.length;m=this.parseUVIndex(o,b),E=this.parseUVIndex(r,b),f=this.parseUVIndex(i,b),void 0===a?this.addUV(m,E,f):(d=this.parseUVIndex(s,b),this.addUV(m,E,d),this.addUV(E,f,d))}if(void 0!==c){var g=this.normals.length;m=this.parseNormalIndex(c,g),E=c===h?m:this.parseNormalIndex(h,g),f=c===l?m:this.parseNormalIndex(l,g),void 0===a?this.addNormal(m,E,f):(d=this.parseNormalIndex(u,g),this.addNormal(m,E,d),this.addNormal(E,f,d))}},addLineGeometry:function(e,t){this.object.geometry.type="Line";for(var n=this.vertices.length,a=this.uvs.length,o=0,r=e.length;o<r;o++)this.addVertexLine(this.parseVertexIndex(e[o],n));for(var i=0,r=t.length;i<r;i++)this.addUVLine(this.parseUVIndex(t[i],a))}};return e.startObject("",!1),e},parse:function(e){console.time("OBJLoader");var t=this._createParserState();-1!==e.indexOf("\r\n")&&(e=e.replace(/\r\n/g,"\n")),-1!==e.indexOf("\\\n")&&(e=e.replace(/\\\n/g,""));for(var n=e.split("\n"),a="",o="",r="",i=[],s="function"==typeof"".trimLeft,c=0,h=n.length;c<h;c++)if(a=n[c],a=s?a.trimLeft():a.trim(),0!==a.length&&"#"!==(o=a.charAt(0)))if("v"===o)if(" "===(r=a.charAt(1))&&null!==(i=this.regexp.vertex_pattern.exec(a)))t.vertices.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3]));else if("n"===r&&null!==(i=this.regexp.normal_pattern.exec(a)))t.normals.push(parseFloat(i[1]),parseFloat(i[2]),parseFloat(i[3]));else{if("t"!==r||null===(i=this.regexp.uv_pattern.exec(a)))throw new Error("Unexpected vertex/normal/uv line: '"+a+"'");t.uvs.push(parseFloat(i[1]),parseFloat(i[2]))}else if("f"===o)if(null!==(i=this.regexp.face_vertex_uv_normal.exec(a)))t.addFace(i[1],i[4],i[7],i[10],i[2],i[5],i[8],i[11],i[3],i[6],i[9],i[12]);else if(null!==(i=this.regexp.face_vertex_uv.exec(a)))t.addFace(i[1],i[3],i[5],i[7],i[2],i[4],i[6],i[8]);else if(null!==(i=this.regexp.face_vertex_normal.exec(a)))t.addFace(i[1],i[3],i[5],i[7],void 0,void 0,void 0,void 0,i[2],i[4],i[6],i[8]);else{if(null===(i=this.regexp.face_vertex.exec(a)))throw new Error("Unexpected face line: '"+a+"'");t.addFace(i[1],i[2],i[3],i[4])}else if("l"===o){var l=a.substring(1).trim().split(" "),u=[],d=[];if(-1===a.indexOf("/"))u=l;else for(var p=0,m=l.length;p<m;p++){var E=l[p].split("/");""!==E[0]&&u.push(E[0]),""!==E[1]&&d.push(E[1])}t.addLineGeometry(u,d)}else if(null!==(i=this.regexp.object_pattern.exec(a))){var f=(" "+i[0].substr(1).trim()).substr(1);t.startObject(f)}else if(this.regexp.material_use_pattern.test(a))t.object.startMaterial(a.substring(7).trim(),t.materialLibraries);else if(this.regexp.material_library_pattern.test(a))t.materialLibraries.push(a.substring(7).trim());else{if(null===(i=this.regexp.smoothing_pattern.exec(a))){if("\0"===a)continue;throw new Error("Unexpected line: '"+a+"'")}var b=i[1].trim().toLowerCase();t.object.smooth="1"===b||"on"===b,(j=t.object.currentMaterial())&&(j.smooth=t.object.smooth)}t.finalize();var g=new THREE.Group;g.materialLibraries=[].concat(t.materialLibraries);for(var c=0,h=t.objects.length;c<h;c++){var v=t.objects[c],T=v.geometry,R=v.materials,x="Line"===T.type;if(0!==T.vertices.length){var y=new THREE.BufferGeometry;y.addAttribute("position",new THREE.BufferAttribute(new Float32Array(T.vertices),3)),T.normals.length>0?y.addAttribute("normal",new THREE.BufferAttribute(new Float32Array(T.normals),3)):y.computeVertexNormals(),T.uvs.length>0&&y.addAttribute("uv",new THREE.BufferAttribute(new Float32Array(T.uvs),2));for(var H=[],w=0,O=R.length;w<O;w++){var L=R[w],j=void 0;if(null!==this.materials&&(j=this.materials.create(L.name),x&&j&&!(j instanceof THREE.LineBasicMaterial))){var M=new THREE.LineBasicMaterial;M.copy(j),j=M}j||((j=x?new THREE.LineBasicMaterial:new THREE.MeshPhongMaterial).name=L.name),j.shading=L.smooth?THREE.SmoothShading:THREE.FlatShading,H.push(j)}var P;if(H.length>1){for(var w=0,O=R.length;w<O;w++){L=R[w];y.addGroup(L.groupStart,L.groupCount,w)}P=x?new THREE.LineSegments(y,H):new THREE.Mesh(y,H)}else P=x?new THREE.LineSegments(y,H[0]):new THREE.Mesh(y,H[0]);P.name=v.name,g.add(P)}}return console.timeEnd("OBJLoader"),g}},THREE.OrbitControls=function(e,t){function n(){return 2*Math.PI/60/60*_.autoRotateSpeed}function a(){return Math.pow(.95,_.zoomSpeed)}function o(e){D.theta-=e}function r(e){D.phi-=e}function i(e){_.object instanceof THREE.PerspectiveCamera?z/=e:_.object instanceof THREE.OrthographicCamera?(_.object.zoom=Math.max(_.minZoom,Math.min(_.maxZoom,_.object.zoom*e)),_.object.updateProjectionMatrix(),Z=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),_.enableZoom=!1)}function s(e){_.object instanceof THREE.PerspectiveCamera?z*=e:_.object instanceof THREE.OrthographicCamera?(_.object.zoom=Math.max(_.minZoom,Math.min(_.maxZoom,_.object.zoom/e)),_.object.updateProjectionMatrix(),Z=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),_.enableZoom=!1)}function c(e){Y.set(e.clientX,e.clientY)}function h(e){J.set(e.clientX,e.clientY)}function l(e){K.set(e.clientX,e.clientY)}function u(e){X.set(e.clientX,e.clientY),G.subVectors(X,Y);var t=_.domElement===document?_.domElement.body:_.domElement;o(2*Math.PI*G.x/t.clientWidth*_.rotateSpeed),r(2*Math.PI*G.y/t.clientHeight*_.rotateSpeed),Y.copy(X),_.update()}function d(e){Q.set(e.clientX,e.clientY),$.subVectors(Q,J),$.y>0?i(a()):$.y<0&&s(a()),J.copy(Q),_.update()}function p(e){W.set(e.clientX,e.clientY),q.subVectors(W,K),ne(q.x,q.y),K.copy(W),_.update()}function m(e){}function E(e){e.deltaY<0?s(a()):e.deltaY>0&&i(a()),_.update()}function f(e){switch(e.keyCode){case _.keys.UP:ne(0,_.keyPanSpeed),_.update();break;case _.keys.BOTTOM:ne(0,-_.keyPanSpeed),_.update();break;case _.keys.LEFT:ne(_.keyPanSpeed,0),_.update();break;case _.keys.RIGHT:ne(-_.keyPanSpeed,0),_.update()}}function b(e){Y.set(e.touches[0].pageX,e.touches[0].pageY)}function g(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,a=Math.sqrt(t*t+n*n);J.set(0,a)}function v(e){K.set(e.touches[0].pageX,e.touches[0].pageY)}function T(e){X.set(e.touches[0].pageX,e.touches[0].pageY),G.subVectors(X,Y);var t=_.domElement===document?_.domElement.body:_.domElement;o(2*Math.PI*G.x/t.clientWidth*_.rotateSpeed),r(2*Math.PI*G.y/t.clientHeight*_.rotateSpeed),Y.copy(X),_.update()}function R(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,o=Math.sqrt(t*t+n*n);Q.set(0,o),$.subVectors(Q,J),$.y>0?s(a()):$.y<0&&i(a()),J.copy(Q),_.update()}function x(e){W.set(e.touches[0].pageX,e.touches[0].pageY),q.subVectors(W,K),ne(q.x,q.y),K.copy(W),_.update()}function y(e){}function H(e){if(!1!==_.enabled){switch(e.preventDefault(),e.button){case _.mouseButtons.ORBIT:if(!1===_.enableRotate)return;c(e),N=U.ROTATE;break;case _.mouseButtons.ZOOM:if(!1===_.enableZoom)return;h(e),N=U.DOLLY;break;case _.mouseButtons.PAN:if(!1===_.enablePan)return;l(e),N=U.PAN}N!==U.NONE&&(document.addEventListener("mousemove",w,!1),document.addEventListener("mouseup",O,!1),_.dispatchEvent(V))}}function w(e){if(!1!==_.enabled)switch(e.preventDefault(),N){case U.ROTATE:if(!1===_.enableRotate)return;u(e);break;case U.DOLLY:if(!1===_.enableZoom)return;d(e);break;case U.PAN:if(!1===_.enablePan)return;p(e)}}function O(e){!1!==_.enabled&&(m(e),document.removeEventListener("mousemove",w,!1),document.removeEventListener("mouseup",O,!1),_.dispatchEvent(F),N=U.NONE)}function L(e){!1===_.enabled||!1===_.enableZoom||N!==U.NONE&&N!==U.ROTATE||(e.preventDefault(),e.stopPropagation(),E(e),_.dispatchEvent(V),_.dispatchEvent(F))}function j(e){!1!==_.enabled&&!1!==_.enableKeys&&!1!==_.enablePan&&f(e)}function M(e){if(!1!==_.enabled){switch(e.touches.length){case 1:if(!1===_.enableRotate)return;b(e),N=U.TOUCH_ROTATE;break;case 2:if(!1===_.enableZoom)return;g(e),N=U.TOUCH_DOLLY;break;case 3:if(!1===_.enablePan)return;v(e),N=U.TOUCH_PAN;break;default:N=U.NONE}N!==U.NONE&&_.dispatchEvent(V)}}function P(e){if(!1!==_.enabled)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(!1===_.enableRotate)return;if(N!==U.TOUCH_ROTATE)return;T(e);break;case 2:if(!1===_.enableZoom)return;if(N!==U.TOUCH_DOLLY)return;R(e);break;case 3:if(!1===_.enablePan)return;if(N!==U.TOUCH_PAN)return;x(e);break;default:N=U.NONE}}function C(e){!1!==_.enabled&&(y(e),_.dispatchEvent(F),N=U.NONE)}function A(e){e.preventDefault()}this.object=e,this.domElement=void 0!==t?t:document,this.enabled=!0,this.target=new THREE.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.25,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:THREE.MOUSE.LEFT,ZOOM:THREE.MOUSE.MIDDLE,PAN:THREE.MOUSE.RIGHT},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return S.phi},this.getAzimuthalAngle=function(){return S.theta},this.saveState=function(){_.target0.copy(_.target),_.position0.copy(_.object.position),_.zoom0=_.object.zoom},this.reset=function(){_.target.copy(_.target0),_.object.position.copy(_.position0),_.object.zoom=_.zoom0,_.object.updateProjectionMatrix(),_.dispatchEvent(k),_.update(),N=U.NONE},this.update=function(){var t=new THREE.Vector3,a=(new THREE.Quaternion).setFromUnitVectors(e.up,new THREE.Vector3(0,1,0)),r=a.clone().inverse(),i=new THREE.Vector3,s=new THREE.Quaternion;return function(){var e=_.object.position;return t.copy(e).sub(_.target),t.applyQuaternion(a),S.setFromVector3(t),_.autoRotate&&N===U.NONE&&o(n()),S.theta+=D.theta,S.phi+=D.phi,S.theta=Math.max(_.minAzimuthAngle,Math.min(_.maxAzimuthAngle,S.theta)),S.phi=Math.max(_.minPolarAngle,Math.min(_.maxPolarAngle,S.phi)),S.makeSafe(),S.radius*=z,S.radius=Math.max(_.minDistance,Math.min(_.maxDistance,S.radius)),_.target.add(B),t.setFromSpherical(S),t.applyQuaternion(r),e.copy(_.target).add(t),_.object.lookAt(_.target),!0===_.enableDamping?(D.theta*=1-_.dampingFactor,D.phi*=1-_.dampingFactor):D.set(0,0,0),z=1,B.set(0,0,0),!!(Z||i.distanceToSquared(_.object.position)>I||8*(1-s.dot(_.object.quaternion))>I)&&(_.dispatchEvent(k),i.copy(_.object.position),s.copy(_.object.quaternion),Z=!1,!0)}}(),this.dispose=function(){_.domElement.removeEventListener("contextmenu",A,!1),_.domElement.removeEventListener("mousedown",H,!1),_.domElement.removeEventListener("wheel",L,!1),_.domElement.removeEventListener("touchstart",M,!1),_.domElement.removeEventListener("touchend",C,!1),_.domElement.removeEventListener("touchmove",P,!1),document.removeEventListener("mousemove",w,!1),document.removeEventListener("mouseup",O,!1),window.removeEventListener("keydown",j,!1)};var _=this,k={type:"change"},V={type:"start"},F={type:"end"},U={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5},N=U.NONE,I=1e-6,S=new THREE.Spherical,D=new THREE.Spherical,z=1,B=new THREE.Vector3,Z=!1,Y=new THREE.Vector2,X=new THREE.Vector2,G=new THREE.Vector2,K=new THREE.Vector2,W=new THREE.Vector2,q=new THREE.Vector2,J=new THREE.Vector2,Q=new THREE.Vector2,$=new THREE.Vector2,ee=function(){var e=new THREE.Vector3;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),B.add(e)}}(),te=function(){var e=new THREE.Vector3;return function(t,n){e.setFromMatrixColumn(n,1),e.multiplyScalar(t),B.add(e)}}(),ne=function(){var e=new THREE.Vector3;return function(t,n){var a=_.domElement===document?_.domElement.body:_.domElement;if(_.object instanceof THREE.PerspectiveCamera){var o=_.object.position;e.copy(o).sub(_.target);var r=e.length();r*=Math.tan(_.object.fov/2*Math.PI/180),ee(2*t*r/a.clientHeight,_.object.matrix),te(2*n*r/a.clientHeight,_.object.matrix)}else _.object instanceof THREE.OrthographicCamera?(ee(t*(_.object.right-_.object.left)/_.object.zoom/a.clientWidth,_.object.matrix),te(n*(_.object.top-_.object.bottom)/_.object.zoom/a.clientHeight,_.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),_.enablePan=!1)}}();_.domElement.addEventListener("contextmenu",A,!1),_.domElement.addEventListener("mousedown",H,!1),_.domElement.addEventListener("wheel",L,!1),_.domElement.addEventListener("touchstart",M,!1),_.domElement.addEventListener("touchend",C,!1),_.domElement.addEventListener("touchmove",P,!1),window.addEventListener("keydown",j,!1),this.update()},THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype),THREE.OrbitControls.prototype.constructor=THREE.OrbitControls,Object.defineProperties(THREE.OrbitControls.prototype,{center:{get:function(){return console.warn("THREE.OrbitControls: .center has been renamed to .target"),this.target}},noZoom:{get:function(){return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),!this.enableZoom},set:function(e){console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),this.enableZoom=!e}},noRotate:{get:function(){return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),!this.enableRotate},set:function(e){console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),this.enableRotate=!e}},noPan:{get:function(){return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),!this.enablePan},set:function(e){console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),this.enablePan=!e}},noKeys:{get:function(){return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),!this.enableKeys},set:function(e){console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),this.enableKeys=!e}},staticMoving:{get:function(){return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),!this.enableDamping},set:function(e){console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),this.enableDamping=!e}},dynamicDampingFactor:{get:function(){return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor},set:function(e){console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor=e}}});

/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(!event.pointerType||"mouse"!=event.pointerType||0!=options.fallbackToMouseEvents){var ret,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.cancelable!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null===options.pinchThreshold||pinchDistance>=options.pinchThreshold}function validateSwipeTime(){var result;return result=!options.maxTimeThreshold||!(duration>=options.maxTimeThreshold)}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&distance<DOUBLE_TAP_THRESHOLD}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){if(maximumsMap[direction])return maximumsMap[direction].distance}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return pinchZoom<1?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return angle<0&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return angle<=45&&angle>=0?LEFT:angle<=360&&angle>=315?LEFT:angle>=135&&angle<=225?RIGHT:angle>45&&angle<135?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.18",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:".noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(plugin,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(plugin,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});

/*!
	Autosize 4.0.0
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['exports', 'module'], factory);
	} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		factory(exports, module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod);
		global.autosize = mod.exports;
	}
})(this, function (exports, module) {
	'use strict';

	var map = typeof Map === "function" ? new Map() : (function () {
		var keys = [];
		var values = [];

		return {
			has: function has(key) {
				return keys.indexOf(key) > -1;
			},
			get: function get(key) {
				return values[keys.indexOf(key)];
			},
			set: function set(key, value) {
				if (keys.indexOf(key) === -1) {
					keys.push(key);
					values.push(value);
				}
			},
			'delete': function _delete(key) {
				var index = keys.indexOf(key);
				if (index > -1) {
					keys.splice(index, 1);
					values.splice(index, 1);
				}
			}
		};
	})();

	var createEvent = function createEvent(name) {
		return new Event(name, { bubbles: true });
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function (name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

		var heightOffset = null;
		var clientWidth = ta.clientWidth;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop
					});
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			var originalHeight = ta.style.height;
			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = '';

			var endHeight = ta.scrollHeight + heightOffset;

			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				ta.style.height = originalHeight;
				return;
			}

			ta.style.height = endHeight + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var styleHeight = Math.round(parseFloat(ta.style.height));
			var computed = window.getComputedStyle(ta, null);

			// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
			var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

			// The actual height not matching the style height (set via the resize method) indicates that
			// the max-height has been exceeded, in which case the overflow should be allowed.
			if (actualHeight !== styleHeight) {
				if (computed.overflowY === 'hidden') {
					changeOverflow('scroll');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			}

			if (cachedHeight !== actualHeight) {
				cachedHeight = actualHeight;
				var evt = createEvent('autosize:resized');
				try {
					ta.dispatchEvent(evt);
				} catch (err) {
					// Firefox will throw an error on dispatchEvent for a detached element
					// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
				}
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = (function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});

			map['delete'](ta);
		}).bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap
		});

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		map.set(ta, {
			destroy: destroy,
			update: update
		});

		init();
	}

	function destroy(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.destroy();
		}
	}

	function update(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.update();
		}
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function (el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function (el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	module.exports = autosize;
});

/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);