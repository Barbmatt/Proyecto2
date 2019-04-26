class sphericalCamera{
	constructor(theta,phi,r,center,up){
		this.theta=theta;
		this.phi=phi;
		this.r=r;
		this.center=center;
		this.up=up;
	}
	
	createViewMatrix(){
		let viewMatrix = mat4.create();
		this.eyePos=[this.r*Math.sin(this.theta)*Math.cos(this.phi),this.r*Math.cos(this.theta),this.r*Math.sin(this.theta)*Math.sin(this.phi)];
		viewMatrix = mat4.lookAt(viewMatrix,this.eyePos,this.center,this.up);
		return viewMatrix;
	}
	createPerspectiveMatrix(fov,near,far,aspect){
		this.fov=fov;
		this.near=near;
		this.far=far;
		this.aspect=aspect;
		let projMatrix = mat4.create();
		mat4.perspective(projMatrix, fov, aspect, near, far);
		return projMatrix;
	}
	
	zoom(r){
		let projMatrix = mat4.create();
		projMatrix = this.createPerspectiveMatrix(glMatrix.toRadian(r),this.near,this.far,this.aspect);
		return projMatrix;
	}

	quaternionCamera(phi,theta){
		this.phi = phi;  // se actualizan el valor de phi de la camara
		this.theta = theta;
		const rotations = quat.create(); // se crea un cuaternion identidad. 
		quat.rotateX(rotations,rotations,this.theta); // se guarda la rotación que se aplicará al objeto
		quat.rotateY(rotations,rotations,this.phi);

		const rotationMatrix = mat4.create(); // se crea una matriz de rotación
		mat4.fromQuat(rotationMatrix,rotations); // se convierte el cuaternion a matriz

		const translationMatrix = mat4.create(); // se crea una matriz de traslación
		mat4.fromTranslation(translationMatrix,[0,0,-this.r]); // se guarda la traslación que se aplicará al objeto
		
		
		let viewMatrix = mat4.create();  // se resetea la matriz de vista
		mat4.multiply(viewMatrix, translationMatrix, rotationMatrix); // se multiplica la matriz traslación a la de rotación
																	// y se la guarda en la matriz de vista.
		return viewMatrix;
	}
}
