// Tipo de material para la bandera  ----> satinado
var material_banderas = {
	ka: [0.19 ,0.07 ,0.02],
	kd: [0.7 ,0.27 ,0.08],
	ks: [0.26 ,0.14 ,0.09],
	alfa: 0.05,
	f0:1
};

// Tipo de material para el castillo ----> rugoso (piedra)
var material_castillo = {
	ka: [0.13,0.13,0.13],
	kd: [0.8, 0.8, 0.8],
	ks: [0.01, 0.01, 0.01],
	n:20
};

// Tipo de material para el piso del castillo ----> rugoso
var material_piso = {
	ka: [0.02,0.02,0.02],
	kd: [0.01, 0.01, 0.01],
	ks: [0.5, 0.5, 0.5],
	n:9.85
};


// Tipo de material para el piso del castillo ----> rugoso (arena)
var material_sand = {
	ka: [0.25,0.22,0.11],
	kd: [0.8, 0.8, 0.8],
	ks: [0.01, 0.01, 0.01],
	n:9.85
};


// Tipo de material para la puerta  ----> satinado
var material_puerta = {
	ka: [0.11,0.06,0.11],
	kd: [0.43, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	n: 9.85
};

// Tipo de material para el cañon  ----> metalica (cromo)
var material_barrels = {
	ka: [0.25,0.25,0.25],
	kd: [0.4, 0.4, 0.4],
	ks: [0.77, 0.77, 0.77],
	alfa: 1,
	f0:0.3
};

// Tipo de material para la bala  ----> metalica  (estaño)
var material_bala = {
	ka: [1,0.06,0.11],  
	kd: [0.42, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	alfa: 2,
	f0:1
};

// Tipo de material para las ruedas  ----> rugoso
var material_ruedas = {
	ka: [0.11,0.06,0.11],
	kd: [0.43, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	n: 9.85
};

// Tipo de material para el soporte  ----> rugoso
var material_soporte = {
	ka: [0.22,0.09,0.09],
	kd: [0.4, 0.4, 0.4],
	ks: [0.01, 0.01, 0.01],
	n: 9.85
};

// Tipo de material para el bote ----> rugoso
var material_bote = {
	ka: [0.4,0.17,0.0],
	kd: [0.47, 0.47, 0.54],
	ks: [0.01, 0.01, 0.01],
	n: 9
};

// Tipo de material para las bisagras ----> metalico (estaño)
var material_hinges = {
	ka: [0.1,0.06,0.11],
	kd: [0.42, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	alfa: 2,
	f0:1
};

// Tipo de material para los remos ----> rugoso
var material_remos = {
	ka: [0.11,0.06,0.11],
	kd: [0.43, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	n: 9.85
};

// Tipo de material para el agua  ----> satinado
var material_agua = {
	ka: [0.1,0.1,0.2],
	kd: [0.1,0.1,0.1],
	ks: [1,1,1],
	n: 30
};
